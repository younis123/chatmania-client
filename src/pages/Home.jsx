import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!roomName.trim()) {
      alert("Please enter a room name!");
      return;
    }

    try {
      const response = await axios.post(
        "https://chatmania-server.onrender.com/rooms/create",
        { name: roomName }
      );

      navigate(`/room/${response.data.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-green-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-96 text-center border-t-4 border-green-500">
        {/* App Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-2xl font-bold shadow-md">
            💬
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-green-700 mb-2">
          Welcome to Chatmania
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Create your chat room and start chatting instantly.
        </p>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter a room name..."
          className="border border-gray-300 rounded-full px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createRoom()}
        />

        {/* Button */}
        <button
          onClick={createRoom}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2 w-full transition duration-200 shadow-sm"
        >
          Create Room
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          Powered by <span className="text-green-600 font-semibold">Chatmania</span>
        </p>
      </div>
    </div>
  );
}
