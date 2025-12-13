import { env } from "@/env";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getUserWithRole = async function (userId: string) {
  try {
    const [user] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId));
    if (!user || !user.id) {
      throw new Error("Something went wrong");
    }
    return user;
  } catch (err) {
    console.log(err);
  }
};
