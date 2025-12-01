import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Room() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join_room', id);
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.disconnect();
  }, [id]);

  const sendMessage = () => {
    const msgData = { roomId: id, sender: 'User', content: message };
    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage('');
  };

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-2'>Room: {id}</h2>
      <div className='border h-64 overflow-y-scroll p-2 mb-4'>
        {messages.map((m, i) => <p key={i}><b>{m.sender}:</b> {m.content}</p>)}
      </div>
      <input className='border p-2 w-3/4' value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className='ml-2 bg-green-500 text-white px-4 py-2' onClick={sendMessage}>Send</button>
    </div>
  );
}