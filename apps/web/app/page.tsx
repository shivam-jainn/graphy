import { ChatInput } from "@graphy/chatter/src/components/ChatInput";
import {MessageBubble} from "@graphy/chatter/src/components/MessageBubble";
export default function Page() {
  const messageExample = {
    content : "hello world lorem ipsum dolor sit amet",
    type : "text"
  }
  return (
    <div className="h-full">
      <ChatInput />

      <div className="px-8">
        <MessageBubble message={messageExample}  />
      </div>
    </div>
  );
}
