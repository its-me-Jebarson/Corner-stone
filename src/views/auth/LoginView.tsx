import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../services/authContext';

interface LoginViewProps {
  onNavigateAuth: (view: 'login' | 'register' | 'forgot-password' | 'email-verification') => void;
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigateAuth, onLoginSuccess }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        onNavigateAuth('email-verification');
      } else {
        setError('Invalid email or password. Please verify your credentials or use the Demo Account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    loginAsDemo();
    onLoginSuccess();
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/30 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 mb-2">
          <ShieldAlert className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          TruthLense AI
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Multimodal Deepfake &amp; Digital Forensics Platform
        </p>
      </div>

      {/* Demo Credentials Quick-Launch Box (Mandated by Section 7) */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-500/40 shadow-lg shadow-amber-950/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
              Evaluator Demo Mode
            </span>
          </div>
          <span className="px-1.5 py-0.5 text-[10px] font-mono bg-amber-900/60 text-amber-300 rounded border border-amber-700/50">
            DEMO READY
          </span>
        </div>

        <div className="text-xs text-slate-300 font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
          <div><span className="text-slate-400">Email:</span> <span className="text-cyan-300 font-bold">demo@truthlens.ai</span></div>
          <div><span className="text-slate-400">Password:</span> <span className="text-cyan-300 font-bold">Demo@12345</span></div>
        </div>

        <button
          type="button"
          onClick={handleDemoClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all shadow-md shadow-amber-500/20 hover:scale-[1.01]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Try Demo Account (One-Click)</span>
        </button>
      </div>

      {/* Standard Login Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 space-y-5 shadow-2xl">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-200">
            Investigator Sign In
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Access secure evidence vaults and forensic analysis tools
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-xs text-red-300 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="investigator@agency.gov"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigateAuth('forgot-password')}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Vault</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Don't have an investigator account? </span>
          <button
            onClick={() => onNavigateAuth('register')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold font-mono underline ml-1"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};
