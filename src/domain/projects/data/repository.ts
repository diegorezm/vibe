import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const projectRepository = {
  create: async (data: typeof projectsTable.$inferInsert) => {
    return db.insert(projectsTable).values(data).returning();
  },

  getById: async (id: string) => {
    return db.query.projectsTable.findFirst({
      where: eq(projectsTable.id, id),
    });
  },

  getAll: async () => {
    return db.select().from(projectsTable);
  },

  getByUserId: async (userID: stringj) => {
    return db.select().from(projectsTable).where(eq(projectsTable.userId, userID));
  },

  update: async (id: string, data: Partial<typeof projectsTable.$inferInsert>) => {
    return db.update(projectsTable).set(data).where(eq(projectsTable.id, id));
  },

  delete: async (id: string) => {
    return db.delete(projectsTable).where(eq(projectsTable.id, id));
  },
};
