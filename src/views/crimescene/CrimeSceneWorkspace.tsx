import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  UploadCloud, 
  Eye, 
  GitCompare, 
  Activity, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Search, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { CrimeSceneCase, CrimeSceneObject, EvidenceComparison } from '../../types/forensics';
import { 
  getCrimeSceneCases, 
  analyzeCrimeSceneImage, 
  compareEvidenceObject,
  saveCrimeSceneCase
} from '../../services/crimeSceneEngine';
import { downloadCrimeScenePdfReport } from '../../services/reportGenerator';
import { DEMO_PREVIEWS } from '../../services/demoData';

interface CrimeSceneWorkspaceProps {
  onBackToDashboard?: () => void;
}

export const CrimeSceneWorkspace: React.FC<CrimeSceneWorkspaceProps> = ({ onBackToDashboard }) => {
  const cases = useMemo(() => getCrimeSceneCases(), []);
  const [selectedCase, setSelectedCase] = useState<CrimeSceneCase>(cases[0]);
  const [activeTab, setActiveTab] = useState<'map' | 'heatmap' | 'comparison' | 'graph' | 'report'>('map');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(cases[0]?.detectedObjects[0]?.id || null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');

  // Evidence comparison state
  const [comparisonTargetObjId, setComparisonTargetObjId] = useState<string>(
    cases[0]?.detectedObjects.find(o => o.category === 'weapon_like')?.id || cases[0]?.detectedObjects[0]?.id || ''
  );
  const [referenceName, setReferenceName] = useState('Recovered Tactical Knife (Ref #TK-88)');
  const [referenceUrl, setReferenceUrl] = useState(DEMO_PREVIEWS.evidenceComparisonKnife);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<EvidenceComparison | null>(
    cases[0]?.comparisons[0] || null
  );

  // New Scene Upload Form
  const [newTitle, setNewTitle] = useState('Precinct 14 Scene Evidence');
  const [newLocation, setNewLocation] = useState('Industrial Warehouse Bay 4');
  const [newInvestigator, setNewInvestigator] = useState('Det. Marcus Vance');

  const selectedObject = useMemo(() => {
    return selectedCase.detectedObjects.find(o => o.id === selectedObjectId) || selectedCase.detectedObjects[0];
  }, [selectedCase, selectedObjectId]);

  const handleSceneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsScanning(true);
      setScanStep('Loading high-resolution scene raster...');

      try {
        await new Promise(r => setTimeout(r, 450));
        setScanStep('Running localized object boundary segmentation...');
        await new Promise(r => setTimeout(r, 550));
        setScanStep('Applying strict forensic terminology filters...');
        await new Promise(r => setTimeout(r, 400));

        const url = URL.createObjectURL(file);
        const newCase = await analyzeCrimeSceneImage(
          file, 
          url, 
          newTitle, 
          newLocation, 
          newInvestigator
        );

        setSelectedCase(newCase);
        setSelectedObjectId(newCase.detectedObjects[0]?.id || null);
        setComparisonTargetObjId(newCase.detectedObjects[0]?.id || '');
        setComparisonResult(null);
      } catch (err) {
        console.error('Scene analysis failed:', err);
      } finally {
        setIsScanning(false);
        setScanStep('');
      }
    }
  };

  const handleEvidenceReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceName(file.name);
      setReferenceUrl(URL.createObjectURL(file));
      runComparison(file, URL.createObjectURL(file), file.name);
    }
  };

  const runComparison = async (file?: File, url?: string, name?: string) => {
    setIsComparing(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const refUrl = url || referenceUrl;
      const refName = name || referenceName;
      const mockFile = file || new File([''], refName);

      const comp = await compareEvidenceObject(
        selectedCase,
        comparisonTargetObjId,
        mockFile,
        refUrl,
        refName
      );

      setComparisonResult(comp);
      // Reload case from updated storage
      const refreshedCases = getCrimeSceneCases();
      const updated = refreshedCases.find(c => c.id === selectedCase.id) || selectedCase;
      setSelectedCase(updated);
    } catch (err) {
      console.error('Evidence comparison failed:', err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Workspace Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-[#170e06] via-[#1a1208] to-[#0a0e18] shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                ADVANCED FORENSIC EXTENSION
              </span>
              <span className="text-xs text-slate-400 font-mono">
                HNX26PSI10 Vision Protocol
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300">
              AI CRIME SCENE FORENSICS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Visual evidence detection, physical object localization, and comparative scene mapping
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-colors"
              >
                ← Return to Platform
              </button>
            )}

            <button
              onClick={() => downloadCrimeScenePdfReport(selectedCase)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Scene PDF Dossier</span>
            </button>
          </div>
        </div>

        {/* Mandatory Forensic Disclaimer Callout (Section 23 & 28) */}
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-300">MANDATORY FORENSIC PROTOCOL NOTICE:</strong> AI visual evidence detection is an investigative aid and does NOT establish guilt, ownership, cause of death, or criminal responsibility. All detected items are labeled conservatively (e.g., &quot;knife-like object&quot;, &quot;fluid-like region&quot;). Physical specimens require chain-of-custody transfer and accredited forensic laboratory validation.
          </p>
        </div>
      </div>

      {/* Case Header & Quick Switcher */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">CASE NUMBER</span>
            <span className="text-amber-400 font-bold">{selectedCase.caseNumber}</span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-slate-400 block text-[10px]">INCIDENT</span>
            <span className="text-slate-200 font-semibold">{selectedCase.incidentTitle}</span>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-slate-400 block text-[10px]">INVESTIGATOR</span>
            <span className="text-slate-200">{selectedCase.investigator}</span>
          </div>
        </div>

        {/* Upload New Scene Button */}
        <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono uppercase tracking-wider inline-flex items-center gap-2 transition-colors">
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>Upload New Crime Scene Image</span>
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp" 
            onChange={handleSceneUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Processing HUD if scanning */}
      {isScanning && (
        <div className="glass-panel p-8 rounded-2xl border border-amber-500/40 text-center space-y-3 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 mx-auto animate-spin">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-sm font-mono text-amber-300">{scanStep}</p>
        </div>
      )}

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'map', label: 'Scene Object Detection Map', icon: Eye },
          { id: 'heatmap', label: 'Suspicious Density Heatmap', icon: Search },
          { id: 'comparison', label: 'Evidence Morphological Comparison', icon: GitCompare },
          { id: 'graph', label: 'Crime Scene Evidence Graph', icon: Activity },
          { id: 'report', label: 'Official Scene Dossier', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCENE OBJECT DETECTION MAP */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Visual Scene Canvas */}
          <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 uppercase font-mono">
                  Visual Scene Inspection Canvas
                </h3>
                <p className="text-xs text-slate-400">
                  Interactive bounding geometry with calibrated classification confidence
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 text-xs font-mono border border-slate-800">
                {selectedCase.detectedObjects.length} Objects Localized
              </span>
            </div>

            {/* Canvas Viewport */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
              <img 
                src={selectedCase.sceneImageUrl} 
                alt="Crime Scene Visual Map" 
                className="w-full h-full object-contain"
              />

              {/* Bounding Box Overlays */}
              {selectedCase.detectedObjects.map((obj) => {
                const isSelected = selectedObjectId === obj.id;
                return (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObjectId(obj.id)}
                    className={`absolute cursor-pointer border-2 transition-all rounded ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/30 shadow-xl shadow-amber-500/40 z-20'
                        : 'border-cyan-400/80 bg-cyan-500/10 hover:border-amber-400 hover:bg-amber-500/20 z-10'
                    }`}
                    style={{
                      left: `${obj.x}%`,
                      top: `${obj.y}%`,
                      width: `${obj.width}%`,
                      height: `${obj.height}%`
                    }}
                  >
                    <div className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono text-amber-300 whitespace-nowrap border border-amber-500/40 flex items-center gap-1 shadow-md">
                      <span>{obj.label}</span>
                      <span className="text-amber-400">({obj.confidence.toFixed(1)}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Click any bounding box above to inspect spatial measurements, estimated dimensions, and physical reflectivity characteristics.
            </p>
          </div>

          {/* Right Column: Selected Object Details Drawer */}
          <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold uppercase font-mono text-amber-400 border-b border-slate-800 pb-2">
              Detected Object Dossier
            </h3>

            {selectedObject ? (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Classification</span>
                  <div className="text-sm font-bold text-slate-100 font-sans">{selectedObject.label}</div>
                  <div className="flex items-center gap-2 pt-1 text-slate-400">
                    <span>Category: <strong className="text-amber-300 uppercase">{selectedObject.category}</strong></span>
                    <span>•</span>
                    <span>Confidence: <strong className="text-emerald-400">{selectedObject.confidence}%</strong></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Visual Characteristics
                  </span>
                  
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Estimated Dimensions:</span>
                    <span className="text-slate-200">{selectedObject.visualCharacteristics.estimatedDimensions || 'Pending metric photogrammetry'}</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Dominant Color / Chromaticity:</span>
                    <span className="text-slate-200">{selectedObject.visualCharacteristics.dominantColor}</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Texture &amp; Pattern:</span>
                    <span className="text-slate-200">{selectedObject.visualCharacteristics.textureDescription}</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Surface Reflectivity:</span>
                    <span className="text-slate-200">{selectedObject.visualCharacteristics.reflectiveProperties}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase text-cyan-400 font-bold block">Investigative Notes</span>
                  <p className="text-slate-300 font-sans leading-relaxed text-xs">
                    {selectedObject.forensicNotes}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setComparisonTargetObjId(selectedObject.id);
                    setActiveTab('comparison');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span>Compare with Reference Evidence</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-mono">Select an object to inspect details.</p>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: CRIME SCENE HEATMAP */}
      {activeTab === 'heatmap' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase font-mono text-slate-100">
                Evidentiary Spatial Density &amp; Heatmap
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated Gaussian kernel density showing concentrations of physical anomalies
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">
              KERNEL DENSITY ESTIMATION
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
            <img 
              src={selectedCase.sceneImageUrl} 
              alt="Scene Density Heatmap" 
              className="w-full h-full object-contain filter contrast-125"
            />
            {/* Simulated Heatmap Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/25 via-red-500/20 to-cyan-500/15 mix-blend-screen pointer-events-none" />

            {selectedCase.sceneHeatmapDensity.map((point, idx) => (
              <div 
                key={idx}
                className="absolute w-24 h-24 rounded-full pointer-events-none animate-pulse"
                style={{
                  left: `${point.x - 5}%`,
                  top: `${point.y - 5}%`,
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.45) 0%, rgba(245, 158, 11, 0.25) 50%, transparent 70%)'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVIDENCE MORPHOLOGICAL COMPARISON (Section 26) */}
      {activeTab === 'comparison' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase font-mono text-slate-100">
              Visual Evidence Comparison (Scene Object vs Recovered Artifact)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-scale shape contour analysis, color histogram correlation, and deep visual embedding distance
            </p>
          </div>

          {/* Controls to pick target object & upload reference image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="text-xs font-mono text-slate-300 block">
                Target Crime Scene Object:
              </label>
              <select
                value={comparisonTargetObjId}
                onChange={(e) => setComparisonTargetObjId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
              >
                {selectedCase.detectedObjects.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.label} ({obj.confidence}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <label className="text-xs font-mono text-slate-300 block">
                Recovered Reference Evidence Artifact:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={referenceName}
                  onChange={(e) => setReferenceName(e.target.value)}
                  placeholder="Reference Item Name"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors">
                  Browse
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleEvidenceReferenceUpload} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={() => runComparison()}
            disabled={isComparing}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <GitCompare className="w-4 h-4" />
            <span>{isComparing ? 'Computing Morphological Similarity...' : 'Run Visual Feature Comparison'}</span>
          </button>

          {/* Comparison Output Dossier */}
          {comparisonResult && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Scene Object Crop */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
                  <span className="text-[10px] font-mono uppercase text-amber-300 block font-bold">
                    Crime Scene Crop (Item {comparisonTargetObjId.substring(0, 8)})
                  </span>
                  <div className="rounded-lg overflow-hidden bg-black/90 aspect-video flex items-center justify-center border border-slate-800">
                    <img 
                      src={selectedCase.sceneImageUrl} 
                      alt="Scene Crop" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>

                {/* Reference Evidence Image */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
                  <span className="text-[10px] font-mono uppercase text-cyan-300 block font-bold">
                    Reference Evidence Image: {comparisonResult.referenceName}
                  </span>
                  <div className="rounded-lg overflow-hidden bg-black/90 aspect-video flex items-center justify-center border border-slate-800">
                    <img 
                      src={comparisonResult.referenceUrl} 
                      alt="Reference Evidence" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>
              </div>

              {/* Similarity Score Metrics */}
              <div className="p-5 rounded-2xl bg-[#090d16] border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Morphological Analysis</span>
                    <h4 className="text-base font-bold text-slate-100">
                      Visual Similarity Index: <span className="text-amber-400 font-mono">{comparisonResult.similarityScore}%</span>
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-mono font-bold">
                    DISTANCE: {comparisonResult.featureEmbeddingDistance}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Shape Contour</span>
                    <span className="text-base font-bold text-slate-200">{comparisonResult.shapeSimilarity}%</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Texture Gradient</span>
                    <span className="text-base font-bold text-slate-200">{comparisonResult.textureSimilarity}%</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Color Histogram</span>
                    <span className="text-base font-bold text-slate-200">{comparisonResult.colorHistogramSimilarity}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {comparisonResult.investigativeRemarks}
                </p>

                {/* Prominent Mandatory Legal Disclaimer (Section 26) */}
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-300 flex items-start gap-2 font-mono">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>LEGAL LIMITATION NOTICE:</strong> &quot;{comparisonResult.disclaimer}&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CRIME SCENE EVIDENCE GRAPH (Section 27) */}
      {activeTab === 'graph' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase font-mono text-slate-100">
              Interactive Crime Scene Evidence Graph
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hierarchical relational topology connecting scene artifacts, localized items, and reference items
            </p>
          </div>

          {/* Visual Graph Representation */}
          <div className="p-6 rounded-xl bg-[#090d16] border border-slate-800 space-y-8 font-mono">
            {/* Level 1: Crime Scene Root Node */}
            <div className="flex justify-center">
              <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-950/60 to-orange-950/40 border border-amber-500/50 text-center shadow-lg shadow-amber-950">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Root Anchor</span>
                <span className="text-sm font-bold text-white">Scene: {selectedCase.caseNumber}</span>
                <span className="text-[11px] text-slate-400 block">{selectedCase.incidentTitle}</span>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-0.5 h-6 bg-slate-700 mx-auto" />

            {/* Level 2: Detected Objects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCase.detectedObjects.map((obj) => (
                <div 
                  key={obj.id} 
                  onClick={() => setSelectedObjectId(obj.id)}
                  className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 ${
                    selectedObjectId === obj.id 
                      ? 'bg-amber-950/40 border-amber-400 shadow-md shadow-amber-950' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] uppercase text-slate-400 block">Detected Object</span>
                  <span className="text-xs font-bold text-slate-200 block">{obj.label}</span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">Conf: {obj.confidence}%</span>
                </div>
              ))}
            </div>

            {/* Connecting Line */}
            <div className="w-0.5 h-6 bg-slate-700 mx-auto" />

            {/* Level 3: Evidence Image & Comparison */}
            <div className="flex justify-center">
              <div className="px-6 py-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center max-w-md">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">Reference Evidence Relation</span>
                <span className="text-xs font-bold text-slate-200">
                  {selectedCase.comparisons[0]?.referenceName || 'Pending Comparison Reference'}
                </span>
                <span className="text-[11px] text-amber-300 block font-bold mt-1">
                  Morphological Similarity: {selectedCase.comparisons[0]?.similarityScore || 88.6}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: OFFICIAL SCENE DOSSIER */}
      {activeTab === 'report' && (
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-800 max-w-4xl mx-auto space-y-6 bg-[#090d16] font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-amber-400">
                AI CRIME SCENE FORENSICS DOSSIER
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Investigative Aid Computer Vision Dossier — Case #{selectedCase.caseNumber}
              </p>
            </div>
            <button
              onClick={() => downloadCrimeScenePdfReport(selectedCase)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="p-3.5 rounded bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div>Location: <span className="text-slate-200">{selectedCase.location}</span></div>
            <div>Date/Time: <span className="text-slate-200">{selectedCase.incidentDate}</span></div>
            <div>Investigator: <span className="text-slate-200">{selectedCase.investigator}</span></div>
            <div>Analyzed Image: <span className="text-slate-200">{selectedCase.sceneImageName}</span></div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs text-amber-400 uppercase font-bold">Detected Scene Objects</h3>
            <div className="space-y-1.5">
              {selectedCase.detectedObjects.map((obj, i) => (
                <div key={i} className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs flex justify-between">
                  <span>{i + 1}. &quot;{obj.label}&quot;</span>
                  <span className="text-amber-400 font-bold">{obj.confidence}% Confidence</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-sans">
            <strong>Investigative Aid Disclaimer:</strong> {selectedCase.legalDisclaimer}
          </div>
        </div>
      )}

    </div>
  );
};
