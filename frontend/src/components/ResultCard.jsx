import React from 'react';

export default function ResultCard({ title, imageUrl, description }) {
  return (
    <div className="flex flex-col bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="p-4 border-b border-slate-700 bg-slate-800/80">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      </div>
      <div className="relative w-full aspect-square bg-slate-900 flex items-center justify-center p-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        ) : (
          <div className="text-slate-600 animate-pulse">Processing...</div>
        )}
      </div>
    </div>
  );
}
