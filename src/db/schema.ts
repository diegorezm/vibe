import { sql } from "drizzle-orm";
import { sqliteTableCreator, text, numeric } from "drizzle-orm/sqlite-core";
import { v7 as uuidv7 } from "uuid"

export const createTable = sqliteTableCreator((name: string) => `vibe_${name}`);

export const projectsTable = createTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at"),
})

export const messageTable = createTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  content: text("content").notNull(),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  type: text("type", { enum: ["result", "error"] }).notNull(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at"),
  projectId: text("project_id").references(() => projectsTable.id, {
    onDelete: "cascade"
  }).notNull()
})

export const fragmentTable = createTable("fragments", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  title: text("title"),
  sandboxUrl: text("sandbox_url"),
  files: text("files", { mode: "json" }),
  messageId: text("message_id").references(() => messageTable.id, { onDelete: "cascade" }).notNull(),
})

export const usageTable = createTable("usage", {
  key: text("key").primaryKey(),
  points: numeric("points").notNull(),
  expire: text("expire"),
})

export type Project = typeof projectsTable.$inferSelect
export type Message = typeof messageTable.$inferInsert
export type Fragment = typeof fragmentTable.$inferInsert
export type Usage = typeof usageTable.$inferSelect
