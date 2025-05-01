import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const resources = pgTable('resources', {
  id: varchar('id', { length: 191 }).primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // 'pdf' or 'webpage'
  path: text('path').notNull(), // local path or URL
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});