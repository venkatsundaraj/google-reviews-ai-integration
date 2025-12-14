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
    <Sidebar className="h-screen py-">
      <SidebarHeader className="bg-background gap-2">
        <Link
          href={"/"}
          className="text-foreground font-bold text-paragraph-heading  text-center leading-tight tracking-normal font-heading  max-w-2xl mb-4"
        >
          Google Maps AI
        </Link>
        <Link
          href={`/`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "hover:bg-primary/90 text-white hover:text-white"
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
