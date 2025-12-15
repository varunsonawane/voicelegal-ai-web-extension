const API_URL = 'http://localhost:8000';

console.log('VoiceLegal background script loaded');

// Keep service worker alive
let keepAliveInterval = null;

function startKeepAlive() {
  if (keepAliveInterval) return;
  
  keepAliveInterval = setInterval(() => {
    console.log('Service worker heartbeat');
  }, 20000); // Every 20 seconds
}

function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

// Start keepalive
startKeepAlive();

// Restart on any activity
chrome.runtime.onMessage.addListener(() => {
  startKeepAlive();
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.action);
  
  if (request.action === 'analyzePage') {
    handlePageAnalysis(request, sender, sendResponse);
    return true; // Keep channel open
  }
  
  if (request.action === 'storeTempAnalysis') {
    handleStoreTempAnalysis(request, sendResponse);
    return true; // Keep channel open
  }
  
  // If we don't handle it, return false
  return false;
});

async function handlePageAnalysis(request, sender, sendResponse) {
  try {
    console.log('Analyzing page...');
    
    const response = await fetch(`${API_URL}/api/analyze-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: request.text,
        url: request.url,
        title: request.title
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Analysis complete');

    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'showAnalysis',
      data: {
        analysis: data.analysis,
        url: request.url,
        title: request.title
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    chrome.tabs.sendMessage(sender.tab.id, {
      action: 'showAnalysis',
      data: null,
      error: error.message
    });
  }
}

async function handleStoreTempAnalysis(request, sendResponse) {
  console.log('=== STORE TEMP ANALYSIS CALLED ===');
  console.log('Request data:', request.data);
  
  // Set a timeout to prevent hanging
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout after 10s')), 10000);
  });
  
  const fetchPromise = (async () => {
    try {
      console.log('Fetching to backend:', `${API_URL}/api/store-temp-analysis`);
      
      const response = await fetch(`${API_URL}/api/store-temp-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.data)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✓ Success! Analysis ID:', result.analysis_id);
      
      return { success: true, analysis_id: result.analysis_id };

    } catch (error) {
      console.error('✗ Fetch error:', error);
      return { success: false, error: error.message };
    }
  })();
  
  // Race between fetch and timeout
  try {
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    console.log('Sending response:', result);
    sendResponse(result);
  } catch (error) {
    console.error('✗ Timeout or error:', error);
    sendResponse({ success: false, error: error.message });
  }
}