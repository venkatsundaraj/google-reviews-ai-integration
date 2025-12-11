"use client";

import { MyUIMessage } from "@/types/chat";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

interface ChatContextProps extends ReturnType<typeof useChat<MyUIMessage>> {
  startNewMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

export const ChatProvider = function ({
  children,
}: {
  children: React.ReactNode;
}) {
  const chatProps = useChat<MyUIMessage>({
    messages: [],
    id: "fdfd",
    onError: (err) => {
      console.log(err);
    },
    onFinish: (data) => {
      console.log(data);
    },
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id }) {
        return { body: { messages: messages[messages.length - 1] }, id };
      },
    }),
  });
  const startNewMessage = useCallback(async function (msg: string) {
    if (!msg.trim()) return;
    await chatProps.sendMessage({ text: msg });
  }, []);

  useEffect(() => {}, []);

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
