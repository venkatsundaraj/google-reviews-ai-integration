import z from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

const MAX_FILE_SIZE = 5000000;
const MAX_FILE_COUNT = 5;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileValidator = z.object({
  files: z
    .array(
      z.object({
        name: z.string(),
        type: z
          .string()
          .refine(
            (type) => ACCEPTED_IMAGE_TYPES.includes(type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
          ),
        size: z
          .number()
          .max(MAX_FILE_SIZE, "Each image must be less than 5MB."),
        data: z.string(),
      })
    )
    .min(1, "At least one file is required.")
    .max(MAX_FILE_COUNT, `You can only upload up to ${MAX_FILE_COUNT} files.`),
});
export const fileRouter = createTRPCRouter({
  upload: privateProcedure.input(fileValidator).mutation(({ ctx, input }) => {
    console.log(input.files);
    return true;
  }),
});
