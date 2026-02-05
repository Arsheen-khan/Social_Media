import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/api';
import { disconnectSocket } from '../socket/socket';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ posts: 0, likes: 0 });

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.fromTo(headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(gridRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        // Fetch all posts and filter by user
        const response = await postsAPI.getPosts(0, 100);
        const allPosts = response.data.posts || response.data || [];
        
        // Filter posts by current user
        const userPosts = allPosts.filter(post => 
          post.user?.email === user?.email || 
          post.user?._id === user?._id ||
          post.userId === user?._id
        );
        
        setPosts(userPosts);
        
        // Calculate stats
        const totalLikes = userPosts.reduce((acc, post) => 
          acc + (post.likes?.length || post.likesCount || 0), 0
        );
        setStats({ posts: userPosts.length, likes: totalLikes });
      } catch (error) {
        console.error('Error fetching user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleLogout = () => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        disconnectSocket();
        logout();
        navigate('/login');
      }
    });
  };

  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const getUsername = (email) => {
    if (!email) return 'User';
    return email.split('@')[0];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold gradient-text">
            Profile
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-destructive font-medium hover:underline"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="page-container max-w-lg mx-auto">
        {/* Profile Header */}
        <div ref={headerRef} className="text-center py-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center text-white text-3xl font-bold glow-primary">
            {getInitials(user.email)}
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-1">
            {getUsername(user.email)}
          </h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{stats.posts}</p>
              <p className="text-muted-foreground text-sm">Posts</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-foreground">{stats.likes}</p>
              <p className="text-muted-foreground text-sm">Likes</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div ref={gridRef}>
          <h3 className="font-semibold text-foreground mb-4">Your Posts</h3>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 card-genz">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-muted-foreground mb-4">No posts yet</p>
              <button onClick={() => navigate('/create')} className="btn-primary">
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden">
              {posts.map((post, index) => (
                <div
                  key={post._id || post.id || index}
                  className="aspect-square relative group cursor-pointer overflow-hidden"
                >
                  <img
                    src={post.image || post.imageUrl}
                    alt="Post"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-4 text-white">
                      <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {post.likes?.length || post.likesCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Profile;
