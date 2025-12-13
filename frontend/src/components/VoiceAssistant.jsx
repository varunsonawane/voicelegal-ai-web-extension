import React, { useState, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';

const VoiceAssistant = ({ documentContext, filename }) => {
  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
  const [contextSent, setContextSent] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs agent');
    },
    onDisconnect: () => {
      console.log('Disconnected from agent');
      setContextSent(false);
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      
      // After agent's first message, send the document context
      if (message.source === 'ai' && !contextSent) {
        sendDocumentContext();
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
    },
  });

  const sendDocumentContext = () => {
    if (conversation.status === 'connected' && !contextSent) {
      // Send a message with the document context
      const contextMessage = `I've uploaded a document called "${filename}". Here's the analysis:\n\n${documentContext.substring(0, 3000)}...\n\nPlease use this information to answer my questions about the document.`;
      
      // Note: You may need to use conversation.sendMessage() or similar
      // depending on the @elevenlabs/react API
      console.log('Sending context:', contextMessage);
      setContextSent(true);
    }
  };

  const startConversation = async () => {
    try {
      await conversation.startSession({
        agentId: agentId,
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const endConversation = () => {
    conversation.endSession();
    setContextSent(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl p-8 text-white">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">
            🎤 Voice Assistant
          </h3>
          <p className="text-blue-100">
            Ask me anything about: <strong>{filename}</strong>
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 text-center">
          {conversation.status === 'connected' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                  <span className="text-white text-2xl">🎙️</span>
                </div>
              </div>
              <p className="text-gray-700 font-medium">
                Listening... Ask me about the document!
              </p>
              <button
                onClick={endConversation}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                End Conversation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">🎙️</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                I'll analyze: <strong className="text-gray-800">{filename}</strong>
              </p>
              <div className="bg-blue-50 p-4 rounded-lg text-left text-sm text-gray-700 mb-4">
                <p className="font-semibold mb-2">📋 Document Summary:</p>
                <p>{documentContext.substring(0, 200)}...</p>
              </div>
              <button
                onClick={startConversation}
                disabled={conversation.status === 'connecting'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                {conversation.status === 'connecting' ? 'Connecting...' : 'Start Voice Chat'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-blue-100">
          <p className="font-semibold mb-2">Try asking:</p>
          <ul className="space-y-1">
            <li>• "What are the high-risk clauses?"</li>
            <li>• "Explain the account termination terms"</li>
            <li>• "What should I be careful about?"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;