import Link from "next/link";
import { FC } from "react";
import { Icons } from "../miscellaneous/icons";
import { useSession } from "@/lib/auth-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface SettingsIconProps {}

const SettingsIcon = async ({}: SettingsIconProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return Boolean(session) ? (
    <Link href={"/settings/account"} className="hover:bg-background/80">
      <Icons.Settings2 className="stroke-foreground w-4 h-8 " />
    </Link>
  ) : null;
};

export default SettingsIcon;
