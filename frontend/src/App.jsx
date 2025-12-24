import React, { useState, useEffect } from 'react';
import DocumentUpload from './components/DocumentUpload';
import DocumentAnalysis from './components/DocumentAnalysis';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const [documentData, setDocumentData] = useState(null);
  const [loadingExtensionData, setLoadingExtensionData] = useState(true);

  useEffect(() => {
  const checkExtensionData = async () => {
    console.log('Checking for extension data...');
    
    try {
      // Check URL for analysis_id parameter
      const urlParams = new URLSearchParams(window.location.search);
      const analysisId = urlParams.get('analysis_id');
      
      console.log('Analysis ID from URL:', analysisId);
      
      if (analysisId) {
        console.log('Fetching analysis from backend...');
        
        const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/get-temp-analysis/${analysisId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }
        
        const result = await response.json();
        console.log('Received analysis data:', result);
        
        if (result.success && result.data) {
          console.log('✓ Loading extension data into dashboard');
          setDocumentData({
            analysis: result.data.analysis,
            url: result.data.url,
            title: result.data.title,
            filename: result.data.title || 'Web Page Analysis'
          });
          
          // Clean up URL (remove analysis_id parameter)
          window.history.replaceState({}, document.title, window.location.pathname);
          console.log('✓ Extension data loaded and URL cleaned');
        }
      } else {
        console.log('No analysis_id in URL');
      }
    } catch (error) {
      console.error('Error loading extension data:', error);
    } finally {
      setLoadingExtensionData(false);
    }
  };

  checkExtensionData();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  VoiceLegal AI
                </h1>
                <p className="text-sm text-gray-600 mt-1">AI-Powered Legal Document Analysis</p>
              </div>
            </div>
            
            {documentData && (
              <button
                onClick={() => setDocumentData(null)}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Document
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loadingExtensionData && !documentData ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Checking for extension data...</p>
          </div>
        ) : !documentData ? (
          <DocumentUpload onDocumentAnalyzed={setDocumentData} />
        ) : (
          <div className="space-y-8">
            {/* Show source info if from extension */}
            {documentData.url && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900">
                      ✓ Analyzed from browser extension
                    </p>
                    <p className="text-xs text-blue-700 mt-1 break-all">
                      {documentData.url}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DocumentAnalysis
              analysis={documentData.analysis}
              filename={documentData.filename}
            />
            <VoiceAssistant
              documentContext={documentData.analysis}
              filename={documentData.filename}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Powered by{' '}
              <span className="font-bold text-blue-600">Google Cloud Vertex AI</span>
              {' '}& <span className="font-bold text-purple-600">ElevenLabs</span>
            </p>
            <p className="text-xs text-gray-500">
              Built for AI Partner Catalyst Hackathon 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;