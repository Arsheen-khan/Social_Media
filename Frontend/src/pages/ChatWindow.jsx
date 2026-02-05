import React, { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { useParams, useNavigate } from 'react-router-dom';
import { getSocket, initSocket } from '../api/socket';
import { chatAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';

const ChatWindow = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const socketInstance = initSocket();
    setSocket(socketInstance);

    return () => {
      if (!socketInstance.connected) {
        socketInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    fetchChatHistory();
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        if (data.sender._id === userId || data.sender._id === user?._id) {
          setMessages((prev) => [...prev, data]);
        }
      });

      return () => {
        socket.off('message');
      };
    }
  }, [socket, userId, user?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0) {
      const messageElements = messagesContainerRef.current.querySelectorAll('.message-bubble');
      if (messageElements.length > 0) {
        const lastMessage = messageElements[messageElements.length - 1];
        gsap.fromTo(
          lastMessage,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getChatHistory(userId);
      const chatData = response.data.chat || [];
      setMessages(chatData.messages || []);
      setOtherUser(chatData.user || { _id: userId });
      setError(null);
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setError('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || !socket || !user) return;

    try {
      setSending(true);

      socket.emit('message', {
        receiver: userId,
        message: inputMessage.trim(),
        sender: user,
      });

      setMessages((prev) => [
        ...prev,
        {
          _id: `temp-${Date.now()}`,
          message: inputMessage,
          sender: user,
          timestamp: new Date(),
        },
      ]);

      setInputMessage('');
      setError(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#F7F8FC',
  };

  const headerStyle = {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #f0f0f0',
    padding: '15px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  };

  const backButtonStyle = {
    backgroundColor: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px',
    color: '#333',
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#6C63FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    flexShrink: 0,
    overflow: 'hidden',
    objectFit: 'cover',
  };

  const usernameStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
  };

  const messagesAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '15px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const messageBubbleStyle = (isOwn) => ({
    display: 'flex',
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
    marginBottom: '5px',
  });

  const messageContentStyle = (isOwn) => ({
    maxWidth: '70%',
    padding: '10px 15px',
    borderRadius: isOwn ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
    backgroundColor: isOwn
      ? 'linear-gradient(135deg, #6C63FF, #5a52d5)'
      : '#FFFFFF',
    color: isOwn ? '#fff' : '#333',
    fontSize: '14px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    boxShadow: isOwn
      ? '0 4px 12px rgba(108, 99, 255, 0.3)'
      : '0 2px 8px rgba(0,0,0,0.08)',
  });

  const messageTimeStyle = {
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
  };

  const inputAreaStyle = {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #f0f0f0',
    padding: '15px 20px',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
  };

  const inputFormStyle = {
    display: 'flex',
    gap: '10px',
    maxWidth: '100%',
  };

  const inputFieldStyle = {
    flex: 1,
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '22px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.3s ease',
  };

  const sendButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6C63FF',
    color: '#fff',
    border: 'none',
    borderRadius: '22px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: sending ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: sending ? 0.7 : 1,
    flexShrink: 0,
  };

  const errorStyle = {
    backgroundColor: '#ffe0e0',
    color: '#c41e3a',
    padding: '10px 15px',
    borderRadius: '12px',
    fontSize: '12px',
    marginBottom: '10px',
    textAlign: 'center',
  };

  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div style={{ ...containerStyle, ...loadingStyle }}>
        <Loading />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button
          style={backButtonStyle}
          onClick={() => navigate('/chat')}
          onMouseOver={(e) => (e.target.style.color = '#666')}
          onMouseOut={(e) => (e.target.style.color = '#333')}
        >
          ←
        </button>
        {otherUser?.image ? (
          <img src={otherUser.image} alt={otherUser?.username} style={avatarStyle} />
        ) : (
          <div style={avatarStyle}>{otherUser?.username?.[0]?.toUpperCase()}</div>
        )}
        <h2 style={usernameStyle}>{otherUser?.username || 'Chat'}</h2>
      </div>

      <div style={messagesAreaStyle} ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', margin: 'auto' }}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender?._id === user?._id;
            return (
              <div key={msg._id || index} className="message-bubble">
                <div style={messageBubbleStyle(isOwn)}>
                  <div>
                    <div style={messageContentStyle(isOwn)}>{msg.message}</div>
                    <div
                      style={{
                        ...messageTimeStyle,
                        textAlign: isOwn ? 'right' : 'left',
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={inputAreaStyle}>
        <form style={inputFormStyle} onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            style={inputFieldStyle}
            disabled={sending}
            onFocus={(e) => {
              e.target.style.borderColor = '#6C63FF';
              e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type="submit"
            style={sendButtonStyle}
            disabled={sending || !inputMessage.trim()}
            onMouseOver={(e) => {
              if (!sending && inputMessage.trim()) {
                e.target.style.backgroundColor = '#5a52d5';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#6C63FF';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {sending ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
