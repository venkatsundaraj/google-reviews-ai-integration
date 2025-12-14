"use client";
import { User } from "@/server/db/schema";
import { notFound } from "next/navigation";
import {
  FC,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSession } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/session";

interface AccountProviderProps {
  children: React.ReactNode;
}

export const AccountContext = createContext<{
  account: User;
  isLoading: boolean;
} | null>(null);

const AccountProvider = ({ children }: AccountProviderProps) => {
  const session = useSession();

  return (
    <AccountContext.Provider
      value={{ account: { ...(session.data?.user as User) }, isLoading: true }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}

export default AccountProvider;
