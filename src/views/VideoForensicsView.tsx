import React, { useState } from 'react';
import { 
  Video as VideoIcon, 
  UploadCloud, 
  Clock, 
  Play, 
  Pause, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Sliders,
  RotateCcw
} from 'lucide-react';
import { ForensicAnalysisResult } from '../types/forensics';
import { 
  extractFileMetadata, 
  performMultiSignalFusion, 
  saveAnalysis,
  getStoredAnalyses
} from '../services/forensicEngine';
import { AnalysisResultView } from '../components/forensics/AnalysisResultView';

export const VideoForensicsView: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(() => {
    const list = getStoredAnalyses();
    return list.find(a => a.mediaType === 'video' && a.verdict === 'FAKE') || list.find(a => a.mediaType === 'video') || null;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState<string>('00:14.2');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      runVideoForensics(file);
    }
  };

  const runVideoForensics = async (file: File) => {
    setIsProcessing(true);
    try {
      const url = URL.createObjectURL(file);
      const metadata = await extractFileMetadata(file, 'video');

      const result = performMultiSignalFusion({
        mediaType: 'video',
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mediaUrl: url,
        metadata
      });

      saveAnalysis(result);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Video forensics failed:', err);
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
            TEMPORAL &amp; AUDIO-VISUAL FORENSICS
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Phoneme-Viseme Sync • Optical Flow Vectors
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <VideoIcon className="w-8 h-8 text-cyan-400" />
          <span>Video Deepfake &amp; Temporal Forensics</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Frame-by-frame synthetic manipulation inspection, boundary flicker detection, facial movement dynamics, and Cross-Modal Lip-Sync verification.
        </p>
      </div>

      {/* Upload Action Strip */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase font-mono text-slate-200">
              Upload Video for Frame-by-Frame Decomposition
            </h2>
            <p className="text-[11px] text-slate-400">
              Supports MP4, MOV, AVI with frame-rate and audio track alignment
            </p>
          </div>
        </div>

        <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 inline-flex items-center gap-2">
          <UploadCloud className="w-4 h-4" />
          <span>Choose Video File</span>
          <input 
            type="file" 
            accept="video/mp4,video/quicktime,video/x-msvideo" 
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
            Decompressing video frames &amp; computing inter-frame optical flow...
          </p>
        </div>
      )}

      {/* Detailed Result View */}
      {!isProcessing && analysisResult && (
        <AnalysisResultView
          analysis={analysisResult}
          onNewAnalysis={() => setAnalysisResult(null)}
        />
      )}
    </div>
  );
};
