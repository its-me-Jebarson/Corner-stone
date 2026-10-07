import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  File, 
  Film, 
  Music, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Play, 
  Zap,
  Info
} from 'lucide-react';
import { MediaType } from '../../types/forensics';
import { formatBytes } from '../../services/forensicEngine';

interface UnifiedUploadProps {
  onAnalyze: (file: File, mediaType: MediaType, previewUrl: string) => void;
  onSelectDemoCase: (caseId: string) => void;
  isAnalyzing: boolean;
}

export const UnifiedUpload: React.FC<UnifiedUploadProps> = ({
  onAnalyze,
  onSelectDemoCase,
  isAnalyzing
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<MediaType>('image');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedExtensions = ['JPG', 'JPEG', 'PNG', 'WEBP', 'MP4', 'MOV', 'AVI', 'MP3', 'WAV', 'M4A'];

  const determineMediaType = (file: File): MediaType => {
    const type = file.type;
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.startsWith('image/')) return 'image';

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'].includes(ext || '')) return 'audio';
    return 'image';
  };

  const handleFileProcess = (file: File) => {
    setErrorMsg(null);
    const mediaType = determineMediaType(file);
    setDetectedType(mediaType);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const startAnalysis = () => {
    if (!selectedFile || !previewUrl) return;
    onAnalyze(selectedFile, detectedType, previewUrl);
  };

  return (
    <div className="space-y-6">
      
      {/* Upload Dropzone Container */}
      <div 
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all p-8 md:p-12 text-center glass-panel overflow-hidden ${
          dragActive 
            ? 'border-cyan-400 bg-cyan-950/20 shadow-xl shadow-cyan-500/10' 
            : 'border-slate-700/80 hover:border-slate-600 bg-[#0c121e]/60'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.avi,.mp3,.wav,.m4a"
          onChange={handleChange}
          className="hidden" 
        />

        {/* Ambient background grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-4">
          
          {/* Animated Upload Icon */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/30 flex items-center justify-center cursor-pointer group shadow-lg hover:scale-105 transition-all"
          >
            <UploadCloud className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 animate-pulse" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Drop suspect media here, or{' '}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/40"
              >
                browse files
              </button>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports high-resolution single &amp; multi-stream forensics up to 100MB
            </p>
          </div>

          {/* Supported Format Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {supportedExtensions.map((ext) => (
              <span 
                key={ext} 
                className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400"
              >
                .{ext}
              </span>
            ))}
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/60 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected File Pre-Analysis Inspector Card */}
      {selectedFile && previewUrl && (
        <div className="glass-panel-glow rounded-xl p-5 border border-cyan-500/30 bg-[#0d1424]/90 animate-fadeIn">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Media Preview Box */}
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="w-24 h-24 rounded-lg bg-black/60 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {detectedType === 'image' && (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                )}
                {detectedType === 'video' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                    <Film className="w-8 h-8 text-cyan-400" />
                    <Play className="w-4 h-4 text-white absolute" />
                  </div>
                )}
                {detectedType === 'audio' && (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 gap-1">
                    <Music className="w-8 h-8 text-purple-400" />
                    <span className="text-[9px] font-mono text-slate-400">AUDIO</span>
                  </div>
                )}
              </div>

              {/* File Specs */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm truncate max-w-xs">
                    {selectedFile.name}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {detectedType}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Size: {formatBytes(selectedFile.size)}</span>
                  <span>Type: {selectedFile.type || 'Binary stream'}</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Media container validated for multi-signal extraction</span>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="w-full lg:w-auto flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="px-4 py-2.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
              >
                Change File
              </button>

              <button
                type="button"
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>ANALYZING SIGNALS...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>START FORENSIC ANALYSIS</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Preloaded Demo Datasets Row */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Preloaded Demo Test Samples (Instant Evaluation)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click any case to test live multi-signal engine
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <button
            type="button"
            onClick={() => onSelectDemoCase('case-demo-01')}
            className="p-3 rounded-xl glass-card-interactive text-left space-y-1.5 border border-red-900/40 hover:border-red-500/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-red-400 font-bold">FAKE IMAGE</span>
              <ImageIcon className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">FaceSwap Portrait</div>
            <div className="text-[10px] text-slate-400">Boundary seam &amp; ELA</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectDemoCase('case-demo-02')}
            className="p-3 rounded-xl glass-card-interactive text-left space-y-1.5 border border-emerald-900/40 hover:border-emerald-500/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">REAL VIDEO</span>
              <Film className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">Witness Statement</div>
            <div className="text-[10px] text-slate-400">Continuous optical flow</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectDemoCase('case-demo-03')}
            className="p-3 rounded-xl glass-card-interactive text-left space-y-1.5 border border-orange-900/40 hover:border-orange-500/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-orange-400 font-bold">FAKE VIDEO</span>
              <Film className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">Reenactment Leak</div>
            <div className="text-[10px] text-slate-400">Lip-sync desync &amp; flicker</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectDemoCase('case-demo-04')}
            className="p-3 rounded-xl glass-card-interactive text-left space-y-1.5 border border-purple-900/40 hover:border-purple-500/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-400 font-bold">AI VOICE</span>
              <Music className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">CFO Authorization</div>
            <div className="text-[10px] text-slate-400">16kHz vocoder cutoff</div>
          </button>

          <button
            type="button"
            onClick={() => onSelectDemoCase('case-demo-05')}
            className="p-3 rounded-xl glass-card-interactive text-left space-y-1.5 border border-yellow-900/40 hover:border-yellow-500/60 col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-yellow-400 font-bold">UNCERTAIN</span>
              <Info className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <div className="text-xs font-semibold text-slate-200 truncate">WhatsApp Re-encode</div>
            <div className="text-[10px] text-slate-400">Conflicting signals</div>
          </button>

        </div>
      </div>

    </div>
  );
};
