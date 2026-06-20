import React from 'react';
import { Mail, Briefcase, Award, GraduationCap, Code } from 'lucide-react';

export default function Profile() {
  return (
    <section id="about" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-white mb-2">Saumya Srivastava</h2>
            <p className="text-blue-400 font-medium mb-4">AI Engineer | Machine Learning Engineer | Computer Vision Engineer</p>
            <div className="w-16 h-1 bg-blue-500 rounded-full mb-6"></div>
            
            <p className="text-slate-300 mb-6 leading-relaxed">
              I specialize in Computer Vision and Medical Image Analysis. My goal is to bridge the gap between advanced deep learning architectures and real-world healthcare applications, ensuring robust detection and transparent Explainable AI.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg mr-4 shrink-0">
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
                <span>B.Tech Information Technology, MMMUT Gorakhpur, Batch 2027</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg mr-4 shrink-0">
                  <Code className="w-5 h-5 text-emerald-400" />
                </div>
                <span><span className="font-semibold text-slate-200">Skills:</span> YOLO, PyTorch, TensorFlow, OpenCV, FastAPI, React, Spring Boot, Docker</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg mr-4 shrink-0">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                </div>
                <span><span className="font-semibold text-slate-200">Projects:</span> Brain Tumor Detection, Dental AI Pipeline, RoadGuard AI, KrishiMitram, LinkedIn Microservices Platform</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="p-2 bg-slate-800 rounded-lg mr-4 shrink-0">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <span><span className="font-semibold text-slate-200">Achievements:</span> IIT Kanpur & ICMR National Hackathon Winner, 500+ LeetCode problems, 1842 LeetCode rating</span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-2xl rotate-6 opacity-50 blur-lg"></div>
              <div className="absolute inset-0 bg-slate-800 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                 <img src="/profile.jpeg" alt="Saumya Srivastava" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
