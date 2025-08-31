import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createAiModelInputSchema,
  createChatSessionInputSchema,
  updateChatSessionInputSchema,
  createMessageInputSchema,
  chatCompletionInputSchema,
  getMessagesInputSchema,
  getChatSessionsInputSchema
} from './schema';

// Import handlers
import { createAiModel } from './handlers/create_ai_model';
import { getAiModels } from './handlers/get_ai_models';
import { createChatSession } from './handlers/create_chat_session';
import { getChatSessions } from './handlers/get_chat_sessions';
import { updateChatSession } from './handlers/update_chat_session';
import { createMessage } from './handlers/create_message';
import { getMessages } from './handlers/get_messages';
import { chatCompletion } from './handlers/chat_completion';
import { deleteChatSession } from './handlers/delete_chat_session';
import { getChatSession } from './handlers/get_chat_session';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // AI Models management
  createAiModel: publicProcedure
    .input(createAiModelInputSchema)
    .mutation(({ input }) => createAiModel(input)),

  getAiModels: publicProcedure
    .query(() => getAiModels()),

  // Chat Sessions management
  createChatSession: publicProcedure
    .input(createChatSessionInputSchema)
    .mutation(({ input }) => createChatSession(input)),

  getChatSessions: publicProcedure
    .input(getChatSessionsInputSchema)
    .query(({ input }) => getChatSessions(input)),

  getChatSession: publicProcedure
    .input(z.string())
    .query(({ input }) => getChatSession(input)),

  updateChatSession: publicProcedure
    .input(updateChatSessionInputSchema)
    .mutation(({ input }) => updateChatSession(input)),

  deleteChatSession: publicProcedure
    .input(z.string())
    .mutation(({ input }) => deleteChatSession(input)),

  // Messages management
  createMessage: publicProcedure
    .input(createMessageInputSchema)
    .mutation(({ input }) => createMessage(input)),

  getMessages: publicProcedure
    .input(getMessagesInputSchema)
    .query(({ input }) => getMessages(input)),

  // Chat completion (main chat functionality)
  chatCompletion: publicProcedure
    .input(chatCompletionInputSchema)
    .mutation(({ input }) => chatCompletion(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Chat Application TRPC server listening at port: ${port}`);
}

start();