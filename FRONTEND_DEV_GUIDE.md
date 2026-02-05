# Frontend Implementation - Developer Quick Reference

## Files Modified/Created

### 1. **src/api/api.js** ✅
Base axios instance with credentials and interceptors.

**Usage:**
```javascript
import { postsAPI } from '../api/api'

// Get posts
const response = await postsAPI.getPosts(0, 20)

// Create post
const formData = new FormData()
formData.append('image', file)
formData.append('mentions', '@user1 @user2')
await postsAPI.createPost(formData)

// Like post
await postsAPI.likePost(postId)

// Comment on post
await postsAPI.commentPost(postId, 'comment text')
```

---

### 2. **src/pages/CreatePost.jsx** ✅
Image upload + post creation page.

**State:**
```javascript
const [image, setImage] = useState(null)          // File object
const [preview, setPreview] = useState(null)      // Base64 preview
const [mentions, setMentions] = useState('')      // String: "@user1 @user2"
const [loading, setLoading] = useState(false)     // Upload in progress
const [error, setError] = useState('')            // Error message
const [success, setSuccess] = useState(false)     // Success confirmation
```

**Key Flow:**
1. User selects image → preview displayed
2. Optional mentions input
3. Submit → FormData created
4. API call → Success → Redirect to /home
5. Home auto-refetches posts

**FormData:**
```javascript
const formData = new FormData()
formData.append('image', image)          // Required
formData.append('mentions', mentions)    // Optional
const response = await postsAPI.createPost(formData)
```

---

### 3. **src/pages/Home.jsx** ✅
Feed display with auto-refresh.

**State:**
```javascript
const [posts, setPosts] = useState([])          // All posts
const [loading, setLoading] = useState(true)    // Fetch in progress
const [page, setPage] = useState(0)             // Current page
const [hasMore, setHasMore] = useState(true)    // More posts available
```

**Key Flow:**
1. Mount → Fetch posts (skip=0, limit=20)
2. User returns from /create → Auto-refetch
3. Render posts with PostCard component
4. Show "Load More" if hasMore=true
5. Refresh button re-fetches from page 0

**Auto-Refresh Trigger:**
```javascript
useEffect(() => {
  fetchPosts(0)
}, [location.pathname])  // Refetch when returning to /home
```

---

### 4. **src/styles/upload.css** ✅
Instagram-like upload page styling.

**Key Classes:**
```css
.create-post-container      /* Main wrapper, centered */
.create-post-card           /* White card with shadow */
.image-upload-box           /* Dashed border upload area */
.image-preview-container    /* Preview image holder */
.form-input                 /* Input fields */
.btn-submit                 /* Blue submit button */
.alert-error / -success     /* Alert messages */
```

---

### 5. **src/styles/feed.css** ✅
Instagram-like feed page styling.

**Key Updates:**
```css
.empty-state                /* No posts message */
.posts-grid                 /* Feed layout */
.load-more-container        /* Pagination button */
.alert                      /* Error messages */
.refresh-btn                /* Refresh button */
```

---

## API Endpoints Used

| Method | Endpoint | Params | Body |
|--------|----------|--------|------|
| GET | `/posts` | skip, limit | - |
| POST | `/posts` | - | FormData: image, mentions |
| POST | `/posts/like` | - | { post: postId } |
| POST | `/posts/comment` | - | { post: postId, text: string } |

---

## Common Issues & Solutions

### Issue: Posts don't show after creating
**Solution:** Home page now auto-refetches when user navigates back
```javascript
// Automatic trigger on location change
useEffect(() => {
  fetchPosts(0)
}, [location.pathname])
```

### Issue: Image upload fails
**Solution:** FormData is properly configured
```javascript
const formData = new FormData()
formData.append('image', file)  // Must be File object
formData.append('mentions', '')
// Let axios set Content-Type header automatically
```

### Issue: Redirect not working
**Solution:** Use `navigate` with replace flag
```javascript
navigate('/home', { replace: true })
```

---

## GSAP Animations Used

### 1. CreatePost - Image Preview
```javascript
gsap.from(previewRef.current, {
  opacity: 0,
  y: 20,
  duration: 0.6,
  ease: 'power2.out'
})
```

### 2. Home - Feed Load
```javascript
gsap.from(feedRef.current, {
  opacity: 0,
  duration: 0.5,
  ease: 'power2.out'
})
```

### 3. Alert Messages
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Component Props

### PostCard
```javascript
<PostCard
  post={post}              // Post object from API
  user={user}              // Current user object
  index={index}            // Array index for key
  onPostUpdate={() => handleRefresh()}  // Callback on like/comment
/>
```

### NavBar
```javascript
<NavBar
  user={user}              // Current user object
  currentPage="home"       // Active page: home, profile, chat, etc
/>
```

### Loading
```javascript
<Loading />  // Simple spinner component
```

---

## Response Handling

### GET /posts Success
```javascript
{
  data: {
    posts: [
      {
        _id: "...",
        image: "...",
        caption: "AI-generated",
        mentions: "...",
        user: {...},
        likes: 5,
        comments: [],
        createdAt: "..."
      }
    ]
  }
}
```

### POST /posts Success
```javascript
{
  data: {
    post: {
      _id: "...",
      image: "...",
      caption: "AI-generated caption",  // ← Generated by backend
      mentions: "...",
      user: {...},
      likes: 0,
      comments: [],
      createdAt: "..."
    },
    message: "Post created successfully"
  }
}
```

### Error Response
```javascript
{
  response: {
    status: 400,
    data: {
      message: "Image is required",
      error: "Validation failed"
    }
  }
}
```

---

## Environment Setup

**Required:**
- Node.js 16+
- React 18.2+
- Vite dev server
- Backend running on `http://localhost:3000`

**Installation:**
```bash
cd Frontend
npm install
npm run dev
```

**API URL:** http://localhost:3000 (configured in api.js)

---

## Testing a Post Creation

1. Navigate to http://localhost:5173/create
2. Select an image
3. Enter mentions (optional): @user1 @user2
4. Click "Post"
5. Should see success message
6. Redirect to /home
7. New post should appear at top of feed

---

## FormData Requirements

**Critical:** Do NOT send caption

```javascript
// ✅ CORRECT
const formData = new FormData()
formData.append('image', imageFile)
formData.append('mentions', '@user1')

// ❌ WRONG - Don't send caption
// formData.append('caption', 'My caption')  // Backend generates this!
```

---

## Authorization

All requests include `withCredentials: true` to send authentication cookies.

```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'  // Redirect on auth failure
    }
    return Promise.reject(error)
  }
)
```

---

## Success Indicators

✅ New posts show in feed after creation
✅ Mentions optional but accepted
✅ AI caption visible in PostCard
✅ Refresh button works
✅ Load more pagination works
✅ Error messages display
✅ Loading spinner shows during upload
✅ Animations play smoothly
✅ Mobile responsive
✅ No console errors

