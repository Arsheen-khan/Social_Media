import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../api/api';
import Loading from '../components/Loading';
import NavBar from '../components/NavBar';

const CreatePost = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mentions, setMentions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageSelect(files[0]);
    }
  };

  const handleImageSelect = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setImage(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);

      if (previewRef.current) {
        gsap.fromTo(
          previewRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' }
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', image);

      if (mentions.trim()) {
        const mentionsList = mentions
          .split(',')
          .map((m) => m.trim())
          .filter((m) => m);
        if (mentionsList.length > 0) {
          formData.append('mentions', JSON.stringify(mentionsList));
        }
      }

      await postsAPI.createPost(formData);

      setSuccess(true);
      setImage(null);
      setImagePreview(null);
      setMentions('');

      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          setTimeout(() => {
            navigate('/home');
          }, 300);
        },
      });
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#F7F8FC',
    paddingBottom: '100px',
    paddingTop: '20px',
  };

  const contentStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '20px 15px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6C63FF 0%, #00C9FF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '0',
  };

  const formStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '22px',
    padding: '25px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  };

  const uploadAreaStyle = {
    border: dragActive ? '3px dashed #6C63FF' : '2px dashed #ddd',
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: dragActive ? 'rgba(108, 99, 255, 0.05)' : '#f9f9f9',
    marginBottom: '20px',
  };

  const uploadIconStyle = {
    fontSize: '48px',
    marginBottom: '10px',
  };

  const uploadTextStyle = {
    color: '#666',
    fontSize: '14px',
    margin: '5px 0',
  };

  const previewContainerStyle = {
    marginBottom: '20px',
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    display: imagePreview ? 'block' : 'none',
  };

  const previewImageStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover',
    display: 'block',
  };

  const inputGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
  };

  const submitButtonStyle = {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#6C63FF',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: loading ? 0.7 : 1,
  };

  const cancelButtonStyle = {
    flex: 1,
    padding: '12px 20px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const errorStyle = {
    backgroundColor: '#ffe0e0',
    color: '#c41e3a',
    padding: '12px 15px',
    borderRadius: '12px',
    fontSize: '13px',
    marginBottom: '15px',
    textAlign: 'center',
  };

  const successStyle = {
    backgroundColor: '#e0ffe0',
    color: '#2d7a2d',
    padding: '12px 15px',
    borderRadius: '12px',
    fontSize: '13px',
    marginBottom: '15px',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle} ref={containerRef}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Create Post</h1>
        </div>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>Post created successfully! Redirecting...</div>}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 20px' }}>
            <Loading />
          </div>
        ) : (
          <form style={formStyle} onSubmit={handleSubmit}>
            <div
              style={uploadAreaStyle}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div style={uploadIconStyle}>📸</div>
              <p style={uploadTextStyle}>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p style={{ ...uploadTextStyle, fontSize: '12px', color: '#999' }}>
                PNG, JPG, GIF up to 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>

            {imagePreview && (
              <div style={previewContainerStyle} ref={previewRef}>
                <img src={imagePreview} alt="Preview" style={previewImageStyle} />
              </div>
            )}

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Mentions (optional)</label>
              <input
                type="text"
                value={mentions}
                onChange={(e) => setMentions(e.target.value)}
                placeholder="Separate with commas (e.g., @user1, @user2)"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6C63FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108, 99, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ddd';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={buttonContainerStyle}>
              <button
                type="button"
                style={cancelButtonStyle}
                onClick={() => navigate('/home')}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e0e0e0';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#f0f0f0';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={submitButtonStyle}
                disabled={loading}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#5a52d5';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#6C63FF';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {loading ? 'Creating...' : 'Post'}
              </button>
            </div>
          </form>
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default CreatePost;
