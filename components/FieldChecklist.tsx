
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Camera, 
  Send, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  User,
  Zap
} from 'lucide-react';
import { useStore } from '../store';
import { DIARIO_CITIES } from '../types';

export const FieldChecklist = () => {
  const { nodes, updateNodeData } = useStore();
  const [selectedCity, setSelectedCity] = useState<string>(DIARIO_CITIES[0]);

  // Filtra as OSs/Tarefas atribuídas ao usuário logado (Simulado: Master)
  const fieldTasks = nodes.filter(n => (n.type === 'os' || n.type === 'custom_action') && n.data.status !== 'done');

  return (
    <div className="flex flex-col h-full bg-slate-950 font-sans lg:hidden">
      {/* Header Mobile */}
      <div className="p-6 bg-gradient-to-br from-slate-900 to-black border-b border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand-neon-purple fill-brand-neon-purple" />
            FIELD HUB
          </h1>
          <div className="bg-brand-neon-blue/20 px-3 py-1 rounded-full border border-brand-neon-blue/30">
            <span className="text-[10px] font-black text-brand-neon-blue uppercase">Live</span>
          </div>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Diário do Vale • Cobertura Regional</p>
      </div>

      {/* City Selector (Horizontal Scroll) */}
      <div className="p-4 overflow-x-auto flex gap-3 scrollbar-hide bg-black/20">
        {DIARIO_CITIES.map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              selectedCity === city 
              ? 'bg-brand-neon-purple border-brand-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
              : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Main Action Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {fieldTasks.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mb-4" />
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Nenhuma tarefa pendente no campo.</p>
          </div>
        ) : (
          fieldTasks.map(task => (
            <div 
              key={task.id}
              className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 shadow-xl active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{task.type}</span>
                    <span className="text-[8px] font-bold text-zinc-600">• ID: {task.id.split('-')[1]}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-tight">{task.data.label}</h3>
                </div>
                <div className={`w-2 h-2 rounded-full ${task.data.status === 'doing' ? 'bg-brand-neon-blue animate-pulse' : 'bg-zinc-700'}`} />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateNodeData(task.id, { status: 'doing' })}
                  className="py-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10"
                >
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[9px] font-black text-zinc-400 uppercase">Iniciar</span>
                </button>
                <button 
                  onClick={() => updateNodeData(task.id, { status: 'done' })}
                  className="py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-2 text-emerald-500"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase">Concluir</span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-zinc-600" />
                  <span className="text-[10px] font-bold text-zinc-600">{selectedCity}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-800" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mobile Nav / Action Bar */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 grid grid-cols-3 gap-2">
         <button className="flex flex-col items-center gap-1 opacity-50">
           <MapPin className="w-5 h-5" />
           <span className="text-[8px] font-black uppercase">Mapa</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-brand-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.2)]">
           <div className="bg-brand-neon-purple/20 p-2 rounded-xl border border-brand-neon-purple/40">
             <Zap className="w-6 h-6 fill-current" />
           </div>
         </button>
         <button className="flex flex-col items-center gap-1 opacity-50">
           <User className="w-5 h-5" />
           <span className="text-[8px] font-black uppercase">Perfil</span>
         </button>
      </div>
    </div>
  );
};
