import { inngest } from "./client";
import Sandbox from "@e2b/code-interpreter";
import {
  createAgent,
  createNetwork,
  createTool,
  openai,
  type Tool,
  type Message,
  createState
} from "@inngest/agent-kit";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "./prompt";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { db } from "@/db";
import { fragmentTable, messageTable } from "@/db/schema";
import { messageRepository } from "@/domain/messages/data/repository";
import { desc, eq } from "drizzle-orm";

interface AgentState {
  summary: string,
  files: {
    [path: string]: string
  }
}

const eventSchema = z.object({
  prompt: z.string().min(1).max(1024),
  projectId: z.string().uuid()
})

export const codeAgentTask = inngest.createFunction(
  { id: "create-next-app" },
  { event: "code/generate.code" },
  async ({ event, step }) => {
    // Parsing it here because if it fails nothing else should run.
    const inputValues = eventSchema.parse(event.data)

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("diegorezm-vibe-test");
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = []
      const messages = await db.query.messageTable.findMany({
        where: eq(messageTable.projectId, inputValues.projectId),
        orderBy: desc(messageTable.createdAt)
      })
      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role,
          content: message.content
        })
      }
      return formattedMessages
    })

    const state = createState<AgentState>({
      summary: "",
      files: {}
    }, {
      messages: previousMessages
    })

    const codeAgent = createAgent<AgentState>({
      name: "code-agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4.1",
        apiKey: process.env.OPEN_AI_API_KEY!,
        defaultParameters: {
          temperature: 0.1
        }
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.error(
                  `Command failed: ${error}\nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`,
                );
                return `Command failed: ${error}\nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`;
              }
            });
          },
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getSandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content
                  }
                  return updatedFiles;
                } catch (error) {
                  return "Error: " + error;
                }
              },
            );
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return step?.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
              } catch (error) {
                return "Error: " + error;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantTextMessage =
            lastAssistantTextMessageContent(result);
          if (lastAssistantTextMessage && network) {
            if (lastAssistantTextMessage.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantTextMessage;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(inputValues.prompt, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "gpt-4o",
        apiKey: process.env.OPEN_AI_API_KEY!,
      }),
    })

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "gpt-4o",
        apiKey: process.env.OPEN_AI_API_KEY!,
      }),
    })

    const { output: fragmentTitle } = await fragmentTitleGenerator.run(result.state.data.summary)
    const { output: response } = await responseGenerator.run(result.state.data.summary)

    const parseAIResponse = (m: Message) => {
      if (m.type !== "text") return "Fragment"
      if (Array.isArray(m.content)) return m.content.map((txt) => txt).join("")
      return m.content
    }

    const isError = result.state.data.summary === undefined || result.state.data.summary === "" || Object.keys(result.state.data.files).length === 0

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await messageRepository.create({
          content: "Something went wrong!",
          projectId: inputValues.projectId,
          role: "assistant",
          type: "error"
        })
      }

      return await db.transaction(async (tx) => {
        try {
          const [messageResult] = await tx.insert(messageTable).values({
            content: parseAIResponse(response[0]),
            role: "assistant",
            type: "result",
            projectId: inputValues.projectId
          }).returning()

          if (!messageResult) {
            throw new Error("Failed to create message.");
          }

          const lastInsertedId = messageResult.id

          await tx.insert(fragmentTable).values({
            sandboxUrl: sandboxUrl,
            title: parseAIResponse(fragmentTitle[0]),
            messageId: lastInsertedId,
            files: result.state.data.files,
          })
        } catch (error) {
          tx.rollback();
          console.error(error)
          return error
        }
      })
    })

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
