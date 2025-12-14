import ChatInputLexical from "@/app/_components/chat/chat-input-lexical";

interface pageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

const page = async ({ params }: pageProps) => {
  const param = await params;

  const isEditMode = Boolean(param.id);

  return isEditMode ? (
    <section className="w-full h-screen overflow-y-hidden flex items-center justify-center ">
      <div className="container h-full flex-col flex items-center justify-between">
        <ChatInputLexical />
      </div>
    </section>
  ) : null;
};

export default page;
