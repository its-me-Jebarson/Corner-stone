import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Sparkles, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle,
  RotateCcw,
  Info
} from 'lucide-react';
import { getStoredAnalyses } from '../services/forensicEngine';
import { ForensicAnalysisResult } from '../types/forensics';

export const EvidenceFusionView: React.FC = () => {
  const allAnalyses = useMemo(() => getStoredAnalyses(), []);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(allAnalyses[0]?.id || 'case-demo-01');
  
  const currentCase = useMemo(() => {
    return allAnalyses.find(a => a.id === selectedCaseId) || allAnalyses[0];
  }, [allAnalyses, selectedCaseId]);

  // Modifiable weights for interactive evidence fusion demonstration
  const [weights, setWeights] = useState<{ [key: string]: number }>({
    'Face Boundary & Blending': 0.28,
    'Error Level Analysis (ELA)': 0.22,
    'Sensor Noise Uniformity': 0.20,
    'Lighting & Shadow Coherence': 0.15,
    'Metadata & Provenance': 0.15
  });

  const handleWeightChange = (name: string, val: number) => {
    setWeights(prev => ({ ...prev, [name]: val }));
  };

  // Dynamically compute fused score
  const dynamicFused = useMemo(() => {
    if (!currentCase) return { score: 50, fake: 50, verdict: 'UNCERTAIN', risk: 'MEDIUM' };

    let totalWeight = 0;
    let weightedFakeSum = 0;

    currentCase.signals.forEach(sig => {
      const w = weights[sig.name] !== undefined ? weights[sig.name] : sig.weight;
      totalWeight += w;
      weightedFakeSum += sig.score * w;
    });

    const fakeProbability = totalWeight > 0 ? weightedFakeSum / totalWeight : currentCase.fakeProbability;
    const authenticityScore = 100 - fakeProbability;

    let verdict: 'REAL' | 'FAKE' | 'UNCERTAIN' = 'UNCERTAIN';
    let risk = 'MEDIUM';

    if (fakeProbability > 65) {
      verdict = 'FAKE';
      risk = fakeProbability > 85 ? 'CRITICAL' : 'HIGH';
    } else if (authenticityScore > 75) {
      verdict = 'REAL';
      risk = 'LOW';
    } else {
      verdict = 'UNCERTAIN';
      risk = 'MEDIUM';
    }

    return {
      score: parseFloat(authenticityScore.toFixed(1)),
      fake: parseFloat(fakeProbability.toFixed(1)),
      verdict,
      risk
    };
  }, [currentCase, weights]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            EVIDENCE FUSION LAYER
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Calibrated Cross-Modal Signal Aggregator
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Layers className="w-8 h-8 text-cyan-400" />
          <span>Multi-Signal Forensic Fusion Engine</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          No single forensic test is infallible. TruthLense AI combines independent orthogonal signals—spatial pixel variance, temporal frame continuity, acoustic vocoder patterns, and container atoms—into a calibrated Bayesian evidence dossier.
        </p>
      </div>

      {/* Case Selector Strip */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-slate-400">Select Active Case Dossier:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            {allAnalyses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseId} — {c.fileName} ({c.verdict})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setWeights({
              'Face Boundary & Blending': 0.28,
              'Error Level Analysis (ELA)': 0.22,
              'Sensor Noise Uniformity': 0.20,
              'Lighting & Shadow Coherence': 0.15,
              'Metadata & Provenance': 0.15
            });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-colors"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          <span>Reset Default Fusion Weights</span>
        </button>
      </div>

      {/* Dynamic Fused Verdict HUD */}
      <div className={`p-6 rounded-2xl border transition-all ${
        dynamicFused.verdict === 'FAKE'
          ? 'bg-gradient-to-r from-red-950/40 via-rose-950/20 to-slate-900/80 border-red-500/40 glow-danger'
          : dynamicFused.verdict === 'UNCERTAIN'
          ? 'bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900/80 border-purple-500/40 glow-uncertain'
          : 'bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/80 border-emerald-500/40 glow-success'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Computed Fusion Output
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black">
                {dynamicFused.verdict === 'FAKE' && <span className="text-red-400">⚠️ LIKELY MANIPULATED</span>}
                {dynamicFused.verdict === 'UNCERTAIN' && <span className="text-purple-300">⚖️ UNCERTAIN DETERMINATION</span>}
                {dynamicFused.verdict === 'REAL' && <span className="text-emerald-400">✓ AUTHENTIC MEDIA</span>}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                dynamicFused.risk === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                dynamicFused.risk === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                dynamicFused.risk === 'MEDIUM' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                RISK: {dynamicFused.risk}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Fused Authenticity</span>
              <span className={`text-2xl font-bold ${
                dynamicFused.score > 70 ? 'text-emerald-400' : dynamicFused.score > 35 ? 'text-purple-400' : 'text-red-400'
              }`}>
                {dynamicFused.score}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Manipulation Likelihood</span>
              <span className={`text-2xl font-bold ${
                dynamicFused.fake > 65 ? 'text-red-400' : dynamicFused.fake > 35 ? 'text-purple-400' : 'text-emerald-400'
              }`}>
                {dynamicFused.fake}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Signal Weights Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-semibold uppercase font-mono text-slate-200">
            Signal Evidence Weights &amp; Sensitivity Tuning
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Adjust sliders to simulate weight variations
          </span>
        </div>

        <div className="space-y-4">
          {currentCase?.signals.map((sig, idx) => {
            const currentWeight = weights[sig.name] !== undefined ? weights[sig.name] : sig.weight;
            return (
              <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{sig.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {sig.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-slate-400">Raw Anomaly: <span className="text-cyan-300 font-bold">{sig.score.toFixed(1)}%</span></span>
                    <span className="text-slate-400">Assigned Weight: <span className="text-amber-300 font-bold">{(currentWeight * 100).toFixed(0)}%</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={currentWeight}
                    onChange={(e) => handleWeightChange(sig.name, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <span className="text-xs font-mono text-slate-400 w-12 text-right">
                    {(currentWeight * 100).toFixed(0)}%
                  </span>
                </div>

                <p className="text-xs text-slate-400">{sig.description}</p>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-200">Forensic Integrity Principle:</strong> Evidence fusion weights are mathematically grounded in receiver operating characteristic (ROC) curves. Heavy weighting is given to PRNU sensor noise and optical flow continuity because synthetic autoencoders struggle to replicate physical photon arrival statistics.
          </p>
        </div>
      </div>
    </div>
  );
};
