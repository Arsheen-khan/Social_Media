import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/api';
import NavBar from '../components/NavBar';
import '../styles/upload.css';

function Upload({ user }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [mentions, setMentions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);
      if (mentions) {
        formData.append('mentions', mentions);
      }

      await postsAPI.createPost(formData);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload post');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-page">
      <NavBar user={user} currentPage="create" />

      <div className="upload-container">
        <div className="upload-card">
          <h1>Create Post</h1>

          <form onSubmit={handleSubmit} className="upload-form">
            {error && <div className="error-message">{error}</div>}

            <div
              className={`image-upload-area ${preview ? 'hidden' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📸</div>
              <div className="upload-text">
                <strong>Click to select image</strong>
                <p>or drag and drop</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </div>

            {preview && (
              <div className="image-preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-btn"
                >
                  ✕ Remove
                </button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="caption">Caption</label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                maxLength={2200}
                rows={4}
                className="caption-input"
              />
              <div className="char-count">
                {caption.length}/2200
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mentions">Mentions (optional)</label>
              <input
                id="mentions"
                type="text"
                value={mentions}
                onChange={(e) => setMentions(e.target.value)}
                placeholder="@user1, @user2"
                className="mentions-input"
              />
              <p className="help-text">Separate multiple mentions with commas</p>
            </div>

            <div className="upload-actions">
              <button
                type="submit"
                disabled={loading || !image}
                className="btn-primary"
              >
                {loading ? 'Uploading...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
