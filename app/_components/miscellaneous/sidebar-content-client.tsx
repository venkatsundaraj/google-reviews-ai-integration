"use client";

import { FC, useState } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/_components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Icons } from "@/app/_components/miscellaneous/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { api } from "@/trpc/react";
import { useSession } from "@/lib/auth-client";

interface SidebarContentClientProps {}

const SidebarContentClient: FC<SidebarContentClientProps> = ({}) => {
  const {
    data: chatHistory,
    isLoading,
    isError,
  } = api.chat.getListofChats.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 0,
    refetchOnMount: true,
  });

  if (isLoading) {
    return (
      <SidebarContent className="bg-background px-3 py-2 flex flex-col items-center justify-center gap-6">
        <SidebarMenu className="flex-1 flex items-center justify-center text-center font-semibold font-heading text-foreground text-subtitle-heading">
          Loading...
        </SidebarMenu>
      </SidebarContent>
    );
  }

  if (isError) {
    return (
      <SidebarContent className="bg-background px-3 py-2 flex flex-col items-center justify-center gap-6">
        <SidebarMenu className="flex-1 flex items-center justify-center text-center font-semibold font-heading text-foreground text-subtitle-heading">
          Please login to check the histories
        </SidebarMenu>
      </SidebarContent>
    );
  }
  if (!chatHistory?.length) {
    return (
      <SidebarContent className="bg-background px-3 py-2 flex flex-col items-center justify-center gap-6">
        <SidebarMenu className="flex-1 flex items-center justify-center text-center font-semibold font-heading text-primary text-subtitle-heading">
          No chat history has been created.
        </SidebarMenu>
      </SidebarContent>
    );
  }

  if (isError) {
    return (
      <SidebarContent className="bg-background px-3 py-2 flex flex-col items-center justify-center gap-6">
        <SidebarMenu className="flex-1 flex items-center justify-center text-center font-semibold font-heading text-foreground text-subtitle-heading">
          Please login to check the histories
        </SidebarMenu>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent className="bg-background px-3 py-2 flex flex-col items-start justify-start gap-6">
      <SidebarMenu className="flex-1">
        {chatHistory && chatHistory.length > 0 ? (
          chatHistory.map((item, i) => {
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild className="">
                  <Link
                    href={`/chat/${item.id}`}
                    className="text-extra-paragraph-headin cursor-pointer menu-item-group font-paragraph text-foreground leading-normal tracking-wide"
                  >
                    <span className="max-w-[85%] w-full block truncate">
                      {item.title}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className={cn(
                          "opacity-0 menu-item-group-hover:opacity-100 menu-item-group-active:opacity-100"
                        )}
                      >
                        <Icons.Ellipsis className="cursor-pointer stroke-1" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-[0.5px] cursor-pointer">
                        <DropdownMenuItem className="cursor-pointer">
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Pin
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })
        ) : (
          <SidebarMenuItem className="text-center my-auto">
            Please login to check the histories
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarContent>
  );
};

export default SidebarContentClient;
