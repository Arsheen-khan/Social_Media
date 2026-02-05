import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { postsAPI } from '../api/api';
import NavBar from '../components/NavBar';
import Loading from '../components/Loading';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState({});
  const postsContainerRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts();
      const postsData = response.data.posts || [];
      setPosts(postsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postsContainerRef.current && posts.length > 0) {
      const postCards = postsContainerRef.current.querySelectorAll('.post-card');
      gsap.fromTo(
        postCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [posts]);

  const handleLike = async (postId) => {
    if (liking[postId]) return;

    try {
      setLiking((prev) => ({ ...prev, [postId]: true }));
      await postsAPI.likePost(postId);
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, likeCount: (post.likeCount || 0) + 1 } : post
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setLiking((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F7F8FC',
    paddingBottom: '100px',
    paddingTop: '20px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    paddingTop: '20px',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6C63FF 0%, #00C9FF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0 0 5px 0',
  };

  const feedContainerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '0 15px',
  };

  const postCardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '22px',
    marginBottom: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  const postHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #f0f0f0',
  };

  const avatarStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#6C63FF',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    overflow: 'hidden',
    objectFit: 'cover',
  };

  const userInfoStyle = {
    flex: 1,
  };

  const usernameStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0',
  };

  const postImageStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: '500px',
    objectFit: 'cover',
    display: 'block',
  };

  const postContentStyle = {
    padding: '15px',
  };

  const captionStyle = {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.5',
    marginBottom: '12px',
    wordBreak: 'break-word',
  };

  const mentionsStyle = {
    fontSize: '12px',
    color: '#6C63FF',
    marginBottom: '12px',
    fontWeight: '600',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '20px',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '12px',
    marginTop: '12px',
  };

  const actionButtonStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#f5f5f5',
    border: 'none',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    transition: 'all 0.2s ease',
  };

  const likeButtonStyle = {
    ...actionButtonStyle,
    background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(255, 77, 141, 0.1))',
    color: '#FF4D8D',
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
      <div style={headerStyle}>
        <h1 style={titleStyle}>Feed</h1>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      {loading ? (
        <div style={loadingContainerStyle}>
          <Loading />
        </div>
      ) : posts.length === 0 ? (
        <div style={emptyStyle}>
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div style={feedContainerStyle} ref={postsContainerRef}>
          {posts.map((post) => (
            <div key={post._id} className="post-card" style={postCardStyle}>
              <div style={postHeaderStyle}>
                {post.user?.image ? (
                  <img src={post.user.image} alt={post.user?.username} style={avatarStyle} />
                ) : (
                  <div style={avatarStyle}>{post.user?.username?.[0]?.toUpperCase()}</div>
                )}
                <div style={userInfoStyle}>
                  <p style={usernameStyle}>{post.user?.username || 'Anonymous'}</p>
                </div>
              </div>

              {post.image && <img src={post.image} alt="Post" style={postImageStyle} />}

              <div style={postContentStyle}>
                {post.caption && <p style={captionStyle}>{post.caption}</p>}
                {post.mentions && post.mentions.length > 0 && (
                  <div style={mentionsStyle}>Mentioned: {post.mentions.join(', ')}</div>
                )}

                <div style={actionsStyle}>
                  <button
                    style={likeButtonStyle}
                    onClick={() => handleLike(post._id)}
                    disabled={liking[post._id]}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ❤️ {post.likeCount || 0}
                  </button>
                  <button
                    style={actionButtonStyle}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#e8e8e8';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    💬 Comment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Home;
