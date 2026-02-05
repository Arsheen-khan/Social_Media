import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import socket from '../api/socket';

const Conversation = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketConnectedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/chat/chat-history/${user._id}/${userId}`);
        
        const history = response.data.messages || response.data || [];
        setMessages(history);
        
        // Set other user info from first message or from response
        if (response.data.user) {
          setOtherUser(response.data.user);
        }
      } catch (err) {
        setError('Failed to load chat history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [userId, user._id]);

  // Socket.io setup
  useEffect(() => {
    const connectSocket = () => {
      if (!socket.connected) {
        socket.connect();
        socketConnectedRef.current = true;
      }

      // Listen for incoming messages
      socket.off('message'); // Remove old listeners
      socket.on('message', (data) => {
        if (data.sender === userId || data.receiver === userId) {
          setMessages((prev) => [...prev, data]);
        }
      });

      return () => {
        socket.off('message');
      };
    };

    connectSocket();

    return () => {
      if (socketConnectedRef.current && socket.connected) {
        socket.off('message');
      }
    };
  }, [userId, user._id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Emit message via socket
      socket.emit('message', {
        receiver: userId,
        message: newMessage,
      });

      // Add to local state immediately
      setMessages((prev) => [
        ...prev,
        {
          sender: user._id,
          receiver: userId,
          text: newMessage,
          timestamp: new Date(),
        },
      ]);

      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    }
  };

  if (loading) return <div className="conversation-container"><div>Loading...</div></div>;

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <button onClick={() => navigate('/chat')} className="back-btn">
          ← Back
        </button>
        <h2>{otherUser?.email || userId}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}
            >
              <p>{msg.text || msg.message}</p>
              <small className="timestamp">
                {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default Conversation;
