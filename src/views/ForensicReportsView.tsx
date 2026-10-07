import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  FileJson, 
  Printer, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { getStoredAnalyses } from '../services/forensicEngine';
import { ForensicAnalysisResult } from '../types/forensics';
import { downloadForensicPdfReport, downloadForensicJson } from '../services/reportGenerator';

export const ForensicReportsView: React.FC = () => {
  const allAnalyses = useMemo(() => getStoredAnalyses(), []);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(allAnalyses[0]?.id || 'case-demo-01');

  const selectedCase = useMemo(() => {
    return allAnalyses.find(a => a.id === selectedCaseId) || allAnalyses[0];
  }, [allAnalyses, selectedCaseId]);

  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopySummary = () => {
    if (!selectedCase) return;
    const summaryText = `TRUTHLENSE AI FORENSIC AUDIT DOSSIER
Case ID: ${selectedCase.caseId}
File: ${selectedCase.fileName} (${selectedCase.fileSize})
Date: ${selectedCase.timestamp}
Verdict: ${selectedCase.verdict}
Authenticity Score: ${selectedCase.authenticityScore}%
Manipulation Likelihood: ${selectedCase.fakeProbability}%
Risk Level: ${selectedCase.riskLevel}
Confidence: ${selectedCase.confidence}%
Summary: ${selectedCase.summaryExplanation}
Primary Evidence:
${selectedCase.primaryEvidence.map((e, i) => `  ${i + 1}. ${e}`).join('\n')}
--------------------------------------------------
Certified by TruthLense AI v3.4.2 [HNX26PSI10]`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            COURT-READY DOSSIER EXPORTER
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Cryptographically Formatted Forensic Documentation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <FileText className="w-8 h-8 text-cyan-400" />
          <span>Forensic Reports &amp; Legal Export</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Generate official PDF dossiers compliant with ISO/IEC 27037 standards for digital evidence handling. Download structured JSON schemas for automated SOC integration.
        </p>
      </div>

      {/* Case Selector and Actions Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-slate-400">Select Case Record:</span>
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => selectedCase && downloadForensicPdfReport(selectedCase)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Dossier</span>
          </button>

          <button
            onClick={() => selectedCase && downloadForensicJson(selectedCase)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
          >
            <FileJson className="w-4 h-4 text-cyan-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
          >
            {copiedSummary ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Live Dossier Preview */}
      {selectedCase && (
        <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-slate-800 max-w-4xl mx-auto space-y-8 bg-[#090d16]/90 shadow-2xl">
          
          {/* Header block resembling formal dossier */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 font-mono tracking-wider">
                TRUTHLENSE AI — FORENSIC VERIFICATION REPORT
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Multimodal Deepfake &amp; Digital Forensics Evaluation Dossier
              </p>
            </div>

            <div className="text-right text-xs font-mono">
              <div className="text-cyan-400 font-bold">CASE: {selectedCase.caseId}</div>
              <div className="text-slate-400">{selectedCase.timestamp}</div>
              <div className="text-slate-400">ENGINE: v3.4.2 [PSI10]</div>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            selectedCase.verdict === 'FAKE' ? 'bg-red-950/40 border-red-500/50 text-red-300' :
            selectedCase.verdict === 'UNCERTAIN' ? 'bg-purple-950/40 border-purple-500/50 text-purple-300' :
            'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest block">
                Official Forensic Determination
              </span>
              <span className="text-lg font-black font-mono">
                {selectedCase.verdict === 'FAKE' ? 'VERDICT: FAKE / MANIPULATED' :
                 selectedCase.verdict === 'UNCERTAIN' ? 'VERDICT: UNCERTAIN (CONFLICTING EVIDENCE)' :
                 'VERDICT: AUTHENTIC / REAL'}
              </span>
            </div>

            <div className="text-right font-mono text-xs">
              <div>Authenticity Score: <strong className="text-white">{selectedCase.authenticityScore}%</strong></div>
              <div>Manipulation Likelihood: <strong className="text-white">{selectedCase.fakeProbability}%</strong></div>
              <div>Confidence: <strong className="text-white">{selectedCase.confidence}%</strong></div>
            </div>
          </div>

          {/* Media Info Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 border-b border-slate-800 pb-1">
              Section 1. Media Provenance &amp; Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">File Name</span>
                <span className="text-slate-200 line-clamp-1">{selectedCase.fileName}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">File Size</span>
                <span className="text-slate-200">{selectedCase.fileSize}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Format</span>
                <span className="text-slate-200">{selectedCase.metadata.format}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Hardware Pipeline</span>
                <span className="text-slate-200 line-clamp-1">{selectedCase.metadata.cameraMake || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Multi-Signal Evidence Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 border-b border-slate-800 pb-1">
              Section 2. Multi-Signal Evidence Analysis
            </h3>

            <div className="space-y-2">
              {selectedCase.signals.map((sig, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">{i + 1}.</span>
                    <span className="font-semibold text-slate-200">{sig.name}</span>
                    <span className="text-[10px] text-slate-400">[{sig.category}]</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">Confidence: {sig.confidence}%</span>
                    <span className={sig.score > 60 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                      Score: {sig.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Detailed Explanations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400 border-b border-slate-800 pb-1">
              Section 3. Explainable AI Forensic Rationale
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-slate-100">{selectedCase.summaryExplanation}</p>
              <ul className="space-y-1.5 pt-1">
                {selectedCase.detailedExplanations.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-cyan-400">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Mandatory Legal Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
            <div className="font-bold text-slate-300">FORENSIC EVIDENCE DISCLAIMER &amp; LIMITATIONS</div>
            <p>
              This document is an automated AI digital forensics analysis report. Machine-learning feature extraction constitutes investigative evidence and should be evaluated alongside physical provenance records, chain of custody logs, and certified human examiner review.
            </p>
          </div>

        </div>
      )}
    </div>
  );
};
