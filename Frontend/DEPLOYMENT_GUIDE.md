# Deployment Guide - N22 Social Frontend

## 🚀 PRODUCTION DEPLOYMENT

This guide covers deploying the N22 Social frontend to production.

---

## Prerequisites

- ✅ Frontend code is complete and tested
- ✅ Backend is deployed and accessible
- ✅ Environment variables configured
- ✅ HTTPS enabled on backend

---

## Step 1: Build the Frontend

```bash
cd Frontend
npm install
npm run build
```

This creates an optimized `dist/` folder with:
- Minified HTML/CSS/JS
- Code splitting
- Asset optimization
- Production configuration

---

## Step 2: Update Backend URL

**Edit `src/api/api.js`:**
```javascript
const API_BASE_URL = 'https://your-backend-domain.com';
// For local: 'http://localhost:5000'
// For production: 'https://api.yourdomain.com'
```

**Edit `src/api/socket.js`:**
```javascript
const SOCKET_URL = 'https://your-backend-domain.com';
// Must match backend WebSocket URL
```

Then rebuild:
```bash
npm run build
```

---

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Setup Vercel
```bash
npm install -g vercel
vercel login
```

### Step 2: Deploy
```bash
cd Frontend
vercel
```

### Step 3: Configure Environment
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add if needed (usually not required for frontend)
3. Redeploy

### Step 4: Custom Domain
1. Go to Domains
2. Add your custom domain
3. Configure DNS records

---

## Option 2: Deploy to Netlify

### Step 1: Connect GitHub
1. Push code to GitHub
2. Go to netlify.com
3. Click "New site from Git"
4. Select GitHub repo

### Step 2: Configure Build
```
Build command: npm run build
Publish directory: dist
```

### Step 3: Deploy
- Netlify auto-deploys on git push
- Custom domain available in settings

---

## Option 3: Deploy to AWS (S3 + CloudFront)

### Step 1: Build
```bash
npm run build
```

### Step 2: Upload to S3
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

### Step 3: Invalidate CloudFront
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Option 4: Deploy to Your Server

### Step 1: Build
```bash
npm run build
```

### Step 2: Upload dist/ folder
```bash
# Using SCP
scp -r dist/* user@server.com:/var/www/html/

# Or using FTP/SFTP
```

### Step 3: Configure Web Server

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Apache:**
```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

---

## Backend Configuration

### CORS Setup
Backend must allow your frontend URL:

```javascript
// Backend: server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',      // Development
    'https://yourdomain.com',     // Production
  ],
  credentials: true,              // ✅ Important for cookies
}));
```

### Socket.io Configuration
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://yourdomain.com',
    ],
    credentials: true,
  },
});
```

---

## SSL/HTTPS

### Get SSL Certificate
**Let's Encrypt (Free):**
```bash
sudo certbot certonly --standalone -d yourdomain.com
```

**Commercial:**
- Buy from GoDaddy, Namecheap, etc.

### Redirect HTTP to HTTPS
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Environment Variables

Create `.env.production` (if needed):
```
VITE_API_URL=https://api.yourdomain.com
```

Build with environment:
```bash
npm run build
```

---

## Performance Optimization

### Enable Compression
```nginx
gzip on;
gzip_types text/plain text/css application/javascript;
gzip_vary on;
```

### Cache Static Assets
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### Cache HTML
```nginx
location = /index.html {
  expires 10m;
  add_header Cache-Control "public, max-age=600";
}
```

---

## Monitoring & Logging

### Check Errors
```bash
# Vercel
vercel logs

# Netlify
netlify logs:tail

# Server
tail -f /var/log/nginx/error.log
```

### Monitor Performance
- Use Lighthouse
- Check Core Web Vitals
- Monitor API response times

---

## Troubleshooting Deployment

### Blank Page
- Check browser console (F12)
- Verify API URL is correct
- Check network requests

### API Not Working
- Verify backend URL
- Check CORS configuration
- Ensure credentials are sent

### Routes Not Working
- Verify `try_files` is configured
- Check router configuration
- Test in dev first

### Images Not Loading
- Verify ImageKit URLs
- Check CORS headers
- Test with direct URL

### Chat Not Connecting
- Check WebSocket URL
- Verify backend is running
- Check firewall rules

---

## Deployment Checklist

- [ ] Build succeeds without errors
- [ ] Backend URL updated in api.js
- [ ] Socket.io URL updated
- [ ] CORS configured on backend
- [ ] Credentials allowed in CORS
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Environment variables set
- [ ] Tested login/logout
- [ ] Tested post creation
- [ ] Tested chat
- [ ] Tested on mobile
- [ ] Performance optimized
- [ ] CDN configured (optional)
- [ ] Monitoring enabled
- [ ] Backup created

---

## Post-Deployment

### Verify Everything Works
1. Visit your domain
2. Register a new account
3. Create a post
4. Test chat
5. Check all features

### Monitor for Issues
- Check error logs
- Monitor API latency
- Check WebSocket connection
- Monitor database performance

### Maintenance
- Regular backups
- Security updates
- Performance monitoring
- User feedback

---

## Rollback Plan

If something breaks:

```bash
# Rollback to previous version
vercel rollback  # (Vercel)

# Or redeploy previous build
npm run build
# Use previous dist/ version
```

---

## CI/CD Pipeline

### Automatic Deployment with GitHub Actions

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: cd Frontend && npm install
      - name: Build
        run: cd Frontend && npm run build
      - name: Deploy
        uses: actions/upload-artifact@v2
        with:
          name: dist
          path: Frontend/dist
```

---

## Cost Estimates

| Platform | Cost | Notes |
|----------|------|-------|
| Vercel | Free | Good for most cases |
| Netlify | Free | Good alternative |
| AWS | $0-50/mo | Variable based on usage |
| Digital Ocean | $4-20/mo | Simple VPS |
| Heroku | $7+/mo | All-in-one solution |

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Sensitive data not in frontend
- [ ] Environment variables secured
- [ ] Headers properly set
- [ ] Content Security Policy configured
- [ ] Regular security updates

---

## Performance Targets

- ✅ First Contentful Paint: < 1.5s
- ✅ Largest Contentful Paint: < 2.5s
- ✅ Cumulative Layout Shift: < 0.1
- ✅ Time to Interactive: < 3.5s

---

## Support

- Frontend Issues: Check `FRONTEND_GUIDE.md`
- Deployment Help: Check specific platform docs
- Backend Issues: Check backend documentation

---

**Version:** 1.0.0
**Last Updated:** February 1, 2026
**Status:** Ready for Production
