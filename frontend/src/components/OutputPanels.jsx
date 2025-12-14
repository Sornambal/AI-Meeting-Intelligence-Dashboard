import { useState } from 'react';
import MeetingSummary from './MeetingSummary';
import MinutesOfMeeting from './MinutesOfMeeting';
import ActionItems from './ActionItems';

export default function OutputPanels({ output }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportToPDF = async (content, filename) => {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;

      let yPosition = margin;

      // Title
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(filename, margin, yPosition);
      yPosition += 10;

      // Content
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      const lines = doc.splitTextToSize(content, maxWidth);

      lines.forEach((line) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });

      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Make sure jsPDF is installed.');
    }
  };

  if (!output) return null;

  const tabs = [
    { id: 'summary', label: '📝 Summary', icon: '📝' },
    { id: 'mom', label: '📋 Minutes', icon: '📋' },
    { id: 'actions', label: '✅ Actions', icon: '✅' },
  ];

  return (
    <div className="space-y-4">
      {/* Modern Tab Navigation */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 font-semibold rounded-lg transition duration-200 ${
              activeTab === tab.id
                ? 'bg-white shadow-lg text-purple-600 border-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <div className="text-sm">{tab.label.split(' ')[1] || tab.label}</div>
          </button>
        ))}
      </div>

      {/* Tab Content Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header with Action Buttons */}
        <div className="bg-gradient-to-r from-purple-50 to-teal-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">
            {activeTab === 'summary' && '📝 Meeting Summary'}
            {activeTab === 'mom' && '📋 Minutes of Meeting'}
            {activeTab === 'actions' && '✅ Action Items'}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                let text = '';
                if (activeTab === 'summary') text = output.summary || '';
                else if (activeTab === 'mom') text = output.minutes || '';
                else text = JSON.stringify(output.action_items, null, 2);
                copyToClipboard(text, activeTab);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm ${
                copied === activeTab
                  ? 'bg-green-100 text-green-700'
                  : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
              }`}
            >
              {copied === activeTab ? '✅ Copied!' : '📋 Copy'}
            </button>
            <button
              onClick={() => {
                let text = '';
                let title = '';
                if (activeTab === 'summary') {
                  text = output.summary || '';
                  title = 'Meeting Summary';
                } else if (activeTab === 'mom') {
                  text = output.minutes || '';
                  title = 'Minutes of Meeting';
                } else {
                  text = JSON.stringify(output.action_items, null, 2);
                  title = 'Action Items';
                }
                exportToPDF(text, title);
              }}
              className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-semibold transition flex items-center gap-2 text-sm"
            >
              📄 PDF
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === 'summary' && <MeetingSummary summary={output.summary} />}
          {activeTab === 'mom' && <MinutesOfMeeting mom={output.minutes} />}
          {activeTab === 'actions' && <ActionItems actions={output.action_items} />}
        </div>
      </div>
    </div>
  );
}
