# 🚀 Vercel Deployment Guide for BioBrain AI

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - BioBrain AI"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/biobrain.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings
   - Click "Deploy"

3. **Environment Variables (Optional)**
   - In Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_OPENROUTER_API_KEY` = `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`
   - This is optional as the key is hardcoded in the app

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd biobrain
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔑 API Key System

### How It Works

BioBrain AI has a **dual API key system**:

1. **Default API Key (Built-in)**
   - Pre-configured in the app: `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`
   - Works immediately - no setup required
   - Shared among all users
   - Perfect for immediate testing and demo

2. **Custom API Key (Optional)**
   - Users can add their own OpenRouter API key in Settings
   - Stored locally in their browser
   - Provides unlimited usage with their own quota
   - Privacy-focused - only stored on user's device

### User Experience

**First Time Users:**
- App works immediately with default key
- No configuration needed
- Can start asking biology questions right away

**Power Users:**
- Can click Settings ⚙️
- Add their own OpenRouter API key
- Get unlimited usage with their quota
- Option to save key for future sessions

### Settings Interface

The app shows:
- "Using Default Key" - when using the built-in key
- "Using Custom Key" - when user provides their own key
- Clear instructions in settings modal

## 📁 Project Structure for Vercel

```
biobrain/
├── index.html          # Main app file
├── styles.css          # All styles
├── app.js             # Application logic (with default API key)
├── sw.js              # Service worker
├── vercel.json        # Vercel configuration
├── .env               # Local environment variables
├── .env.production    # Production environment variables
├── .gitignore         # Git ignore rules
├── package.json       # Project metadata
└── README.md          # Documentation
```

## 🔒 Security Notes

### Default API Key
- ✅ Hardcoded in `app.js` for convenience
- ✅ Can be rotated anytime by updating the code
- ✅ Users can override with their own key
- ⚠️ Shared among all users (rate limits may apply)

### Custom API Keys
- ✅ Stored only in user's browser (localStorage)
- ✅ Base64 encoded (basic protection)
- ✅ Never sent to your server
- ✅ User can clear anytime

### Recommendations
1. Monitor usage of default API key on OpenRouter dashboard
2. Consider rotating the default key periodically
3. For production with many users, implement backend API proxy
4. Encourage power users to use their own keys

## 🌐 Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `biobrain.yourdomain.com`)
3. Follow DNS configuration instructions
4. Vercel provides automatic HTTPS

## 📊 Monitoring

### Vercel Analytics (Built-in)
- View in Vercel Dashboard → Your Project → Analytics
- See page views, performance metrics
- All free tier included

### OpenRouter Usage
- Check usage at [openrouter.ai/dashboard](https://openrouter.ai/dashboard)
- Monitor API key usage and costs
- Set up usage alerts

## 🔄 Updates & Redeployment

### Automatic Deployment
- Push to GitHub main branch
- Vercel auto-deploys changes
- Live in ~30 seconds

### Manual Deployment
```bash
vercel --prod
```

## 🐛 Troubleshooting

### API Key Issues
- **Default key not working**: Check OpenRouter dashboard for quota/status
- **Custom key not saving**: Check browser localStorage permissions
- **Keys showing as error**: Verify key format starts with `sk-or-v1-`

### Deployment Issues
- **Build fails**: Ensure all files are committed to git
- **404 errors**: Check `vercel.json` routing configuration
- **Slow loading**: Enable Vercel Edge Network (automatic)

### User Issues
- **Can't send messages**: Check API key status in settings
- **Diagrams not loading**: Check internet connection
- **Chat history lost**: Clear browser cache may reset localStorage

## 💡 Tips for Production

1. **Rate Limiting**: Consider implementing rate limits for default key
2. **Backend Proxy**: For high traffic, proxy API calls through backend
3. **Key Rotation**: Rotate default API key monthly
4. **User Education**: Add banner encouraging users to use own keys
5. **Analytics**: Enable Vercel Analytics for insights
6. **Monitoring**: Set up alerts for API usage spikes

## 📞 Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- OpenRouter Docs: [openrouter.ai/docs](https://openrouter.ai/docs)
- BioBrain Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/biobrain/issues)

---

**Your app is now ready for production! 🎉**

Access it at: `https://biobrain-ai.vercel.app` (or your custom domain)
