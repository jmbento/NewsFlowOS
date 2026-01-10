import React, { useState } from 'react';
import { 
  Plus, 
  Video, 
  FileText, 
  Palette, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  Zap,
  Globe,
  Layout,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { LogisticsEngine } from '../services/logistics_engine';

interface InputType {
  id: string;
  label: string;
  icon: any;
  subTasks: { label: string, role?: 'CAPTURE' | 'EDITOR', squadSize?: number }[];
  color: string;
}

const PROJECT_TREE_TEMPLATES: InputType[] = [
  { 
    id: 'VIDEO', 
    label: 'INPUT VÍDEO', 
    icon: Video, 
    color: 'brand-neon-purple',
    subTasks: [
      { label: 'Captação', role: 'CAPTURE', squadSize: 3 }, 
      { label: 'Decupagem' }, 
      { label: 'Edição', role: 'EDITOR', squadSize: 2 }, 
      { label: 'Finalização/Motion' }
    ] 
  },
  { 
    id: 'IMPRESSO', 
    label: 'INPUT IMPRESSO (3A)', 
    icon: Layout, 
    color: 'emerald-500',
    subTasks: [
      { label: 'Diagramação' }, 
      { label: 'Revisão P. 5' }, 
      { label: 'Capa/Text Alt' }
    ] 
  },
  { 
    id: 'SITE', 
    label: 'INPUT SITE (3B)', 
    icon: Globe, 
    color: 'brand-neon-blue',
    subTasks: [
      { label: 'Links' }, 
      { label: 'Tags' }, 
      { label: 'Thumbnail' }, 
      { label: 'Agendamento' }
    ] 
  }
];

export const ProjectInputTree = ({ onClose }: { onClose: () => void }) => {
  const { addNode, nodes } = useStore();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isActivating, setIsActivating] = useState(false);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleActivate = async () => {
    setIsActivating(true);
    const campaignNode = nodes.find(n => n.type === 'campaign');
    const baseX = campaignNode ? campaignNode.position.x + 400 : 100;
    const baseY = campaignNode ? campaignNode.position.y : 100;

    for (const typeId of selectedTypes) {
      const template = PROJECT_TREE_TEMPLATES.find(t => t.id === typeId);
      if (!template) continue;

      // Cria nó principal do Input
      const inputNodeId = `input-${typeId}-${Math.random().toString(36).substring(7)}`;
      addNode('custom_action', { x: baseX, y: baseY + (selectedTypes.indexOf(typeId) * 300) }, {
        label: template.label,
        status: 'todo',
        checklist: template.subTasks.map(st => ({ label: st.label, done: false }))
      });

      // Se for Vídeo, tenta alocar squad automaticamente para os sub-inputs críticos
      if (typeId === 'VIDEO') {
        const deadline = campaignNode?.data.deadline || new Date().toISOString().split('T')[0];
        
        for (const st of template.subTasks) {
          if (st.role && st.squadSize) {
            const squad = await LogisticsEngine.checkSquadAvailability(
              st.role, 
              st.squadSize, 
              `${deadline}T09:00:00`, 
              `${deadline}T18:00:00`
            );
            
            if (squad.available) {
               console.log(`✅ [TEAM_ORCHESTRATOR]: Alocados ${squad.assignedIds.length} profissionais para ${st.label}`);
            } else {
               console.warn(`⚠️ [TEAM_ORCHESTRATOR]: Falhou alocação de equipe mínima para ${st.label}`);
            }
          }
        }
      }
    }

    setIsActivating(false);
    onClose();
  };

  return (
    <div className="bg-white border border-slate-300 rounded-md p-8 shadow-lg max-w-4xl w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-purple-100 flex items-center justify-center border border-purple-300">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Orquestrador de Execução</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Definição de Ativos e Equipe (Whiteboard Flow)</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROJECT_TREE_TEMPLATES.map((tmpl) => (
          <motion.div
            key={tmpl.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => toggleType(tmpl.id)}
            className={`cursor-pointer rounded-md p-6 border-2 transition-all relative overflow-hidden ${
              selectedTypes.includes(tmpl.id) 
                ? 'bg-purple-50 border-purple-300 shadow-sm' 
                : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            {selectedTypes.includes(tmpl.id) && (
              <div className="absolute top-2 right-2 p-1.5 bg-purple-600 rounded-md">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            )}
            
            <tmpl.icon className={`w-10 h-10 mb-4 ${selectedTypes.includes(tmpl.id) ? 'text-purple-600' : 'text-slate-400'}`} />
            <span className={`text-sm font-semibold leading-none block ${selectedTypes.includes(tmpl.id) ? 'text-slate-900' : 'text-slate-500'}`}>
              {tmpl.label}
            </span>
            
            <div className="mt-6 space-y-2">
              {tmpl.subTasks.map((st, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className={`w-1.5 h-1.5 rounded-full ${selectedTypes.includes(tmpl.id) ? 'bg-purple-500' : 'bg-slate-300'}`} />
                   <span className="text-xs font-medium text-slate-600">{st.label}</span>
                   {st.squadSize && (
                     <div className="flex items-center gap-1 ml-auto bg-slate-100 px-2 py-0.5 rounded-md">
                        <Users className="w-2.5 h-2.5 text-slate-500" />
                        <span className="text-[9px] font-semibold text-slate-600">{st.squadSize}</span>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          onClick={handleActivate}
          disabled={selectedTypes.length === 0 || isActivating}
          className={`flex-1 py-4 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-3 ${
            selectedTypes.length > 0
            ? 'bg-black text-white shadow-sm hover:opacity-90'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-300'
          }`}
        >
          {isActivating ? (
            <span className="animate-pulse">Gerando FLOW...</span>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Ativar Execução e Logística
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
