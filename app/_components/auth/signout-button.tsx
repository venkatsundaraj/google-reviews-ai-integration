"use client";

import { FC } from "react";
import { Button, buttonVariants } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Icons } from "@/app/_components/miscellaneous/icons";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";

interface SignoutButtonProps {}

const SignoutButton: FC<SignoutButtonProps> = ({}) => {
  const router = useRouter();
  const utils = api.useUtils();
  return (
    <Button
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              //   utils.chat.getListofChats.invalidate();
              router.push("/"); // Redirect to the login page
            },
          },
        });
      }}
      className={cn(
        buttonVariants({ variant: "link" }),
        "gap-4 no-underline p-0 bg-transparent cursor-pointer h-[initial] text-primary hover:bg-inherit hover:no-underline"
      )}
    >
      <span className="text-extra-subtitle-heading text-foreground leading-normal tracking-normal font-paragraph">
        Signout
      </span>
    </Button>
  );
};

export default SignoutButton;
