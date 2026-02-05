import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const PostCard = ({ post, onLike, onComment }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const cardRef = useRef(null);
  const heartRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

    if (heartRef.current) {
      gsap.fromTo(heartRef.current,
        { scale: 1 },
        { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }

    if (onLike) {
      try {
        await onLike(post._id || post.id);
      } catch (error) {
        // Revert on error
        setLiked(!newLiked);
        setLikesCount(prev => newLiked ? prev - 1 : prev + 1);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (onComment) {
      try {
        await onComment(post._id || post.id, commentText);
        setComments([...comments, { text: commentText, user: { email: 'You' } }]);
        setCommentText('');
      } catch (error) {
        console.error('Failed to post comment:', error);
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <article ref={cardRef} className="post-card mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.user?.avatar || `https://ui-avatars.com/api/?name=${post.user?.email || 'User'}&background=random`}
          alt={post.user?.email || 'User'}
          className="avatar"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm">
            {post.user?.email?.split('@')[0] || 'Anonymous'}
          </h3>
          <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-muted">
        <img
          src={post.image || post.imageUrl}
          alt="Post"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={handleLike}
            className="like-btn p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          >
            <svg
              ref={heartRef}
              className={`w-7 h-7 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-foreground'}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <svg className="w-7 h-7 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* Likes count */}
        <p className="font-semibold text-sm text-foreground mb-2">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-foreground mb-2">
            <span className="font-semibold">{post.user?.email?.split('@')[0] || 'Anonymous'}</span>{' '}
            {post.caption}
          </p>
        )}

        {/* Mentions */}
        {post.mentions && post.mentions.length > 0 && (
          <p className="text-sm text-primary mb-2">
            {post.mentions.map((m, i) => (
              <span key={i}>@{m} </span>
            ))}
          </p>
        )}

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border">
            {comments.length > 0 && (
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {comments.map((comment, index) => (
                  <p key={index} className="text-sm">
                    <span className="font-semibold">{comment.user?.email?.split('@')[0] || 'User'}</span>{' '}
                    {comment.text}
                  </p>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="text-sm font-semibold text-primary disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
