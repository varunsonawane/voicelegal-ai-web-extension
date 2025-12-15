class VoiceAssistant {
  constructor(analysisData, containerId) {
    this.analysisData = analysisData;
    this.containerId = containerId;
    this.agentId = 'agent_2401kcash9gqejx8t67n3prbe2nv'; // Replace with your ElevenLabs Agent ID
    this.isConnected = false;
    this.conversation = null;
  }

  async init() {
    // Load ElevenLabs SDK
    await this.loadElevenLabsSDK();
    
    // Store analysis in chrome storage for agent access
    await this.storeAnalysis();
    
    // Render UI
    this.render();
  }

  async loadElevenLabsSDK() {
    return new Promise((resolve, reject) => {
      if (window.ElevenLabs) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://elevenlabs.io/convai-widget/index.js';
      script.async = true;
      script.onload = () => {
        console.log('ElevenLabs SDK loaded');
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async storeAnalysis() {
    // Store in chrome.storage so the webhook can access it
    const storageData = {
      analysis: this.analysisData.analysis,
      url: this.analysisData.url,
      title: this.analysisData.title,
      timestamp: Date.now()
    };
    
    await chrome.storage.local.set({ latestAnalysis: storageData });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const voiceSection = document.createElement('div');
    voiceSection.id = 'voicelegal-voice-section';
    voiceSection.innerHTML = `
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
        
        <div id="voicelegal-voice-status" style="
          padding: 12px;
          background: #f0f4ff;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 13px;
          color: #667eea;
          display: none;
        ">
          <span id="voicelegal-status-text">Ready to chat</span>
        </div>

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
          <span id="voicelegal-voice-btn-text">Talk to Voice Agent</span>
        </button>

        <div id="voicelegal-conversation-container" style="
          margin-top: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          min-height: 100px;
          max-height: 300px;
          overflow-y: auto;
          display: none;
          font-size: 14px;
          line-height: 1.6;
        ">
          <div id="voicelegal-messages"></div>
        </div>

        <p style="
          margin-top: 12px;
          font-size: 12px;
          color: #666;
          text-align: center;
        ">
          Click the button and ask anything about this document
        </p>
      </div>
    `;

    container.appendChild(voiceSection);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const btn = document.getElementById('voicelegal-voice-btn');
    const btnText = document.getElementById('voicelegal-voice-btn-text');
    const statusDiv = document.getElementById('voicelegal-voice-status');
    const statusText = document.getElementById('voicelegal-status-text');

    btn.addEventListener('click', async () => {
      if (!this.isConnected) {
        await this.startConversation();
      } else {
        this.endConversation();
      }
    });

    // Hover effects
    btn.addEventListener('mouseenter', () => {
      if (!this.isConnected) {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
      }
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = 'none';
    });
  }

  async startConversation() {
    const btn = document.getElementById('voicelegal-voice-btn');
    const btnText = document.getElementById('voicelegal-voice-btn-text');
    const statusDiv = document.getElementById('voicelegal-voice-status');
    const statusText = document.getElementById('voicelegal-status-text');
    const conversationContainer = document.getElementById('voicelegal-conversation-container');
    const messagesDiv = document.getElementById('voicelegal-messages');

    try {
      btnText.textContent = 'Connecting...';
      btn.disabled = true;

      // Initialize ElevenLabs Conversation
      if (!window.ElevenLabs) {
        throw new Error('ElevenLabs SDK not loaded');
      }

      const ElevenLabs = window.ElevenLabs;
      
      this.conversation = await ElevenLabs.Conversation.startSession({
        agentId: this.agentId,
        onConnect: () => {
          console.log('Connected to voice agent');
          this.isConnected = true;
          btnText.textContent = 'End Conversation';
          btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
          btn.disabled = false;
          
          statusDiv.style.display = 'block';
          statusText.textContent = '🎙️ Listening... Speak your question';
          conversationContainer.style.display = 'block';
          
          this.addMessage('system', '✓ Connected! Ask me anything about this document.');
        },
        onDisconnect: () => {
          console.log('Disconnected from voice agent');
          this.handleDisconnect();
        },
        onMessage: (message) => {
          console.log('Agent message:', message);
          if (message.type === 'assistant') {
            this.addMessage('agent', message.text || message.message);
          }
        },
        onError: (error) => {
          console.error('Voice agent error:', error);
          this.addMessage('error', `Error: ${error.message}`);
        }
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
      btnText.textContent = 'Talk to Voice Agent';
      btn.disabled = false;
      this.addMessage('error', `Failed to connect: ${error.message}`);
    }
  }

  endConversation() {
    if (this.conversation) {
      this.conversation.endSession();
    }
    this.handleDisconnect();
  }

  handleDisconnect() {
    this.isConnected = false;
    const btn = document.getElementById('voicelegal-voice-btn');
    const btnText = document.getElementById('voicelegal-voice-btn-text');
    const statusDiv = document.getElementById('voicelegal-voice-status');

    btnText.textContent = 'Talk to Voice Agent';
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    btn.disabled = false;
    statusDiv.style.display = 'none';

    this.addMessage('system', '✓ Conversation ended');
  }

  addMessage(type, text) {
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

    // Scroll to bottom
    messagesDiv.parentElement.scrollTop = messagesDiv.parentElement.scrollHeight;
  }
}

// Export for use in content.js
window.VoiceAssistant = VoiceAssistant;