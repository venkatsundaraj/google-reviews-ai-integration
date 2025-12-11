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

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });
export async function POST(req: NextRequest, res: NextResponse) {
  const { messages } = (await req.json()) as { messages: MyUIMessage };

  const rawUserMessage = messages.parts.reduce(
    (acc, cur) => (cur.type === "text" ? acc + cur.text : ""),
    ""
  );

  const totalMessages = [messages] as MyUIMessage[];

  const stream = createUIMessageStream<MyUIMessage>({
    originalMessages: totalMessages,
    onFinish: ({ messages }) => {
      // console.log(messages);
    },
    onError: (err) => {
      console.log(err);
      return err instanceof Error ? err.message : "Something went wrong";
    },
    execute: async ({ writer }) => {
      const createWeatherTool = create_weather_tool({
        writer,
        ctx: { totalMessages, rawUserMessage },
      });

      const getCode = get_code();
      const googleMapInsights = google_map_insights();
      const result = streamText({
        model: openrouter.chat("amazon/nova-2-lite-v1:free", {
          models: ["amazon/nova-2-lite-v1:free"],
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

        messages: convertToModelMessages(totalMessages),
        stopWhen: stepCountIs(5),
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
