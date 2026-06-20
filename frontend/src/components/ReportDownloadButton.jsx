import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function ReportDownloadButton({ reportUrl }) {
  if (!reportUrl) return null;

  return (
    <div className="mt-8 flex justify-center">
      <a 
        href={reportUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        download
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/30"
      >
        <FileText className="mr-2 w-5 h-5" />
        Download Clinical Report (PDF)
        <Download className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
      </a>
    </div>
  );
}
