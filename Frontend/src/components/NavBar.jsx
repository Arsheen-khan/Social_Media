import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar({ user, currentPage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(229, 229, 234, 0.3)',
        zIndex: 1000,
        padding: '0 20px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: currentPage === 'home' ? '#6C63FF' : '#8E8E93',
            transition: 'all 0.3s ease',
            transform: currentPage === 'home' ? 'scale(1.15)' : 'scale(1)',
          }}
          title="Home"
        >
          🏠
        </button>
        <button
          onClick={() => navigate('/create')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: currentPage === 'create' ? '#6C63FF' : '#8E8E93',
            transition: 'all 0.3s ease',
            transform: currentPage === 'create' ? 'scale(1.15)' : 'scale(1)',
          }}
          title="Create"
        >
          {String.fromCharCode(10133)}
        </button>
        <button
          onClick={() => navigate('/chat')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: currentPage === 'chat' ? '#6C63FF' : '#8E8E93',
            transition: 'all 0.3s ease',
            transform: currentPage === 'chat' ? 'scale(1.15)' : 'scale(1)',
          }}
          title="Chat"
        >
          💬
        </button>
        <button
          onClick={() => navigate('/profile')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: currentPage === 'profile' ? '#6C63FF' : '#8E8E93',
            transition: 'all 0.3s ease',
            transform: currentPage === 'profile' ? 'scale(1.15)' : 'scale(1)',
          }}
          title="Profile"
        >
          👤
        </button>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            color: '#8E8E93',
            transition: 'all 0.3s ease',
          }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
