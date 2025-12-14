import { useRef, useState } from 'react';

export default function InputSection({
  meetingText,
  onTextChange,
  onMicStart,
  onMicStop,
  isListening,
  transcript,
  onProcessClick,
  onClearClick,
  loading,
}) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      onTextChange({ target: { value: meetingText + `\n[Uploaded: ${file.name}]` } });
    }
  };

  return (
    <div className="space-y-4">
      {/* Three Input Method Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Upload Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border-2 border-emerald-300 p-4 hover:shadow-lg transition">
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl mb-2">📁</span>
            <h3 className="font-bold text-green-900 text-sm">Upload</h3>
            <p className="text-xs text-green-700 mt-1">Audio file</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg transition text-xs"
            >
              Choose
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
            {uploadedFile && (
              <p className="text-xs text-green-700 font-bold mt-2 truncate">✓ {uploadedFile}</p>
            )}
          </div>
        </div>

        {/* Text Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-300 p-4 hover:shadow-lg transition">
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl mb-2">📝</span>
            <h3 className="font-bold text-blue-900 text-sm">Type</h3>
            <p className="text-xs text-blue-700 mt-1">Paste text</p>
            <div className="mt-3 text-xs text-blue-700">
              <p className="font-semibold">Enter notes below</p>
            </div>
          </div>
        </div>

        {/* Voice Card */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl border-2 border-teal-300 p-4 hover:shadow-lg transition">
          <div className="flex flex-col items-center text-center">
            <span className="text-3xl mb-2">🎙️</span>
            <h3 className="font-bold text-purple-900 text-sm">Voice</h3>
            <p className="text-xs text-purple-700 mt-1">Real-time</p>
            <button
              onClick={!isListening ? onMicStart : onMicStop}
              disabled={loading}
              className={`mt-3 w-full font-semibold py-2 px-3 rounded-lg transition text-xs text-white ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700'
              } disabled:bg-gray-400`}
            >
              {isListening ? '⏹️ Stop' : '🎤 Start'}
            </button>
          </div>
        </div>
      </div>

      {/* Text Input Area */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Meeting Notes</label>
        <textarea
          ref={textareaRef}
          value={meetingText}
          onChange={onTextChange}
          placeholder="Paste or type your meeting notes here... Include task owners and deadlines for better results."
          className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-sm font-medium"
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">💡 Include task owners and deadlines</p>
          <p className="text-xs text-gray-500">{meetingText.length} characters</p>
        </div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold flex items-center gap-2 mb-2">
            <span>📢</span> Current Transcript:
          </p>
          <p className="text-gray-800 text-sm bg-white p-3 rounded-lg border border-purple-200">{transcript}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onProcessClick}
          disabled={loading || !meetingText.trim()}
          className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 text-base shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span> Processing...
            </>
          ) : (
            <>
              <span>🚀</span> Process Meeting
            </>
          )}
        </button>
        <button
          onClick={onClearClick}
          disabled={loading}
          className="px-6 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <span>🗑️</span> Clear
        </button>
      </div>
    </div>
  );
}
