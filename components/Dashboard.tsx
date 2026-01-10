
import React from 'react';
import { 
  Play, 
  BookOpen, 
  FileText, 
  Zap, 
  Users, 
  BarChart3,
  ArrowRight,
  Award
} from 'lucide-react';
import { useStore } from '../store';

export const Dashboard = () => {
  const { setActiveTab, nodes } = useStore();
  
  const stats = {
    totalNodes: nodes.length,
    completedNodes: nodes.filter(n => n.data.status === 'done').length,
    inProgressNodes: nodes.filter(n => n.data.status === 'doing').length
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 p-8 lg:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Hero Welcome */}
        <div className="relative bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-white/5 rounded-[48px] p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-neon-purple/10 blur-[150px] rounded-full -mr-48 -mt-48" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-brand-neon-purple/20 p-3 rounded-2xl border border-brand-neon-purple/30">
                  <Zap className="text-brand-neon-purple w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-black text-brand-neon-purple uppercase tracking-wider bg-brand-neon-purple/10 px-3 py-1.5 rounded-full border border-brand-neon-purple/20">NewsFlow OS v12.0</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                Bem-vindo ao <span className="text-brand-neon-purple">NewsFlow</span>
              </h1>
              <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
                A plataforma de gestão de produção multimídia do Diário do Vale. 33 anos de liderança, agora digital.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('canvas')}
                className="flex items-center gap-3 bg-brand-neon-purple text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand-neon-purple/20"
              >
                <span>Ir para o Canvas</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-slate-900/60 border-2 border-white/10 p-6 md:p-8 rounded-3xl md:rounded-[40px] hover:border-white/20 hover:bg-slate-900/70 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400 text-xs font-black uppercase tracking-wider">Total de Nós</p>
              <Users className="w-5 h-5 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
            </div>
            <p className="text-3xl md:text-4xl font-black text-white leading-tight">{stats.totalNodes}</p>
          </div>
          <div className="bg-slate-900/60 border-2 border-white/10 p-6 md:p-8 rounded-3xl md:rounded-[40px] hover:border-emerald-500/30 hover:bg-slate-900/70 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400 text-xs font-black uppercase tracking-wider">Concluídos</p>
              <Award className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-3xl md:text-4xl font-black text-emerald-500 leading-tight">{stats.completedNodes}</p>
          </div>
          <div className="bg-slate-900/60 border-2 border-white/10 p-6 md:p-8 rounded-3xl md:rounded-[40px] hover:border-brand-neon-blue/30 hover:bg-slate-900/70 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-400 text-xs font-black uppercase tracking-wider">Em Progresso</p>
              <BarChart3 className="w-5 h-5 text-brand-neon-blue group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-3xl md:text-4xl font-black text-brand-neon-blue leading-tight">{stats.inProgressNodes}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <button 
            onClick={() => setActiveTab('onboarding' as any)}
            className="group bg-indigo-500/10 border-2 border-indigo-500/20 p-6 md:p-8 rounded-3xl md:rounded-[40px] text-left hover:border-indigo-500/50 hover:bg-indigo-500/15 transition-all"
          >
            <div className="p-3 bg-indigo-500/20 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all">
              <Play className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
            </div>
            <h3 className="text-base md:text-lg font-black text-white mb-2 leading-tight">Guia de Integração</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Aprenda a usar o sistema passo a passo.</p>
          </button>

          <button 
            onClick={() => setActiveTab('sales')}
            className="group bg-emerald-500/10 border-2 border-emerald-500/20 p-6 md:p-8 rounded-3xl md:rounded-[40px] text-left hover:border-emerald-500/50 hover:bg-emerald-500/15 transition-all"
          >
            <div className="p-3 bg-emerald-500/20 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
            </div>
            <h3 className="text-base md:text-lg font-black text-white mb-2 leading-tight">Central de Vendas</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Gerencie propostas e oportunidades comerciais.</p>
          </button>

          <button 
            onClick={() => setActiveTab('report')}
            className="group bg-amber-500/10 border-2 border-amber-500/20 p-6 md:p-8 rounded-3xl md:rounded-[40px] text-left hover:border-amber-500/50 hover:bg-amber-500/15 transition-all"
          >
            <div className="p-3 bg-amber-500/20 rounded-2xl w-fit mb-4 group-hover:scale-110 group-hover:bg-amber-500/30 transition-all">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <h3 className="text-base md:text-lg font-black text-white mb-2 leading-tight">Relatório de ROI</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">Visualize o impacto das campanhas.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
