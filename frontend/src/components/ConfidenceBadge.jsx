import React from 'react';

export default function ConfidenceBadge({ score }) {
  const percentage = Math.round(score * 100);
  
  let colorClass = "bg-green-500";
  if (percentage < 50) colorClass = "bg-red-500";
  else if (percentage < 75) colorClass = "bg-yellow-500";

  return (
    <div className="flex items-center space-x-3">
      <span className="font-semibold">{percentage}%</span>
      <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
