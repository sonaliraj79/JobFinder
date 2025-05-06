import React from "react";
import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  const isBot = chat.role === "mode1";

  return (
    <div
      className={`flex items-start gap-2 ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && <ChatbotIcon />}
      <p
        className={`p-3 rounded-lg text-sm max-w-[75%] ${
          chat.isError
            ? "bg-red-100 text-red-700"
            : isBot
            ? "bg-blue-100 text-gray-900"
            : "bg-blue-600 text-white self-end"
        }`}
      >
        {chat.text}
      </p>
    </div>
  );
};

export default ChatMessage;
