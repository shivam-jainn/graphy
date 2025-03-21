import { pgTable, text, varchar, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";

export const boardsTable = pgTable("boards", {
  id: varchar("id", { length: 191 }).primaryKey(),
  boardName: text("board_name").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const uploadsTable = pgTable("uploads", {
  id: varchar("id", { length: 191 }).primaryKey(),
  boardId: varchar("board_id", { length: 191 }).references(() => boardsTable.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const chatHistoryTable = pgTable("chat_history", {
  id: varchar("id", { length: 191 }).primaryKey(),
  boardId: varchar("board_id", { length: 191 })
    .references(() => boardsTable.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(), // Add timestamp config
});

export const messagesTable = pgTable("messages", {
  id: varchar("id", { length: 191 }).primaryKey(),
chatId: varchar("chat_id", { length: 191 }).references(() => chatHistoryTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  role: varchar("role", { length: 50 }).notNull(), // 'user' or 'bot'
  createdAt: timestamp("created_at").notNull(),
});

// Many-to-many relationship for boards and chat sessions
export const boardChatTable = pgTable(
  "board_chat",
  {
    boardId: varchar("board_id", { length: 191 }).references(() => boardsTable.id, { onDelete: "cascade" }),
    chatId: varchar("chat_id", { length: 191 }).references(() => chatHistoryTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.boardId, table.chatId] }),
  })
);
