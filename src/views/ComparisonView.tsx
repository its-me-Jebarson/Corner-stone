import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  Layers, 
  Eye, 
  Maximize2,
  FileText,
  Sliders
} from 'lucide-react';
import { getStoredAnalyses } from '../services/forensicEngine';
import { ForensicAnalysisResult } from '../types/forensics';
import { DEMO_PREVIEWS } from '../services/demoData';

interface ComparisonViewProps {
  initialCase?: ForensicAnalysisResult | null;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ initialCase }) => {
  const allAnalyses = useMemo(() => getStoredAnalyses(), []);

  // Pre-select comparison pairs
  const [leftCaseId, setLeftCaseId] = useState<string>(
    initialCase?.id || allAnalyses.find(a => a.verdict === 'REAL')?.id || allAnalyses[0]?.id || ''
  );
  const [rightCaseId, setRightCaseId] = useState<string>(
    allAnalyses.find(a => a.verdict === 'FAKE')?.id || allAnalyses[1]?.id || ''
  );

  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'difference' | 'slider'>('side-by-side');

  const leftCase = useMemo(() => allAnalyses.find(a => a.id === leftCaseId) || allAnalyses[0], [allAnalyses, leftCaseId]);
  const rightCase = useMemo(() => allAnalyses.find(a => a.id === rightCaseId) || allAnalyses[1], [allAnalyses, rightCaseId]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            SIDE-BY-SIDE FORENSIC COMPARISON
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Original Reference vs Suspected Media
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <GitCompare className="w-8 h-8 text-cyan-400" />
          <span>Comparative Evidence Verification</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Evaluate authentic control samples against suspected manipulated content. Compare differential pixel error, spatial edge boundaries, and provenance metadata signatures.
        </p>
      </div>

      {/* Case Selector Strip & View Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 uppercase">Control / Sample A:</span>
            <select
              value={leftCaseId}
              onChange={(e) => setLeftCaseId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              {allAnalyses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseId} — {c.fileName} [{c.verdict}]
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-red-400 uppercase">Suspect / Sample B:</span>
            <select
              value={rightCaseId}
              onChange={(e) => setRightCaseId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              {allAnalyses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseId} — {c.fileName} [{c.verdict}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'side-by-side' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('difference')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'difference' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Difference Map
          </button>
        </div>
      </div>

      {/* Visual Canvas Display */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Sample A */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  Reference Sample A
                </span>
                <h2 className="text-sm font-bold text-slate-100 font-mono">
                  {leftCase?.caseId} — {leftCase?.fileName}
                </h2>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                leftCase?.verdict === 'REAL' ? 'bg-emerald-500/20 text-emerald-400' :
                leftCase?.verdict === 'FAKE' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {leftCase?.verdict} ({leftCase?.authenticityScore}%)
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video flex items-center justify-center border border-slate-800">
              <img 
                src={leftCase?.mediaUrl} 
                alt="Reference Media" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
                SAMPLE A
              </div>
            </div>

            {/* Signal preview */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">PRNU Noise Profile:</span>
                <span className="text-emerald-400 font-bold">Uniform (Natural)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Camera Hardware:</span>
                <span className="text-slate-200">{leftCase?.metadata.cameraMake || 'Verified'}</span>
              </div>
            </div>
          </div>

          {/* Right: Sample B */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">
                  Suspected Sample B
                </span>
                <h2 className="text-sm font-bold text-slate-100 font-mono">
                  {rightCase?.caseId} — {rightCase?.fileName}
                </h2>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                rightCase?.verdict === 'REAL' ? 'bg-emerald-500/20 text-emerald-400' :
                rightCase?.verdict === 'FAKE' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-400'
              }`}>
                {rightCase?.verdict} ({rightCase?.authenticityScore}%)
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video flex items-center justify-center border border-slate-800">
              <img 
                src={rightCase?.mediaUrl} 
                alt="Suspect Media" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-red-300 border border-red-500/40">
                SAMPLE B
              </div>

              {/* Bounding box marker */}
              {rightCase?.suspiciousRegions[0] && (
                <div 
                  className="absolute border-2 border-red-400 bg-red-500/20 rounded pointer-events-none"
                  style={{
                    left: `${rightCase.suspiciousRegions[0].x}%`,
                    top: `${rightCase.suspiciousRegions[0].y}%`,
                    width: `${rightCase.suspiciousRegions[0].width}%`,
                    height: `${rightCase.suspiciousRegions[0].height}%`
                  }}
                >
                  <span className="absolute -top-5 left-0 px-1.5 py-0.2 bg-black/90 text-[9px] font-mono text-red-400 border border-red-500/50">
                    Delta Seam
                  </span>
                </div>
              )}
            </div>

            {/* Signal preview */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">PRNU Noise Profile:</span>
                <span className="text-red-400 font-bold">Discontinuity Detected</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400">Camera Hardware:</span>
                <span className="text-slate-200">{rightCase?.metadata.cameraMake || 'Synthetic Canvas'}</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Difference Map Mode */
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 font-mono">
                Computed Absolute Difference &amp; Gradient Variance
              </h3>
              <p className="text-xs text-slate-400">
                Highlighting structural, colorimetric, and frequency divergence between Sample A and Sample B
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 bg-cyan-950 border border-cyan-800">
              ELA DIFFERENTIAL
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border border-slate-800">
            <img 
              src={rightCase?.mediaUrl} 
              alt="Difference Map Canvas" 
              className="w-full h-full object-contain filter invert contrast-200 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-red-500/25 to-purple-500/20 mix-blend-color-dodge pointer-events-none" />
            <div className="absolute bottom-4 left-4 bg-black/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
              Thermal Gradient: Red indicates localized pixel resaving disparity &gt; 38%
            </div>
          </div>
        </div>
      )}

      {/* Comparison Metrics Breakdown Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-300">
          Forensic Metrics Comparison Dossier
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Forensic Parameter</th>
                <th className="py-2.5 px-3 text-emerald-400">Control (Sample A)</th>
                <th className="py-2.5 px-3 text-red-400">Suspect (Sample B)</th>
                <th className="py-2.5 px-3 text-cyan-400">Differential Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-2.5 px-3 text-slate-300 font-semibold">Authenticity Score</td>
                <td className="py-2.5 px-3 text-emerald-400">{leftCase?.authenticityScore}%</td>
                <td className="py-2.5 px-3 text-red-400">{rightCase?.authenticityScore}%</td>
                <td className="py-2.5 px-3 text-cyan-300">
                  {Math.abs((leftCase?.authenticityScore || 0) - (rightCase?.authenticityScore || 0)).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-300 font-semibold">Manipulation Likelihood</td>
                <td className="py-2.5 px-3 text-slate-400">{leftCase?.fakeProbability}%</td>
                <td className="py-2.5 px-3 text-red-400">{rightCase?.fakeProbability}%</td>
                <td className="py-2.5 px-3 text-cyan-300">
                  {Math.abs((leftCase?.fakeProbability || 0) - (rightCase?.fakeProbability || 0)).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-300 font-semibold">Risk Classification</td>
                <td className="py-2.5 px-3 text-emerald-400">{leftCase?.riskLevel}</td>
                <td className="py-2.5 px-3 text-red-400">{rightCase?.riskLevel}</td>
                <td className="py-2.5 px-3 text-slate-400">Severity Divergence</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-300 font-semibold">Metadata Provenance</td>
                <td className="py-2.5 px-3 text-emerald-400">{leftCase?.metadata.isMetadataIntact ? 'Verified Intact' : 'Stripped'}</td>
                <td className="py-2.5 px-3 text-red-400">{rightCase?.metadata.isMetadataIntact ? 'Verified Intact' : 'Anomalous / Stripped'}</td>
                <td className="py-2.5 px-3 text-slate-400">Provenance Inconsistent</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-slate-300 font-semibold">Suspicious Regions</td>
                <td className="py-2.5 px-3 text-emerald-400">{leftCase?.suspiciousRegions.length || 0}</td>
                <td className="py-2.5 px-3 text-red-400">{rightCase?.suspiciousRegions.length || 0} localized</td>
                <td className="py-2.5 px-3 text-cyan-300">+{rightCase?.suspiciousRegions.length || 0} Anomaly Clusters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
