import AccountProvider from "@/hooks/use-account";

import { ChatProvider } from "@/hooks/use-chat";
import { FC } from "react";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <AccountProvider>
      <ChatProvider>{children}</ChatProvider>
    </AccountProvider>
  );
};

export default layout;
