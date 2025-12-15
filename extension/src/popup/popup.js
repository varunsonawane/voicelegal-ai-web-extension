// Change these to your local URLs for testing
const API_URL = 'http://localhost:8000';  // Your local backend
const DASHBOARD_URL = 'http://localhost:5173';  // Your local frontend

document.getElementById('analyzeBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  showStatus('Analyzing page...');
  
  // Inject content script and analyze
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractPageText
  }, async (results) => {
    if (results && results[0]) {
      const pageText = results[0].result;
      
      try {
        const response = await fetch(`${API_URL}/api/analyze-text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: pageText.substring(0, 15000), // Limit to first 15k chars
            url: tab.url,
            title: tab.title
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Show results in content script
        chrome.tabs.sendMessage(tab.id, {
          action: 'showAnalysis',
          data: data
        });
        
        showStatus('✓ Analysis complete!');
        setTimeout(() => window.close(), 1000);
        
      } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Error: ' + error.message);
      }
    }
  });
});

document.getElementById('uploadBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: DASHBOARD_URL });
});

document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: DASHBOARD_URL });
});

function extractPageText() {
  return document.body.innerText;
}

function showStatus(message) {
  const status = document.getElementById('status');
  const statusText = document.getElementById('statusText');
  status.style.display = 'block';
  statusText.textContent = message;
}