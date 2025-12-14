import { Icons } from "@/app/_components/miscellaneous/icons";
import SigninButton from "@/app/_components/auth/signin-button";
import { buttonVariants } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/app/_components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import SidebarContentClient from "./sidebar-content-client";

interface AppSidebarProps {}

export const AppSidebar = async function ({}: AppSidebarProps) {
  return (
    <Sidebar className="h-screen bg-transparent">
      <SidebarHeader className="bg-background gap-2">
        <Link
          href={"/"}
          className="text-foreground font-logo font-extrabold uppercase text-paragraph-heading pt-4  text-center leading-tight tracking-normal  max-w-2xl mb-4"
        >
          Locallens
        </Link>
        <Link
          href={`/`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "hover:bg-primary/90 text-white hover:text-white font-heading"
          )}
        >
          New Chat
        </Link>
      </SidebarHeader>
      <SidebarContentClient />
      <SidebarFooter>
        <SigninButton />
      </SidebarFooter>
    </Sidebar>
  );
};
