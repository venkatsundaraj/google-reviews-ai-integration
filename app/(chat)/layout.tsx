import { ChatProvider } from "@/hooks/use-chat";
import { EditorProvider } from "@/hooks/use-editor";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <ChatProvider>
      <EditorProvider>{children}</EditorProvider>
    </ChatProvider>
  );
};

export default layout;
