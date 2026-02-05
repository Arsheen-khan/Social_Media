# 🚀 Quick Start

## Start Both Servers (5 minutes)

### Terminal 1: Backend
```bash
cd Backend
npm start
```
✅ Backend running on: `http://localhost:5000`

### Terminal 2: Frontend
```bash
cd Frontend
npm install  # Only first time
npm run dev
```
✅ Frontend running on: `http://localhost:5173`

---

## Test the App

### 1. Register
- Go to `http://localhost:5173`
- Click "Register"
- Create account with email & password

### 2. Login
- Enter credentials
- You're logged in! ✅

### 3. Create Post
- Click "Create Post"
- Upload image
- Add caption
- Click "Post"

### 4. View Feed
- Posts appear in feed
- Like posts
- Comment on posts

### 5. Chat
- Click "Chat"
- Select a user
- Send real-time message

---

## Key URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Chat | WebSocket on 5000 |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to backend | Check port 5000, run Backend server |
| Images won't upload | Check file size, verify backend running |
| Chat not working | Refresh page, check Socket.io |
| 401 errors | Clear cookies, logout/login again |

**More help?** See `TROUBLESHOOTING.md`

---

## What's New

✨ **Frontend Complete**
- React + Vite
- Posts with images
- Real-time chat
- JWT cookies
- Protected routes

✅ **Backend Unchanged**
- Your existing API
- No modifications needed
- Everything works together

---

## Documentation

- `SETUP_GUIDE.md` - Detailed setup
- `API_INTEGRATION.md` - API reference
- `FRONTEND_IMPLEMENTATION.md` - Architecture
- `TROUBLESHOOTING.md` - Common issues

---

**You're all set! Happy coding!** 🎉
