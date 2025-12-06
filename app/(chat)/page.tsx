import Image from "next/image";
import InputBox from "@/app/_components/chat/input-box";

export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <InputBox />
    </main>
  );
}
