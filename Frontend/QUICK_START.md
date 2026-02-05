# Quick Start - N22 Social Frontend

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd Frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Visit: `http://localhost:5173`

### Step 3: Backend Must Be Running
Make sure your backend is running on `http://localhost:5000`
```bash
cd Backend
npm start
```

### Step 4: Test the App
1. Open `http://localhost:5173` in your browser
2. Register a new account or login
3. Create a post with an image
4. Like and comment on posts
5. Chat in real-time
6. View your profile

## 🎯 Key Features Working

✅ **Authentication** - Login/Register with email and password
✅ **Feed** - Infinite scroll with posts and likes
✅ **Upload** - Create posts with images and captions
✅ **Real-time Chat** - Socket.io powered messaging
✅ **Profile** - View user info and posts
✅ **Dark Mode** - Auto detection with system theme
✅ **Responsive** - Works on mobile, tablet, desktop

## 📁 Files Structure

```
src/
├── pages/           # Page components (Home, Login, Chat, etc)
├── components/      # Reusable components (NavBar, PostCard)
├── api/             # Axios and Socket.io setup
├── styles/          # CSS for each page
├── context/         # Auth context
├── App.jsx          # Main routing
└── main.jsx         # React entry point
```

## 🔧 Configuration

### Backend URL
The frontend expects backend at `http://localhost:5000`

If your backend is on different port, update:
- `src/api/api.js` - Change `API_BASE_URL`
- `src/api/socket.js` - Change `SOCKET_URL`

### GSAP CDN
GSAP is loaded from CDN in `index.html`. If offline, install locally:
```bash
npm install gsap
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 🐛 Troubleshooting

### Page shows blank
- Check browser console (F12)
- Ensure backend is running
- Try hard refresh (Ctrl+Shift+R)

### Can't login
- Check backend is running on :5000
- Verify email/password format
- Check browser cookies are enabled

### Images not loading
- Backend must be running and ImageKit configured
- Check image URLs in Network tab

### Chat not working
- Backend Socket.io must be running
- Check WebSocket connection in Network tab

## 📚 Documentation

- Full guide: `FRONTEND_GUIDE.md`
- API details: `../API_INTEGRATION.md`
- Architecture: `../ARCHITECTURE_DIAGRAMS.md`

## 🚢 Deploy to Production

```bash
npm run build
# Upload 'dist' folder to your hosting
```

## 💡 Tips

- Use React DevTools for debugging
- Check Network tab for API calls
- Use browser DevTools for styling
- Press F12 to open DevTools

## 🎨 Customization

Edit `src/styles/main.css` to change:
- Primary color: `--primary: #0095f6`
- Text color: `--text-primary: #262626`
- Background: `--bg-primary: #ffffff`

## ✨ Next Steps

1. Test all features in browser
2. Try creating posts
3. Test chat with another user
4. Explore dark mode toggle
5. Check responsive design (resize browser)

---

**Frontend is 100% complete and ready to use!**

Need help? Check the documentation or backend logs.
