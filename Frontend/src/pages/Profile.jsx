import React, { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { postsAPI } from '../api/api';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsGridRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      const allPosts = response.data.posts || [];
      const userPostsData = allPosts.filter((post) => post.user?._id === user?._id);
      setUserPosts(userPostsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Failed to load your posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postsGridRef.current && userPosts.length > 0) {
      const postItems = postsGridRef.current.querySelectorAll('.profile-post-item');
      gsap.fromTo(
        postItems,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out',
        }
      );
    }
  }, [userPosts]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F7F8FC',
    paddingBottom: '100px',
    paddingTop: '20px',
  };

  const profileHeaderStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '22px',
    padding: '30px 20px',
    marginBottom: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    maxWidth: '500px',
    margin: '0 auto 30px auto',
    textAlign: 'center',
  };

  const profileImageStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#6C63FF',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '48px',
    fontWeight: 'bold',
    overflow: 'hidden',
    objectFit: 'cover',
  };

  const usernameStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0 0 5px 0',
  };

  const emailStyle = {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 20px 0',
  };

  const statsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
  };

  const statItemStyle = {
    textAlign: 'center',
  };

  const statNumberStyle = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#6C63FF',
    margin: '0',
  };

  const statLabelStyle = {
    fontSize: '12px',
    color: '#666',
    margin: '5px 0 0 0',
  };

  const logoutButtonStyle = {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#FF4D8D',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
    maxWidth: '500px',
    margin: '0 auto 15px auto',
    padding: '0 20px',
  };

  const postsGridContainerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '0 15px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  };

  const postItemStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    aspectRatio: '1',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
  };

  const postImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
    padding: '40px 20px',
    color: '#999',
  };

  return (
    <div style={containerStyle}>
      {error && <div style={errorStyle}>{error}</div>}

      <div style={profileHeaderStyle}>
        {user?.image ? (
          <img src={user.image} alt={user?.username} style={profileImageStyle} />
        ) : (
          <div style={profileImageStyle}>{user?.username?.[0]?.toUpperCase()}</div>
        )}

        <h1 style={usernameStyle}>{user?.username || 'User'}</h1>
        <p style={emailStyle}>{user?.email}</p>

        <div style={statsStyle}>
          <div style={statItemStyle}>
            <p style={statNumberStyle}>{userPosts.length}</p>
            <p style={statLabelStyle}>Posts</p>
          </div>
          <div style={statItemStyle}>
            <p style={statNumberStyle}>
              {userPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0)}
            </p>
            <p style={statLabelStyle}>Likes</p>
          </div>
        </div>

        <button
          style={logoutButtonStyle}
          onClick={handleLogout}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#ff3b76';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#FF4D8D';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <div style={loadingContainerStyle}>
          <Loading />
        </div>
      ) : userPosts.length === 0 ? (
        <div style={emptyStyle}>
          <p>No posts yet. Create your first post!</p>
        </div>
      ) : (
        <>
          <h2 style={sectionTitleStyle}>Your Posts</h2>
          <div style={postsGridContainerStyle}>
            <div style={gridStyle} ref={postsGridRef}>
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="profile-post-item"
                  style={postItemStyle}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {post.image && <img src={post.image} alt="Post" style={postImageStyle} />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <NavBar />
    </div>
  );
};

export default Profile;
