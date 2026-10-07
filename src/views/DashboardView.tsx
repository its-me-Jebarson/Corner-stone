import React, { useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  TrendingUp, 
  PieChart, 
  AlertTriangle, 
  Flame, 
  PlusCircle, 
  ExternalLink, 
  ArrowRight, 
  Clock, 
  Eye, 
  FileText,
  Activity,
  Layers,
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';
import { ForensicAnalysisResult } from '../types/forensics';
import { getStoredAnalyses } from '../services/forensicEngine';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSelectCase: (analysis: ForensicAnalysisResult) => void;
  onOpenCrimeSceneNewTab: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onSelectCase,
  onOpenCrimeSceneNewTab
}) => {
  const analyses = useMemo(() => getStoredAnalyses(), []);

  // Compute Dashboard Statistics
  const stats = useMemo(() => {
    const total = analyses.length;
    const realCount = analyses.filter(a => a.verdict === 'REAL').length;
    const fakeCount = analyses.filter(a => a.verdict === 'FAKE').length;
    const uncertainCount = analyses.filter(a => a.verdict === 'UNCERTAIN').length;
    const highRiskCount = analyses.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL').length;
    
    const avgScore = total > 0 
      ? (analyses.reduce((acc, a) => acc + a.authenticityScore, 0) / total).toFixed(1)
      : '0.0';

    return { total, realCount, fakeCount, uncertainCount, highRiskCount, avgScore };
  }, [analyses]);

  // Breakdown for charts
  const mediaDistribution = useMemo(() => {
    const images = analyses.filter(a => a.mediaType === 'image').length;
    const videos = analyses.filter(a => a.mediaType === 'video').length;
    const audio = analyses.filter(a => a.mediaType === 'audio').length;
    return { images, videos, audio };
  }, [analyses]);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Top Welcome & Quick Actions Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              PSI10 CERTIFIED PLATFORM
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Investigation Session
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Forensic Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Multimodal deepfake detection, cross-modal signal fusion, and explainable digital evidence verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('deepfake-analysis')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start New Analysis</span>
          </button>
        </div>
      </div>

      {/* Prominent AI Crime Scene Forensics Extension Card (Section 4 & 22) */}
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[#170e06] via-[#1a1208] to-[#0c101c] border border-amber-500/40 shadow-xl shadow-amber-950/20 group hover:border-amber-400 transition-all">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/20">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-400">
                Advanced Forensic Extension
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-700/60">
                Separate Route / New Tab
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300">
              AI Crime Scene Forensics Workspace
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Detect visual evidence in complex crime scenes: knife-like objects, fluid/blood-like patterns, footwear impressions, and body postures. Compare physical scene evidence with suspect reference artifacts using computer vision embeddings.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Object Localization
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                Evidence Comparison Graph
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Court-Ready PDF Dossier
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenCrimeSceneNewTab}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.03]"
            >
              <span>Launch Crime Scene Workspace</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-400 font-mono">
              Opens dedicated /crime-scene workspace
            </p>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[
          { 
            label: 'Total Analyses', 
            value: stats.total, 
            sub: 'Processed Cases', 
            icon: Layers, 
            color: 'text-cyan-400', 
            border: 'border-cyan-500/30',
            bg: 'bg-cyan-950/20'
          },
          { 
            label: 'Authentic (Real)', 
            value: stats.realCount, 
            sub: 'PRNU Verified', 
            icon: ShieldCheck, 
            color: 'text-emerald-400', 
            border: 'border-emerald-500/30',
            bg: 'bg-emerald-950/20'
          },
          { 
            label: 'Manipulated (Fake)', 
            value: stats.fakeCount, 
            sub: 'Synthetic Found', 
            icon: ShieldAlert, 
            color: 'text-red-400', 
            border: 'border-red-500/30',
            bg: 'bg-red-950/20'
          },
          { 
            label: 'Uncertain Media', 
            value: stats.uncertainCount, 
            sub: 'Conflict Guard', 
            icon: HelpCircle, 
            color: 'text-purple-400', 
            border: 'border-purple-500/30',
            bg: 'bg-purple-950/20'
          },
          { 
            label: 'Avg Authenticity', 
            value: `${stats.avgScore}%`, 
            sub: 'Calibrated Score', 
            icon: TrendingUp, 
            color: 'text-blue-400', 
            border: 'border-blue-500/30',
            bg: 'bg-blue-950/20'
          },
          { 
            label: 'High-Risk Cases', 
            value: stats.highRiskCount, 
            sub: 'Immediate Flag', 
            icon: AlertTriangle, 
            color: 'text-orange-400', 
            border: 'border-orange-500/30',
            bg: 'bg-orange-950/20'
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className={`glass-panel p-4 rounded-2xl border ${kpi.border} ${kpi.bg} flex flex-col justify-between hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  {kpi.label}
                </span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <span className={`text-2xl font-black font-mono tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </span>
                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                  {kpi.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics & Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real vs Fake vs Uncertain Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-300 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Verdict Distribution
            </h2>
            <span className="text-[10px] font-mono text-slate-400">PSI10 Tri-State</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Authentic (Real)
                </span>
                <span className="text-slate-300 font-bold">
                  {stats.realCount} ({stats.total > 0 ? ((stats.realCount / stats.total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.realCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-red-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" /> Manipulated (Fake)
                </span>
                <span className="text-slate-300 font-bold">
                  {stats.fakeCount} ({stats.total > 0 ? ((stats.fakeCount / stats.total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.fakeCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-purple-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" /> Uncertain (Conflict Guard)
                </span>
                <span className="text-slate-300 font-bold">
                  {stats.uncertainCount} ({stats.total > 0 ? ((stats.uncertainCount / stats.total) * 100).toFixed(0) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${stats.total > 0 ? (stats.uncertainCount / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono leading-relaxed">
            Note: Uncertain cases protect against false positives when lossy compression masks PRNU sensor signatures.
          </div>
        </div>

        {/* Media Modality Breakdown */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Media Modality Split
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Cross-Modal</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Images</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{mediaDistribution.images}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ELA / Noise</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Videos</span>
              <span className="text-xl font-bold font-mono text-blue-400">{mediaDistribution.videos}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">LipSync / Frame</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Audio</span>
              <span className="text-xl font-bold font-mono text-purple-400">{mediaDistribution.audio}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Vocoder / Jitter</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              Multi-Signal Fusion Engine
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every media file undergoes multi-level cross-examination across spatial pixels, temporal continuity, biomechanical acoustics, and container atoms.
            </p>
          </div>
        </div>

        {/* System Activity & Engine Health */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-slate-300 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Engine Health &amp; Rules
            </h2>
            <span className="text-[10px] font-mono text-emerald-400">STATUS: NOMINAL</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Core Engine:</span>
              <span className="text-cyan-300">TruthLense Neural v3.4.2</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Protocol Spec:</span>
              <span className="text-cyan-300">HNX26PSI10 Compliant</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Evidence Conflict Index:</span>
              <span className="text-emerald-400">Calibrated &lt; 0.45</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Local Processing:</span>
              <span className="text-emerald-400">HTML5 Canvas + WebWorker</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition-colors text-center block"
          >
            Configure AI Providers (Gemini / OpenAI) →
          </button>
        </div>
      </div>

      {/* Recent Investigations Table (Section 4) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-200">
              Recent Forensic Investigations
            </h2>
            <p className="text-xs text-slate-400">
              Audited case records, confidence ratings, and official determinations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 transition-colors"
            >
              <span>View Full History ({analyses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3">Case ID</th>
                <th className="py-3 px-3">Examined Media</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Forensic Verdict</th>
                <th className="py-3 px-3">Authenticity</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {analyses.slice(0, 6).map((item) => {
                const isItemFake = item.verdict === 'FAKE';
                const isItemUncertain = item.verdict === 'UNCERTAIN';
                const isItemReal = item.verdict === 'REAL';

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-900/50 cursor-pointer transition-colors group"
                    onClick={() => onSelectCase(item)}
                  >
                    <td className="py-3 px-3 font-bold text-cyan-300">
                      {item.caseId}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-sans font-medium text-slate-200 line-clamp-1 max-w-[200px]">
                        {item.fileName}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.fileSize}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-900 text-slate-300 border border-slate-800">
                        {item.mediaType}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                        isItemFake ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        isItemUncertain ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {item.verdict === 'FAKE' ? 'MANIPULATED' : item.verdict}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold">
                      <span className={
                        item.authenticityScore > 70 ? 'text-emerald-400' :
                        item.authenticityScore > 35 ? 'text-purple-400' : 'text-red-400'
                      }>
                        {item.authenticityScore}%
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        item.riskLevel === 'CRITICAL' ? 'text-red-400 bg-red-950/60' :
                        item.riskLevel === 'HIGH' ? 'text-orange-400 bg-orange-950/60' :
                        item.riskLevel === 'MEDIUM' ? 'text-purple-400 bg-purple-950/60' :
                        'text-emerald-400 bg-emerald-950/60'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-400 text-[11px]">
                      {item.timestamp.substring(0, 10)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(item);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
