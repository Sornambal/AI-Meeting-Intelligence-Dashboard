export default function MinutesOfMeeting({ mom }) {
  return (
    <div className="space-y-4">
      <div className="bg-teal-50 border-l-4 border-teal-600 rounded-lg p-6">
        {typeof mom === 'string' ? (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">{mom}</p>
        ) : Array.isArray(mom) ? (
          <ul className="space-y-3">
            {mom.map((item, index) => (
              <li key={index} className="flex gap-3 text-gray-800">
                <span className="font-bold text-teal-600 flex-shrink-0">•</span>
                <span className="text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No minutes available</p>
        )}
      </div>
      <div className="text-xs text-gray-500">
        <p>✓ Minutes extracted from meeting notes</p>
      </div>
    </div>
  );
}
