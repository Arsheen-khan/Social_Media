# Frontend API Integration Reference

## Overview
The frontend uses Axios with `withCredentials: true` to send JWT cookies with every request. Socket.io also uses cookies for authentication.

## Axios Setup

### Location: `src/api/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // 🔑 CRITICAL: Sends cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// 401 Interceptor: redirects to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Socket.io Setup

### Location: `src/api/socket.js`

```javascript
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  withCredentials: true,  // 🔑 Sends cookies for JWT auth
  autoConnect: false,
});

export default socket;
```

## Authentication Context

### Location: `src/context/AuthContext.jsx`

Provides:
- `user`: Current user object
- `loading`: Auth state loading
- `login(email, password)`: Login method
- `register(email, password)`: Register method
- `logout()`: Logout method

Usage:
```javascript
const { user, login, logout } = useContext(AuthContext);
```

## API Endpoints Usage

### 1. Authentication

#### Register
```javascript
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const { register } = useContext(AuthContext);
await register('user@example.com', 'password123');
```

#### Login
```javascript
const { login } = useContext(AuthContext);
await login('user@example.com', 'password123');
```

### 2. Posts

#### Create Post (with image)
```javascript
const formData = new FormData();
formData.append('image', imageFile);
formData.append('caption', 'My awesome post!');
formData.append('mentions', '@alice,@bob');  // comma-separated

await api.post('/posts', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

#### Get Posts (Paginated)
```javascript
const response = await api.get('/posts', {
  params: {
    skip: 0,
    limit: 20,
  },
});

const posts = response.data.posts || response.data;
```

#### Like Post
```javascript
await api.post('/posts/like', {
  postId: post._id,
});
```

#### Comment on Post
```javascript
await api.post('/posts/comment', {
  postId: post._id,
  text: 'Great post!',
});
```

### 3. Chat

#### Get Chat History
```javascript
const response = await api.get(
  `/chat/chat-history/${currentUserId}/${otherUserId}`
);

const messages = response.data.messages || response.data;
```

#### Send Real-time Message (Socket.io)
```javascript
import socket from '../api/socket';

// Connect if not already connected
if (!socket.connected) {
  socket.connect();
}

// Send message
socket.emit('message', {
  receiver: recipientUserId,
  message: 'Hello!',
});

// Listen for incoming messages
socket.on('message', (data) => {
  console.log('Received:', data);
  // data contains: { sender, receiver, text, timestamp }
});
```

## Error Handling

### Automatic 401 Handling
```javascript
// Any 401 error automatically:
// 1. Clears localStorage
// 2. Redirects to /login
// No need to handle in components!
```

### Manual Error Handling
```javascript
try {
  const response = await api.post('/posts', data);
} catch (error) {
  if (error.response?.status === 401) {
    // Redirects automatically
  } else if (error.response?.status === 400) {
    console.error('Bad request:', error.response.data.message);
  } else {
    console.error('Error:', error.message);
  }
}
```

## Protected Routes

### Using ProtectedRoute Component
```javascript
import ProtectedRoute from '../components/ProtectedRoute';
import Home from '../pages/Home';

<Route
  path="/"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>
```

### Checking User in Components
```javascript
const { user } = useContext(AuthContext);

if (!user) {
  return <Navigate to="/login" />;
}
```

## Cookie-based Authentication Flow

```
1. User submits login form
   ↓
2. Backend validates credentials
   ↓
3. Backend creates JWT and sets in HTTP-only cookie
   ↓
4. Frontend receives response with cookie (automatically stored by browser)
   ↓
5. All subsequent Axios requests include withCredentials: true
   ↓
6. Browser automatically sends cookie with every request
   ↓
7. Backend validates JWT from cookie
   ↓
8. If expired or invalid → 401 response → frontend redirects to login
```

## Important Notes

### ✅ DO
- Always use `api` from `src/api/api.js` for HTTP requests
- Use `withCredentials: true` when making custom requests
- Let the 401 interceptor handle auth failures
- Use FormData for file uploads
- Keep messages comma-separated for mentions: `@user1,@user2`

### ❌ DON'T
- Use `fetch` without `withCredentials: 'include'`
- Manually set JWT token in headers (use cookies)
- Store sensitive data in localStorage (only user basics)
- Make API calls outside of components without error handling
- Forget to add `Content-Type: multipart/form-data` for file uploads

## Testing Locally

### Backend Running
```bash
cd Backend
npm start
# Should run on http://localhost:5000
```

### Frontend Running
```bash
cd Frontend
npm run dev
# Should run on http://localhost:5173
```

### Test Flow
1. Register new account
2. Login (verify cookie in DevTools → Application → Cookies)
3. Create post with image
4. Like/comment on posts
5. Open chat and send message
6. Verify real-time message appears

## DevTools Debugging

### Check Cookies
1. Open DevTools (F12)
2. Go to Application tab
3. Under Cookies, select http://localhost:5173
4. Look for `jwt` or authentication token
5. Verify it's being sent with API requests

### Monitor Network Requests
1. Open DevTools → Network tab
2. Make an API request
3. Look for Cookie header in request
4. Should show: `Cookie: <your_jwt_token>`

### Check Socket.io Connection
1. Open Console
2. Type: `socket.io` or check network for Socket.io connection
3. Look for WebSocket connection
4. Verify "handshake" and successful connection

## Environment Variables

### .env File
```
VITE_API_URL=http://localhost:5000
```

### Usage in Code
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

## Troubleshooting

### Issue: 401 on Protected Routes
**Solution**: 
- Check browser cookies exist
- Verify backend is setting cookies
- Check CORS is enabled on backend

### Issue: Images not uploading
**Solution**:
- Verify `Content-Type: multipart/form-data` header
- Check file size isn't exceeding backend limit
- Ensure FormData is used

### Issue: Chat messages not appearing
**Solution**:
- Check Socket.io is connected
- Verify receiver ID is correct
- Check browser console for Socket.io errors

### Issue: withCredentials not working
**Solution**:
- Verify backend has `credentials: 'include'` in CORS
- Check browser allows third-party cookies
- Ensure SSL/TLS if on HTTPS
