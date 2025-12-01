import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://chatmania-server.onrender.com");

export default function Room() {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (joined) {
      socket.emit("join_room", id);

      socket.on("receive_message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      return () => {
        socket.off("receive_message");
      };
    }
  }, [id, joined]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = {
      room: id,
      sender: username || "Anonymous",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <div className="bg-white p-8 rounded-2xl shadow-md w-80 text-center">
          <h1 className="text-2xl font-semibold text-green-700 mb-4">Join Chat Room</h1>
          <input
            type="text"
            placeholder="Enter your name"
            className="border p-2 rounded w-full mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            onClick={() => setJoined(true)}
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">
      {/* Header */}
      <div className="bg-green-700 text-white p-3 flex justify-between items-center shadow-md">
        <div>
          <h2 className="font-bold text-lg">Chat Room</h2>
          <p className="text-sm text-green-200">Room ID: {id}</p>
        </div>
        <span className="text-sm italic">{username}</span>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender === username ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-xl shadow-sm ${
                m.sender === username
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm font-semibold">{m.sender}</p>
              <p>{m.content}</p>
              <p className="text-[10px] text-gray-300 text-right mt-1">
                {m.timestamp || ""}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Message input */}
      <div className="bg-gray-100 p-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
