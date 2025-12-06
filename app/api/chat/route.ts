import { NextRequest, NextResponse } from "next/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { env } from "@/env";
import { streamText, convertToModelMessages } from "ai";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });
export async function POST(req: NextRequest, res: NextResponse) {
  const { messages } = await req.json();
  console.log(messages);
  const result = streamText({
    model: openrouter.chat("amazon/nova-2-lite-v1:free", {
      models: ["amazon/nova-2-lite-v1:free"],
      reasoning: { effort: "low" },
    }),
    messages: convertToModelMessages(messages),
  });
  const resValue = result.toUIMessageStreamResponse();
  console.log(resValue);
  return resValue;
  //   return NextResponse.json({ message: messages }, { status: 200 });
}
