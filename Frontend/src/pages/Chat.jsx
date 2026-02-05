import React, { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { getSocket, initSocket } from '../api/socket';
import { chatAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const socketInstance = initSocket();
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to socket');
    });

    socketInstance.on('message', (data) => {
      console.log('New message:', data);
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv._id === data.conversationId || conv.user._id === data.sender._id) {
            return {
              ...conv,
              lastMessage: data.message,
              lastMessageTime: new Date(),
            };
          }
          return conv;
        });
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      const convsData = response.data.conversations || [];
      setConversations(convsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current && conversations.length > 0) {
      const items = containerRef.current.querySelectorAll('.conversation-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [conversations]);

  const handleConversationClick = (conversationId, userId) => {
    navigate(`/chat/${conversationId || userId}`);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return d.toLocaleDateString();
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F7F8FC',
    paddingBottom: '100px',
    paddingTop: '20px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '25px',
    paddingTop: '10px',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6C63FF 0%, #00C9FF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0',
  };

  const conversationsListStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '0 15px',
  };

  const conversationItemStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '15px',
    marginBottom: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const avatarStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#6C63FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
    flexShrink: 0,
    overflow: 'hidden',
    objectFit: 'cover',
  };

  const contentStyle = {
    flex: 1,
    minWidth: 0,
  };

  const userNameStyle = {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 5px 0',
  };

  const messagePreviewStyle = {
    fontSize: '13px',
    color: '#666',
    margin: '0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const timeStyle = {
    fontSize: '12px',
    color: '#999',
    whiteSpace: 'nowrap',
    marginLeft: '10px',
  };

  const loadingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  };

  const errorStyle = {
    backgroundColor: '#ffe0e0',
    color: '#c41e3a',
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '13px',
    maxWidth: '500px',
    margin: '20px auto',
    textAlign: 'center',
  };

  const emptyStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Messages</h1>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <div style={loadingContainerStyle}>
          <Loading />
        </div>
      ) : conversations.length === 0 ? (
        <div style={emptyStyle}>
          <p>No conversations yet.</p>
          <p style={{ fontSize: '12px', color: '#ccc' }}>Start chatting with someone!</p>
        </div>
      ) : (
        <div style={conversationsListStyle} ref={containerRef}>
          {conversations.map((conversation) => (
            <div
              key={conversation._id || conversation.user._id}
              className="conversation-item"
              style={conversationItemStyle}
              onClick={() =>
                handleConversationClick(conversation._id, conversation.user._id)
              }
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {conversation.user?.image ? (
                <img
                  src={conversation.user.image}
                  alt={conversation.user?.username}
                  style={avatarStyle}
                />
              ) : (
                <div style={avatarStyle}>{conversation.user?.username?.[0]?.toUpperCase()}</div>
              )}

              <div style={contentStyle}>
                <p style={userNameStyle}>{conversation.user?.username || 'Unknown'}</p>
                <p style={messagePreviewStyle}>
                  {conversation.lastMessage || 'No messages yet'}
                </p>
              </div>

              <div style={timeStyle}>{formatTime(conversation.lastMessageTime)}</div>
            </div>
          ))}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Chat;
