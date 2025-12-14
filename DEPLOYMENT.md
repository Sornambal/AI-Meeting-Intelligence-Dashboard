# Deployment Guide

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add full stack app"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Set Root Directory: `frontend`
   - Add Environment Variables:
     ```
     VITE_API_BASE_URL=https://meeting-action-extractor.onrender.com
     ```
   - Click Deploy

3. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain

### Option 2: Netlify

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop the `frontend/dist` folder
   - Or connect GitHub for auto-deployment

3. **Set Environment Variables**
   - Build & Deploy → Environment
   - Add `VITE_API_BASE_URL`

### Option 3: GitHub Pages

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/meeting-action-extractor/',
     // ... rest of config
   })
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm install gh-pages --save-dev
   npm run deploy
   ```

---

## Backend Deployment (Already on Render)

The backend is already running at: `https://meeting-action-extractor.onrender.com`

### If Deploying to a New Platform:

#### Heroku
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### Docker (Any Cloud Provider)
```dockerfile
FROM python:3.11

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Then push to:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## Production Checklist

### Frontend
- [ ] Set `VITE_API_BASE_URL` to production backend
- [ ] Test all features in production build
- [ ] Enable HTTPS
- [ ] Set up error tracking (Sentry)
- [ ] Configure CDN (CloudFlare)
- [ ] Add analytics (Google Analytics)
- [ ] Set up SSL certificate

### Backend
- [ ] Change `JWT_SECRET_KEY` in production
- [ ] Update `FRONTEND_URL` for CORS
- [ ] Use production database
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure backups
- [ ] Add monitoring (Sentry, DataDog)
- [ ] Rate limiting enabled

### Database
- [ ] Automated backups enabled
- [ ] Use strong passwords
- [ ] Enable SSL connections
- [ ] Regular maintenance checks

### Security
- [ ] Remove all console.log statements
- [ ] Validate all inputs (frontend & backend)
- [ ] Use HTTPS everywhere
- [ ] Set secure cookies
- [ ] Enable CORS properly
- [ ] Add rate limiting
- [ ] Regular security audits

---

## Monitoring & Logs

### Frontend
- Vercel/Netlify built-in analytics
- Google Analytics integration
- Sentry for error tracking

### Backend
- Render logs: Dashboard → Logs
- Application logs in `/app/logs/`
- Sentry integration for errors

---

## Rollback Procedure

### Frontend
- Vercel: Deployments → Select previous version → Promote
- Netlify: Deploys → Click on previous deploy

### Backend
- Render: Dashboard → Deployments → Rollback

---

## Performance Optimization

### Frontend
- [ ] Enable gzip compression
- [ ] Minify CSS/JS
- [ ] Lazy load components
- [ ] Image optimization
- [ ] Cache assets (vite auto-handles)

### Backend
- [ ] Enable caching headers
- [ ] Database indexing
- [ ] Connection pooling
- [ ] Async operations

---

## Support & Contact

For deployment issues:
1. Check platform documentation
2. Review application logs
3. Verify environment variables
4. Test locally before deploying
