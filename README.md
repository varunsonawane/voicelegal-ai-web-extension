⚖️ VoiceLegal AI

> AI-Powered Legal Document Analysis with Voice Interaction

VoiceLegal AI is an intelligent legal document assistant that analyzes complex legal documents and provides insights through natural voice conversation. Built for the AI Partner Catalyst Hackathon 2025.

![VoiceLegal AI Banner](https://via.placeholder.com/1200x400/2563eb/ffffff?text=VoiceLegal+AI)

## 🌟 Features

- 📄 **Smart Document Upload** - Drag-and-drop PDF documents for instant analysis
- 🤖 **AI-Powered Analysis** - Powered by Google Cloud Vertex AI (Gemini 2.0 Flash)
- 🎤 **Voice Interaction** - Ask questions naturally using ElevenLabs Conversational AI
- ⚡ **Real-Time Processing** - Get comprehensive analysis in seconds
- 🎯 **Risk Assessment** - Automatically identifies HIGH, MEDIUM, and LOW risk clauses
- 🔍 **Hidden Clause Detection** - Uncovers easy-to-miss terms and conditions
- 💬 **Natural Q&A** - Voice assistant that understands your document context
- 🔒 **Secure** - Documents are processed securely and not permanently stored

## 🎯 Use Cases

- **Terms & Conditions** - Understand what you're agreeing to
- **Privacy Policies** - Know how your data is being used
- **Service Agreements** - Identify obligations and commitments
- **Employment Contracts** - Review clauses and terms
- **Rental Agreements** - Spot unfavorable conditions
- **Insurance Policies** - Decode complex legal language

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **ElevenLabs React SDK** - Voice interaction

### Backend
- **Python 3.12+** - Core language
- **FastAPI** - High-performance API framework
- **Google Cloud Vertex AI** - Gemini 2.0 Flash for document analysis
- **Google Cloud Firestore** - Document storage (optional)
- **PyPDF2** - PDF text extraction

### AI & Voice
- **Google Cloud Vertex AI (Gemini 2.0 Flash)** - Document analysis and natural language processing
- **ElevenLabs Conversational AI** - Voice-based question answering

## 🚀 Getting Started

### Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- Google Cloud account with Vertex AI enabled
- ElevenLabs account with Conversational AI access

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/neagra12/voicelegal-ai.git
cd voicelegal-ai
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env and add your credentials:
# GOOGLE_CLOUD_PROJECT=your_project_id
# GOOGLE_APPLICATION_CREDENTIALS=../key.json
# GCS_BUCKET_NAME=your_bucket_name
# ELEVENLABS_API_KEY=your_api_key
```

**Add your Google Cloud service account key:**
- Download your service account key from Google Cloud Console
- Save it as `key.json` in the project root directory

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Edit .env and add:
# VITE_BACKEND_URL=http://localhost:8000
# VITE_ELEVENLABS_AGENT_ID=your_agent_id
```

#### 4. ElevenLabs Agent Setup

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io)
2. Navigate to **Conversational AI** → **Agents**
3. Create a new agent named "VoiceLegal Assistant"
4. Configure the agent:
   - **LLM**: Select "Gemini 2.5 Flash"
   - **Voice**: Choose a professional voice (e.g., Rachel, Chris)
   - **System Prompt**:
```
   You are VoiceLegal AI, a friendly legal document assistant.

   When a user asks about their uploaded document, ALWAYS use the get_document_analysis tool FIRST to retrieve the document analysis before answering any questions.

   After retrieving the analysis:
   - Summarize key points naturally
   - Answer specific questions based on the analysis
   - Point out HIGH RISK, MEDIUM RISK, and LOW RISK items
   - Explain clauses in simple language
   - Be conversational and helpful

   Important: Always call get_document_analysis when the user asks about their document before answering questions.
```

5. **Add Webhook Tool**:
   - Tool Name: `get_document_analysis`
   - Description: `Retrieves the complete analysis of the legal document that the user just uploaded. Call this tool whenever the user asks questions about their document.`
   - Method: `POST`
   - URL: `https://your-ngrok-url.ngrok.io/api/agent/get-document-analysis`
   - Body Parameters: Leave empty (defaults to latest document)

6. Copy your **Agent ID** and add it to `frontend/.env`

#### 5. Expose Backend with ngrok (for ElevenLabs webhook)
```bash
# Install ngrok: https://ngrok.com/download

# Expose port 8000
ngrok http 8000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Update the webhook URL in your ElevenLabs agent configuration
```

### Running the Application

#### Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload --port 8000
```

Backend will run on: `http://localhost:8000`

#### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 📖 Usage

1. **Open the application** at `http://localhost:5173`
2. **Upload a PDF** document (Terms & Conditions, Privacy Policy, Contract, etc.)
3. **Review the AI analysis** showing:
   - Executive Summary
   - Key Terms
   - Risk Assessment (HIGH/MEDIUM/LOW)
   - Consumer Warnings
   - Hidden Clauses
4. **Click "Start Voice Chat"** to interact with the voice assistant
5. **Ask questions** like:
   - "What are the high-risk clauses?"
   - "Explain the cancellation policy"
   - "Are there any hidden fees?"
   - "What should I watch out for?"

## 📁 Project Structure
```
voicelegal-ai/
├── backend/
│   ├── app/
│   │   └── main.py              # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   └── .env.example             # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── DocumentAnalysis.jsx
│   │   │   └── VoiceAssistant.jsx
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── package.json             # Node dependencies
│   └── .env.example             # Environment template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🎥 Demo

[Add screenshots or video demo here]

### Upload Interface
![Upload Interface](https://via.placeholder.com/800x500/3b82f6/ffffff?text=Upload+Interface)

### Document Analysis
![Document Analysis](https://via.placeholder.com/800x500/8b5cf6/ffffff?text=Document+Analysis)

### Voice Assistant
![Voice Assistant](https://via.placeholder.com/800x500/10b981/ffffff?text=Voice+Assistant)

## 🏆 Hackathon Information

**Event**: AI Partner Catalyst: Accelerate Innovation  
**Challenge**: ElevenLabs Challenge  
**Dates**: December 2025  
**Team**: Varun Neeha Agrawal

### Judging Criteria Alignment

1. **Technological Implementation** ✅
   - Integrates Google Cloud Vertex AI (Gemini 2.0 Flash)
   - Uses ElevenLabs Conversational AI with custom webhooks
   - FastAPI backend with efficient PDF processing
   - React frontend with real-time updates

2. **Design** ✅
   - Modern, intuitive UI with Tailwind CSS
   - Smooth animations and transitions
   - Mobile-responsive design
   - Clear visual hierarchy with risk indicators

3. **Potential Impact** ✅
   - Helps consumers understand complex legal documents
   - Democratizes legal knowledge
   - Prevents predatory agreements
   - Saves time and potential legal issues

4. **Quality of the Idea** ✅
   - Solves a real-world problem
   - Unique voice-first approach to legal documents
   - Combines document analysis with natural conversation
   - Accessible to non-legal professionals

## 🛣️ Roadmap

- [ ] Multi-language document support
- [ ] Document comparison feature
- [ ] Export analysis as PDF
- [ ] User accounts and document history
- [ ] Mobile app (iOS/Android)
- [ ] Integration with popular cloud storage (Google Drive, Dropbox)
- [ ] Advanced clause extraction with citations
- [ ] Legal precedent matching

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Cloud** for Vertex AI and Gemini API
- **ElevenLabs** for Conversational AI technology
- **AI Partner Catalyst Hackathon** for the opportunity
- **FastAPI** and **React** communities for excellent tools

## 📧 Contact

**Varun Neeha Agrawal**  
- Email: neagra@iu.edu vsonawanane@iu.edu
- LinkedIn: [Neeha Agrawal](https://www.linkedin.com/in/neeha-agrawal/)

## ⚠️ Disclaimer

VoiceLegal AI is an educational tool and should not replace professional legal advice. Always consult with a qualified attorney for important legal matters.

---

Built with ❤️ for AI Partner Catalyst Hackathon 2025
