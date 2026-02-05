import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ChatBubble = ({ message, isSent, timestamp }) => {
  const bubbleRef = useRef(null);

  useEffect(() => {
    if (bubbleRef.current) {
      gsap.fromTo(bubbleRef.current,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, []);

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        ref={bubbleRef}
        className={`chat-bubble ${isSent ? 'sent' : 'received'}`}
      >
        <p>{message}</p>
        {timestamp && (
          <span className={`text-[10px] mt-1 block ${isSent ? 'text-white/70' : 'text-muted-foreground'}`}>
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
