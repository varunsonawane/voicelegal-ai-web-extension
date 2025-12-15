// Configuration - Update these URLs
const API_URL = 'http://localhost:8000';
const DASHBOARD_URL = 'http://localhost:5173';
const ELEVENLABS_AGENT_ID = 'agent_2401kcash9gqejx8t67n3prbe2nv'; // Your ElevenLabs Agent ID

// Detect if page is Terms & Conditions or Privacy Policy
function detectLegalPage() {
  const title = document.title.toLowerCase();
  const url = window.location.href.toLowerCase();
  const keywords = ['terms', 'conditions', 'privacy', 'policy', 'legal', 'agreement', 'eula', 'license'];
  
  return keywords.some(keyword => title.includes(keyword) || url.includes(keyword));
}

// Show floating button on legal pages
if (detectLegalPage()) {
  createFloatingButton();
}

function createFloatingButton() {
  const existingButton = document.getElementById('voicelegal-float-btn');
  if (existingButton) {
    existingButton.remove();
  }

  const button = document.createElement('div');
  button.id = 'voicelegal-float-btn';
  button.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 999999;
      transition: all 0.3s;
    ">
      <span style="font-size: 30px;">⚖️</span>
    </div>
  `;
  
  const innerDiv = button.querySelector('div');
  innerDiv.addEventListener('mouseenter', () => {
    innerDiv.style.transform = 'scale(1.1)';
  });
  innerDiv.addEventListener('mouseleave', () => {
    innerDiv.style.transform = 'scale(1)';
  });
  
  button.addEventListener('click', () => {
    analyzeCurrentPage();
  });
  
  document.body.appendChild(button);
}

function analyzeCurrentPage() {
  showLoadingModal();
  const pageText = document.body.innerText;
  
  chrome.runtime.sendMessage({
    action: 'analyzePage',
    text: pageText.substring(0, 15000),
    url: window.location.href,
    title: document.title
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error sending message:', chrome.runtime.lastError);
      showError('Failed to connect to extension. Please reload the page.');
    }
  });
}

function showLoadingModal() {
  const existingModal = document.getElementById('voicelegal-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'voicelegal-modal';
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 1000000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div style="
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <h2 style="margin-bottom: 20px; color: #667eea; font-size: 24px;">Analyzing Document...</h2>
        <div style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: voicelegal-spin 1s linear infinite;
          margin: 0 auto;
        "></div>
        <p style="margin-top: 15px; color: #666; font-size: 14px;">This may take a few moments...</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  if (!document.getElementById('voicelegal-spin-style')) {
    const style = document.createElement('style');
    style.id = 'voicelegal-spin-style';
    style.textContent = `
      @keyframes voicelegal-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function showError(message) {
  const modal = document.getElementById('voicelegal-modal');
  if (modal) modal.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.id = 'voicelegal-error';
  errorDiv.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fee;
      color: #c33;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000001;
      max-width: 300px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div>
          <strong style="display: block; margin-bottom: 8px;">⚠️ Error</strong>
          <p style="margin: 0; font-size: 14px;">${message}</p>
        </div>
        <button id="voicelegal-error-close" style="
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #c33;
          padding: 0;
          margin-left: 10px;
        ">✕</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(errorDiv);
  
  document.getElementById('voicelegal-error-close').addEventListener('click', () => {
    errorDiv.remove();
  });
  
  setTimeout(() => {
    if (errorDiv && errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showAnalysis') {
    const modal = document.getElementById('voicelegal-modal');
    if (modal) modal.remove();
    
    if (request.data && request.data.analysis) {
      showAnalysisSidebar(request.data);
    } else {
      showError('No analysis data received. Please try again.');
    }
    
    sendResponse({ received: true });
  }
  return true;
});

function showAnalysisSidebar(data) {
  const existingSidebar = document.getElementById('voicelegal-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }

  const analysis = data.analysis || 'Analysis complete!';
  
  const sidebar = document.createElement('div');
  sidebar.id = 'voicelegal-sidebar';
  sidebar.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      right: 0;
      width: 450px;
      height: 100%;
      background: white;
      box-shadow: -5px 0 15px rgba(0,0,0,0.3);
      z-index: 1000000;
      overflow-y: auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      animation: voicelegal-slide-in 0.3s ease-out;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="color: #667eea; margin: 0; font-size: 20px;">⚖️ VoiceLegal Analysis</h2>
        <button id="voicelegal-close-sidebar" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          transition: all 0.2s;
        ">✕</button>
      </div>
      
      <div style="
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        white-space: pre-wrap;
        color: #333;
        font-size: 14px;
        line-height: 1.6;
        max-height: 300px;
        overflow-y: auto;
      ">
        ${analysis}
      </div>
      
      <!-- Voice Assistant Section -->
<div style="
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
  margin-top: 20px;
">
  <h3 style="
    color: #667eea;
    font-size: 16px;
    margin-bottom: 15px;
    font-weight: 600;
  ">
    🎤 Ask Questions with Voice
  </h3>
  
  <p style="
    font-size: 13px;
    color: #666;
    margin-bottom: 15px;
    line-height: 1.5;
  ">
    Open the full dashboard to use our advanced voice assistant and ask any questions about this document.
  </p>

  <button id="voicelegal-voice-btn" style="
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  ">
    <span style="font-size: 20px;">🎤</span>
    <span>Open Voice Assistant</span>
  </button>

  <p style="
    margin-top: 12px;
    font-size: 11px;
    color: #999;
    text-align: center;
  ">
    Voice chat works best in the full dashboard
  </p>
</div>
      
      <button id="voicelegal-open-dashboard" style="
        width: 100%;
        padding: 15px;
        margin-top: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      ">
        Open Full Dashboard
      </button>
    </div>
  `;
  
  document.body.appendChild(sidebar);
  
  if (!document.getElementById('voicelegal-slide-style')) {
    const style = document.createElement('style');
    style.id = 'voicelegal-slide-style';
    style.textContent = `
      @keyframes voicelegal-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize voice assistant
  initializeVoiceAssistant(data);
  
  // Close button
  const closeBtn = document.getElementById('voicelegal-close-sidebar');
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = '#f0f0f0';
  });
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
  });
  closeBtn.addEventListener('click', () => {
    sidebar.remove();
  });
  
  // Dashboard button
  const dashboardBtn = document.getElementById('voicelegal-open-dashboard');
  dashboardBtn.addEventListener('mouseenter', () => {
    dashboardBtn.style.transform = 'translateY(-2px)';
    dashboardBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
  });
  dashboardBtn.addEventListener('mouseleave', () => {
    dashboardBtn.style.transform = 'translateY(0)';
    dashboardBtn.style.boxShadow = 'none';
  });
  dashboardBtn.addEventListener('click', () => {
    window.open(DASHBOARD_URL, '_blank');
  });
}


function initializeVoiceAssistant(data) {
  const btn = document.getElementById('voicelegal-voice-btn');
  if (!btn) {
    console.error('Voice button not found!');
    return;
  }

  console.log('Setting up voice button with data:', data);

  btn.addEventListener('click', async () => {
  console.log('Voice button clicked, sending to background script...');
  
  const btnText = btn.querySelector('span:last-child');
  const originalText = btnText.textContent;
  btnText.textContent = 'Preparing...';
  btn.disabled = true;
  
  const extensionData = {
    analysis: data.analysis,
    url: data.url || window.location.href,
    title: data.title || document.title
  };
  
  console.log('Sending to background script:', extensionData);
  
  // Retry function
  const sendWithRetry = (retries = 3) => {
    return new Promise((resolve, reject) => {
      const attemptSend = (attemptsLeft) => {
        console.log(`Attempt ${4 - attemptsLeft} of 3...`);
        
        chrome.runtime.sendMessage({
          action: 'storeTempAnalysis',
          data: extensionData
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Chrome runtime error:', chrome.runtime.lastError);
            
            if (attemptsLeft > 0) {
              console.log(`Retrying... (${attemptsLeft} attempts left)`);
              setTimeout(() => attemptSend(attemptsLeft - 1), 1000);
            } else {
              reject(new Error(chrome.runtime.lastError.message));
            }
            return;
          }
          
          resolve(response);
        });
      };
      
      attemptSend(retries);
    });
  };
  
  try {
    const response = await sendWithRetry(3);
    console.log('Background script response:', response);
    
    if (response && response.success) {
      console.log('Analysis ID:', response.analysis_id);
      const dashboardUrl = `${DASHBOARD_URL}?analysis_id=${response.analysis_id}`;
      console.log('Opening:', dashboardUrl);
      window.open(dashboardUrl, '_blank');
      btnText.textContent = originalText;
      btn.disabled = false;
    } else {
      throw new Error(response?.error || 'Failed to store analysis');
    }
  } catch (error) {
    console.error('Final error after retries:', error);
    alert('Error: ' + error.message + '\n\nPlease try again.');
    btnText.textContent = originalText;
    btn.disabled = false;
  }
});

  btn.addEventListener('mouseenter', () => {
    if (!btn.disabled) {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
    }
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = 'none';
  });
}


function injectPageScript() {
  // Check if already injected
  if (document.getElementById('voicelegal-injected-script')) {
    console.log('Script already injected');
    return;
  }

  const script = document.createElement('script');
  script.id = 'voicelegal-injected-script';
  script.src = chrome.runtime.getURL('src/content/injected.js');
  script.onload = () => {
    console.log('✓ Injected script loaded');
  };
  script.onerror = (error) => {
    console.error('Failed to load injected script:', error);
  };
  
  (document.head || document.documentElement).appendChild(script);
}

function updateVoiceUI(data) {
  const btn = document.getElementById('voicelegal-voice-btn');
  const btnText = document.getElementById('voicelegal-voice-btn-text');
  const statusDiv = document.getElementById('voicelegal-voice-status');
  const statusText = document.getElementById('voicelegal-status-text');
  const conversationContainer = document.getElementById('voicelegal-conversation-container');
  
  if (!btn || !btnText) return;
  
  switch (data.status) {
    case 'connecting':
      btnText.textContent = 'Connecting...';
      btn.disabled = true;
      break;
      
    case 'connected':
      btnText.textContent = 'End Conversation';
      btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      btn.disabled = false;
      statusDiv.style.display = 'block';
      statusText.textContent = '🎙️ Listening... Speak your question';
      conversationContainer.style.display = 'block';
      addVoiceMessage('system', '✓ Connected! Ask me anything about this document.');
      break;
      
    case 'disconnected':
      btnText.textContent = 'Talk to Voice Agent';
      btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      btn.disabled = false;
      statusDiv.style.display = 'none';
      addVoiceMessage('system', '✓ Conversation ended');
      break;
      
    case 'message':
      if (data.message) {
        addVoiceMessage('agent', data.message);
      }
      break;
      
    case 'error':
      btnText.textContent = 'Talk to Voice Agent';
      btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      btn.disabled = false;
      statusDiv.style.display = 'none';
      addVoiceMessage('error', data.error || 'Connection failed');
      break;
  }
}

function addVoiceMessage(type, text) {
  const messagesDiv = document.getElementById('voicelegal-messages');
  if (!messagesDiv) return;

  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    margin-bottom: 12px;
    padding: 10px;
    border-radius: 8px;
    ${type === 'agent' ? 'background: #667eea; color: white;' : ''}
    ${type === 'system' ? 'background: #e5e7eb; color: #374151; font-style: italic;' : ''}
    ${type === 'error' ? 'background: #fee; color: #c33;' : ''}
  `;
  messageDiv.textContent = text;
  messagesDiv.appendChild(messageDiv);

  messagesDiv.parentElement.scrollTop = messagesDiv.parentElement.scrollHeight;
}

console.log('VoiceLegal AI content script loaded');