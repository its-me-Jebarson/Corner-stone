import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Layers, 
  Sparkles, 
  Eye, 
  Scan,
  Maximize2
} from 'lucide-react';
import { AnalysisResultView } from '../components/forensics/AnalysisResultView';
import { ForensicAnalysisResult } from '../types/forensics';
import { 
  analyzeImageViaBackend,
  saveAnalysis,
  getStoredAnalyses
} from '../services/forensicEngine';

export const ImageForensicsView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(() => {
    const list = getStoredAnalyses();
    return list.find(a => a.mediaType === 'image') || null;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      runImageForensics(file);
    }
  };

  const runImageForensics = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const result = await analyzeImageViaBackend(file);
      saveAnalysis(result);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error('Image forensics failed:', err);
      setErrorMessage(err.message || 'Image analysis failed. Please ensure the backend is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            REAL ML SENSOR &amp; ARTIFACT INSPECTION
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ResNet-18 Deepfake Classifier • Calculated ELA • 2D FFT
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <ImageIcon className="w-8 h-8 text-cyan-400" />
          <span>Image Deepfake &amp; Manipulation Forensics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Trained deep neural network classification, pixel-level manipulation localization, genuine Error Level Analysis (ELA), 2D Fourier frequency domain inspection, and Bayer PRNU sensor noise evaluation.
        </p>
      </div>

      {/* Error Callout */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-xs text-red-300 flex items-start gap-3 animate-fadeIn font-mono">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-red-200 uppercase">Analysis Error</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Upload Strip */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Scan className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase font-mono text-slate-200">
              Upload Image for Deep Learning &amp; Spatial Scan
            </h2>
            <p className="text-[11px] text-slate-400">
              Supports JPEG, PNG, WEBP with uncompressed sensor and neural inspection
            </p>
          </div>
        </div>

        <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 inline-flex items-center gap-2">
          <UploadCloud className="w-4 h-4" />
          <span>Choose Image File</span>
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Processing HUD */}
      {isProcessing && (
        <div className="glass-panel p-8 rounded-2xl border border-cyan-500/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mx-auto animate-spin">
            <Sliders className="w-6 h-6" />
          </div>
          <p className="text-sm font-mono text-cyan-300">
            Running ResNet-18 forward pass &amp; calculating genuine ELA/noise indicators...
          </p>
        </div>
      )}

      {/* Display Detailed Result */}
      {!isProcessing && analysisResult && (
        <AnalysisResultView
          analysis={analysisResult}
          onNewAnalysis={() => setAnalysisResult(null)}
        />
      )}
    </div>
  );
};
