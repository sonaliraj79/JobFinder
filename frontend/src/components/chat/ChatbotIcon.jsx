// src/components/chat/ChatbotIcon.jsx
import React from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const ChatbotIcon = () => {
  return (
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl">
      <HiOutlineChatAlt2 />
    </div>
  );
};

export default ChatbotIcon;
