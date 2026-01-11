
import React, { useMemo } from 'react';
import { useStore } from '../store';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  PieChart, 
  ArrowUpRight,
  ShieldCheck,
  History,
  Download,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FinancialDashboard: React.FC = () => {
  const { commissions, isMaster, team, leads, updateCommissionStatus } = useStore();

  const metrics = useMemo(() => {
    const total = commissions.reduce((sum, c) => sum + c.value, 0);
    const paid = commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.value, 0);
    const pending = commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.value, 0);
    const overdue = commissions.filter(c => c.status === 'OVERDUE').reduce((sum, c) => sum + c.value, 0);

    return { total, paid, pending, overdue };
  }, [commissions]);

  const displayCommissions = useMemo(() => {
    const sorted = [...commissions].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    return sorted.length > 0 ? sorted : [
      { id: '1', projectId: 'proj-1', userId: 'IA-SYSTEM', level: 0, value: 800, status: 'PAID', dueDate: '2026-01-01', paymentDate: '2026-01-02' },
      { id: '2', projectId: 'proj-2', userId: 'user-1', level: 1, value: 2000, status: 'PENDING', dueDate: '2026-02-10' },
      { id: '3', projectId: 'proj-3', userId: 'user-2', level: 2, value: 1200, status: 'OVERDUE', dueDate: '2025-12-30' },
    ];
  }, [commissions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID': return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[10px] font-bold">PAGO</span>;
      case 'OVERDUE': return <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded text-[10px] font-bold">ATRASADO</span>;
      default: return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-[10px] font-bold">PENDENTE</span>;
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#09090b] p-8 flex flex-col space-y-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic">Painel <span className="text-yellow-500">Financeiro</span></h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase font-bold tracking-widest">Gestão de comissões e transparência de pagamentos.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-zinc-100 dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-xl text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Exportar
           </button>
           {isMaster && (
             <button className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                Processar Lote
             </button>
           )}
        </div>
      </div>

      {/* Stats Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Geral', value: metrics.total, color: 'text-zinc-900 dark:text-white' },
          { label: 'Total Pago', value: metrics.paid, color: 'text-emerald-500' },
          { label: 'Pendente', value: metrics.pending, color: 'text-amber-500' },
          { label: 'Vencido', value: metrics.overdue, color: 'text-rose-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            <p className={`text-2xl font-black mt-2 italic ${stat.color}`}>R$ {stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 mb-4 px-1">Histórico de Comissões</h3>
          <div className="space-y-3">
            {displayCommissions.map((comm) => {
              const project = leads.find(l => l.id === comm.projectId);
              const user = team?.find(t => t.id === comm.userId);
              return (
                <div key={comm.id} className="bg-white dark:bg-[#18181b] border border-zinc-100 dark:border-[#27272a] p-4 rounded-xl flex items-center justify-between hover:border-yellow-500/50 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-50 dark:bg-black/40 rounded-xl border border-zinc-100 dark:border-[#27272a] flex items-center justify-center shadow-inner">
                       <DollarSign className={`w-6 h-6 ${comm.status === 'PAID' ? 'text-emerald-500' : 'text-zinc-400'}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase italic tracking-tight">{project?.data.projectName || 'Projeto Ad-hoc'}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-0.5 uppercase tracking-widest">
                        {user?.name || (comm.userId === 'IA-SYSTEM' ? 'IA Engine' : 'Colaborador')} • Nível {comm.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                       <p className="text-sm font-bold text-white">R$ {comm.value.toLocaleString()}</p>
                       <p className="text-[10px] text-zinc-500 mt-0.5">{new Date(comm.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="w-24 flex justify-end">
                       {getStatusBadge(comm.status)}
                    </div>
                    {isMaster && comm.status !== 'PAID' && (
                       <button 
                         onClick={() => updateCommissionStatus(comm.id, 'PAID')}
                         className="p-2 bg-emerald-500/10 text-emerald-500 rounded hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                       >
                          <CheckCircle2 className="w-4 h-4" />
                       </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

         <div className="space-y-6">
            {/* Card de Saldo Pessoal */}
            <div className="bg-yellow-400/5 border border-yellow-400/20 p-6 rounded-2xl shadow-sm">
               <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest">Disponível para Saque</span>
               <p className="text-3xl font-black text-zinc-900 dark:text-white mt-2 italic tracking-tight">R$ {metrics.pending.toLocaleString()}</p>
               <div className="mt-4 pt-4 border-t border-yellow-400/10 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span className="text-zinc-400 dark:text-zinc-500">Próximo Vencimento</span>
                     <span className="text-zinc-900 dark:text-zinc-300">10/02/2026</span>
                  </div>
               </div>
            </div>

            {/* Distribuição */}
            <div className="bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] p-6 rounded-2xl space-y-5 shadow-sm">
               <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Resumo de Atividade</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Closers', val: 70, color: 'bg-yellow-500' },
                    { label: 'Hunters', val: 20, color: 'bg-zinc-900 dark:bg-white' },
                    { label: 'IA Tech', val: 10, color: 'bg-emerald-500' }
                  ].map((d, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          <span>{d.label}</span>
                          <span className="text-zinc-900 dark:text-white">{d.val}%</span>
                       </div>
                       <div className="h-1.5 bg-zinc-200 dark:bg-black rounded-full overflow-hidden">
                          <div className={`h-full ${d.color} rounded-full transition-all duration-1000`} style={{ width: `${d.val}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
