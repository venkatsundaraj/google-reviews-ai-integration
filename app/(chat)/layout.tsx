import { ChatProvider } from "@/hooks/use-chat";
import { EditorProvider } from "@/hooks/use-editor";
import { FC } from "react";
import { AppSidebar } from "@/app/_components/miscellaneous/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../_components/ui/sidebar";
import SettingsIcon from "@/app/_components/chat/settings-icon";
import { ModeToggle } from "../_components/miscellaneous/toggle-theme";
import { Toaster } from "../_components/ui/sonner";

interface layoutProps {
  children: React.ReactNode;
}

const layout: FC<layoutProps> = ({ children }) => {
  return (
    <ChatProvider>
      <EditorProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full bg-background h-screen overflow-y-hidden flex flex-col items-center justify-start relative">
            <nav className="w-full z-10 h-[6%] bg-transparent">
              <div className="flex items-center justify-between py-4 px-8">
                <SidebarTrigger />
                <div className="flex items-center justify-center gap-4">
                  <SettingsIcon />
                  <ModeToggle />
                </div>
              </div>
            </nav>
            {children}
          </main>
          <Toaster />
        </SidebarProvider>
      </EditorProvider>
    </ChatProvider>
  );
};

export default layout;
