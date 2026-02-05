# N22 Social - Frontend Documentation

## Overview
A fully functional Instagram-style frontend built with React, Vite, and modern web technologies. This frontend is designed to work seamlessly with the Node.js/Express backend using cookie-based JWT authentication, Socket.io for real-time chat, and ImageKit for image storage.

## Tech Stack
- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with cookie support
- **Socket.io Client** - Real-time messaging
- **GSAP 3** - Smooth animations
- **CSS3** - Instagram-inspired styling

## Project Structure
```
Frontend/
├── index.html              # Entry point with GSAP CDN
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── App.jsx             # Main routing component
│   ├── main.jsx            # React entry point
│   ├── App.css             # Global app styles
│   ├── styles.css          # Base styles
│   ├── theme.css           # Theme variables
│   ├── api/
│   │   ├── api.js          # Axios instance with withCredentials
│   │   └── socket.js       # Socket.io client configuration
│   ├── components/
│   │   ├── NavBar.jsx      # Navigation bar with routing
│   │   ├── PostCard.jsx    # Reusable post display component
│   │   ├── Loading.jsx     # Loading spinner
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── pages/
│   │   ├── Login.jsx       # Login form
│   │   ├── Register.jsx    # Registration form
│   │   ├── Home.jsx        # Feed page
│   │   ├── Upload.jsx      # Create post page
│   │   ├── Chat.jsx        # Real-time messaging
│   │   └── Profile.jsx     # User profile
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   └── styles/
│       ├── main.css        # Main CSS variables and utilities
│       ├── navbar.css      # Navigation styling
│       ├── auth.css        # Auth pages styling
│       ├── feed.css        # Feed styling
│       ├── post-card.css   # Post card styling
│       ├── upload.css      # Upload page styling
│       ├── chat.css        # Chat page styling
│       └── profile.css     # Profile page styling
```

## Features

### 1. Authentication
- **Login & Register** - Email/password based authentication
- **JWT Cookies** - Secure HTTP-only cookies for authentication
- **Protected Routes** - Routes redirect to login if not authenticated
- **Auto Redirect** - 401 errors automatically redirect to login

### 2. Home Feed
- **Posts Display** - Infinite scroll feed with GSAP animations
- **Like System** - Like/unlike posts with visual feedback
- **Comments** - Add comments to posts
- **Mentions** - Display user mentions in posts
- **Load More** - Pagination for loading more posts

### 3. Create Post
- **Image Upload** - Drag & drop or click to select images
- **Image Preview** - See preview before uploading
- **Caption** - Add caption with character counter (2200 max)
- **Mentions** - Tag users in posts (comma-separated)
- **FormData Support** - Multipart form data handling

### 4. Real-time Chat
- **Socket.io Integration** - Real-time messaging
- **Message History** - Load previous conversations
- **Auto Scroll** - Automatically scroll to latest message
- **Sent/Received Bubbles** - Visual message distinction
- **Timestamp** - Show message times

### 5. User Profile
- **User Info** - Display email and post count
- **User Posts** - Show all posts by logged-in user
- **Logout** - Secure logout with cleanup
- **Stats** - Display post statistics

## Running the Frontend

### Prerequisites
- Node.js 14+ installed
- Backend running on http://localhost:5000
- npm or yarn package manager

### Installation
```bash
cd Frontend
npm install
```

### Development Server
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## API Integration

### Axios Configuration
All API requests include:
- `withCredentials: true` - Automatically sends cookies
- 401 error handling - Auto redirects to login
- JSON content-type by default

### API Endpoints Used

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

**Posts:**
- `GET /posts?skip=0&limit=20` - Get posts
- `POST /posts` - Create post (multipart/form-data)
- `POST /posts/like` - Like/unlike post
- `POST /posts/comment` - Add comment to post

**Chat:**
- `GET /chat/chat-history/:user1/:user2` - Get chat history
- Socket.io `emit "message"` - Send real-time message
- Socket.io `listen "message"` - Receive real-time message

## Component Details

### NavBar.jsx
- Sticky navigation with emoji icons
- Active page highlighting
- Quick logout button
- Responsive design

### PostCard.jsx
- GSAP animation on load
- Like/unlike with visual feedback
- Comment input form
- Display mentions and captions
- Auto-scroll support

### Home.jsx
- Infinite scroll pagination
- Load more button
- Pull to refresh
- Empty state handling

### Upload.jsx
- Drag & drop image upload
- Image preview with remove button
- Caption input with counter
- Mentions input helper
- Form validation

### Chat.jsx
- Real-time messaging with Socket.io
- Message history loading
- Auto-scroll to latest message
- Sent/received message distinction

### Profile.jsx
- User avatar with initials
- Post count display
- User posts gallery
- Logout button

## Styling

### Color Scheme
- **Primary**: #0095f6 (Instagram Blue)
- **Danger**: #ed4956 (Instagram Red)
- **Background**: White (light) / Black (dark)
- **Border**: #dbdbdb (light) / #262626 (dark)

### Dark Mode
- Automatic detection with `prefers-color-scheme`
- All components support dark mode
- Smooth transitions between themes

## Animations

### GSAP Animations
- **Post Cards** - Fade in + slide up on load
- **Page Transitions** - Smooth opacity changes
- **Button Interactions** - Scale and transform effects
- **Like Button** - Heart beat animation
- **Refresh Button** - Rotation animation

## Responsive Design

### Breakpoints
- **Desktop**: 1200px+ - Full layout
- **Tablet**: 768px - Adjusted spacing
- **Mobile**: 480px - Single column layout

### Mobile Optimizations
- Touch-friendly button sizes
- Responsive grid for posts
- Horizontal scroll for chat users
- Optimized image loading

## Environment Variables
Create a `.env` file if needed:
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Cookies Not Sending
- Ensure `withCredentials: true` in axios instance
- Check browser settings for third-party cookie blocking
- Verify backend allows credentials

### Socket.io Not Connecting
- Check Socket.io server is running on backend
- Verify `withCredentials: true` in socket configuration
- Check browser console for connection errors

### Images Not Loading
- Verify ImageKit URLs are accessible
- Check image format support
- Ensure backend returns correct image URLs

### Dark Mode Not Working
- Check browser supports `prefers-color-scheme`
- Verify CSS variables are defined in `:root`
- Check no conflicting inline styles

## Performance Tips

1. **Lazy Loading** - Images use `loading="lazy"` attribute
2. **Pagination** - Posts load in chunks of 20
3. **Code Splitting** - React Router enables code splitting
4. **GSAP Optimization** - Animations use `will-change` where needed

## Security Notes

- JWT tokens in HTTP-only cookies (no JavaScript access)
- CSRF protection through cookie attributes
- XSS prevention through React's built-in sanitization
- All external URLs should be verified before use

## Development Tips

1. **Debug Socket.io**: Open DevTools, go to Network > WS
2. **Check API Calls**: Network tab shows all requests
3. **Theme Switching**: Use DevTools to change `prefers-color-scheme`
4. **Performance**: Use React DevTools Profiler

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Upload to Vercel with vite config
```

### Other Platforms
```bash
npm run build
# Deploy dist/ folder to static hosting
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Blank page on load | Check console for errors, verify React mount |
| Cookies not persisting | Verify backend CORS allows credentials |
| Chat not working | Ensure Socket.io server is running |
| Images not displaying | Check ImageKit URL accessibility |
| Dark mode not applying | Force refresh or clear browser cache |

## Future Enhancements

- [ ] Image compression before upload
- [ ] Search functionality
- [ ] User following system
- [ ] Post editing and deletion
- [ ] Notifications
- [ ] Stories feature
- [ ] Reels/Videos
- [ ] Direct messaging groups

## Support & Documentation

- Backend API: See `API_INTEGRATION.md`
- Architecture: See `ARCHITECTURE_DIAGRAMS.md`
- Setup Guide: See `SETUP_GUIDE.md`

## License
Proprietary - N22 Social Media Platform
