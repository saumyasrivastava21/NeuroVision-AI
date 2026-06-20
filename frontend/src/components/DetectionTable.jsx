import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';

export default function DetectionTable({ detections }) {
  if (!detections || detections.length === 0) {
    return (
      <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 text-center">
        <p className="text-slate-400">No tumors detected in this MRI scan.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/80">
        <h3 className="text-lg font-semibold text-slate-100">Detection Results</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Class</th>
              <th className="px-6 py-4 font-medium">Confidence</th>
              <th className="px-6 py-4 font-medium">Bounding Box (x1, y1, x2, y2)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {detections.map((det, idx) => (
              <tr key={idx} className="hover:bg-slate-700/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-100 capitalize">
                  {det.class_name.replace('_', ' ')}
                </td>
                <td className="px-6 py-4">
                  <ConfidenceBadge score={det.confidence} />
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  [{det.bbox.map(v => v.toFixed(1)).join(', ')}]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
