import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { postsAPI } from '../api/api';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  
  const headerRef = useRef(null);
  const feedRef = useRef(null);
  const LIMIT = 20;

  const fetchPosts = useCallback(async (skipCount = 0, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await postsAPI.getPosts(skipCount, LIMIT);
      const newPosts = response.data.posts || response.data || [];

      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      setHasMore(newPosts.length === LIMIT);
      setError('');
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(0, false);
  }, [fetchPosts]);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loadingMore) {
      const newSkip = skip + LIMIT;
      setSkip(newSkip);
      fetchPosts(newSkip, true);
    }
  }, [hasMore, loadingMore, skip, fetchPosts]);

  const handleLike = async (postId) => {
    await postsAPI.likePost(postId);
  };

  const handleComment = async (postId, text) => {
    await postsAPI.commentOnPost(postId, text);
  };

  const handleRefresh = () => {
    setSkip(0);
    fetchPosts(0, false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header ref={headerRef} className="sticky top-0 z-40 glass px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold gradient-text">
            InstaVibe
          </h1>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Feed */}
      <main
        ref={feedRef}
        className="page-container pt-4 max-w-lg mx-auto overflow-y-auto"
        onScroll={handleScroll}
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your feed...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <button onClick={handleRefresh} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold mb-2">No posts yet</h2>
            <p className="text-muted-foreground">Be the first to share something!</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
            
            {loadingMore && (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
            
            {!hasMore && posts.length > 0 && (
              <p className="text-center text-muted-foreground py-6 text-sm">
                You've reached the end ✨
              </p>
            )}
          </>
        )}
      </main>

      <Navbar />
    </div>
  );
};

export default Home;
