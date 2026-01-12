import z from "zod";

export const attachmentValidation = z.object({
  id: z.string(),
  type: z.enum(["url", "txt", "docx", "pdf", "image", "manual", "video"]),
  title: z.string().nullable(),
  key: z.string().optional(),
  variant: z.enum(["knowledge", "chat"]),
  url: z.string(),
});

export type AttachmentSchema = z.infer<typeof attachmentValidation>;
