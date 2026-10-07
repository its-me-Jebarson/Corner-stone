import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, RotateCcw, ArrowLeft, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../services/authContext';

interface EmailVerificationViewProps {
  onNavigateAuth: (view: 'login' | 'register' | 'forgot-password' | 'email-verification') => void;
  onVerificationSuccess: () => void;
}

export const EmailVerificationView: React.FC<EmailVerificationViewProps> = ({
  onNavigateAuth,
  onVerificationSuccess
}) => {
  const { pendingVerificationEmail, verifyEmailToken, resendVerificationEmail, setPendingVerificationEmail } = useAuth();
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer for resending verification email
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendVerificationEmail();
      setResendSuccess(true);
      setCanResend(false);
      setCountdown(45);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: any) {
      setError('Failed to resend verification message.');
    }
  };

  const handleDevInstantVerify = async () => {
    setIsVerifying(true);
    setError(null);
    try {
      // In development mode, retrieve pending token from storage or use master verification
      await verifyEmailToken();
      onVerificationSuccess();
    } catch (err: any) {
      setError('Verification token failed or expired.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fadeIn">
      {/* Brand Icon */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/30 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 mb-2">
          <Mail className="w-8 h-8 text-cyan-400 animate-bounce" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Check Your Email
        </h1>
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Verification Dispatch Confirmation
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800/80 space-y-5 shadow-2xl">
        <div className="text-center space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed">
            We have dispatched a cryptographic verification link to:
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-cyan-300 font-semibold text-xs break-all">
            {pendingVerificationEmail || 'your.registered.email@domain.com'}
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Please click the link inside the email to activate your forensic credentials.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verification email re-dispatched successfully!</span>
          </div>
        )}

        {/* Development Mode Verification Box */}
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Dev / Offline Verification Mode</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            No SMTP email server configured for this session. Use the simulated verification token bypass below to activate the account.
          </p>
          <button
            onClick={handleDevInstantVerify}
            disabled={isVerifying}
            className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Verifying Token...' : 'Verify Account (Dev Token)'}</span>
          </button>
        </div>

        {/* Action Controls: Resend & Countdown */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
              canResend
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{canResend ? 'Resend Verification Email' : `Resend available in ${countdown}s`}</span>
          </button>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setPendingVerificationEmail(null);
                onNavigateAuth('register');
              }}
              className="hover:text-cyan-300 transition-colors"
            >
              Change Email
            </button>

            <button
              onClick={() => onNavigateAuth('login')}
              className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
