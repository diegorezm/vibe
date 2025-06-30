import { db } from "@/db";
import { fragmentTable, messageTable } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const messageRepository = {
  create: async (data: typeof messageTable.$inferInsert) => {
    return db.insert(messageTable).values(data).returning();
  },

  getById: async (id: string) => {
    return db.query.messageTable.findFirst({
      where: eq(messageTable.id, id),
    });
  },

  getAll: async (projectId: string) => {
    return db.select().from(messageTable).where(eq(messageTable.projectId, projectId));
  },

  getAllWithFragment: async (projectId: string) => {
    return db.select().from(messageTable).where(eq(messageTable.projectId, projectId))
      .leftJoin(fragmentTable, eq(fragmentTable.messageId, messageTable.id))
      .orderBy(asc(messageTable.createdAt));
  },
  update: async (id: string, data: Partial<typeof messageTable.$inferInsert>) => {
    return db.update(messageTable).set(data).where(eq(messageTable.id, id));
  },

  delete: async (id: string) => {
    return db.delete(messageTable).where(eq(messageTable.id, id));
  },
};
