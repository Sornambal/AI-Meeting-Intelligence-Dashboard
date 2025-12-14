import { useState } from 'react';

export default function MeetingSummary({ summary }) {
  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border-l-4 border-purple-600 rounded-lg p-6">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">{summary}</p>
      </div>
      <div className="text-xs text-gray-500">
        <p>✓ Summary generated from meeting transcript</p>
      </div>
    </div>
  );
}
