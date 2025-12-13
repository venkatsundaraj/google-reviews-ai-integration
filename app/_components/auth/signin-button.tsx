"use client";
import { FC, useEffect, useState } from "react";

import { Button, buttonVariants } from "@/app/_components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "@/app/_components/miscellaneous/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import SignoutButton from "@/app/_components/auth/signout-button";
import { signIn, useSession } from "@/lib/auth-client";

interface SigninButtonProps {}

const SigninButton: FC<SigninButtonProps> = ({}) => {
  const { data, isPending } = useSession();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!isPending) {
      setIsMounted(true);
    }
    console.log(data?.user.image, "session from the client");
  }, [isMounted, data, isPending]);

  const loginHandler = async function () {
    const { data } = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    console.log("clicked data", data);
  };

  if (!isMounted || status === "loading")
    return (
      <Button className={cn(buttonVariants({ variant: "outline" }), "gap-4")}>
        <Icons.LoaderCircle className="w-20 animate-spin stroke-foreground" />
      </Button>
    );
  return data ? (
    <div className="w-full flex flex-row items-center justify-between">
      <div className="flex items-center justify-start gap-2.5">
        {data.user.image ? (
          <Image
            src={data.user.image}
            alt={"user profile"}
            width={100}
            height={100}
            className="w-8 h-8 rounded-full"
          />
        ) : null}
        <span className="text-subtitle-heading text-foreground font-heading font-normal">
          {data.user.name}
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn("menu-item-group-active:opacity-100")}
        >
          <Icons.Ellipsis className="cursor-pointer stroke-1 stroke-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-[0.5px] cursor-pointer">
          <DropdownMenuItem
            className="cursor-pointer text-extra-subtitle-heading"
            asChild
          >
            <Link
              className="font-normal text-[16px] text-foreground"
              href={"/settings/account"}
            >
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-[16px]">
            <SignoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Button
      onClick={loginHandler}
      className={cn(buttonVariants({ variant: "outline" }), "gap-4")}
    >
      <Icons.LogIn className="w-20" />
      <span className="text-extra-subtitle-heading text-foreground leading-normal tracking-normal font-paragraph cursor-pointer">
        Signin
      </span>
    </Button>
  );
};

export default SigninButton;
