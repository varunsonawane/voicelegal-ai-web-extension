
# ⚖️ VoiceLegal AI

> AI-Powered Legal Document Analysis with Voice Interaction + Chrome Extension

Stop blindly accepting Terms & Conditions. VoiceLegal AI analyzes legal documents instantly and lets you ask questions through voice - **right in your browser**, no downloads needed.

**🎯 Built for AI Partner Catalyst Hackathon 2025**

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://voicelegal-ai-web-extension.vercel.app)
[![Chrome Extension](https://img.shields.io/badge/Extension-Manual_Install-blue)](#-installing-the-chrome-extension)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Features

### **Chrome Extension (The Game Changer)**
- 🔍 **Auto-Detection** - Automatically recognizes legal pages (terms, privacy policies)
- 🎯 **One-Click Analysis** - Floating button appears, no tab switching needed
- ⚡ **Zero Downloads** - Works on ANY website (Netflix, Spotify, social platforms)
- 🚀 **Instant Sidebar** - Analysis appears in-page within 3-5 seconds

### **Web Dashboard**
- 📄 **PDF Upload** - Drag-and-drop any legal document
- 🤖 **AI Analysis** - Powered by Google Gemini 2.0 Flash via Vertex AI
- 🎤 **Voice Assistant** - Ask questions using ElevenLabs Conversational AI
- 📊 **Risk Assessment** - Categorized as HIGH, MEDIUM, LOW with explanations
- 🔎 **Hidden Clauses** - Uncovers easy-to-miss harmful terms
- 💬 **Context-Aware Q&A** - Voice agent already knows your document

---

## 🎯 Why VoiceLegal AI?

**Problem with ChatGPT/Gemini:**
- ❌ Must download PDF or copy-paste text
- ❌ Open new tab, switch contexts
- ❌ Type questions manually
- ❌ Re-upload for every document

**VoiceLegal AI Solution:**
- ✅ Automatic page detection
- ✅ Works directly on web pages
- ✅ One-click analysis
- ✅ Voice-first interaction
- ✅ **4.8x faster** than traditional AI tools

---

## 🏗️ Tech Stack

### **AI & ML**
- **Google Vertex AI** - Gemini 2.0 Flash for document analysis
- **ElevenLabs Conversational AI** - Voice agent with custom webhooks

### **Backend**
- **Python 3.11+** - Core language
- **FastAPI** - RESTful API framework
- **PyPDF2** - PDF text extraction
- **Uvicorn** - ASGI server
- **Render** - Production hosting (free tier)

### **Frontend**
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **@elevenlabs/react** - Voice SDK
- **Vercel** - Hosting

### **Chrome Extension**
- **Manifest V3** - Extension framework
- **Content Scripts** - Page interaction & text extraction
- **Background Service Worker** - API proxy (CORS bypass)
- **Chrome APIs** - Runtime messaging, storage

### **DevOps**
- **Docker** - Containerization
- **Google Cloud Build** - CI/CD (development)
- **Git/GitHub** - Version control

---

## 🚀 Quick Start

### **Option 1: Try the Live Demo** (Easiest)

#### **⚠️ Important: Wake Up Backend First**

We use **free hosting** (Render free tier auto-sleeps after 15 min):

1. **Wake the server:**
   ```
   Visit: https://voicelegal-ai-web-extension.onrender.com
   You'll see: {"detail":"Not Found"} ← This is expected! ✅
   Wait ~30 seconds for initialization
   ```

2. **Use the dashboard:**
   ```
   Visit: https://voicelegal-ai-web-extension.vercel.app
   Upload PDF → Get Analysis → Start Voice Chat
   ```

3. **Install Chrome Extension:**
   See [Extension Installation Guide](#-installing-the-chrome-extension) below

---

### **Option 2: Run Locally**

#### Prerequisites

- Python 3.11+
- Node.js 18+
- Google Cloud account with Vertex AI enabled
- ElevenLabs account

#### 1. Clone Repository
```bash
git clone https://github.com/varunsonawane/voicelegal-ai-web-extension.git
cd voicelegal-ai-web-extension
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup Google Cloud credentials
# Download service account key from Google Cloud Console
# Save as key.json in backend/

# Create .env (optional for local)
echo "GOOGLE_CLOUD_PROJECT=your_project_id" > .env

# Run server
uvicorn app.main:app --reload --port 8000
```

Backend runs on: `http://localhost:8000`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.development.local
echo "VITE_API_URL=http://localhost:8000" > .env.development.local
echo "VITE_ELEVENLABS_AGENT_ID=agent_2401kcash9gqejx8t67n3prbe2nv" >> .env.development.local

# Run dev server
npm run dev
```

Frontend runs on: `http://localhost:5173`

#### 4. Load Chrome Extension
See [Extension Installation](#-installing-the-chrome-extension)

---

## 📥 Installing the Chrome Extension

**Manual installation required** (unpaid Chrome Web Store fee)

### Steps:

1. **Download the code:**
   - Clone this repo OR
   - [Download ZIP](https://github.com/varunsonawane/voicelegal-ai-web-extension/archive/refs/heads/main.zip) and extract

2. **Load in Chrome:**
   - Open Chrome → `chrome://extensions/`
   - **Enable "Developer mode"** (top-right toggle)
   - Click **"Load unpacked"**
   - Navigate to `voicelegal-ai-web-extension/extension` folder
   - Click "Select Folder"

3. **Verify:**
   - Extension appears in list as "VoiceLegal AI"
   - Icon appears in toolbar

4. **Test:**
   - Visit [Netflix Terms](https://brand.netflix.com/en/terms/)
   - Look for floating 🔍 button (bottom-right)
   - Click "Analyze This Page"
   - Analysis appears in sidebar
   - Click "Open Voice Assistant" → Dashboard opens with pre-loaded context

---

## 📖 Usage Guide

### **Using the Web Dashboard**

1. Visit https://voicelegal-ai-web-extension.vercel.app
2. Upload PDF (Terms, Privacy Policy, Contract, etc.)
3. Review AI analysis:
   - Executive Summary
   - Key Terms
   - Risk Assessment (🔴 HIGH / 🟡 MEDIUM / 🟢 LOW)
   - Consumer Warnings
   - Hidden Clauses
4. Click "Start Voice Chat"
5. **Grant microphone permission**
6. Ask questions naturally:
   - *"What are the high-risk clauses?"*
   - *"Explain the cancellation policy"*
   - *"Are there hidden fees?"*

### **Using the Chrome Extension**

1. Navigate to any legal page (terms, privacy policy)
2. Extension auto-detects page
3. Click floating button
4. Read inline analysis
5. Click "Open Voice Assistant" for Q&A

---

## 📁 Project Structure

```
voicelegal-ai-web-extension/
├── backend/
│   ├── app/
│   │   └── main.py              # FastAPI app + all endpoints
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── VoiceAssistant.jsx
│   │   │   └── [other components]
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json
│
├── extension/
│   ├── manifest.json            # Extension config (Manifest V3)
│   ├── src/
│   │   ├── background/
│   │   │   └── background.js    # Service worker (API proxy)
│   │   ├── content/
│   │   │   └── content.js       # Page interaction & analysis
│   │   └── popup/
│   │       └── popup.js         # Extension popup
│   └── icons/                   # Extension icons
│
└── README.md
```

---

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/analyze` | POST | Analyze uploaded PDF |
| `/api/analyze-text` | POST | Analyze text from extension |
| `/api/store-temp-analysis` | POST | Store analysis for extension→dashboard transfer |
| `/api/get-temp-analysis/{id}` | GET | Retrieve stored analysis |
| `/api/store-document-context` | POST | Store context for voice assistant |
| `/api/webhook/get-document-analysis` | POST | ElevenLabs webhook for voice agent |

---

## 🔧 Configuration

### Backend Environment Variables
```env
GOOGLE_CLOUD_PROJECT=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=../key.json
```

### Frontend Environment Variables
```env
# Production (.env.production)
VITE_API_URL=https://voicelegal-api-web-extension.onrender.com
VITE_ELEVENLABS_AGENT_ID=agent_2401kcash9gqejx8t67n3prbe2nv

# Development (.env.development.local)
VITE_API_URL=http://localhost:8000
VITE_ELEVENLABS_AGENT_ID=agent_2401kcash9gqejx8t67n3prbe2nv
```

### Extension Configuration
Update URLs in `extension/src/content/content.js` and `extension/src/background/background.js`:
```javascript
const API_URL = 'https://voicelegal-api-web-extension.onrender.com';
const DASHBOARD_URL = 'https://voicelegal-ai-web-extension.vercel.app';
```

---

## 🚧 Technical Challenges Solved

1. **Chrome Extension CORS** - Background script API proxy pattern
2. **Cross-domain data transfer** - Backend UUID-based temporary storage
3. **Service worker lifecycle** - Keepalive heartbeat + retry logic
4. **ElevenLabs webhook** - Cloud-hosted backend for public URL access
5. **Real-time voice context** - Document storage with conversation ID mapping

---

## 🎥 Demo Video

[Watch on YouTube](#) *(Link to be added)*

---

## 🏆 Hackathon Details

**Event:** AI Partner Catalyst: Accelerate Innovation  
**Challenge:** ElevenLabs Challenge  
**Submission Date:** December 2025  
**Team:** Varun Sonawane, Neeha Agrawal

---

## 🛣️ Roadmap

**Planned Features:**
- [ ] Multi-language support (Spanish, French, German)
- [ ] Firefox extension port
- [ ] Save analysis history
- [ ] Share analysis links
- [ ] Document comparison mode
- [ ] Mobile app (iOS/Android)
- [ ] Enterprise contract review version
- [ ] DocuSign/HelloSign integration

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **Google Cloud** - Vertex AI & Gemini 2.0 Flash
- **ElevenLabs** - Conversational AI technology
- **AI Partner Catalyst Hackathon** - Opportunity to build
- **Open Source Community** - FastAPI, React, Vite

---

## 📧 Contact

### **Varun Sonawane**
- Email: vsonawa23@gmail.com
- LinkedIn: [linkedin.com/in/varun-sonawane](https://www.linkedin.com/in/varun-sonawane/)
- GitHub: [@varunsonawane](https://github.com/varunsonawane)

### **Neeha Agrawal**
- Email: neagra@iu.edu
- LinkedIn: [linkedin.com/in/neeha-agrawal](https://www.linkedin.com/in/neeha-agrawal/)
- GitHub: [@neagra12](https://github.com/neagra12)

---

## ⚠️ Disclaimer

**VoiceLegal AI is an educational tool** and should not replace professional legal advice. Always consult a qualified attorney for important legal matters.

---

<div align="center">

**Built with ❤️ for AI Partner Catalyst Hackathon 2025**

[🔗 Live Demo](https://voicelegal-ai-web-extension.vercel.app) • [📥 Install Extension](#-installing-the-chrome-extension) • [📧 Contact](#-contact)

</div>
