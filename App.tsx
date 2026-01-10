
import React, { useEffect, useState, useMemo } from 'react';
import FeedbackFAB from './components/FeedbackFAB';
import { useStore } from './store';
import FlowCanvas from './components/FlowCanvas';
import KanbanBoard from './components/KanbanBoard';
import ChatInterface from './components/ChatInterface';
import MeetingRoom from './components/MeetingRoom';
import ProjectManagement from './components/ProjectManagement';
import TeamManagement from './components/TeamManagement';
import ProjectWizard from './components/ProjectWizard';
import { GovernancePortal } from './components/GovernancePortal';
import { LoginLanding } from './components/LoginLanding';
import { HelpCenter } from './components/HelpCenter';
import { AdminPanel } from './components/AdminPanel';
import { SettingsPage } from './components/SettingsPage';
import { FinancialDashboard } from './components/FinancialDashboard';
import OrgCanvas from './components/OrgCanvas';
import MyWork from './components/MyWork';
import MasterDashboard from './components/MasterDashboard';
import BrandHub from './components/BrandHub';
import PlaceholderView from './components/PlaceholderView';
import { Home } from './components/Home';
import { 
  LayoutDashboard, 
  Workflow, 
  MessageSquare, 
  Settings, 
  Bell, 
  CheckCircle2, 
  RefreshCw,
  Globe,
  ShieldCheck,
  Calendar,
  Briefcase,
  BarChart3,
  Mic,
  FolderOpen,
  Users,
  Plus,
  Menu,
  X,
  Search,
  Filter,
  Share2,
  Maximize2,
  Wallet,
  BookOpen,
  TrendingUp,
  Palette,
  UserPlus,
  Zap,
  Trash2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CuratorshipAdmin from './components/CuratorshipAdmin';
import EditorialCalendar from './components/EditorialCalendar';
import SalesCRM from './components/SalesCRM';
import { ClientReportView } from './components/ClientReportView';
import { ROICalculator } from './services/roi_calculator';
import { Dashboard } from './components/Dashboard';
import { OnboardingGuide } from './components/OnboardingGuide';
import ThemeLanguageToggle from './components/ThemeLanguageToggle';
import StatusSelector from './components/StatusSelector';
import { theme } from './services/theme';
import { SyncIndicator } from './components/SyncIndicator';
import { useAutosave } from './hooks/useAutosave';

const SpaceBackground = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="space-bg">
      {stars.map(star => (
        <div 
          key={star.id}
          className="star animate-star-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const { activeTab, setActiveTab, nodes, edges, initialize, team, userConsent, currentWorkspaceId } = useStore();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const syncStatus = useAutosave(currentWorkspaceId);

  // Inicialização do Sistema
  useEffect(() => {
    console.log('🚀 [APP] Inicializando NewsFlow OS...');
    try {
      initialize();
      theme.init();
      console.log('✅ [APP] Inicialização concluída');
    } catch (error) {
      console.error('❌ [APP] Erro na inicialização:', error);
    }
  }, [initialize]);

  // Status de Sincronização Visual
  useEffect(() => {
    if (nodes.length > 0) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [nodes, edges]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);

  const audiovisualInField = useMemo(() => {
    return team.filter(t => t.sector === 'Audiovisual' && (t.name === 'Marco' || t.name === 'Ruan'));
  }, [team]);

  return (
    <div className="flex h-screen w-screen bg-[#121212] overflow-hidden font-sans text-[#E0E0E0] selection:bg-yellow-500/30">
      {!userConsent && <LoginLanding />}
      
      {/* Header Superior Fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-[#1E1E1E] border-b border-[#2A2A2A] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img 
            src="/logo_diario.png" 
            className="h-8 object-contain" 
            alt="Diário do Vale" 
          />
          <div className="h-6 w-px bg-[#2A2A2A]" />
          <h1 className="text-sm font-bold text-[#FFD700]">NewsFlow OS</h1>
        </div>
        <div className="flex items-center gap-4">
          <StatusSelector />
          <ThemeLanguageToggle />
          {/* Perfil do usuário */}
          {user && (
            <div className="flex items-center gap-2">
              {user.avatar_url && (
                <img 
                  src={user.avatar_url} 
                  alt={user.name || 'Usuário'} 
                  className="w-8 h-8 rounded-full border-2 border-[#FFD700]"
                />
              )}
              <span className="text-sm text-[#E0E0E0]">{user.name || 'Usuário'}</span>
            </div>
          )}
        </div>
      </header>
      
      {/* Sidebar Nav (Dark Mode Premium) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 mt-16
        w-[240px] bg-[#1E1E1E] border-r border-[#2A2A2A]
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      style={{ height: 'calc(100vh - 4rem)', overflowY: 'auto' }}
      >
        <div className="p-6 pb-4 flex flex-col gap-2 flex-shrink-0">
          <img 
            src="/logo_diario.png" 
            className="h-8 object-contain self-start" 
            alt="Diário do Vale" 
          />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[9px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">NEWS FLOW</h1>
            <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">Sistema de Gestão v3.1</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 py-2 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Geral</div>
                    <button onClick={() => setActiveTab('home')} className={`sidebar-item w-full ${activeTab === 'home' ? 'sidebar-item-active' : ''}`}>
              <LayoutDashboard className="w-4 h-4" /> <span>Página Inicial</span>
            </button>
            <button onClick={() => setActiveTab('my-work')} className={`sidebar-item w-full ${activeTab === 'my-work' ? 'sidebar-item-active' : ''}`}>
              <Workflow className="w-4 h-4" /> <span>Meu Trabalho</span>
            </button>
            <button onClick={() => setActiveTab('canvas')} className={`sidebar-item w-full ${activeTab === 'canvas' ? 'sidebar-item-active' : ''}`}>
              <Workflow className="w-4 h-4" /> <span>Canvas Completo</span>
            </button>
            <button onClick={() => setActiveTab('search')} className={`sidebar-item w-full ${activeTab === 'search' ? 'sidebar-item-active' : ''}`}>
              <Search className="w-4 h-4" /> <span>Pesquisa Rápida</span>
            </button>
            <button onClick={() => setActiveTab('templates')} className={`sidebar-item w-full ${activeTab === 'templates' ? 'sidebar-item-active' : ''}`}>
              <FolderOpen className="w-4 h-4" /> <span>Central de Templates</span>
            </button>
            <button onClick={() => setActiveTab('brand-hub')} className={`sidebar-item w-full ${activeTab === 'brand-hub' ? 'sidebar-item-active' : ''}`}>
              <Palette className="w-4 h-4" /> <span>Brand Hub</span>
            </button>
            <button onClick={() => setActiveTab('calendar')} className={`sidebar-item w-full ${activeTab === 'calendar' ? 'sidebar-item-active' : ''}`}>
              <Calendar className="w-4 h-4" /> <span>Agenda</span>
            </button>

          <div className="pt-6 px-3 py-2 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Comercial & Finanças</div>
          <button onClick={() => setActiveTab('sales')} className={`sidebar-item w-full ${activeTab === 'sales' ? 'sidebar-item-active' : ''}`}>
            <Briefcase className="w-4 h-4" /> <span>CRM Comercial</span>
          </button>
          <button onClick={() => setActiveTab('financial')} className={`sidebar-item w-full ${activeTab === 'financial' ? 'sidebar-item-active' : ''}`}>
            <Wallet className="w-4 h-4" /> <span>Financeiro</span>
          </button>
          <button onClick={() => setActiveTab('report')} className={`sidebar-item w-full ${activeTab === 'report' ? 'sidebar-item-active' : ''}`}>
            <TrendingUp className="w-4 h-4" /> <span>Relatórios</span>
          </button>

          <div className="pt-6 px-3 py-2 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Acesso</div>
          <button onClick={() => setActiveTab('login')} className={`sidebar-item w-full ${activeTab === 'login' ? 'sidebar-item-active' : ''}`}>
            <ShieldCheck className="w-4 h-4" /> <span>Login Equipe/Admin</span>
          </button>
          <button onClick={() => setActiveTab('register')} className={`sidebar-item w-full ${activeTab === 'register' ? 'sidebar-item-active' : ''}`}>
            <UserPlus className="w-4 h-4" /> <span>Cadastro de Equipe</span>
          </button>

          <div className="pt-6 px-3 py-2 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Administração</div>
          <button onClick={() => setActiveTab('master-dashboard')} className={`sidebar-item w-full ${activeTab === 'master-dashboard' ? 'sidebar-item-active' : ''}`}>
            <BarChart3 className="w-4 h-4" /> <span>Dashboard Master</span>
          </button>
            <button onClick={() => setActiveTab('settings')} className={`sidebar-item w-full ${activeTab === 'settings' ? 'sidebar-item-active' : ''}`}>
              <Settings className="w-4 h-4" /> <span>Configurações</span>
            </button>
          <button onClick={() => setActiveTab('automation')} className={`sidebar-item w-full ${activeTab === 'automation' ? 'sidebar-item-active' : ''}`}>
            <Zap className="w-4 h-4" /> <span>Automações</span>
          </button>
          <button onClick={() => setActiveTab('trash')} className={`sidebar-item w-full ${activeTab === 'trash' ? 'sidebar-item-active' : ''}`}>
            <Trash2 className="w-4 h-4" /> <span>Lixeira</span>
          </button>
          <button onClick={() => setActiveTab('admin')} className={`sidebar-item w-full ${activeTab === 'admin' ? 'sidebar-item-active' : ''}`}>
            <ShieldCheck className="w-4 h-4" /> <span>Portal Administrativo</span>
          </button>
          <button onClick={() => setActiveTab('team')} className={`sidebar-item w-full ${activeTab === 'team' ? 'sidebar-item-active' : ''}`}>
            <Users className="w-4 h-4" /> <span>Equipes</span>
          </button>
          <button onClick={() => setActiveTab('org-canvas')} className={`sidebar-item w-full ${activeTab === 'org-canvas' ? 'sidebar-item-active' : ''}`}>
            <Users className="w-4 h-4" /> <span>Organograma</span>
          </button>
        </nav>

          {/* Status de Trabalho */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-black/5 dark:bg-white/[0.02]">
            <StatusSelector />
          </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-[#27272a] overflow-hidden shadow-inner">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marco" alt="Admin" className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-900 dark:text-white uppercase italic">Diretoria</span>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Master Cloud</span>
               </div>
            </div>
            <button className="p-2 text-zinc-400 hover:text-yellow-500 transition-all">
               <Settings className="w-4 h-4" />
            </button>
        </div>

        {/* Footer Credit */}
        <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <a 
            href="https://www.BXD.design" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[8px] font-medium text-zinc-400 dark:text-zinc-600 hover:text-purple-500 transition-colors"
          >
            Desenvolvido por www.BXD.design
          </a>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-brand-900/90 backdrop-blur-xl border border-black/10 dark:border-white/5 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-white transition-all"
      >
        <Workflow className="w-5 h-5" />
      </button>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden md:ml-0 bg-background">
        {/* Header Bar - Responsivo */}
        <header className="h-16 md:h-18 bg-background/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-8 flex items-center justify-between z-10 text-foreground">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Título removido - agora está no sidebar */}
          </div>
          
            <div className="flex items-center gap-2 md:gap-6 flex-shrink-0">
            <div className="hidden md:flex items-center gap-3">
              <SyncIndicator status={syncStatus} />
            </div>
            
            <div className="flex items-center gap-3 md:gap-5 md:pl-6 md:border-l md:border-black/10 md:dark:border-white/10">
               <div className="flex items-center gap-4 text-zinc-500 group cursor-pointer" onClick={() => setActiveTab('project_new')}>
                  <div className="w-10 h-10 rounded-xl bg-brand-neon-purple/10 flex items-center justify-center border border-brand-neon-purple/20 group-hover:bg-brand-neon-purple/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <Plus className="w-5 h-5 text-brand-neon-purple" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Novo Job</span>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase">Wizard Neural</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-zinc-200 dark:bg-white/5 mx-2 hidden sm:block"></div>
                <ThemeLanguageToggle />
               <button 
                 onClick={() => setHelpCenterOpen(true)}
                 className="hidden md:block text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative group"
                 title="Central de Ajuda"
               >
                 <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
               </button>
               <button className="hidden md:block text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors relative group">
                 <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-neon-purple rounded-full border-2 border-white dark:border-brand-900"></span>
               </button>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <span className="hidden sm:inline text-xs font-black text-emerald-500 uppercase tracking-wider">Conectado</span>
               </div>
            </div>
          </div>
        </header>

        {/* View Switcher */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {activeTab === 'home' && <Home />}
              {activeTab === 'canvas' && <FlowCanvas />}
              {activeTab === 'my-work' && <MyWork />}
              {activeTab === 'master-dashboard' && <MasterDashboard />}
              {activeTab === 'brand-hub' && <BrandHub />}
              {activeTab === 'search' && <PlaceholderView title="Pesquisa Rápida" description="Busca global em desenvolvimento" icon={Search} />}
              {activeTab === 'templates' && <PlaceholderView title="Central de Templates" description="Biblioteca de templates em desenvolvimento" icon={FolderOpen} />}
              {activeTab === 'kanban' && <KanbanBoard />}
              {activeTab === 'calendar' && <EditorialCalendar />}
              {activeTab === 'master' && <ProjectManagement />}
              {activeTab === 'sales' && <SalesCRM />}
              {activeTab === 'report' && (
                <ClientReportView 
                  projectLabel={nodes.find(n => n.type === 'campaign')?.data.label || 'Campanha Consolidada'} 
                  roiStats={nodes.find(n => n.type === 'campaign')?.data.roiStats || ROICalculator.calculateProjectROI(25000)}
                  clippingNodes={nodes.filter(n => n.data.evidenceUrl || n.data.evidenceScreenshot)}
                />
              )}
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'onboarding' && <OnboardingGuide />}
              {activeTab === 'meeting' && <MeetingRoom />}
              {activeTab === 'projects' && <ProjectManagement />}
              {activeTab === 'team' && <TeamManagement />}
              {activeTab === 'org-canvas' && <OrgCanvas />}
              {activeTab === 'project_new' && <ProjectWizard />}
              {activeTab === 'financial' && <FinancialDashboard />}
              {activeTab === 'profile' && <PlaceholderView title="Meu Perfil" description="Configurações de perfil em desenvolvimento" icon={UserPlus} />}
              {activeTab === 'automation' && <PlaceholderView title="Automações" description="Configuração de automações em desenvolvimento" icon={Zap} />}
              {activeTab === 'trash' && <PlaceholderView title="Lixeira" description="Itens excluídos em desenvolvimento" icon={Trash2} />}
              {activeTab === 'admin' && <AdminPanel />}
              {activeTab === 'login' && <LoginLanding />}
              {activeTab === 'register' && <LoginLanding />}
              {activeTab === 'settings' && <SettingsPage />}
              {activeTab === 'profile' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Feedback FAB */}
      <FeedbackFAB />
      
      {/* Help Center Drawer */}
      <HelpCenter isOpen={helpCenterOpen} onClose={() => setHelpCenterOpen(false)} />
    </div>
  );
};

export default App;

