import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { removeAuthToken } from '../utils/auth';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import InputSection from '../components/InputSection';
import OutputPanels from '../components/OutputPanels';

export default function Dashboard() {
  const navigate = useNavigate();
  const [meetingText, setMeetingText] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const handleMicStart = () => {
    resetTranscript();
    startListening();
  };

  const handleMicStop = () => {
    stopListening();
    if (transcript) {
      setMeetingText((prev) => prev + ' ' + transcript);
    }
  };

  const handleTextChange = (e) => {
    setMeetingText(e.target.value);
  };

  const handleProcessMeeting = async () => {
    if (!meetingText.trim()) {
      setError('Please enter meeting notes or record audio');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/meetings/process', {
        text: meetingText,
      });

      setOutput(response.data);
      setSuccessMessage('✅ Meeting processed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Process error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to process meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleClear = () => {
    setMeetingText('');
    setOutput(null);
    setError('');
    resetTranscript();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-teal-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-600 to-teal-600 p-2 rounded-lg">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
                Meeting Action Extractor
              </h1>
              <p className="text-xs text-gray-500">Transform meetings into actionable insights</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-md animate-pulse">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <p className="font-semibold text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📥</span> Your Meeting
              </h2>
              <InputSection
                meetingText={meetingText}
                onTextChange={handleTextChange}
                onMicStart={handleMicStart}
                onMicStop={handleMicStop}
                isListening={isListening}
                transcript={transcript}
                onProcessClick={handleProcessMeeting}
                onClearClick={handleClear}
                loading={loading}
              />
            </div>
          </div>

          {/* Right Column: Output Section */}
          <div className="lg:col-span-7">
            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center min-h-96">
                <div className="mb-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 opacity-25 animate-pulse"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
                  </div>
                </div>
                <p className="text-gray-800 font-bold text-lg text-center">Processing Meeting...</p>
                <p className="text-gray-500 text-sm mt-2 text-center">Analyzing notes with AI intelligence</p>
              </div>
            )}

            {/* Output Panels */}
            {output && !loading && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span> Results
                </h2>
                <OutputPanels output={output} />
              </div>
            )}

            {/* Empty State */}
            {!loading && !output && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h3>
                <p className="text-gray-600 mb-4">Upload, type, or record your meeting notes to get started</p>
                <p className="text-sm text-gray-500">Your summary, minutes, and action items will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
