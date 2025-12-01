import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      console.log("Creating room:", roomName);

      // ✅ Use your Render backend instead of localhost
      const response = await axios.post(
        "https://chatmania-server.onrender.com/rooms/create",
        { name: roomName }
      );

      console.log("Room created successfully:", response.data);

      // ✅ Redirect to room page
      navigate(`/room/${response.data.id}`);
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Check console for details.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create a Chat Room</h1>
      <input
        className="border p-2"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter a room name"
      />
      <button
        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={createRoom}
      >
        Create
      </button>
    </div>
  );
}
