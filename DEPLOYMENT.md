# 🚀 VoiceLegal AI - Deployment Guide

Complete guide to deploy VoiceLegal AI to production using free hosting services.

---

## 📋 Prerequisites

- GitHub account
- Render account (sign up at https://render.com)
- Vercel account (sign up at https://vercel.com)
- ElevenLabs account with API key and Agent ID
- Google Cloud Project (for document analysis)

---

## 🗂️ Project Structure

```
voicelegal-ai/
├── backend/           # FastAPI backend
├── frontend/          # React frontend  
└── extension/         # Chrome extension
```

---

## 📦 Part 1: Deploy Backend to Render

### Step 1: Prepare Backend Repository

1. Make sure your backend code is pushed to GitHub
2. Ensure `render.yaml` exists in the backend folder
3. Verify `REQUIREMENTS.txt` is present

### Step 2: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `voicelegal-api` (or your choice)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r REQUIREMENTS.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 3: Set Environment Variables

In Render dashboard → Environment → Add:

```
GOOGLE_CLOUD_PROJECT=your-project-id
GCS_BUCKET_NAME=your-bucket-name
ELEVENLABS_API_KEY=sk_your_key_here
```

**Note**: For `GOOGLE_APPLICATION_CREDENTIALS`, you'll need to:
- Either upload `key.json` as a secret file in Render
- Or convert it to a JSON string and set as an environment variable

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Copy your backend URL (e.g., `https://voicelegal-api.onrender.com`)

### Step 5: Test Backend

Visit: `https://voicelegal-api.onrender.com/docs`

You should see the FastAPI documentation page.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Update Environment Variables Locally

Edit `frontend/.env`:

```env
VITE_BACKEND_URL=https://voicelegal-api.onrender.com
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
```

### Step 2: Commit and Push Changes

```bash
cd frontend
git add .env
git commit -m "Update API URL for production"
git push
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
npm install -g vercel
cd frontend
vercel
```

**Option B: Using Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4: Set Environment Variables in Vercel

In Vercel Project Settings → Environment Variables:

```
VITE_BACKEND_URL=https://voicelegal-api.onrender.com
VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes
3. Copy your frontend URL (e.g., `https://voicelegal.vercel.app`)

---

## 🧩 Part 3: Configure Chrome Extension

### Step 1: Update Extension URLs

Edit `extension/src/content/content.js`:

```javascript
const API_URL = 'https://voicelegal-api.onrender.com';
const DASHBOARD_URL = 'https://voicelegal.vercel.app';
```

Edit `extension/src/background/background.js`:

```javascript
const API_URL = 'https://voicelegal-api.onrender.com';
```

### Step 2: Load Extension in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable **"Developer mode"** (top right)
3. Click **"Load unpacked"**
4. Select the `extension` folder
5. Extension is now active!

### Step 3: Test Extension

1. Visit any Terms & Conditions page
2. Click the floating ⚖️ button
3. Verify it opens your Vercel dashboard with analysis

---

## 🎙️ Part 4: Configure ElevenLabs Webhook

### Step 1: Get Your Webhook Endpoint

Your webhook URL is: `https://voicelegal-api.onrender.com/webhook`

### Step 2: Update in ElevenLabs Dashboard

1. Go to https://elevenlabs.io/app/conversational-ai
2. Select your agent
3. Find the tool configuration for `get_document_analysis`
4. Update the URL field to: `https://voicelegal-api.onrender.com/api/agent/get-document-analysis`

---

## 🔄 Part 5: Switching ElevenLabs Accounts (When Credits Run Out)

### Quick Switch Process (Takes 60 seconds)

#### 1. Update Backend (Render)

1. Go to https://dashboard.render.com
2. Select your `voicelegal-api` service
3. Go to **Environment**
4. Update `ELEVENLABS_API_KEY` with new key
5. Click **"Save Changes"**
6. Service will auto-redeploy (~30 seconds)

#### 2. Update Frontend (Vercel)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_ELEVENLABS_AGENT_ID` with new agent ID
5. Go to **Deployments**
6. Click **"Redeploy"** on latest deployment

#### 3. Update Extension (Local)

Edit `extension/src/content/content.js`:

```javascript
const ELEVENLABS_AGENT_ID = 'your_new_agent_id_here';
```

Then reload extension:
- Go to `chrome://extensions/`
- Click the reload icon on your extension

#### 4. Update ElevenLabs Webhook

In your new ElevenLabs agent, add the tool with URL:
`https://voicelegal-api.onrender.com/api/agent/get-document-analysis`

---

## 📝 Environment Variables Quick Reference

### Backend (Render)

```env
GOOGLE_CLOUD_PROJECT=voicelegal-ai
GCS_BUCKET_NAME=voicelegal-documents
ELEVENLABS_API_KEY=sk_xxxxx  ← UPDATE FREQUENTLY
```

### Frontend (Vercel)

```env
VITE_BACKEND_URL=https://voicelegal-api.onrender.com
VITE_ELEVENLABS_AGENT_ID=agent_xxxxx  ← UPDATE FREQUENTLY
```

### Extension (Local Files)

```javascript
// content.js & background.js
const API_URL = 'https://voicelegal-api.onrender.com';
const DASHBOARD_URL = 'https://voicelegal.vercel.app';
const ELEVENLABS_AGENT_ID = 'agent_xxxxx';  ← UPDATE FREQUENTLY
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Ensure Python version is 3.11 or 3.12

**Problem**: CORS errors
- Backend already configured to allow Vercel and Render domains
- Check browser console for exact error

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `VITE_BACKEND_URL` is correct
- Check backend is running at that URL
- Open browser DevTools → Network tab to see failed requests

### Extension Issues

**Problem**: Extension not working
- Verify URLs in `content.js` and `background.js`
- Check Chrome DevTools → Console for errors
- Reload extension in `chrome://extensions/`

**Problem**: Analysis not showing in dashboard
- Check backend `/api/get-temp-analysis/` endpoint
- Verify dashboard URL is correct in extension

---

## 💰 Cost Summary

- ✅ **Render (Backend)**: $0/month (750 hours free tier)
- ✅ **Vercel (Frontend)**: $0/month (unlimited hobby projects)
- ✅ **Chrome Extension**: $0 (unpacked) or $5 one-time (published)
- ⚠️ **ElevenLabs**: Paid (10,000 credits per account)

**Total Infrastructure Cost: $0/month** 🎉

---

## 🔗 Useful Links

- Backend API Docs: `https://your-backend.onrender.com/docs`
- Frontend Dashboard: `https://your-frontend.vercel.app`
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- ElevenLabs Dashboard: https://elevenlabs.io/app/conversational-ai

---

## 📞 Need Help?

For hackathon judges/reviewers:

1. **Live Demo URLs**: [Add your deployed URLs here]
2. **Test Credentials**: [If needed]
3. **Known Limitations**: Render free tier may sleep after 15min of inactivity (wakes in ~30sec)

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend environment variables set
- [ ] Backend health check passing (`/docs` endpoint)
- [ ] Frontend deployed to Vercel  
- [ ] Frontend environment variables set
- [ ] Frontend can reach backend API
- [ ] Extension URLs updated
- [ ] Extension loaded in Chrome
- [ ] Extension connects to production backend
- [ ] ElevenLabs webhook URL updated
- [ ] Voice assistant working end-to-end
- [ ] Tested document upload flow
- [ ] Tested voice chat feature
- [ ] Tested web extension on live site

---

**You're all set! 🚀 Good luck with your hackathon!**
