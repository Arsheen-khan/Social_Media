import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { postsAPI } from '../api/api';
import Navbar from '../components/Navbar';

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [mentions, setMentions] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const uploadRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        
        // Animate preview appearance
        gsap.fromTo(uploadRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );

        // Auto-generate caption placeholder
        setGeneratingCaption(true);
        setTimeout(() => {
          // Simulating AI caption generation - in production this would call an AI API
          const captions = [
            "Living my best life ✨",
            "Vibes on point 🔥",
            "Moment captured 📸",
            "This hit different 💫",
            "Main character energy 👑"
          ];
          setCaption(captions[Math.floor(Math.random() * captions.length)]);
          setGeneratingCaption(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const event = { target: { files: [file] } };
      handleImageChange(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
      formData.append('mentions', mentions);
      formData.append('caption', caption);

      await postsAPI.createPost(formData);
      
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => navigate('/')
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
      gsap.fromTo(containerRef.current,
        { x: -10 },
        { x: 10, duration: 0.1, repeat: 3, yoyo: true, ease: 'power2.inOut' }
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    gsap.to(uploadRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setImage(null);
        setImagePreview('');
        setCaption('');
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold gradient-text">
            New Post
          </h1>
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      <main ref={containerRef} className="page-container pt-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div
            ref={uploadRef}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative aspect-square rounded-3xl overflow-hidden border-2 border-dashed transition-all duration-300 ${
              imagePreview 
                ? 'border-transparent' 
                : 'border-border hover:border-primary cursor-pointer bg-secondary/50'
            }`}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-destructive/80 transition-colors"
                >
                  <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4 glow-primary">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-foreground font-medium mb-1">Add Photo</p>
                <p className="text-muted-foreground text-sm">Tap or drag & drop</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Caption */}
          {imagePreview && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Caption
                  {generatingCaption && (
                    <span className="ml-2 text-primary text-xs animate-pulse">
                      ✨ AI generating...
                    </span>
                  )}
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  rows={3}
                  className="input-genz resize-none"
                  disabled={generatingCaption}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mentions
                </label>
                <input
                  type="text"
                  value={mentions}
                  onChange={(e) => setMentions(e.target.value)}
                  placeholder="@friend1, @friend2"
                  className="input-genz"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate with commas
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 rounded-xl p-3">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !image}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Posting...
              </span>
            ) : (
              'Share Post ✨'
            )}
          </button>
        </form>
      </main>

      <Navbar />
    </div>
  );
};

export default CreatePost;
