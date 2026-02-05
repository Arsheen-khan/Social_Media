# Quick Troubleshooting Guide

## 🆘 Common Issues & Solutions

### ❌ "Cannot GET /"
**Problem**: Frontend not running or Vite server not started
**Solution**:
```bash
cd Frontend
npm run dev
```
Then go to `http://localhost:5173`

---

### ❌ "Failed to fetch from backend"
**Problem**: CORS or backend not running
**Solution**:
1. Check backend is running on port 5000
2. Check `.env` has correct `VITE_API_URL`
3. Verify backend CORS settings
```bash
cd Backend
npm start
```

---

### ❌ "401 Unauthorized on login"
**Problem**: JWT not being sent or backend auth failing
**Solution**:
1. Check browser DevTools → Application → Cookies
2. Verify backend is setting JWT cookie
3. Check backend /auth/login endpoint
4. Try clearing all cookies and retrying

---

### ❌ "Register button not working"
**Problem**: Missing email or password
**Solution**:
1. Ensure email is valid format
2. Ensure password is at least 6 characters
3. Check console for error messages
4. Verify backend is running

---

### ❌ "Images won't upload"
**Problem**: FormData not sending or backend limit
**Solution**:
1. Check file is actually selected
2. Verify file size (usually <5MB limit)
3. Check backend Image upload folder exists
4. Verify ImageKit config on backend
5. Check console for upload error

---

### ❌ "Chat messages not appearing"
**Problem**: Socket.io not connected
**Solution**:
1. Check Socket.io is running on backend
2. Open DevTools → Network tab → look for WebSocket
3. Check browser console for Socket.io errors
4. Verify `withCredentials: true` in socket config
5. Refresh page and try again

---

### ❌ "Real-time messages showing "undefined"
**Problem**: Message format mismatch
**Solution**:
Backend sends: `{ text: "...", message: "..." }`
Frontend checks both: `msg.text || msg.message`

---

### ❌ "Logout button not working"
**Problem**: Logout not clearing cookies
**Solution**:
1. Check browser cookies are cleared
2. Verify localStorage is cleared
3. Check redirect to login happens

---

### ❌ "Posts feed empty"
**Problem**: No posts or API error
**Solution**:
1. Check backend /posts endpoint working
2. Verify you're logged in
3. Check console for API errors
4. Try creating a test post first

---

### ❌ "Loading spinner stuck"
**Problem**: API request hanging
**Solution**:
1. Check backend is responding
2. Check network tab for failed requests
3. Refresh page
4. Check for CORS errors

---

### ❌ "'withCredentials' is not working"
**Problem**: Cookies not sending with requests
**Solution**:
1. Check `.env` has `VITE_API_URL`
2. Verify `api.js` has `withCredentials: true`
3. Check backend CORS allows credentials
4. For development: use same domain or proper CORS

---

### ❌ "Component not showing"
**Problem**: Route not rendering
**Solution**:
1. Check syntax in App.jsx routes
2. Verify component imports
3. Check file exists in right location
4. Check console for import errors

---

### ❌ "CSS not loading"
**Problem**: Styles not applied
**Solution**:
1. Check CSS files imported in main.jsx
2. Verify theme.css is loaded first
3. Check CSS file names match
4. Hard refresh browser (Ctrl+Shift+R)

---

### ❌ "CORS error in console"
**Problem**: Backend doesn't allow frontend origin
**Solution**:
Backend `server.js` should have:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

### ❌ "Socket.io connection refused"
**Problem**: Socket.io not running on backend
**Solution**:
1. Check backend Socket.io server created
2. Verify port matches (5000)
3. Check backend has socket initialization
4. Look for Socket.io errors in backend console

---

### ❌ "Dependencies missing after npm install"
**Problem**: Incomplete install
**Solution**:
```bash
rm -r node_modules package-lock.json
npm install
npm run dev
```

---

### ❌ "Vite won't start on port 5173"
**Problem**: Port already in use
**Solution**:
```bash
# Find process on port 5173
netstat -ano | findstr :5173

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

---

## 🔍 Debugging Tips

### Check Backend Logs
```bash
cd Backend
npm start
# Look for errors in console
```

### Check Frontend Logs
Open DevTools (F12) → Console tab
- Look for error messages
- Check network requests
- Verify API responses

### Monitor Network Requests
DevTools → Network tab:
1. Check requests have Cookie header
2. Verify response status (200, 401, etc.)
3. Check response data

### Test API Directly
Use Postman or curl:
```bash
curl -X GET http://localhost:5000/posts \
  -H "Cookie: jwt=<your_token>" \
  -H "Content-Type: application/json"
```

### Check Environment Variables
```javascript
// In browser console:
console.log(import.meta.env.VITE_API_URL);
```

---

## ✅ Quick Verification Checklist

- [ ] Backend running: `http://localhost:5000` (check ports)
- [ ] Frontend running: `http://localhost:5173` (check ports)
- [ ] Database connected (backend can store data)
- [ ] .env file exists with VITE_API_URL
- [ ] Dependencies installed: `npm install`
- [ ] No console errors in frontend
- [ ] Cookies show in DevTools
- [ ] API calls include Authorization header
- [ ] Socket.io WebSocket connection in Network tab
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create post with image
- [ ] Can see posts in feed
- [ ] Can like post
- [ ] Can send chat message

---

## 🆘 Still Having Issues?

### Step 1: Check Logs
```bash
# Backend
cd Backend && npm start

# Frontend (console)
npm run dev
# Check browser DevTools console
```

### Step 2: Verify Running Services
```bash
# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 5173 (frontend)
netstat -ano | findstr :5173
```

### Step 3: Clear Cache & Restart
```bash
# Clear npm cache
npm cache clean --force

# Clear browser cache
# DevTools → Application → Clear storage

# Restart both servers
```

### Step 4: Check .env
```bash
# Frontend/.env should have:
VITE_API_URL=http://localhost:5000
```

### Step 5: Verify Backend Connection
```javascript
// In browser console:
fetch('http://localhost:5000/posts', {
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))
```

If this works, backend is fine. If not, check backend/CORS.

---

## 📞 Need More Help?

1. Check API_INTEGRATION.md for detailed API docs
2. Check SETUP_GUIDE.md for setup instructions
3. Check Frontend/README.md for frontend docs
4. Review FRONTEND_IMPLEMENTATION.md for architecture

---

## 🎯 Common Quick Fixes

**Not seeing posts?**
- Refresh page
- Check backend is running
- Try creating a new post

**Can't upload image?**
- Check file size < 5MB
- Verify file is image format
- Check backend upload folder

**Chat not working?**
- Refresh page
- Reconnect Socket.io manually
- Check backend Socket.io errors

**Can't login?**
- Clear cookies and localStorage
- Try registering new account
- Check backend auth working

**Styles look broken?**
- Hard refresh: Ctrl+Shift+R
- Check CSS imports in main.jsx
- Verify theme.css exists

---

**Last Resort**: Restart everything
```bash
# Kill both servers
# Clear cache
npm cache clean --force

# Fresh install
rm -r node_modules
npm install

# Start fresh
npm run dev
```

You got this! 💪
