import { AttachmentSchema } from "@/lib/validation/chat";
import { UIMessage } from "ai";
import z from "zod";

export const dataPart = z.object({
  mainResponse: z.object({
    text: z.string(),
    status: z.enum(["streaming", "complete"]),
  }),
});

export type dataPartSchema = z.infer<typeof dataPart>;
type Metadata = {
  userMessage: string;
  isGenerated: boolean;
  attachments: Array<AttachmentSchema>;
};
export type MyUIMessage = UIMessage<Metadata, dataPartSchema>;
