import { AgentResult, type TextMessage } from "@inngest/agent-kit"
import { Sandbox } from "@e2b/code-interpreter";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  let lastAssistantTextMessage: TextMessage | undefined = undefined

  for (let index = result.output.length - 1; index >= 0; index--) {
    const message = result.output[index]
    if (message?.role === "assistant") {
      if (message.type === "text") {
        lastAssistantTextMessage = message
      }
    }
  }
  return lastAssistantTextMessage?.content
    ? typeof lastAssistantTextMessage?.content === "string"
      ? lastAssistantTextMessage?.content
      : lastAssistantTextMessage?.content.map((c) => c.text).join()
    : undefined
}
