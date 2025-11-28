import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessagePage from "./MessagePage";

const ChatContainer = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <ChatHeader />

      <MessagePage />

      <ChatInput />
    </div>
  );
};

export default ChatContainer;
