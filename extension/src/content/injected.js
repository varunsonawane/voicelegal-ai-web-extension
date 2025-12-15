// This script runs in the page context
(function() {
  console.log('VoiceLegal injected script loaded');
  
  let widgetInitialized = false;
  
  // Listen for widget initialization request
  window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    if (event.data.type !== 'VOICELEGAL_INIT_WIDGET') return;
    
    console.log('Initializing ElevenLabs widget...');
    initializeWidget(event.data.agentId);
  });
  
  function initializeWidget(agentId) {
    if (widgetInitialized) {
      console.log('Widget already initialized');
      return;
    }
    
    try {
      // Create widget container
      const widgetContainer = document.createElement('div');
      widgetContainer.id = 'elevenlabs-widget-container';
      widgetContainer.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 470px;
        z-index: 999998;
      `;
      document.body.appendChild(widgetContainer);
      
      // Create the widget using the official embed code
      const widgetScript = document.createElement('script');
      widgetScript.src = 'https://elevenlabs.io/convai-widget/index.js';
      widgetScript.async = true;
      
      widgetScript.onload = () => {
        console.log('Widget script loaded');
        
        // Initialize the widget
        const config = {
          agentId: agentId,
          onMessage: (message) => {
            console.log('Widget message:', message);
          },
          onConnect: () => {
            console.log('Widget connected');
            window.postMessage({ 
              type: 'VOICELEGAL_VOICE_STATUS', 
              status: 'connected' 
            }, '*');
          },
          onDisconnect: () => {
            console.log('Widget disconnected');
            window.postMessage({ 
              type: 'VOICELEGAL_VOICE_STATUS', 
              status: 'disconnected' 
            }, '*');
          }
        };
        
        // Check if ElevenLabs widget initializer exists
        if (typeof window.elevenLabsInit === 'function') {
          window.elevenLabsInit(config);
          widgetInitialized = true;
        } else {
          console.error('ElevenLabs widget initializer not found');
        }
      };
      
      widgetScript.onerror = () => {
        console.error('Failed to load widget script');
      };
      
      document.head.appendChild(widgetScript);
      
    } catch (error) {
      console.error('Error initializing widget:', error);
    }
  }
})();