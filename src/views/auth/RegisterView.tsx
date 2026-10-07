import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../services/authContext';

interface RegisterViewProps {
  onNavigateAuth: (view: 'login' | 'register' | 'forgot-password' | 'email-verification') => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigateAuth }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password);
      onNavigateAuth('email-verification');
    } catch (err: any) {
      if (err.message === 'EMAIL_ALREADY_EXISTS') {
        setError('An account with this email address already exists. Please login.');
      } else {
        setError('Failed to create account. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/30 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 mb-2">
          <ShieldAlert className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Create Investigator Account
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          TruthLense AI Multimodal Forensic Investigation Suite
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 space-y-5 shadow-2xl">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-slate-200">
            Account Registration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            A verification link will be dispatched to your email address
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
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Name &amp; Title</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Det. Jordan Walker"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Agency Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan.walker@forensics.org"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Master Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Confirm Password</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>Registering Record...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          <span>Already have an investigator account? </span>
          <button
            onClick={() => onNavigateAuth('login')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold font-mono underline ml-1"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
