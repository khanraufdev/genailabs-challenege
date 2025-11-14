import { ChatList } from "@/components/lab/chat-list";
import { SignOutButton } from "@/components/signout-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b px-4 py-3 h-10">
          <h2 className="text-sm font-semibold">Chats</h2>
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto">
          <ChatList />
        </SidebarContent>
        <SidebarFooter className="border-t p-4">
          <SignOutButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-10 shrink-0 items-center border-b px-4">
          <SidebarTrigger className="size-6 cursor-pointer hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-md" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
