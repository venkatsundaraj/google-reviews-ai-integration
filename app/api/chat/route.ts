import { NextRequest, NextResponse } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/env";
import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  tool,
  stepCountIs,
} from "ai";
import { MyUIMessage } from "@/types/chat";
import z from "zod";
import { create_weather_tool } from "@/lib/tools/weather";
import { get_code } from "@/lib/tools/geocode";
import { google_map_insights } from "@/lib/tools/google-map-insights";
import { getCurrentUser } from "@/lib/session";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { XmlPrompt } from "@/lib/xml-prompt";
import { format } from "date-fns";
import { ChatHistoryItem } from "@/server/api/router/chat-router";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });
const messageInput = z.object({
  id: z.string(),
  message: z.any(),
});
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getCurrentUser();
    if (!session?.user.email) {
      throw new Error("unauthorized");
    }

    const { data } = messageInput.safeParse(body);

    if (!data) {
      throw new Error("Something went wrong here");
    }

    const { id, message } = data as { id: string; message: MyUIMessage };

    const limiter =
      session.user.plan === "pro"
        ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "4h") })
        : new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(5, "6h") });

    const [history, limitResult] = await Promise.all([
      redis.get<MyUIMessage[]>(`chat:history:${id}`),
      limiter.limit(session.user.email),
    ]);

    if (env.NODE_ENV === "production") {
      const { success } = limitResult;

      if (!success) {
        if (session.user.plan === "pro") {
          throw new Error(
            "You've reached your hourly message limit. Please try again in a few hours."
          );
        } else {
          throw new Error(
            "Free plan limit reached, please upgrade to continue."
          );
        }
      }
    }

    const rawUserMessage = message.parts.reduce(
      (acc, cur) => (cur.type === "text" ? acc + cur.text : ""),
      ""
    );

    const content = new XmlPrompt();
    content.open("message", { date: format(new Date(), "EEEE yyyy-MM-dd") });
    content.tag("user_message", rawUserMessage);
    content.close("message");

    const userMessage: MyUIMessage = {
      ...message,
      parts: [{ type: "text", text: rawUserMessage }],
    };

    const messages = [...(history ?? []), userMessage] as MyUIMessage[];

    const stream = createUIMessageStream<MyUIMessage>({
      originalMessages: messages,
      onFinish: async ({ messages }) => {
        await redis.set(`chat:history:${id}`, messages);

        const historyKey = `chat:history-list:${session.user.email}`;
        const existingHistory =
          (await redis.get<ChatHistoryItem[]>(historyKey)) || [];

        const firstUserMessage = messages.find((m) => m.role === "user");
        const userContent =
          firstUserMessage?.parts
            .filter((p) => p.type === "text")
            .map((p) => p.text)
            .join(" ") || "unnamed chat";

        const tempTitle =
          userContent.length > 60
            ? userContent.slice(0, 60) + "..."
            : userContent;

        const existing = existingHistory.find((item) => item.id === id);
        const title = existing?.title || tempTitle;

        const chatHistoryItem: ChatHistoryItem = {
          id,
          title: title,
          lastUpdated: new Date().toISOString(),
        };

        await redis.set(historyKey, [
          chatHistoryItem,
          ...existingHistory.filter((item) => item.id !== id),
        ]);
      },
      onError: (err) => {
        console.log(err);
        return err instanceof Error ? err.message : "Something went wrong";
      },
      execute: async ({ writer }) => {
        const createWeatherTool = create_weather_tool({
          writer,
          ctx: { messages, rawUserMessage },
        });

        const getCode = get_code();
        const googleMapInsights = google_map_insights();
        const result = streamText({
          model: openrouter.chat("nex-agi/deepseek-v3.1-nex-n1:free", {
            models: ["nex-agi/deepseek-v3.1-nex-n1:free"],
            reasoning: { effort: "low" },
          }),
          system: `You are a helpful assistant that provides restaurant and place recommendations based on Google Maps reviews.

                  When users ask about places:
                  - Use the googleMapInsights tool to fetch real review data
                  - Analyze the reviews to identify common themes (food quality, service, ambiance)
                  - Provide honest recommendations based on ratings and review content
                  - If a place has low ratings, mention it diplomatically
                  - Always cite that your information comes from Google Maps reviews

                  Important: Only recommend places you've actually fetched data for. Don't make up information.`,
          tools: {
            // createWeatherTool,
            // getCode,
            googleMapInsights,
          },

          messages: convertToModelMessages(messages),
          stopWhen: stepCountIs(5),
        });

        writer.merge(result.toUIMessageStream());
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}

// nex-agi/deepseek-v3.1-nex-n1:free
// nex-agi/deepseek-v3.1-nex-n1:free
