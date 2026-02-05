import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { chatAPI } from '../api/api';
import { getSocket, sendMessage, onMessage, initSocket } from '../socket/socket';
import { useAuth } from '../context/AuthContext';
import ChatBubble from '../components/ChatBubble';
import Navbar from '../components/Navbar';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState('');
  const [chatPartner, setChatPartner] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    // Initialize socket
    initSocket();

    // Listen for incoming messages
    const unsubscribe = onMessage((msg) => {
      setMessages(prev => [...prev, {
        ...msg,
        isSent: msg.sender === user?.email || msg.sender === user?._id,
        timestamp: new Date()
      }]);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const loadChatHistory = async () => {
    if (!chatPartner.trim() || !user) return;

    setLoading(true);
    setError('');

    try {
      const userId = user._id || user.id || user.email;
      const response = await chatAPI.getChatHistory(userId, chatPartner);
      const history = response.data.messages || response.data || [];
      
      setMessages(history.map(msg => ({
        ...msg,
        isSent: msg.sender === userId || msg.sender === user.email,
      })));
      setReceiver(chatPartner);
    } catch (err) {
      setError('Failed to load chat history');
      console.error('Error loading chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !receiver) return;

    const messageData = {
      text: newMessage,
      message: newMessage,
      sender: user?._id || user?.id || user?.email,
      isSent: true,
      timestamp: new Date()
    };

    // Optimistic update
    setMessages(prev => [...prev, messageData]);
    
    // Send via socket
    sendMessage(receiver, newMessage);
    
    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleStartChat = (e) => {
    e.preventDefault();
    loadChatHistory();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold gradient-text">
            Messages
          </h1>
          {receiver && (
            <button
              onClick={() => {
                setReceiver('');
                setChatPartner('');
                setMessages([]);
              }}
              className="text-sm text-primary font-medium"
            >
              New Chat
            </button>
          )}
        </div>
      </header>

      <main ref={containerRef} className="flex-1 flex flex-col max-w-lg mx-auto w-full pb-24">
        {!receiver ? (
          /* Start Chat Form */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="card-genz w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center glow-primary">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-muted-foreground text-sm">Enter a user ID or email to chat</p>
              </div>

              <form onSubmit={handleStartChat} className="space-y-4">
                <input
                  type="text"
                  value={chatPartner}
                  onChange={(e) => setChatPartner(e.target.value)}
                  placeholder="User ID or email..."
                  className="input-genz"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !chatPartner.trim()}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Start Chat'}
                </button>
              </form>

              {error && (
                <p className="text-destructive text-sm text-center mt-4">{error}</p>
              )}
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <>
            {/* Chat partner info */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                  {receiver.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-foreground">{receiver}</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No messages yet. Say hi! 👋</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <ChatBubble
                    key={index}
                    message={msg.text || msg.message}
                    isSent={msg.isSent}
                    timestamp={msg.timestamp || msg.createdAt}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 glass border-t border-border">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-genz flex-1"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Chat;
