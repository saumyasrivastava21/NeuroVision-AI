import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <Activity className="w-6 h-6 text-slate-500" />
          <span className="text-lg font-bold text-slate-400">NeuroVision</span>
        </div>
        
        <div className="text-slate-500 text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Developed for Portfolio. Not for actual clinical use.
        </div>
        
      </div>
    </footer>
  );
}
