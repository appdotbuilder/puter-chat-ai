import { text, pgTable, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// AI Models table
export const aiModelsTable = pgTable('ai_models', {
  id: text('id').primaryKey(), // Using text for model IDs like 'gpt-4', 'claude-3', etc.
  name: text('name').notNull(),
  provider: text('provider').notNull(), // 'openai', 'claude', 'puter', etc.
  description: text('description').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Chat Sessions table
export const chatSessionsTable = pgTable('chat_sessions', {
  id: text('id').primaryKey(), // Using UUID strings for session IDs
  title: text('title').notNull(),
  model_id: text('model_id').notNull(), // References ai_models.id
  user_id: text('user_id'), // Nullable for anonymous users
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messagesTable = pgTable('messages', {
  id: text('id').primaryKey(), // Using UUID strings for message IDs
  session_id: text('session_id').notNull(), // References chat_sessions.id
  content: text('content').notNull(),
  role: text('role').notNull(), // 'user' or 'assistant'
  model_id: text('model_id'), // Which AI model generated this response (null for user messages)
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Define relations
export const aiModelsRelations = relations(aiModelsTable, ({ many }) => ({
  chatSessions: many(chatSessionsTable),
  messages: many(messagesTable),
}));

export const chatSessionsRelations = relations(chatSessionsTable, ({ one, many }) => ({
  model: one(aiModelsTable, {
    fields: [chatSessionsTable.model_id],
    references: [aiModelsTable.id],
  }),
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  session: one(chatSessionsTable, {
    fields: [messagesTable.session_id],
    references: [chatSessionsTable.id],
  }),
  model: one(aiModelsTable, {
    fields: [messagesTable.model_id],
    references: [aiModelsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type AiModel = typeof aiModelsTable.$inferSelect;
export type NewAiModel = typeof aiModelsTable.$inferInsert;

export type ChatSession = typeof chatSessionsTable.$inferSelect;
export type NewChatSession = typeof chatSessionsTable.$inferInsert;

export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  aiModels: aiModelsTable,
  chatSessions: chatSessionsTable,
  messages: messagesTable,
};

export const tableRelations = {
  aiModelsRelations,
  chatSessionsRelations,
  messagesRelations,
};