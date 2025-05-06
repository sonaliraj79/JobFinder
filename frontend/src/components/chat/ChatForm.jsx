import React, { useRef } from "react";
import { FaChevronUp } from "react-icons/fa";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    const updatedHistory = [
      ...chatHistory,
      { role: "user", text: userMessage },
    ];

    setChatHistory(updatedHistory);

    // Show Thinking message
    setChatHistory((history) => [
      ...history,
      { role: "mode1", text: "Thinking..." },
    ]);

    setTimeout(() => {
      generateBotResponse([
        ...updatedHistory,
        {
          role: "user",
          text: `using the details provided above, please address this query: ${userMessage}`,
        },
      ]);
    }, 600);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="chat-form flex items-center gap-2 p-2"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input flex-1 px-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <button
        type="submit"
        className="material-symbols-rounded bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
      >
        <FaChevronUp />
      </button>
    </form>
  );
};

export default ChatForm;
