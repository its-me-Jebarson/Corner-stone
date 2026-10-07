import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Trash2, 
  Download, 
  Eye, 
  GitCompare, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle,
  Bookmark,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ForensicAnalysisResult, RiskLevel } from '../types/forensics';
import { getStoredAnalyses, deleteAnalysis, toggleBookmark } from '../services/forensicEngine';
import { downloadForensicPdfReport } from '../services/reportGenerator';

interface AnalysisHistoryViewProps {
  onSelectCase: (analysis: ForensicAnalysisResult) => void;
  onCompareWithCase: (analysis: ForensicAnalysisResult) => void;
}

export const AnalysisHistoryView: React.FC<AnalysisHistoryViewProps> = ({
  onSelectCase,
  onCompareWithCase
}) => {
  const [historyList, setHistoryList] = useState<ForensicAnalysisResult[]>(() => getStoredAnalyses());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterMediaType, setFilterMediaType] = useState<string>('all');
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);

  const filteredAnalyses = useMemo(() => {
    return historyList.filter(item => {
      const matchSearch = item.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchVerdict = filterVerdict === 'all' || item.verdict === filterVerdict;
      const matchRisk = filterRisk === 'all' || item.riskLevel === filterRisk;
      const matchType = filterMediaType === 'all' || item.mediaType === filterMediaType;

      return matchSearch && matchVerdict && matchRisk && matchType;
    });
  }, [historyList, searchTerm, filterVerdict, filterRisk, filterMediaType]);

  const handleDelete = (id: string, isDemo?: boolean) => {
    if (isDemo) {
      setDeleteMsg('Demo records are protected by system security protocol and cannot be deleted.');
      setTimeout(() => setDeleteMsg(null), 3000);
      return;
    }

    const success = deleteAnalysis(id);
    if (success) {
      setHistoryList(getStoredAnalyses());
      setDeleteMsg('Case record deleted successfully.');
      setTimeout(() => setDeleteMsg(null), 2500);
    }
  };

  const handleToggleBookmark = (id: string) => {
    toggleBookmark(id);
    setHistoryList(getStoredAnalyses());
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            EVIDENCE DOSSIER REPOSITORY
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Cryptographically Logged Analysis Records
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Clock className="w-8 h-8 text-cyan-400" />
          <span>Case History &amp; Chain of Custody</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Audit trail of past media examinations. Filter by risk severity, export official dossiers, or load historical cases for comparative timeline inspection.
        </p>
      </div>

      {deleteMsg && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-300 flex items-center gap-2 animate-fadeIn font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{deleteMsg}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Case ID or File Name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterVerdict}
            onChange={(e) => setFilterVerdict(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Verdicts</option>
            <option value="REAL">Authentic (Real)</option>
            <option value="FAKE">Manipulated (Fake)</option>
            <option value="UNCERTAIN">Uncertain (Conflict)</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          <select
            value={filterMediaType}
            onChange={(e) => setFilterMediaType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
          </select>
        </div>
      </div>

      {/* Case Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-3">Mark</th>
                <th className="py-3 px-3">Case ID</th>
                <th className="py-3 px-3">Media Artifact</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Forensic Verdict</th>
                <th className="py-3 px-3">Authenticity</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    No matching forensic cases found in repository.
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((item) => {
                  const isItemFake = item.verdict === 'FAKE';
                  const isItemUncertain = item.verdict === 'UNCERTAIN';

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                      onClick={() => onSelectCase(item)}
                    >
                      <td className="py-3 px-3" onClick={(e) => { e.stopPropagation(); handleToggleBookmark(item.id); }}>
                        <Bookmark className={`w-3.5 h-3.5 transition-colors ${
                          item.bookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-600 hover:text-slate-300'
                        }`} />
                      </td>

                      <td className="py-3 px-3 font-bold text-cyan-300">
                        {item.caseId}
                        {item.isDemo && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] uppercase bg-amber-950 text-amber-300 border border-amber-800">
                            DEMO
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-sans font-medium text-slate-200">
                        <div className="line-clamp-1 max-w-[200px]">{item.fileName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{item.fileSize}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-900 text-slate-300 border border-slate-800">
                          {item.mediaType}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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

                      <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectCase(item)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
                            title="View Forensic Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onCompareWithCase(item)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
                            title="Compare in Side-by-Side Mode"
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => downloadForensicPdfReport(item)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
                            title="Download Official PDF Report"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id, item.isDemo)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
                            title={item.isDemo ? 'Demo Record (Protected)' : 'Delete Record'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
