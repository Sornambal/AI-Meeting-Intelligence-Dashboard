export default function ActionItems({ actions }) {
  const actionsList = Array.isArray(actions) ? actions : [];

  if (!actionsList || actionsList.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-5xl mb-4 block">📋</span>
        <p className="text-gray-600">No action items found in the meeting notes.</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase() || 'medium';
    if (p === 'high') return 'bg-red-100 text-red-800 border-red-300';
    if (p === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className="space-y-4">
      {actionsList.map((action, index) => (
        <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex justify-between items-start gap-4 mb-3">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                {action.task || 'Untitled Task'}
              </h4>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(action.priority)}`}>
              {action.priority || 'Medium'}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-semibold text-xs mb-1">👤 Owner</p>
              <p className="text-gray-800 font-medium">{action.owner || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-xs mb-1">📅 Deadline</p>
              <p className="text-gray-800 font-medium">{action.deadline || 'TBD'}</p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-green-800">
          <span className="font-semibold">✓ {actionsList.length}</span> action items identified
        </p>
      </div>
    </div>
  );
}
