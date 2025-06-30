import { db } from "@/db";
import { fragmentTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const fragmentRepository = {
  create: async (data: typeof fragmentTable.$inferInsert) => {
    return db.insert(fragmentTable).values(data);
  },

  getById: async (id: string) => {
    return db.query.fragmentTable.findFirst({
      where: eq(fragmentTable.id, id),
    });
  },

  getAll: async () => {
    return db.select().from(fragmentTable);
  },

  getByMessageId: async (messageId: string) => {
    return db.query.fragmentTable.findMany({
      where: eq(fragmentTable.messageId, messageId),
    });
  },

  update: async (id: string, data: Partial<typeof fragmentTable.$inferInsert>) => {
    return db.update(fragmentTable).set(data).where(eq(fragmentTable.id, id));
  },

  delete: async (id: string) => {
    return db.delete(fragmentTable).where(eq(fragmentTable.id, id));
  },
};
