import { pgTable, text, varchar, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";

export const boardsTable = pgTable("boards", {
  id: varchar("id", { length: 191 }).primaryKey(),
  boardName: text("board_name").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const uploadsTable = pgTable("uploads", {
  id: varchar("id", { length: 191 }).primaryKey(),
  boardId: varchar("board_id", { length: 191 })
    .references(() => boardsTable.id, { onDelete: "cascade" }), // Removed .notNull()
  chatId: varchar("chat_id", { length: 191 }),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const chatHistoryTable = pgTable("chat_history", {
  id: varchar("id", { length: 191 }).primaryKey(),
  boardId: varchar("board_id", { length: 191 })
    .references(() => boardsTable.id, { onDelete: "cascade" }),  // Removed .notNull()
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const messagesTable = pgTable("messages", {
  id: varchar("id", { length: 191 }).primaryKey(),
  chatId: varchar("chat_id", { length: 191 })
    .references(() => chatHistoryTable.id, { onDelete: "cascade" })
    .notNull(),  // Added proper indentation and notNull
  content: text("content").notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull(),
});

// Many-to-many relationship fix
export const boardChatTable = pgTable(
  "board_chat",
  {
    boardId: varchar("board_id", { length: 191 })
      .references(() => boardsTable.id, { onDelete: "cascade" })
      .notNull(),
    chatId: varchar("chat_id", { length: 191 })
      .references(() => chatHistoryTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    compositePk: primaryKey(table.boardId, table.chatId),
  })
);
