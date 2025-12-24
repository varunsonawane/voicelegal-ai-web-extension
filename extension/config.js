// Configuration for different environments
const CONFIG = {
  // Update these URLs when deploying
  API_URL: 'http://localhost:8000', // Change to: https://your-app.onrender.com
  DASHBOARD_URL: 'http://localhost:5173', // Change to: https://your-app.vercel.app
  ELEVENLABS_AGENT_ID: 'agent_2401kcash9gqejx8t67n3prbe2nv' // Update with new agent ID as needed
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
