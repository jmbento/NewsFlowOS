import React from 'react';
import { useStore } from '../store';
import { FinancialDashboard } from './FinancialDashboard';
import { KanbanBoard } from './KanbanBoard';

/**
 * Home page – estilo Light Minimalist.
 * Seções:
 *   • Meu Trabalho (Kanban)
 *   • Recentes (últimos nodes criados)
 *   • Dashboard Financeiro de Comissões
 */
export const Home: React.FC = () => {
  const { nodes } = useStore();

  // Filtra os últimos 5 nodes criados (por data de criação simulada)
  const recentNodes = React.useMemo(() => {
    // Assume que cada node tem `createdAt` ISO string; fallback ao índice se não existir
    return [...nodes]
      .sort((a, b) => {
        const aDate = new Date((a.data?.createdAt as string) || 0).getTime();
        const bDate = new Date((b.data?.createdAt as string) || 0).getTime();
        return bDate - aDate;
      })
      .slice(0, 5);
  }, [nodes]);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 bg-[#F1F5F9] min-h-screen">
      {/* Meu Trabalho */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider mb-4">Meu Trabalho</h2>
        <KanbanBoard />
      </section>

      {/* Recentes */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider mb-4">Recentes</h2>
        <ul className="space-y-3">
          {recentNodes.map(node => (
            <li key={node.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
              <div className="w-3 h-3 rounded-full bg-brand-neon-blue" />
              <span className="font-medium text-slate-800">{node.data?.label || 'Node sem título'}</span>
              <span className="text-xs text-slate-500">{node.type}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Dashboard Financeiro */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider mb-4">Dashboard Financeiro de Comissões</h2>
        <FinancialDashboard />
      </section>
    </div>
  );
};
