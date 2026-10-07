import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  Save, 
  Sparkles,
  Info,
  Server
} from 'lucide-react';
import { 
  getAIProviderConfig, 
  saveAIProviderConfig, 
  testAPIKeyConnection, 
  AIProviderConfig, 
  AIProvider 
} from '../services/aiProviderService';

export const SettingsView: React.FC = () => {
  const [config, setConfig] = useState<AIProviderConfig>(getAIProviderConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; modelInfo?: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Forensic engine calibration thresholds
  const [uncertaintyThreshold, setUncertaintyThreshold] = useState(0.45);
  const [elaSensitivity, setElaSensitivity] = useState(75);
  const [lipSyncToleranceMs, setLipSyncToleranceMs] = useState(120);

  const handleSave = () => {
    saveAIProviderConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const apiKey = config.provider === 'gemini' ? config.geminiApiKey : config.openaiApiKey;
    const result = await testAPIKeyConnection(config.provider, apiKey);
    setTestResult(result);
    setTesting(false);

    if (result.success) {
      const updated = { ...config, isConnected: true, lastTestedAt: new Date().toISOString() };
      setConfig(updated);
      saveAIProviderConfig(updated);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
            SYSTEM CALIBRATION &amp; INTEGRATIONS
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Provider Keys • Local Processing Rules
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <SettingsIcon className="w-8 h-8 text-cyan-400" />
          <span>Platform Settings &amp; AI Provider Configuration</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Configure external multimodal vision-language models (Google Gemini / OpenAI GPT-4o) for automated second-opinion verification, or tune internal PSI10 mathematical thresholds.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2 font-mono animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings and API configurations saved successfully!</span>
        </div>
      )}

      {/* AI Provider Configuration Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold uppercase font-mono text-slate-200">
              Multimodal AI Provider Keys
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {config.isConnected ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Connected
              </span>
            ) : (
              <span className="text-slate-400">Offline / Local Mode</span>
            )}
          </span>
        </div>

        {/* Provider Radio Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setConfig(prev => ({ ...prev, provider: 'gemini' }))}
            className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all ${
              config.provider === 'gemini'
                ? 'bg-cyan-950/30 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Google Gemini API
            </div>
            <p className="text-[11px] text-slate-400">Gemini 1.5 Flash / Gemini 1.5 Pro</p>
          </button>

          <button
            type="button"
            onClick={() => setConfig(prev => ({ ...prev, provider: 'openai' }))}
            className={`p-3.5 rounded-xl border text-left font-mono text-xs transition-all ${
              config.provider === 'openai'
                ? 'bg-purple-950/30 border-purple-400 text-purple-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> OpenAI API
            </div>
            <p className="text-[11px] text-slate-400">GPT-4o Vision &amp; Reasoning</p>
          </button>
        </div>

        {/* API Key Input */}
        {config.provider === 'gemini' ? (
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>Google Gemini API Key:</span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Get API Key from Google AI Studio ↗
              </a>
            </label>
            <input
              type="password"
              value={config.geminiApiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, geminiApiKey: e.target.value }))}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>OpenAI API Key:</span>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-purple-400 hover:underline"
              >
                Get API Key from OpenAI Platform ↗
              </a>
            </label>
            <input
              type="password"
              value={config.openaiApiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, openaiApiKey: e.target.value }))}
              placeholder="sk-proj-..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Test Connection Button & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            <span>{testing ? 'Testing API Endpoint...' : 'Test API Connection'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>

        {/* Test Result Callout */}
        {testResult && (
          <div className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
            testResult.success
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/30 border-red-500/40 text-red-300'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">{testResult.message}</div>
              {testResult.modelInfo && (
                <div className="text-[11px] text-slate-400 mt-0.5">Model verified: {testResult.modelInfo}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Forensic Threshold Calibration (PSI10 Requirements) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold uppercase font-mono text-slate-200">
              PSI10 Mathematical Threshold Calibration
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Fine-tune anti-hallucination barriers and conflict rejection boundaries
          </p>
        </div>

        <div className="space-y-4 font-mono text-xs">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-semibold">Evidence Conflict Index (ECI) Uncertainty Limit</span>
              <span className="text-cyan-400 font-bold">{uncertaintyThreshold}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.8"
              step="0.05"
              value={uncertaintyThreshold}
              onChange={(e) => setUncertaintyThreshold(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              When conflicting signals exceed this threshold, the system enforces the UNCERTAIN determination.
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-semibold">Error Level Analysis (ELA) Compression Sensitivity</span>
              <span className="text-cyan-400 font-bold">{elaSensitivity}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              step="5"
              value={elaSensitivity}
              onChange={(e) => setElaSensitivity(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              Sensitivity threshold for detecting localized JPEG resave differentials.
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300 font-semibold">Phoneme-Viseme Lip-Sync Window Tolerance</span>
              <span className="text-cyan-400 font-bold">±{lipSyncToleranceMs} ms</span>
            </div>
            <input
              type="range"
              min="40"
              max="250"
              step="10"
              value={lipSyncToleranceMs}
              onChange={(e) => setLipSyncToleranceMs(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              Permissible human speech audio-visual offset before flagging desynchronization.
            </p>
          </div>
        </div>
      </div>

      {/* Engine & Environment Info */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs text-slate-400">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-semibold">Platform Version:</span>
          <span className="text-cyan-300">TruthLense Neural-Forensic Suite v3.4.2 [PSI10 Production]</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Client Storage:</span>
          <span>HTML5 LocalStorage Encrypted Vault</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Target Architecture:</span>
          <span>Multimodal Cross-Attention Fusion &amp; PRNU Extraction</span>
        </div>
      </div>
    </div>
  );
};
