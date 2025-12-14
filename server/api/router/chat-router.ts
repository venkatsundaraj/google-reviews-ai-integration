import z from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedureWithUser,
} from "../trpc";
import { MyUIMessage } from "@/types/chat";
import { redis } from "@/lib/redis";

export type ChatHistoryItem = {
  id: string;
  lastUpdated: string;
  title: string;
};

export const chatRouter = createTRPCRouter({
  getChatHistories: privateProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      if (!id) {
        return { messages: [] as MyUIMessage[] };
      }

      const messages = await redis.get<MyUIMessage[]>(`chat:history:${id}`);

      if (!messages) {
        return { messages: [] as MyUIMessage[] };
      }

      return { messages };
    }),
  getListofChats: publicProcedureWithUser.query(async ({ ctx }) => {
    if (!ctx.user || !ctx.user?.email) {
      return [];
    }
    if (ctx.user) {
      const chatHistoryList = await redis.get<ChatHistoryItem[]>(
        `chat:history-list:${ctx.user.email}`
      );
      if (!chatHistoryList || chatHistoryList.length === 0) {
        return [];
      }

      return chatHistoryList;
    }

    return [];
  }),
});
