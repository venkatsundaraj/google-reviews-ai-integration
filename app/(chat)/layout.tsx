import { ChatProvider } from "@/hooks/use-chat";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return <ChatProvider>{children}</ChatProvider>;
};

export default layout;
