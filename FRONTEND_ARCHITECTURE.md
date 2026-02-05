# Frontend Visual Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    (React + Vite)                               │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Routes                                    │    │
│  │  /create     → CreatePost.jsx                         │    │
│  │  /home       → Home.jsx                               │    │
│  │  /login      → Login.jsx (existing)                   │    │
│  │  /profile    → Profile.jsx (existing)                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              API Layer (api.js)                        │    │
│  │                                                        │    │
│  │  • axios instance with withCredentials: true          │    │
│  │  • Base URL: http://localhost:3000                    │    │
│  │  • 401 interceptor → redirect to /login               │    │
│  │                                                        │    │
│  │  postsAPI:                                             │    │
│  │    • getPosts(skip, limit)                            │    │
│  │    • createPost(formData)                             │    │
│  │    • likePost(post)                                   │    │
│  │    • commentPost(post, text)                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                  │
│                (Node.js/Express)                                │
│                http://localhost:3000                            │
│                                                                 │
│  POST /posts                                                   │
│    ← image, mentions                                           │
│    → post { id, image, caption* (*AI), mentions, ... }        │
│                                                                 │
│  GET /posts?skip=0&limit=20                                   │
│    → { posts: [...] }                                          │
│                                                                 │
│  POST /posts/like                                              │
│    ← { post: postId }                                          │
│    → success                                                   │
│                                                                 │
│  POST /posts/comment                                           │
│    ← { post: postId, text: "..." }                            │
│    → comment object                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Flow

### CreatePost Page Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   CreatePost.jsx                            │
│                                                             │
│  State:                                                     │
│    [image]      ← File object                              │
│    [preview]    ← Base64 string for preview               │
│    [mentions]   ← String input                            │
│    [loading]    ← Boolean (uploading)                     │
│    [error]      ← Error message or ""                     │
│    [success]    ← Boolean (created)                       │
│                                                             │
│  Refs:                                                      │
│    previewRef   ← For GSAP animation                      │
│    formRef      ← For success animation                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
          User selects image file
                     ↓
        ┌───────────────────────────┐
        │  handleImageChange()      │
        │ • Read file               │
        │ • Validate type & size    │
        │ • Create preview (Base64) │
        │ • GSAP animate preview    │
        └─────────────┬─────────────┘
                     ↓
            User enters mentions
            (optional)
                     ↓
        ┌───────────────────────────┐
        │  Click "Post" Button      │
        └─────────────┬─────────────┘
                     ↓
        ┌───────────────────────────┐
        │  handleSubmit()           │
        │ • Create FormData         │
        │ • Append image + mentions │
        │ • Call postsAPI.createPost│
        │ • Show success alert      │
        │ • GSAP fade animation     │
        │ • setTimeout → navigate   │
        └─────────────┬─────────────┘
                     ↓
        ┌───────────────────────────┐
        │ navigate('/home',         │
        │    { replace: true })     │
        └─────────────┬─────────────┘
                     ↓
            ✅ Redirect to /home
```

### Home Page Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Home.jsx                                  │
│                                                              │
│  State:                                                      │
│    [posts]      ← Array of post objects                    │
│    [loading]    ← Boolean (fetching)                       │
│    [error]      ← Error message or ""                      │
│    [page]       ← Current pagination page                  │
│    [hasMore]    ← Boolean (more posts available)           │
│                                                              │
│  Refs:                                                       │
│    feedRef      ← For GSAP animation                       │
│                                                              │
│  Hooks:                                                      │
│    useLocation  ← Detect when Home is loaded               │
└──────────────────────┬───────────────────────────────────────┘
                      │
                      ↓
        ┌───────────────────────────────┐
        │  useEffect(() => {            │
        │    fetchPosts(0)              │
        │  }, [location.pathname])      │
        │                               │
        │  • Triggered on mount         │
        │  • Triggered on /home return  │
        │  • Reset page to 0            │
        │  • Clear error state          │
        │  • Show loading spinner       │
        └──────────────┬────────────────┘
                      │
                      ↓
        ┌───────────────────────────────┐
        │  fetchPosts(pageNum)          │
        │ • Calculate skip = page * 20  │
        │ • GET /posts?skip=X&limit=20 │
        │ • Parse response.data         │
        │ • First page: replace posts   │
        │ • Other pages: append posts   │
        │ • GSAP fade-in animation     │
        │ • Set hasMore flag            │
        └──────────────┬────────────────┘
                      │
                      ↓
        ┌───────────────────────────────┐
        │  Render Posts                 │
        │ • Show loading spinner if no  │
        │   posts yet                   │
        │ • Show empty state if no      │
        │   posts and not loading       │
        │ • Map posts → PostCard        │
        │ • Show "Load More" if hasMore │
        └──────────────┬────────────────┘
                      │
                      ↓
        ┌───────────────────────────────┐
        │  User Interactions            │
        │                               │
        │  1. Click Refresh Button (↻)  │
        │     → handleRefresh()          │
        │     → Reset posts             │
        │     → fetchPosts(0)            │
        │                               │
        │  2. Click "Load More Posts"   │
        │     → handleLoadMore()         │
        │     → fetchPosts(page + 1)    │
        │                               │
        │  3. Like/Comment Post         │
        │     → onPostUpdate callback   │
        │     → handleRefresh()         │
        └──────────────┬────────────────┘
```

---

## API Call Sequence

### Creating a Post - Complete Sequence

```
FRONTEND                           BACKEND
    │                                │
    ├─ User selects image           │
    ├─ User enters mentions         │
    │                                │
    ├─ handleSubmit()               │
    │  ├─ Create FormData           │
    │  ├─ formData.append('image')  │
    │  └─ formData.append('mentions')
    │                                │
    ├─ POST /posts ────────────────→ │
    │                                ├─ Validate image
    │                                ├─ Store image
    │                                ├─ Generate AI caption ⭐
    │                                ├─ Save post to DB
    │                                │
    │  ← { post: { id, image,       │
    │             caption (AI),      │
    │             mentions, ... } }  │
    │                                │
    ├─ Show success alert           │
    ├─ GSAP fade-out                │
    ├─ navigate('/home')            │
    │                                │
    ├─ useEffect sees location      │
    │  change                        │
    │                                │
    ├─ GET /posts?skip=0&limit=20 ─→ │
    │                                ├─ Query DB
    │  ← { posts: [NEW POST,         │
    │            older posts...] }   │
    │                                │
    ├─ Render feed with new post    │
    ├─ GSAP fade-in                 │
    │                                │
    └─ ✅ Complete                   │

⭐ KEY: Backend generates caption - Frontend never sends it!
```

---

## FormData Structure

### What Frontend Sends

```javascript
const formData = new FormData()

// Required
formData.append('image', imageFile)

// Optional (can be empty)
formData.append('mentions', '@user1 @user2' || '')

// ❌ NEVER send these:
// formData.append('caption', '...')     ← Backend generates!
// formData.append('description', '...')
// formData.append('title', '...')
```

### Axios Sends As

```
POST /posts HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...

------WebKitFormBoundary...
Content-Disposition: form-data; name="image"; filename="photo.jpg"
Content-Type: image/jpeg

[binary image data here]
------WebKitFormBoundary...
Content-Disposition: form-data; name="mentions"

@user1 @user2
------WebKitFormBoundary...--
```

### Backend Receives & Returns

```javascript
// Backend receives
{
  image: <File Buffer>,
  mentions: '@user1 @user2'
}

// Backend processes
{
  save image to storage
  generate AI caption
  extract mentions
  create post object
}

// Backend returns
{
  _id: "507f1f77bcf86cd799439011",
  image: "https://...",
  caption: "🎨 Beautiful sunset captured...",  // ← AI Generated
  mentions: "@user1 @user2",
  user: {...},
  likes: 0,
  comments: [],
  createdAt: "2024-02-01T10:30:00Z"
}
```

---

## State Management Pattern

### CreatePost State Machine

```
┌─────────────────────────────────────────────┐
│ IDLE (initial state)                        │
│ • No image selected                         │
│ • No error                                  │
│ • Submit button disabled                    │
└────────────────┬────────────────────────────┘
                 │ User selects image
                 ↓
┌─────────────────────────────────────────────┐
│ READY (image selected)                      │
│ • Image file stored                         │
│ • Preview displayed                         │
│ • Submit button enabled                     │
└────────────────┬────────────────────────────┘
                 │ User clicks "Post"
                 ↓
┌─────────────────────────────────────────────┐
│ LOADING (uploading)                         │
│ • loading = true                            │
│ • Submit button disabled                    │
│ • Show "Posting..." text                    │
└────────────────┬────────────────────────────┘
                 │ API response
                 ├─ Success ────────┐
                 │                  ↓
                 │          ┌─────────────────────────────────────────────┐
                 │          │ SUCCESS (post created)                      │
                 │          │ • success = true                            │
                 │          │ • Show success alert                        │
                 │          │ • GSAP animation                           │
                 │          │ • setTimeout → navigate                    │
                 │          └─────────────────────────────────────────────┘
                 │                  │
                 │                  ↓
                 │          ✅ Redirect to /home
                 │
                 └─ Error ──────────┐
                                    ↓
                          ┌─────────────────────────────────────────────┐
                          │ ERROR (upload failed)                       │
                          │ • loading = false                           │
                          │ • error = error message                     │
                          │ • Show error alert                          │
                          │ • Submit button re-enabled                  │
                          └──────────────────┬──────────────────────────┘
                                             │
                                             ↓
                                    ⚠️ User can retry
```

### Home Pagination Pattern

```
Page 0 (Initial)
├─ Fetch: GET /posts?skip=0&limit=20
├─ Response: [post1, post2, ..., post20]
├─ setState: posts = [post1..post20]
├─ hasMore = true (got 20, more available)
└─ Display: 20 posts

Page 0 + Load More
├─ Click "Load More Posts"
├─ Fetch: GET /posts?skip=20&limit=20
├─ Response: [post21, post22, ..., post40]
├─ setState: posts = [...prev 20, post21..post40]
├─ hasMore = true (got 20, more available)
└─ Display: 40 posts

Page 1 + Load More
├─ Click "Load More Posts"
├─ Fetch: GET /posts?skip=40&limit=20
├─ Response: [post41, post42, ..., post45]  ← Only 5 posts
├─ setState: posts = [...prev 40, post41..post45]
├─ hasMore = false (got < 20, no more)
└─ Display: 45 posts, no more "Load More"
```

---

## Animation Timeline

### CreatePost Upload Success

```
t=0ms     ┌─ Form visible
          │

t=0ms     ├─ Submit clicked
          │ ├─ loading = true
          │ ├─ API call starts
          │

t=500ms   ├─ API response received
          │ ├─ success = true
          │ ├─ success alert appears (slideDown animation)
          │

t=700ms   ├─ GSAP fade-out (formRef)
          │ ├─ opacity: 1 → 0.5
          │ ├─ duration: 300ms
          │

t=800ms   ├─ navigate('/home', { replace: true })
          │ ├─ Redirect happens
          │

t=800ms   └─ Home page loads
            ├─ useEffect triggers
            ├─ GET /posts call made
            │

t=1000ms  ├─ Posts fetched
          │ ├─ feedRef found
          │ ├─ GSAP fade-in starts
          │

t=1500ms  └─ Feed fully visible (0.5s animation)
            ├─ New post at top
            ├─ Ready for user interaction
```

### Home Feed Refresh

```
t=0ms     ┌─ User clicks refresh button (↻)
          │ ├─ handleRefresh() called
          │ ├─ posts = []
          │ ├─ page = 0
          │

t=0ms     ├─ fetchPosts(0) called
          │ ├─ loading = true
          │ ├─ error = ''
          │

t=0ms     └─ GET /posts?skip=0&limit=20 sent
            │

t=200-400ms ├─ API response received
            │ ├─ loading = false
            │ ├─ posts = [array of posts]
            │

t=200ms   ├─ GSAP animation starts
          │ ├─ opacity: 0 → 1
          │ ├─ duration: 500ms
          │ ├─ ease: power2.out
          │

t=700ms   └─ Animation complete
            ├─ Feed fully visible
            ├─ New posts displayed
```

---

## Error Handling Flow

### API Error Scenarios

```
Error: Network Timeout
├─ catch(err)
├─ err.response?.status = undefined
├─ setError('Failed to load posts. Please try again.')
└─ Show retry option

Error: 400 - Validation Error
├─ Backend: { message: 'Image is required' }
├─ catch(err)
├─ err.response?.data?.message = 'Image is required'
├─ setError('Image is required')
└─ Show error alert

Error: 401 - Unauthorized
├─ catch(err)
├─ error.response?.status === 401
├─ localStorage.removeItem('user')
├─ window.location.href = '/login'
└─ Redirect to login

Error: 500 - Server Error
├─ Backend: { message: 'Internal server error' }
├─ catch(err)
├─ setError('Internal server error')
└─ Show error alert + retry option
```

---

## CSS Class Architecture

```
CreatePost.jsx
└─ .create-post-container (flex center wrapper)
   ├─ .create-post-card (white card with shadow)
   │  ├─ .create-post-title (h1)
   │  ├─ .alert.alert-error (error message)
   │  ├─ .alert.alert-success (success message)
   │  └─ .create-post-form (flex column)
   │     ├─ .form-group (image upload)
   │     │  ├─ .form-label
   │     │  └─ .image-upload-box (dashed border)
   │     │     ├─ .file-input (hidden)
   │     │     └─ .upload-hint
   │     ├─ .image-preview-container (with animation)
   │     │  └─ .image-preview (img)
   │     ├─ .form-group (mentions)
   │     │  ├─ .form-label
   │     │  ├─ .form-input
   │     │  └─ .form-hint
   │     └─ .btn-submit (blue button)
   └─ .caption-note (info message)

Home.jsx
└─ .home-page (flex column)
   ├─ NavBar
   └─ .feed-container (max-width 800px)
      ├─ .feed-header (flex between)
      │  ├─ h2 (title)
      │  └─ .refresh-btn (circular button)
      ├─ .alert.alert-error (error message)
      ├─ Loading component (spinner)
      ├─ .empty-state (no posts)
      │  ├─ h3
      │  ├─ p
      │  └─ .btn-primary
      ├─ .posts-grid (with GSAP animation)
      │  └─ PostCard (repeated)
      └─ .load-more-container
         └─ .load-more-btn
```

---

## Summary

This architecture ensures:

✅ Clean separation of concerns
✅ Proper error handling at each layer
✅ Smooth animations with GSAP
✅ Proper state management
✅ Correct FormData handling
✅ Auto-refresh on post creation
✅ Pagination support
✅ Authentication integration
✅ Backend contract compliance

