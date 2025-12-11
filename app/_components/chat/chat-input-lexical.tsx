"use client";

import { FC, PropsWithChildren } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import ChatInputLexicalComponent from "./chat-input-lexical-component";

interface ChatInputLexicalProps {}

const initialConfig = {
  namespace: "chat-input",
  onError: (err: Error) => {
    console.log(err);
  },
  nodes: [],
  themes: {
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
  },
};

const ChatInputLexical: FC<ChatInputLexicalProps> = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ChatInputLexicalComponent />
    </LexicalComposer>
  );
};

export default ChatInputLexical;
