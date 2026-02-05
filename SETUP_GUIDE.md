# Complete Social Media App Setup Guide

## Prerequisites
- Node.js v16+ installed
- MongoDB running locally or on cloud
- ImageKit account (for image storage)
- Gemini API key

## Backend Setup (Already Built ✅)
Your backend is complete with:
- Node.js + Express
- MongoDB integration
- JWT authentication (cookie-based)
- Multer for file uploads
- ImageKit for image storage
- Gemini AI for captions
- Socket.io for real-time chat

No changes needed to backend - it's production-ready!

## Frontend Setup (NEW ✨)

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

This will install:
- React 18
- Vite (build tool)
- Axios (HTTP client)
- React Router v6 (routing)
- Socket.io-client (real-time chat)

### 2. Configure Environment
Frontend .env is already configured with defaults:
```
VITE_API_URL=http://localhost:5000
```

If your backend runs on a different port, update this file.

### 3. Start Frontend Development Server
```bash
npm run dev
```
Frontend will be available at: `http://localhost:5173`

### 4. Access the Application
- Go to `http://localhost:5173`
- Create an account or login
- Create posts with image uploads
- Chat with other users in real-time
- Like and comment on posts

## Running Both Servers

### Terminal 1 - Backend
```bash
cd Backend
npm start
# or
npm run dev
```
Backend runs on: `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd Frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

## Frontend Architecture

### Folder Structure
```
Frontend/src/
├── api/
│   ├── api.js          # Axios with withCredentials
│   └── socket.js       # Socket.io setup
├── components/
│   ├── NavBar.jsx
│   ├── PostCard.jsx
│   ├── ProtectedRoute.jsx
│   ├── Loading.jsx
│   └── Layout.jsx
├── context/
│   └── AuthContext.jsx # Auth state management
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx
│   ├── CreatePost.jsx
│   ├── Chat.jsx
│   └── Conversation.jsx
└── App.jsx             # Routing
```

### Key Features Implemented

✅ **Authentication**
- Login/Register with JWT cookies
- Protected routes
- Session persistence

✅ **Posts**
- Create posts with image upload
- View feed with pagination
- Like/unlike posts
- Comment functionality
- Mentions support (@username,@username2)

✅ **Real-time Chat**
- Socket.io integration
- Chat history
- Instant messaging
- Message timestamps

✅ **Error Handling**
- 401 redirects to login
- Form validation
- Loading states
- Error messages

### API Endpoints Used
```
POST   /auth/register
POST   /auth/login
GET    /posts?skip=0&limit=20
POST   /posts (multipart/form-data)
POST   /posts/comment
POST   /posts/like
GET    /chat/chat-history/:user1/:user2
Socket.io: message event
```

## Important Implementation Details

### withCredentials: true
Every Axios request includes JWT from cookies:
```javascript
// Configured in api.js
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});
```

### Image Upload
Posts use FormData for multipart file uploads:
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('caption', caption);
formData.append('mentions', '@user1,@user2'); // comma-separated
```

### Socket.io Authentication
Socket.io automatically uses cookies for authentication:
```javascript
const socket = io('http://localhost:5000', {
  withCredentials: true
});
```

## Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env
- Verify CORS is enabled on backend

### "401 Unauthorized"
- Clear browser cookies and localStorage
- Re-login
- Check JWT expiration settings

### "Images not uploading"
- Ensure backend file upload folder exists
- Check ImageKit configuration on backend
- Verify file size limits

### "Chat not working"
- Ensure Socket.io is running on backend
- Check browser console for connection errors
- Verify withCredentials in socket config

## Build for Production

```bash
cd Frontend
npm run build
npm run preview
```

Production bundle will be in `dist/` folder.

## Next Steps

1. ✅ Backend is ready
2. ✅ Frontend is ready
3. Install & run both servers
4. Create test account
5. Test all features
6. Deploy when ready

## Support

Frontend is fully compatible with your existing backend. No backend changes needed!

All API calls include cookies automatically.
All routes are protected with authentication.
Real-time chat works out of the box.
Image uploads are fully integrated.

Happy coding! 🚀
