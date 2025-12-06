"use client";

import { ChangeEvent, FC, FormEvent, useRef } from "react";
import { Textarea } from "../ui/text-area";
import { useChat } from "@ai-sdk/react";
import { useChatContext } from "@/hooks/use-chat";

interface InputBoxProps {}

const InputBox: FC<InputBoxProps> = ({}) => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { sendMessage, startNewMessage } = useChatContext();

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      console.log(inputRef.current.value.trim());
      sendMessage({ text: inputRef.current.value });
    }
  };
  return (
    <form onSubmit={submitHandler}>
      <Textarea ref={inputRef} className="max-w-4xl focus-visible:ring-0" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default InputBox;
