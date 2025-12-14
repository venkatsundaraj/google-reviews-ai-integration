"use client";

import { MyUIMessage } from "@/types/chat";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useParams, useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { User } from "@/server/db/schema";
import { api } from "@/trpc/react";

interface ChatContextProps extends ReturnType<typeof useChat<MyUIMessage>> {
  startNewMessage: (text: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | null>(null);
const pendingMessages = new Map<string, string>();

export const ChatProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatValue, setChatValue] = useState<string>();
  const [hasPending, setHasPending] = useState<boolean>(true);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const utils = api.useUtils();
  const session = useSession();

  const { data } = api.chat.getChatHistories.useQuery(
    { id: params.id as string },
    {
      enabled: Boolean(params.id && session),
      refetchOnMount: true,
      staleTime: 0,
      refetchOnWindowFocus: false,
    }
  );

  const chatProps = useChat<MyUIMessage>({
    messages: [],
    id: params.id ?? undefined,
    onError: (err) => {
      console.log(err);
    },
    onFinish: (data) => {
      console.log(data);
    },
    transport: new DefaultChatTransport({
      api: "/api/chat",

      prepareSendMessagesRequest({ messages, id }) {
        console.log(id, "iddd");
        return { body: { message: messages[messages.length - 1], id } };
      },
    }),
  });
  const startNewMessage = useCallback(
    async function (msg: string) {
      if (!msg) {
        toast.error("You have to enter the message", {
          position: "top-center",
        });
        return;
      }

      const sessionRes = await authClient.getSession();
      const currentUser = sessionRes.data?.user as User;

      if (!currentUser?.email) {
        toast.error("Please authenticate", { position: "top-center" });
        return;
      }

      if (params.id) {
        await chatProps.sendMessage({ text: msg });
        utils.chat.getListofChats.invalidate();
      }
      if (!params.id) {
        const defaultValue = nanoid();

        toast.success("New chat has been created", {
          position: "top-center",
        });

        pendingMessages.set(defaultValue, msg);

        router.push(`/chat/${defaultValue}`);
      }
      return Promise.resolve();
    },
    [params.id, router, chatProps, utils.chat.getListofChats]
  );

  useEffect(() => {
    if (!params.id || !hasPending) return;
    const pendingMessage = pendingMessages.get(params.id);
    if (pendingMessage) {
      setHasPending(false);
      chatProps.sendMessage({ text: pendingMessage }).then(() => {
        utils.chat.getListofChats.invalidate();
      });
      pendingMessages.delete(params.id);
    }
  }, [params.id, router, chatProps, utils.chat.getListofChats]);

  useEffect(() => {
    if (data?.messages && data.messages.length > 0) {
      chatProps.setMessages(data?.messages);
    }
  }, [data?.messages]);

  const value = useMemo(
    () => ({ startNewMessage, ...chatProps }),
    [chatProps, startNewMessage]
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = function () {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("you have to wrap the entire component");
  }
  return context;
};
