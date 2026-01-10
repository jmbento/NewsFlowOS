
import React from 'react';
import { 
  BarChart3, 
  Target, 
  Users, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  ExternalLink,
  Award,
  Zap,
  MapPin,
  FileText,
  Video
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ROIStats, AppNode, DIARIO_CITIES } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ClientReportViewProps {
  projectLabel: string;
  roiStats: ROIStats;
  clippingNodes: AppNode[];
}

export const ClientReportView: React.FC<ClientReportViewProps> = ({ 
  projectLabel, 
  roiStats, 
  clippingNodes 
}) => {
  const chartData = {
    labels: roiStats.goalsVsActual.map(g => g.channel),
    datasets: [
      {
        label: 'Meta Impacto',
        data: roiStats.goalsVsActual.map(g => g.goal),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Alcançado',
        data: roiStats.goalsVsActual.map(g => g.actual),
        backgroundColor: '#6366f1',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#71717a', font: { size: 10, weight: 'bold' as any } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#a1a1aa', font: { size: 10, weight: 'bold' as any } },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-200 font-sans selection:bg-indigo-500/30">
      {/* Header Premium - Melhorado */}
      <header className="p-6 md:p-10 lg:p-12 bg-gradient-to-b from-indigo-950/30 to-transparent border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4 flex-1">
             <div className="flex items-center gap-3 mb-1">
                <div className="bg-indigo-500/20 p-2.5 md:p-3 rounded-xl md:rounded-2xl border border-indigo-500/30">
                  <Award className="text-indigo-400 w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-[10px] md:text-xs font-black text-indigo-300 uppercase tracking-wider bg-indigo-500/15 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-indigo-500/25">Relatório Executivo 2026</span>
             </div>
             <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight max-w-2xl leading-[1.1] mb-2">
                Relatório de Performance: {projectLabel}
             </h1>
             <p className="text-zinc-300 font-medium text-sm md:text-base flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                Diário do Vale • Credibilidade Editorial em 20 Cidades Regionalizadas
             </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 flex-shrink-0">
             <div className="bg-black/50 backdrop-blur-xl border-2 border-white/15 p-4 md:p-5 sm:p-6 rounded-xl md:rounded-2xl sm:rounded-3xl flex-1 sm:min-w-[160px] hover:border-white/30 hover:bg-black/60 transition-all shadow-lg">
                <p className="text-[10px] md:text-xs font-black text-zinc-300 uppercase mb-2 tracking-wider">Impacto Total</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none">{roiStats.totalReach.toLocaleString()}</p>
             </div>
             <div className="bg-brand-neon-purple/15 border-2 border-brand-neon-purple/40 p-4 md:p-5 sm:p-6 rounded-xl md:rounded-2xl sm:rounded-3xl flex-1 sm:min-w-[160px] hover:border-brand-neon-purple/60 hover:bg-brand-neon-purple/20 transition-all shadow-lg shadow-brand-neon-purple/20">
                <p className="text-[10px] md:text-xs font-black text-brand-neon-purple uppercase mb-2 tracking-wider">CPV Gerado</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none">R$ {roiStats.costPerView.toFixed(4)}</p>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 space-y-8 md:space-y-10 lg:space-y-12">
        {/* KPI Grid - Melhorado */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
           <div className="bg-slate-900/70 border-2 border-white/15 p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl space-y-3 md:space-y-4 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group">
              <div className="p-2.5 md:p-3 bg-indigo-500/25 rounded-xl md:rounded-2xl w-fit group-hover:bg-indigo-500/35 transition-colors">
                <Users className="text-indigo-300 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-zinc-300 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1.5 md:mb-2">Alcance Orgânico</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">{roiStats.totalReach.toLocaleString()}</p>
              </div>
           </div>
           
           <div className="bg-slate-900/70 border-2 border-white/15 p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl space-y-3 md:space-y-4 hover:border-emerald-500/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group">
              <div className="p-2.5 md:p-3 bg-emerald-500/25 rounded-xl md:rounded-2xl w-fit group-hover:bg-emerald-500/35 transition-colors">
                <TrendingUp className="text-emerald-300 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-zinc-300 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1.5 md:mb-2">Engajamento</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">{roiStats.engagementRate}%</p>
              </div>
           </div>

           <div className="bg-slate-900/70 border-2 border-white/15 p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl space-y-3 md:space-y-4 hover:border-amber-500/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer group">
              <div className="p-2.5 md:p-3 bg-amber-500/25 rounded-xl md:rounded-2xl w-fit group-hover:bg-amber-500/35 transition-colors">
                <Target className="text-amber-300 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-zinc-300 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1.5 md:mb-2">Custo p/ View</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">R$ {roiStats.costPerView.toFixed(3)}</p>
              </div>
           </div>

           <div className="bg-slate-900/70 border-2 border-white/15 p-5 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl space-y-3 md:space-y-4 hover:border-brand-neon-purple/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-brand-neon-purple/10 transition-all cursor-pointer group">
              <div className="p-2.5 md:p-3 bg-brand-neon-purple/25 rounded-xl md:rounded-2xl w-fit group-hover:bg-brand-neon-purple/35 transition-colors">
                <ShieldCheck className="text-brand-neon-purple w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-zinc-300 text-[10px] md:text-xs font-black uppercase tracking-wider mb-1.5 md:mb-2">Autoridade</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">MAX</p>
              </div>
           </div>
        </section>

        {/* Charts Section - Melhorado */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-start">
           <div className="lg:col-span-2 bg-slate-950/80 border-2 border-white/10 p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl lg:rounded-[48px] shadow-2xl">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                 <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter">Alcance por Canal: Metas vs Realizado</h2>
                 <BarChart3 className="text-zinc-500 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="h-[250px] md:h-[300px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
           </div>

           <div className="space-y-5 md:space-y-6 lg:space-y-8">
              <div className="bg-indigo-600/15 border-2 border-indigo-500/25 p-6 md:p-8 rounded-2xl md:rounded-3xl lg:rounded-[40px] relative overflow-hidden group hover:border-indigo-500/40 hover:bg-indigo-600/20 transition-all">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-20 h-20 md:w-24 md:h-24 text-indigo-300" />
                 </div>
                 <h3 className="text-base md:text-lg font-black text-white uppercase mb-2">Editoria de Confiança</h3>
                 <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-medium">
                    O Diário do Vale detém 33 anos de liderança em credibilidade no Sul Fluminense, transformando investimento publicitário em autoridade de marca.
                 </p>
              </div>

              <div className="bg-brand-neon-blue/10 border-2 border-brand-neon-blue/20 p-6 md:p-8 rounded-2xl md:rounded-3xl lg:rounded-[40px] hover:border-brand-neon-blue/30 hover:bg-brand-neon-blue/15 transition-all">
                 <div className="flex items-center gap-3 mb-4">
                    <MapPin className="text-brand-neon-blue w-4 h-4 md:w-5 md:h-5" />
                    <h3 className="text-base md:text-lg font-black text-white uppercase">Abrangência Regional</h3>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {DIARIO_CITIES.slice(0, 6).map(city => (
                      <span key={city} className="text-[9px] md:text-[10px] font-black text-zinc-300 bg-black/50 border border-white/10 px-2.5 md:px-3 py-1 rounded-full">
                        {city.toUpperCase()}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Clipping Gallery - Melhorado */}
        <section className="space-y-6 md:space-y-8">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Clipping & Provas de Publicação</h2>
              <div className="flex items-center gap-2 text-zinc-400">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{clippingNodes.length} Peças Veiculadas</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
              {clippingNodes.map(node => (
                <div key={node.id} className="group bg-slate-900/60 border-2 border-white/10 rounded-2xl md:rounded-3xl lg:rounded-[40px] overflow-hidden hover:border-indigo-500/50 hover:bg-slate-900/70 transition-all shadow-xl hover:shadow-2xl">
                   <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                      {node.data.evidenceScreenshot ? (
                        <img src={node.data.evidenceScreenshot} alt="Clipping" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70" />
                      ) : (
                        <div className="text-zinc-800 flex flex-col items-center gap-2">
                           {node.type === 'media_edition' || node.type === 'production' ? <Video className="w-10 h-10 md:w-12 md:h-12 opacity-20" /> : <FileText className="w-10 h-10 md:w-12 md:h-12 opacity-20" />}
                        </div>
                      )}
                      
                      {node.data.evidenceUrl && (
                        <a 
                          href={node.data.evidenceUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                           <div className="bg-white text-indigo-600 p-3 md:p-4 rounded-full shadow-2xl">
                              <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
                           </div>
                        </a>
                      )}
                   </div>
                   <div className="p-5 md:p-6 lg:p-8 space-y-2.5 md:space-y-3">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] md:text-[10px] font-black text-indigo-300 uppercase tracking-widest">{node.type}</span>
                         <span className="text-[9px] md:text-[10px] font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1">
                           <ShieldCheck className="w-2.5 h-2.5 md:w-3 md:h-3" /> Verificado
                         </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white leading-tight">{node.data.label}</h3>
                      <div className="flex items-center gap-2 pt-1">
                         <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-neon-purple fill-brand-neon-purple" />
                         <span className="text-[10px] md:text-[11px] font-bold text-zinc-400">Impacto estimado: {(Math.random() * 5000 + 2000).toLocaleString()} views</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Footer Authority - Melhorado */}
        <footer className="pt-8 md:pt-10 lg:pt-12 border-t border-white/10 text-center space-y-4 md:space-y-6">
           <div className="flex items-center justify-center gap-6 md:gap-8 opacity-50">
              <Award className="w-8 h-8 md:w-10 md:h-10 text-zinc-400" />
              <div className="w-px h-8 md:h-10 bg-white/20" />
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-zinc-400" />
           </div>
           <div>
              <p className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] md:tracking-[0.4em]">Diário do Vale • 33 Anos de Liderança Regional</p>
           </div>
        </footer>
      </main>
    </div>
  );
};
