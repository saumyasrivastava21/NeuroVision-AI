import React from 'react';
import { Activity, Globe, Mail } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              NeuroVision
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#tool" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              AI Tool
            </a>
            <a href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About the Developer
            </a>
            <div className="flex items-center space-x-4 border-l border-slate-700 pl-6">
              <a href="mailto:contact@example.com" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
