import React, { useState, useEffect, useRef } from "react";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import ChatbotIcon from "./ChatbotIcon";
import { companyInfo } from "./companyInfo";
import { IoChatbox, IoClose } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const Chatbox = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "mode1",
      text: companyInfo,
    },
  ]);

  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "mode1", text, isError },
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedHistory }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseText}`);
      }

      if (!responseText) {
        throw new Error("Empty response from server.");
      }

      const data = JSON.parse(responseText);

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?.replace(/\*\*(.*?)\*\*/g, "$1")
        ?.trim();

      if (!reply) throw new Error("Empty response content.");

      updateHistory(reply);
    } catch (error) {
      console.error("Bot error:", error);
      updateHistory(error.message || "Unexpected error occurred", true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {showChatbot ? <IoClose size={24} /> : <IoChatbox size={24} />}
      </button>

      {/* Floating Chatbot */}
      {showChatbot && (
        <div className="fixed bottom-20 right-4 w-[420px] z-40">
          <div className="chatbot-popup bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="chat-header bg-blue-700 text-white p-4 flex justify-between items-center">
              <div className="header-info flex items-center gap-2">
                <ChatbotIcon />
                <h2 className="logo-text font-semibold text-lg">Chatbot</h2>
              </div>
              <button
                onClick={() => setShowChatbot(false)}
                className="text-white hover:text-gray-200"
              >
                <IoIosArrowDown size={20} />
              </button>
            </div>

            {/* Body */}
            <div
              ref={chatBodyRef}
              className="chat-body flex flex-col gap-3 p-4 overflow-y-auto max-h-[400px] bg-white"
            >
              <div className="message bot-message flex items-start gap-2">
                <ChatbotIcon />
                <p className="message-text bg-gray-100 p-3 rounded-lg text-sm max-w-[75%]">
                  Hey there! <br /> How can I help you today?
                </p>
              </div>
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Footer */}
            <div className="chat-footer border-t p-2">
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;
