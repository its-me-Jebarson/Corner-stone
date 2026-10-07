import React, { useState } from 'react';
import { ShieldAlert, Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigateAuth: (view: 'login' | 'register' | 'forgot-password' | 'email-verification') => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigateAuth }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/30 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 mb-2">
          <ShieldAlert className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Reset Credentials
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Account Recovery Protocol
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 space-y-5 shadow-2xl">
        {submitted ? (
          <div className="text-center space-y-4 py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-slate-200 uppercase font-mono">
                Recovery Link Dispatched
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an investigator record exists for <span className="text-cyan-300 font-mono">{email}</span>, you will receive password reset instructions.
              </p>
            </div>
            <button
              onClick={() => onNavigateAuth('login')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Registered Email</span>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? (
                <span>Dispatching Token...</span>
              ) : (
                <>
                  <span>Send Recovery Instructions</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onNavigateAuth('login')}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors font-mono"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
