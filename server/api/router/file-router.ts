import z from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileValidator = z.object({
  file: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});
export const fileRouter = createTRPCRouter({
  upload: privateProcedure.input(fileValidator).mutation(({ ctx, input }) => {
    console.log(input.file);
    return true;
  }),
});
