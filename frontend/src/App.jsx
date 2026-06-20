import React, { useState } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Footer from './components/Footer';
import UploadBox from './components/UploadBox';
import ResultCard from './components/ResultCard';
import DetectionTable from './components/DetectionTable';
import ReportDownloadButton from './components/ReportDownloadButton';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const handleUpload = async (selectedFile) => {
    setFile(selectedFile);
    if (!selectedFile) {
      setResults(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_BASE}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'success') {
        setResults({
          ...response.data,
          detection_image: `${API_BASE}${response.data.detection_image}`,
          gradcam_image: `${API_BASE}${response.data.gradcam_image}`,
          report: `${API_BASE}${response.data.report}`,
          original_image: URL.createObjectURL(selectedFile)
        });
      } else {
        setError(response.data.error || 'An error occurred during prediction.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 font-['Inter',_sans-serif]">
      <Navbar />
      <Hero />

      {/* Tool Section */}
      <section id="tool" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Diagnostic Dashboard</h2>
            <p className="text-slate-400 mt-2">Drop a medical image below to analyze it immediately.</p>
          </div>
          
          <UploadBox onUpload={handleUpload} />

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-lg text-slate-300 animate-pulse">Running YOLOv8 + Grad-CAM analysis...</p>
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center shadow-lg shadow-red-500/10">
              <p className="font-semibold">Error processing image</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {results && !loading && (
            <div className="space-y-12 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ResultCard 
                  title="Original MRI" 
                  imageUrl={results.original_image} 
                  description="Uploaded medical image" 
                />
                <ResultCard 
                  title="YOLO Detection" 
                  imageUrl={results.detection_image} 
                  description="Bounding box predictions" 
                />
                <ResultCard 
                  title="Grad-CAM Heatmap" 
                  imageUrl={results.gradcam_image} 
                  description="AI attention visualization" 
                />
              </div>

              <div className="max-w-5xl mx-auto space-y-8">
                <DetectionTable detections={results.detections} />
                <ReportDownloadButton reportUrl={results.report} />
              </div>
            </div>
          )}
        </div>
      </section>

      <Profile />
      <Footer />
    </div>
  );
}

export default App;
