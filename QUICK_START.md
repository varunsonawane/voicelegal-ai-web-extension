# 🚀 Quick Start - Deployment Summary

## ✅ What's Been Configured

### 1. Backend (FastAPI)
- ✅ `render.yaml` created for Render deployment
- ✅ CORS updated to allow production domains (Vercel, Render)
- ✅ `.env.example` created for reference

### 2. Frontend (React + Vite)
- ✅ Updated to use `VITE_BACKEND_URL` environment variable
- ✅ `.env.example` created
- ✅ Ready for Vercel deployment

### 3. Extension (Chrome)
- ✅ Config system created with clear TODO comments
- ✅ URLs marked for production updates

### 4. Documentation
- ✅ Complete `DEPLOYMENT.md` guide created

---

## 📝 Next Steps (Do This Now)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 2: Deploy Backend to Render (10 minutes)
1. Go to https://render.com/dashboard
2. New → Web Service
3. Connect GitHub repo
4. Root directory: `backend`
5. Build: `pip install -r REQUIREMENTS.txt`
6. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables (see DEPLOYMENT.md)
8. Deploy!

**Copy your backend URL**: `https://voicelegal-api-XXXX.onrender.com`

### Step 3: Deploy Frontend to Vercel (5 minutes)
1. Update `frontend/.env`:
   ```
   VITE_BACKEND_URL=https://voicelegal-api-XXXX.onrender.com
   VITE_ELEVENLABS_AGENT_ID=your_agent_id
   ```
2. Push changes
3. Go to https://vercel.com/dashboard
4. Import GitHub project
5. Root directory: `frontend`
6. Deploy!

**Copy your frontend URL**: `https://voicelegal-XXXX.vercel.app`

### Step 4: Update Extension URLs (2 minutes)
Edit these files with your production URLs:
- `extension/src/content/content.js` (line 2-3)
- `extension/src/background/background.js` (line 2)

### Step 5: Configure ElevenLabs Webhook
Tool URL: `https://voicelegal-api-XXXX.onrender.com/api/agent/get-document-analysis`

---

## 🔄 When You Need to Switch ElevenLabs Accounts

### Backend (30 seconds)
Render Dashboard → Environment → Update `ELEVENLABS_API_KEY` → Save

### Frontend (30 seconds)  
Vercel Dashboard → Settings → Environment Variables → Update `VITE_ELEVENLABS_AGENT_ID` → Redeploy

### Extension (30 seconds)
Update `ELEVENLABS_AGENT_ID` in `content.js` → Reload extension

**Total: 90 seconds to switch accounts!**

---

## 📖 Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete step-by-step guide with troubleshooting.

---

## 💡 Tips

- **Render Free Tier**: Sleeps after 15min inactivity, wakes in ~30sec
- **First Request**: May be slow as backend wakes up
- **Testing**: Always test after switching ElevenLabs accounts
- **Debugging**: Check browser console and Render logs

---

**Ready to deploy? Follow the steps above!** 🚀
