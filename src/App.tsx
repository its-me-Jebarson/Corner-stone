import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './services/authContext';
import { ForensicBackgroundCanvas } from './components/layout/ForensicBackgroundCanvas';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './views/auth/LoginView';
import { RegisterView } from './views/auth/RegisterView';
import { EmailVerificationView } from './views/auth/EmailVerificationView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';
import { DashboardView } from './views/DashboardView';
import { DeepfakeAnalysisView } from './views/DeepfakeAnalysisView';
import { ImageForensicsView } from './views/ImageForensicsView';
import { VideoForensicsView } from './views/VideoForensicsView';
import { AudioForensicsView } from './views/AudioForensicsView';
import { EvidenceFusionView } from './views/EvidenceFusionView';
import { ComparisonView } from './views/ComparisonView';
import { AnalysisHistoryView } from './views/AnalysisHistoryView';
import { ForensicReportsView } from './views/ForensicReportsView';
import { LiveChallengeView } from './views/LiveChallengeView';
import { SettingsView } from './views/SettingsView';
import { CrimeSceneWorkspace } from './views/crimescene/CrimeSceneWorkspace';
import { ForensicAnalysisResult } from './types/forensics';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, isDemoUser } = useAuth();

  // Check URL query parameters or hash for direct routing (e.g. /crime-scene or ?view=crime-scene)
  const getInitialView = (): string => {
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam) return viewParam;

    const path = window.location.pathname;
    if (path.includes('crime-scene')) return 'crime-scene';

    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;

    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password' | 'email-verification'>('login');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeDossierCase, setActiveDossierCase] = useState<ForensicAnalysisResult | null>(null);
  const [compareSourceCase, setCompareSourceCase] = useState<ForensicAnalysisResult | null>(null);

  // Sync hash/search params
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      if (viewParam) setCurrentView(viewParam);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.history.pushState({}, '', `?view=${view}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch AI Crime Scene Forensics in New Tab (Section 22 requirement)
  const handleOpenCrimeSceneNewTab = () => {
    const newTabUrl = `${window.location.origin}${window.location.pathname}?view=crime-scene`;
    window.open(newTabUrl, '_blank');
  };

  const handleSelectCaseFromDashboardOrHistory = (caseItem: ForensicAnalysisResult) => {
    setActiveDossierCase(caseItem);
    handleNavigate('deepfake-analysis');
  };

  const handleCompareWithCase = (caseItem: ForensicAnalysisResult) => {
    setCompareSourceCase(caseItem);
    handleNavigate('comparison');
  };

  // If not authenticated, render auth views
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-cyan-500/20 selection:text-cyan-200">
        <ForensicBackgroundCanvas />
        <div className="relative z-10 w-full">
          {authView === 'login' && (
            <LoginView
              onNavigateAuth={setAuthView}
              onLoginSuccess={() => handleNavigate('dashboard')}
            />
          )}
          {authView === 'register' && (
            <RegisterView onNavigateAuth={setAuthView} />
          )}
          {authView === 'email-verification' && (
            <EmailVerificationView
              onNavigateAuth={setAuthView}
              onVerificationSuccess={() => handleNavigate('dashboard')}
            />
          )}
          {authView === 'forgot-password' && (
            <ForgotPasswordView onNavigateAuth={setAuthView} />
          )}
        </div>
      </div>
    );
  }

  // If viewing Crime Scene directly in its own tab/route
  const isDedicatedCrimeSceneTab = currentView === 'crime-scene';

  return (
    <div className="relative min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-200 flex flex-col">
      {/* Background Animated Canvas (Particles, Neural Net Lines, Scanlines) */}
      <ForensicBackgroundCanvas />

      {/* Demo Mode Badge if using Demo Account */}
      {isDemoUser && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 font-bold text-[11px] py-1 px-4 text-center tracking-widest uppercase font-mono shadow-md flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          <span>DEMO MODE ACTIVE — PRELOADED FORENSIC DATASETS PROTECTED</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCrimeSceneNewTab={handleOpenCrimeSceneNewTab}
      />

      <div className="flex-1 flex w-full relative z-10">
        {/* Responsive Sidebar (hidden in dedicated crime scene view for full-width immersion) */}
        {!isDedicatedCrimeSceneTab && (
          <Sidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenCrimeSceneNewTab={handleOpenCrimeSceneNewTab}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className={`flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all ${
          isDedicatedCrimeSceneTab ? 'max-w-7xl px-4' : ''
        }`}>
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectCase={handleSelectCaseFromDashboardOrHistory}
              onOpenCrimeSceneNewTab={handleOpenCrimeSceneNewTab}
            />
          )}

          {currentView === 'deepfake-analysis' && (
            <DeepfakeAnalysisView
              activeCase={activeDossierCase}
              onClearActiveCase={() => setActiveDossierCase(null)}
              onCompare={handleCompareWithCase}
            />
          )}

          {currentView === 'image-forensics' && (
            <ImageForensicsView />
          )}

          {currentView === 'video-forensics' && (
            <VideoForensicsView />
          )}

          {currentView === 'audio-forensics' && (
            <AudioForensicsView />
          )}

          {currentView === 'evidence-fusion' && (
            <EvidenceFusionView />
          )}

          {currentView === 'crime-scene' && (
            <CrimeSceneWorkspace
              onBackToDashboard={() => handleNavigate('dashboard')}
            />
          )}

          {currentView === 'comparison' && (
            <ComparisonView
              initialCase={compareSourceCase}
            />
          )}

          {currentView === 'history' && (
            <AnalysisHistoryView
              onSelectCase={handleSelectCaseFromDashboardOrHistory}
              onCompareWithCase={handleCompareWithCase}
            />
          )}

          {currentView === 'reports' && (
            <ForensicReportsView />
          )}

          {currentView === 'live-challenge' && (
            <LiveChallengeView />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-[#07090e]/90 text-slate-500 text-[11px] font-mono py-4 px-6 text-center relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">TruthLense AI</span>
          <span>•</span>
          <span>Multimodal Deepfake &amp; Digital Forensics Platform</span>
        </div>
        <div>
          <span>HackNex 2026 Internal Qualifier [HNX26PSI10]</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

export default App;
