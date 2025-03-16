"use client";

import React from "react";

export default function Debate() {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [input, setInput] = React.useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMessages([...messages, `File uploaded: ${file.name}`]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="flex flex-col w-full bg-white shadow-md rounded-lg p-4">
        <div className="flex flex-col overflow-y-auto h-96">
          {messages.map((message, index) => (
            <div key={index} className="p-2 bg-gray-100 rounded-lg mb-2">
              <p className="text-black">{message}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col text-black sm:flex-row mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            type="file"
            onChange={handleFileUpload}
            className="flex-none"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="flex-none p-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
