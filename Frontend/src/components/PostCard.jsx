import React, { useState, useEffect, useRef } from "react";
import { postsAPI } from "../api/api";
import "../styles/post-card.css";
import { gsap } from "gsap";

function PostCard({ post, user, index }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loadingLike, setLoadingLike] = useState(false);

  const cardRef = useRef(null);

  /* ---------------------------
     CHECK LIKE STATUS
  --------------------------- */
  useEffect(() => {
    if (user && post.likes) {
      setLiked(post.likes.includes(user._id));
    }
  }, [post, user]);

  /* ---------------------------
     GSAP SAFE ANIMATION
     (NO WARNINGS EVER)
  --------------------------- */
  useEffect(() => {
    if (!cardRef.current) return;

    const el = cardRef.current;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.08,
          ease: "power2.out",
        }
      );
    }, el);

    return () => ctx.revert();
  }, [index]);

  /* ---------------------------
     LIKE HANDLER
  --------------------------- */
  const handleLike = async () => {
    setLoadingLike(true);

    try {
      await postsAPI.likePost(post._id);

      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLike(false);
    }
  };

  /* ---------------------------
     COMMENT HANDLER
  --------------------------- */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await postsAPI.commentPost(post._id, commentText);

      setComments((prev) => [
        ...prev,
        {
          _id: Date.now(),
          text: commentText,
          author: user,
        },
      ]);

      setCommentText("");
      setShowCommentInput(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* ---------------------------
     UI
  --------------------------- */
  return (
    <article ref={cardRef} className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <div className="user-info">
          <div className="avatar">
            {post.user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4 className="username">@{post.user?.username}</h4>
            <p className="timestamp">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* IMAGE */}
      <div className="post-image-container">
        {/* ⭐ VERY IMPORTANT: backend gives post.image */}
        <img src={post.image} alt="post" className="post-image" />
      </div>

      {/* BODY */}
      <div className="post-body">
        {/* ACTIONS */}
        <div className="post-actions">
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className={liked ? "liked" : ""}
          >
            {liked ? "❤️" : "🤍"}
          </button>

          <button onClick={() => setShowCommentInput((p) => !p)}>💬</button>
        </div>

        {/* LIKES */}
        <p>
          <strong>{likeCount} likes</strong>
        </p>

        {/* CAPTION (FROM BACKEND AI) */}
        {post.caption && (
          <p>
            <strong>@{post.user?.username}</strong> {post.caption}
          </p>
        )}

        {/* COMMENTS */}
        {comments.map((c) => (
          <p key={c._id}>
            <strong>@{c.author?.username}</strong> {c.text}
          </p>
        ))}

        {/* COMMENT INPUT */}
        {showCommentInput && (
          <form onSubmit={handleCommentSubmit}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add comment..."
            />
          </form>
        )}
      </div>
    </article>
  );
}

export default PostCard;

