import { z } from 'zod';

// AI Model schema
export const aiModelSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(), // 'openai', 'claude', 'puter', etc.
  description: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type AiModel = z.infer<typeof aiModelSchema>;

// Chat Session schema
export const chatSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  model_id: z.string(),
  user_id: z.string().nullable(), // Nullable for anonymous users
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ChatSession = z.infer<typeof chatSessionSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.string(),
  session_id: z.string(),
  content: z.string(),
  role: z.enum(['user', 'assistant']),
  model_id: z.string().nullable(), // Which AI model generated this response (null for user messages)
  created_at: z.coerce.date()
});

export type Message = z.infer<typeof messageSchema>;

// Input schemas for creating/updating

// Create AI Model input
export const createAiModelInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  description: z.string(),
  is_active: z.boolean().optional().default(true)
});

export type CreateAiModelInput = z.infer<typeof createAiModelInputSchema>;

// Create Chat Session input
export const createChatSessionInputSchema = z.object({
  title: z.string().optional().default('New Chat'),
  model_id: z.string(),
  user_id: z.string().nullable().optional()
});

export type CreateChatSessionInput = z.infer<typeof createChatSessionInputSchema>;

// Update Chat Session input
export const updateChatSessionInputSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  model_id: z.string().optional()
});

export type UpdateChatSessionInput = z.infer<typeof updateChatSessionInputSchema>;

// Create Message input
export const createMessageInputSchema = z.object({
  session_id: z.string(),
  content: z.string(),
  role: z.enum(['user', 'assistant']),
  model_id: z.string().nullable().optional() // Required for assistant messages
});

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;

// Chat completion input (for sending message and getting AI response)
export const chatCompletionInputSchema = z.object({
  session_id: z.string(),
  message: z.string(),
  model_id: z.string().optional() // If not provided, use session's default model
});

export type ChatCompletionInput = z.infer<typeof chatCompletionInputSchema>;

// Get messages input
export const getMessagesInputSchema = z.object({
  session_id: z.string(),
  limit: z.number().int().positive().optional().default(50),
  offset: z.number().int().nonnegative().optional().default(0)
});

export type GetMessagesInput = z.infer<typeof getMessagesInputSchema>;

// Get chat sessions input
export const getChatSessionsInputSchema = z.object({
  user_id: z.string().nullable().optional(),
  limit: z.number().int().positive().optional().default(20),
  offset: z.number().int().nonnegative().optional().default(0)
});

export type GetChatSessionsInput = z.infer<typeof getChatSessionsInputSchema>;