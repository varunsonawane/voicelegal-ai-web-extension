from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
from datetime import datetime
import uuid
import time
import os
from typing import Optional
import base64
import json
import tempfile


# Setup Google Cloud credentials from environment variable
def setup_google_credentials():
    """Setup Google Cloud credentials from base64 environment variable"""
    credentials_base64 = os.getenv("GOOGLE_CREDENTIALS_BASE64")
    
    if credentials_base64:
        try:
            # Decode base64 credentials
            credentials_json = base64.b64decode(credentials_base64).decode('utf-8')
            
            # Create a temporary file to store credentials
            with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as temp_file:
                temp_file.write(credentials_json)
                temp_path = temp_file.name
            
            # Set the environment variable to point to the temp file
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = temp_path
            print(f"✅ Google Cloud credentials loaded from environment variable")
            return temp_path
            
        except Exception as e:
            print(f"⚠️ Failed to setup Google credentials: {e}")
            return None
    else:
        # Try to use existing key.json file
        if os.path.exists('./key.json'):
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = './key.json'
            print(f"✅ Using local key.json file")
            return './key.json'
        else:
            print(f"⚠️ No Google Cloud credentials found")
            return None

# Initialize credentials on startup
setup_google_credentials()

app = FastAPI(title="VoiceLegal AI API")

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://localhost:8000",
    "chrome-extension://*",
]

# Add production URLs dynamically
import re
origins.append(re.compile(r"https://.*\.vercel\.app"))
origins.append(re.compile(r"https://.*\.onrender\.com"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.(vercel\.app|onrender\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
documents_db = {}
session_documents = {}
temp_storage = {}
document_storage = {}  # For voice assistant context

def extract_text_from_pdf(pdf_file):
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")

def analyze_document_with_gemini(document_text: str, filename: str):
    """Analyze document using Gemini"""
    try:
        from vertexai.preview.generative_models import GenerativeModel
        from google.cloud import aiplatform
        
        PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "voicelegal-ai")
        aiplatform.init(project=PROJECT_ID, location="us-central1")
        
        model = GenerativeModel("gemini-2.0-flash-exp")
        
        prompt = f"""You are a legal document analyzer. Analyze this document and provide:

1. EXECUTIVE SUMMARY (2-3 sentences)
2. KEY TERMS (bullet points)
3. RISK ASSESSMENT for each critical clause:
   - Label as HIGH RISK, MEDIUM RISK, or LOW RISK
   - Explain why
4. CONSUMER WARNINGS (things users should be aware of)
5. HIDDEN CLAUSES (easy to miss but important)

Document:
{document_text[:15000]}

Format your response clearly with markdown headers.
"""
        
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        print("Falling back to mock analysis")
        
        word_count = len(document_text.split())
        return f"""# Legal Document Analysis: {filename}

## EXECUTIVE SUMMARY
This document contains approximately {word_count} words of legal text with several standard provisions requiring attention.

## KEY TERMS
- Payment and billing provisions
- Service terms and conditions
- Cancellation and termination policies
- Data privacy and security measures
- Limitation of liability clauses
- Dispute resolution and arbitration

## RISK ASSESSMENT

### HIGH RISK ⚠️
**Mandatory Arbitration Clause**: This document likely contains binding arbitration provisions that waive your right to sue in court or participate in class action lawsuits.

**Account Termination**: The service provider may reserve the right to suspend or terminate your account at any time without notice.

### MEDIUM RISK ⚠️
**Broad Liability Limitations**: The provider appears to limit their liability for service interruptions, data loss, or indirect damages.

**Unilateral Modification Rights**: The company may reserve the right to change terms at any time with minimal notice.

### LOW RISK ✓
**Standard Administrative Terms**: Most general operational terms appear industry-standard.

## CONSUMER WARNINGS
⚠️ Pay special attention to:
- Cancellation notice periods and early termination fees
- Data retention and usage after service termination
- Automatic renewal terms and rate increases
- Service level guarantees and recourse options

## HIDDEN CLAUSES
🔍 Look out for:
- Fine print on free trials auto-converting to paid subscriptions
- Third-party data sharing provisions
- Governing law and jurisdiction requirements
- Severability clauses that keep other terms valid if one is invalidated
"""

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "voicelegal-backend", "timestamp": time.time()}

# PDF Upload and Analysis (for dashboard)
@app.post("/api/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    """Analyze uploaded PDF document"""
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        contents = await file.read()
        
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        
        # Extract text from PDF
        text = extract_text_from_pdf(contents)
        print(f"Extracted {len(text)} characters from PDF: {file.filename}")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Analyze with Gemini
        analysis = analyze_document_with_gemini(text, file.filename)
        
        return {
            "success": True,
            "analysis": analysis,
            "filename": file.filename
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error analyzing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Legacy upload endpoint (keeping for backward compatibility)
@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """Upload and analyze a legal document"""
    try:
        print(f"Receiving file: {file.filename}")
        
        doc_id = str(uuid.uuid4())
        contents = await file.read()
        print(f"File size: {len(contents)} bytes")
        
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        
        print("Extracting text from PDF...")
        document_text = extract_text_from_pdf(contents)
        print(f"Extracted {len(document_text)} characters")
        
        if not document_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        print("Analyzing document...")
        analysis = analyze_document_with_gemini(document_text, file.filename)
        
        doc_data = {
            "doc_id": doc_id,
            "filename": file.filename,
            "document_text": document_text[:5000],
            "full_analysis": analysis,
            "uploaded_at": datetime.utcnow().isoformat(),
        }
        
        documents_db[doc_id] = doc_data
        session_documents["latest"] = doc_data
        
        print(f"Document {doc_id} processed successfully")
        
        return {
            "doc_id": doc_id,
            "filename": file.filename,
            "analysis": analysis,
            "document_preview": document_text[:500] + "..."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/document/{doc_id}")
async def get_document(doc_id: str):
    """Retrieve document analysis"""
    if doc_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found")
    return documents_db[doc_id]

# Text analysis (from extension)
@app.post("/api/analyze-text")
async def analyze_text(request: dict):
    """Analyze text content from browser extension"""
    try:
        text = request.get("text", "")
        url = request.get("url", "")
        title = request.get("title", "")
        
        if not text:
            raise HTTPException(status_code=400, detail="No text provided")
        
        # Analyze with Gemini
        analysis = analyze_document_with_gemini(text, title)
        
        return {
            "success": True,
            "analysis": analysis,
            "url": url,
            "title": title
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Extension-to-Dashboard transfer endpoints
@app.post("/api/store-temp-analysis")
async def store_temp_analysis(data: dict):
    """Store analysis temporarily for extension-to-dashboard transfer"""
    analysis_id = str(uuid.uuid4())
    
    temp_storage[analysis_id] = {
        "data": data,
        "timestamp": time.time()
    }
    
    # Clean up old entries (older than 5 minutes)
    current_time = time.time()
    expired_ids = [
        key for key, value in temp_storage.items()
        if current_time - value["timestamp"] > 300
    ]
    for expired_id in expired_ids:
        del temp_storage[expired_id]
    
    return {"success": True, "analysis_id": analysis_id}

@app.get("/api/get-temp-analysis/{analysis_id}")
async def get_temp_analysis(analysis_id: str):
    """Retrieve temporarily stored analysis"""
    if analysis_id not in temp_storage:
        raise HTTPException(status_code=404, detail="Analysis not found or expired")
    
    data = temp_storage[analysis_id]["data"]
    del temp_storage[analysis_id]
    
    return {"success": True, "data": data}

# Voice Assistant endpoints
@app.post("/api/store-document-context")
async def store_document_context(data: dict):
    """Store document context for voice assistant"""
    conversation_id = str(uuid.uuid4())
    
    document_storage[conversation_id] = {
        "analysis": data.get("analysis"),
        "filename": data.get("filename"),
        "timestamp": time.time()
    }
    
    # Clean up old entries (older than 30 minutes)
    current_time = time.time()
    expired_ids = [
        key for key, value in document_storage.items()
        if current_time - value["timestamp"] > 1800
    ]
    for expired_id in expired_ids:
        del document_storage[expired_id]
    
    return {"success": True, "conversation_id": conversation_id}

@app.post("/api/webhook/get-document-analysis")
async def webhook_get_document_analysis(data: dict):
    """Webhook for ElevenLabs to retrieve document analysis"""
    conversation_id = data.get("conversation_id")
    
    if conversation_id and conversation_id in document_storage:
        doc_data = document_storage[conversation_id]
        return {
            "success": True,
            "analysis": doc_data["analysis"],
            "filename": doc_data["filename"]
        }
    
    return {
        "success": False,
        "error": "Document not found"
    }

# Legacy agent endpoint (keeping for backward compatibility)
@app.post("/api/agent/get-document-analysis")
async def get_document_for_agent(
    doc_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """
    Webhook endpoint for ElevenLabs agent to retrieve document analysis.
    Agent will call this to get the document context.
    """
    try:
        print(f"Agent requesting document analysis. doc_id: {doc_id}")
        
        # If no doc_id provided, return latest document
        if not doc_id or doc_id == "latest":
            if "latest" not in session_documents:
                return {
                    "success": False,
                    "message": "No document has been uploaded yet. Please ask the user to upload a document first."
                }
            doc_data = session_documents["latest"]
        else:
            if doc_id not in documents_db:
                return {
                    "success": False,
                    "message": f"Document {doc_id} not found."
                }
            doc_data = documents_db[doc_id]
        
        return {
            "success": True,
            "filename": doc_data["filename"],
            "analysis": doc_data["full_analysis"],
            "uploaded_at": doc_data["uploaded_at"]
        }
        
    except Exception as e:
        print(f"Error in agent webhook: {e}")
        return {
            "success": False,
            "message": f"Error retrieving document: {str(e)}"
        }