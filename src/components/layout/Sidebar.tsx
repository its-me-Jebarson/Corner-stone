import React from 'react';
import { 
  LayoutDashboard, 
  ScanFace, 
  Image as ImageIcon, 
  Video, 
  Mic2, 
  Layers, 
  GitCompare, 
  Clock, 
  FileText, 
  Swords, 
  Settings, 
  ShieldCheck, 
  ExternalLink,
  Flame
} from 'lucide-react';
import { useAuth } from '../../services/authContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCrimeSceneNewTab: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenCrimeSceneNewTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { user, isDemoUser, logout } = useAuth();

  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'deepfake-analysis', label: 'Deepfake Analysis', icon: ScanFace, badge: 'Core' },
    { id: 'image-forensics', label: 'Image Forensics', icon: ImageIcon, badge: null },
    { id: 'video-forensics', label: 'Video Forensics', icon: Video, badge: null },
    { id: 'audio-forensics', label: 'Audio Forensics', icon: Mic2, badge: null },
    { id: 'evidence-fusion', label: 'Evidence Fusion', icon: Layers, badge: 'Multi-Signal' },
    { 
      id: 'crime-scene', 
      label: 'Crime Scene Forensics', 
      icon: Flame, 
      badge: 'Extension', 
      isSpecial: true,
      onClick: () => onOpenCrimeSceneNewTab()
    },
    { id: 'comparison', label: 'Comparison Mode', icon: GitCompare, badge: null },
    { id: 'history', label: 'Analysis History', icon: Clock, badge: null },
    { id: 'reports', label: 'Forensic Reports', icon: FileText, badge: null },
    { id: 'live-challenge', label: 'Live Challenge', icon: Swords, badge: 'Judge Mode' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed lg:sticky top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-slate-800/80 bg-[#090d16]/95 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Links Scrollable Container */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Forensic Suite
          </div>

          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    onNavigate(item.id);
                  }
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  item.isSpecial
                    ? 'bg-gradient-to-r from-amber-950/40 to-orange-950/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 hover:from-amber-950/60'
                    : isActive
                    ? 'bg-gradient-to-r from-cyan-950/70 to-blue-950/50 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    item.isSpecial ? 'text-amber-400' : isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono tracking-tight ${
                      item.isSpecial 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.isSpecial && (
                    <ExternalLink className="w-3 h-3 text-amber-400/80" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Section: Profile & Security */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070a12]/80 space-y-1">
          <div className="px-2 py-1 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
              Operator Session
            </span>
            {isDemoUser && (
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                DEMO
              </span>
            )}
          </div>

          <div className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="text-xs font-semibold text-white truncate">{user?.fullName || 'Examiner'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.organization || 'Forensics Unit'}</div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              Sign out
            </button>
          </div>
        </div>

      </aside>
    </>
  );
};
