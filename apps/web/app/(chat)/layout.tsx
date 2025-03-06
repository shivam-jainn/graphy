import { ChatProvider } from "@/components/chat-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <ChatProvider>
          {children}
        </ChatProvider>
    </section>
  );
}
