import Image from "next/image";
import InputBox from "@/app/_components/chat/input-box";
import ChatInputLexical from "@/app/_components/chat/chat-input-lexical";
import { api } from "@/trpc/server";

export default async function Home() {
  const data = await api.hello.hello();
  return (
    <section className="h-full w-full flex items-center justify-center">
      <ChatInputLexical />
    </section>
  );
}
