# Social Media Frontend - React + Vite

A fully functional React + Vite frontend for a social media application with real-time chat, post creation, and feed management.

## Features

✅ **Authentication**
- User registration and login with JWT cookies
- Protected routes with automatic redirects
- Session persistence

✅ **Posts**
- View feed with infinite scroll
- Create posts with image uploads
- Add captions and mentions
- Like/unlike posts
- Comment on posts
- Image preview before upload

✅ **Real-time Chat**
- Socket.io integration for instant messaging
- Chat history retrieval
- One-on-one conversations
- Message timestamps

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Real-time**: Socket.io Client
- **Styling**: CSS with CSS variables

## Project Structure

```
Frontend/
├── src/
│   ├── api/
│   │   ├── api.js           # Axios instance with withCredentials
│   │   └── socket.js        # Socket.io connection
│   ├── components/
│   │   ├── NavBar.jsx       # Navigation with logout
│   │   ├── PostCard.jsx     # Individual post display
│   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   ├── Loading.jsx      # Loading spinner
│   │   └── Layout.jsx       # Main layout wrapper
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context & provider
│   ├── pages/
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── Home.jsx         # Feed with posts
│   │   ├── CreatePost.jsx   # Post creation form
│   │   ├── Chat.jsx         # Chat users list
│   │   └── Conversation.jsx # Individual chat
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   ├── App.css              # Component styles
│   ├── styles.css           # Global styles
│   └── theme.css            # Theme variables
├── .env                     # Environment variables
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## Quick Start

### Prerequisites
- Node.js (v16+)
- Backend running on `http://localhost:5000`

### Installation & Run

```bash
# From repo root
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Configuration

### Environment Variables

Create `.env` file (defaults are provided):
```
VITE_API_URL=http://localhost:5000
```

Change the URL if your backend is running on a different port or host.

## Key Features & Implementation

### 🔐 Authentication

- JWT stored in HTTP-only cookies
- Every Axios request includes `withCredentials: true`
- Protected routes check authentication context
- 401 responses automatically redirect to login
- Session persisted in localStorage and React context

```javascript
// Login/Register via AuthContext
const { login, register } = useContext(AuthContext);
await login(email, password);
```

### 📝 Posts

- Create posts with image upload
- Automatically converted to FormData for multipart upload
- Image preview before submission
- Mentions sent as comma-separated string: `@alice,@bob`
- Like/unlike with real-time count updates
- Comments with author and timestamp

### 💬 Real-time Chat

- Socket.io with JWT authentication via cookies
- Automatic message listening
- Chat history loaded on conversation open
- Messages emit: `{ receiver: userId, message: text }`
- Receive messages with sender info

### 📡 API Requests

All requests use Axios with:
- Base URL: `http://localhost:5000`
- `withCredentials: true` (for cookies)
- Automatic error handling for 401 responses
- Proper Content-Type for file uploads

```javascript
import api from '../api/api';

// Automatic cookie inclusion
const posts = await api.get('/posts', { params: { skip: 0, limit: 20 } });

// File upload
const formData = new FormData();
formData.append('image', file);
await api.post('/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## Component Documentation

### `AuthContext`
Manages user authentication state and provides login/register/logout functions.

### `ProtectedRoute`
Wrapper component that redirects unauthenticated users to login.

### `PostCard`
Displays individual post with like button and comments.

### `NavBar`
Navigation with logout functionality, shows current user email.

### Pages
- **Login**: Email/password form with error handling
- **Register**: Registration with password confirmation
- **Home**: Feed with posts and infinite scroll
- **CreatePost**: Image upload form with preview
- **Chat**: List of conversations
- **Conversation**: Real-time chat interface

## Troubleshooting

### CORS/Cookie Issues
- Ensure backend has CORS enabled with credentials support
- Check that cookies are being sent in requests (DevTools → Network)
- Verify `withCredentials: true` in Axios config

### 401 Unauthorized
- Clear cookies and localStorage
- Check JWT expiration on backend
- Verify authentication middleware on backend

### Socket.io Not Connecting
- Check that backend Socket.io is running
- Verify Socket.io port matches backend
- Check browser console for connection errors

### Images Not Uploading
- Verify file size is within backend limits
- Check that FormData is used for image uploads
- Ensure `Content-Type: multipart/form-data` header

## Backend Compatibility

This frontend is designed to work with a Node.js/Express backend featuring:
- MongoDB database
- JWT authentication (cookie-based)
- Multer file uploads
- ImageKit integration
- Gemini AI for captions
- Socket.io for real-time chat

The backend must provide these endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `POST /posts` (multipart)
- `GET /posts`
- `POST /posts/comment`
- `POST /posts/like`
- `GET /chat/chat-history/:user1/:user2`
- Socket.io `message` event

- App runs at http://localhost:5173
- Routes available:
  - /register
  - /login
  - /home
  - /chat
  - /conversation
  - /create-post
  - /profile
  - /user-search

## Build & preview

```bash
npm run build
npm run preview
```

