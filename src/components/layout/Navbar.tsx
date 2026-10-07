import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  ExternalLink, 
  PlusCircle, 
  Activity, 
  User, 
  LogOut,
  Bell,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../services/authContext';

interface NavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onOpenCrimeSceneNewTab: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onNavigate, 
  currentView,
  onOpenCrimeSceneNewTab 
}) => {
  const { user, isDemoUser, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0a0e18]/85 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Logo Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/30 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400 transition-all">
              <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                  TruthLense AI
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 rounded">
                  PSI10
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight hidden md:block">
                Multimodal Deepfake &amp; Digital Forensics
              </p>
            </div>
          </div>
        </div>

        {/* Center: System Status & Quick Stats */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono text-[11px]">
              Engine v3.4.2 [Online]
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-mono text-[11px] flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Multi-Signal Fusion
            </span>
          </div>
        </div>

        {/* Right: Actions & User Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Crime Scene Forensics Action */}
          <button
            onClick={onOpenCrimeSceneNewTab}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-600/20 to-amber-700/20 hover:from-amber-500/30 hover:to-orange-600/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 text-xs font-semibold tracking-wide transition-all shadow-lg shadow-amber-900/20 group"
            title="Open AI Crime Scene Forensics Workspace in New Window/Tab"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Crime Scene Forensics</span>
            <span className="sm:hidden">Scene</span>
            <ExternalLink className="w-3 h-3 text-amber-400/80" />
          </button>

          {/* Start New Analysis CTA */}
          <button
            onClick={() => onNavigate('deepfake-analysis')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs tracking-wide shadow-md shadow-cyan-500/20 transition-all hover:shadow-cyan-400/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Analysis</span>
          </button>

          {/* User Profile Mini Tag */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
              {user?.fullName?.substring(0, 2).toUpperCase() || 'EX'}
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <div className="text-white font-semibold truncate max-w-[120px]">{user?.fullName || 'Examiner'}</div>
              <div className="text-[10px] text-slate-400">{user?.role || 'Analyst'}</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
