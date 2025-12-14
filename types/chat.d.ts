import { AttachmentSchema } from "@/lib/validation/chat";
import { UIMessage } from "ai";
import z from "zod";

export const dataPart = z.object({
  "tool-reasoning": z.object({
    text: z.string(),
    status: z.enum(["streaming", "complete", "reasoning"]),
  }),
});

export type dataPartSchema = z.infer<typeof dataPart>;
export type Metadata = {
  userMessage: string;
  isGenerated: boolean;
  attachments: Array<AttachmentSchema>;
};
export type MyUIMessage = UIMessage<Metadata, dataPartSchema>;
