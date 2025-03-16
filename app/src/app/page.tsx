"use client";

import React from "react";

export default function Debate() {
  const [messages, setMessages] = React.useState<string[]>([]);
  const [input, setInput] = React.useState<string>("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input.trim()]);
      setInput("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMessages([...messages, `File uploaded: ${file.name}`]);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        event.preventDefault();
        setInput(input + "\n");
      } else {
        event.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 h-full p-4">
      <div className="flex flex-col w-full bg-white shadow-md rounded-lg grow">
        <div className="flex flex-col overflow-y-auto grow bg-gray-100 break-words">
          {messages.map((message, index) => (
            <div key={index} className="p-2 rounded-lg mb-2 bg-white max-w-full w-fit">
              <p className="text-black">
                {message.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-col p-1 text-black sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <input type="file" onChange={handleFileUpload} />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow border rounded-lg resize-none"
            placeholder="Type a message..."
            rows={3}
          />
          <button
            onClick={handleSend}
            className="p-1 bg-blue-500 text-white rounded-lg h-1/2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
