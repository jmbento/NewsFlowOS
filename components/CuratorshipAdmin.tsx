
import React, { useMemo } from 'react';
import { useStore } from '../store';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart3,
  Calendar,
  Search,
  Filter,
  ImageIcon,
  User,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import { simularCampanhaCompleta } from '../services/workflow_test';

const CuratorshipAdmin = () => {
  const { nodes, updateNodeData } = useStore();
  
  const pendingProductions = useMemo(() => {
    return nodes.filter(n => n.type === 'production' && n.data.status !== 'done');
  }, [nodes]);

  const kpis = {
    pending: pendingProductions.length,
    approved: nodes.filter(n => n.type === 'production' && n.data.approved).length,
    credits: 1240, // Mocked KPI
  };

  const approve = (id: string) => {
    updateNodeData(id, { approved: true, status: 'done' });
    console.log(`[MASTER_APPROVAL] Node ${id} approved for publishing.`);
  };

  return (
    <div className="w-full h-full bg-brand-950 p-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Curadoria <span className="text-brand-neon-purple">Master</span></h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-brand-neon-blue" />
            Painel de Governança Editorial
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
            <div className="w-10 h-10 rounded-xl bg-brand-neon-purple/20 flex items-center justify-center border border-brand-neon-purple/30">
               <Zap className="w-5 h-5 text-brand-neon-purple" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Créditos IA</p>
              <p className="text-xl font-black text-white">{kpis.credits}</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 min-w-[160px]">
            <div className="w-10 h-10 rounded-xl bg-brand-neon-blue/20 flex items-center justify-center border border-brand-neon-blue/30">
               <BarChart3 className="w-5 h-5 text-brand-neon-blue" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pendentes</p>
              <p className="text-xl font-black text-white">{kpis.pending}</p>
            </div>
          </div>

          <button 
            onClick={() => simularCampanhaCompleta()}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-emerald-500/20 transition-all active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500/40 transition-colors">
               <Play className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Teste de Stress Neural</p>
              <p className="text-[8px] font-bold text-emerald-500/60 uppercase">Executar Simulação</p>
            </div>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  type="text" 
                  placeholder="Filtrar produções..." 
                  className="bg-black/40 border border-white/5 rounded-xl pl-12 pr-6 py-3 text-xs text-white focus:outline-none focus:border-brand-neon-purple w-64 transition-all"
                />
             </div>
             <button className="p-3 bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white transition-all">
                <Filter className="w-4 h-4" />
             </button>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Visualização:</span>
             <button className="px-4 py-2 bg-brand-neon-purple text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-neon-purple/20">Tabela</button>
             <button className="px-4 py-2 bg-white/5 text-zinc-500 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Grade</button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Conteúdo do Post</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Responsável</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pendingProductions.map((node) => (
              <motion.tr 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={node.id} 
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-8 py-6 max-w-md">
                   <div className="flex flex-col gap-1">
                      <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">{node.data.postContent || "Sem conteúdo gerado"}</p>
                      <div className="flex items-center gap-2 mt-2">
                         <div className="w-4 h-4 rounded bg-brand-neon-blue/10 flex items-center justify-center">
                            <ImageIcon className="w-2 h-2 text-brand-neon-blue" />
                         </div>
                         <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{node.data.imageUrl ? 'Com Imagem AI' : 'Sem Mídia'}</span>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-neon-purple/20 flex items-center justify-center border border-brand-neon-purple/30">
                         <User className="w-4 h-4 text-brand-neon-purple" />
                      </div>
                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{node.data.assignee || 'Motor IA'}</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">
                      Pendente Aprovação
                   </span>
                </td>
                <td className="px-8 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => approve(node.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-neon-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-neon-purple/40 hover:scale-105 active:scale-95 transition-all"
                      >
                         <CheckCircle2 className="w-4 h-4" />
                         Aprovar e Agendar
                      </button>
                   </div>
                </td>
              </motion.tr>
            ))}
            {pendingProductions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-20">
                      <Clock className="w-12 h-12 text-zinc-500" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Tudo limpo! Nenhuma pendência master.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CuratorshipAdmin;
