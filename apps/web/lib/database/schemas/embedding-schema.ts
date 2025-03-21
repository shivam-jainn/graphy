import { nanoid } from '@/lib/utils';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { resources } from './resources-schema';

export const embeddingsSchema = pgTable('embeddings', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  resourceId: varchar('resource_id', { length: 191 }).references(
    () => resources.id,
    { onDelete: 'cascade' },
  ),
  content: text('content').notNull(), // Store content for reference
});