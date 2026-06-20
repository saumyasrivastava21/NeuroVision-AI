import React from 'react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-20 lg:py-32 bg-slate-900">
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Advanced Explainable AI for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Brain Tumor Detection
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
          Upload an MRI scan and instantly receive YOLOv8 bounding box predictions and localized Grad-CAM heatmaps, delivering true clinical transparency.
        </p>
        
        <div className="mt-10 flex justify-center gap-4">
          <a 
            href="#tool" 
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200"
          >
            Launch Web App
          </a>
          <a 
            href="#about" 
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all duration-200"
          >
            Meet the Developer
          </a>
        </div>
      </div>
    </div>
  );
}
