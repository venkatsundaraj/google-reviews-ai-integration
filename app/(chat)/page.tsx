import Image from "next/image";
import InputBox from "@/app/_components/chat/input-box";
import ChatInputLexical from "@/app/_components/chat/chat-input-lexical";

export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center ">
      <section className="min-h-screen flex items-end justify-center">
        <ChatInputLexical />
      </section>
    </main>
  );
}
