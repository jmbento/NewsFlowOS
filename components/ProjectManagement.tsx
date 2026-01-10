import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { 
  FolderOpen, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  MapPin,
  ChevronRight,
  FileText,
  Users,
  Edit3,
  Trash2,
  Link2,
  Settings,
  Truck,
  TruckIcon,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectInputTree } from './ProjectInputTree';

interface ProjectChecklist {
  id: string;
  label: string;
  done: boolean;
}

const ProjectManagement: React.FC = () => {
  const { nodes, updateNodeData, setActiveTab, edges, projects } = useStore();
  
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  
  const selectedProject = useMemo(() => {
    return projects.find(n => n.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  // Nodes filhos do projeto selecionado
  const childNodes = useMemo(() => {
    if (!selectedProjectId) return [];
    const childIds = edges
      .filter(e => e.source === selectedProjectId)
      .map(e => e.target);
    return nodes.filter(n => childIds.includes(n.id));
  }, [nodes, edges, selectedProjectId]);

  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleActivateProject = (selectedInputs: string[]) => {
    // Simulação de ativação - Criaria o node de campanha e dispararia o startProject
    console.log("🚀 [ACTIVATE_ENGINE]: Ativando projeto com inputs:", selectedInputs);
    setIsNewProjectModalOpen(false);
  };

  const handleSaveDescription = () => {
    if (selectedProjectId) {
      updateNodeData(selectedProjectId, { description: editDescription });
      setIsEditing(false);
    }
  };

  const handleAddChecklistItem = () => {
    if (!selectedProject) return;
    const currentChecklist = selectedProject.data.checklist || [];
    updateNodeData(selectedProjectId!, {
      checklist: [...currentChecklist, { label: 'Nova tarefa...', done: false }]
    });
  };

  const handleToggleChecklistItem = (index: number) => {
    if (!selectedProject) return;
    const currentChecklist = [...(selectedProject.data.checklist || [])];
    currentChecklist[index].done = !currentChecklist[index].done;
    updateNodeData(selectedProjectId!, { checklist: currentChecklist });
  };

  const handleUpdateChecklistLabel = (index: number, newLabel: string) => {
    if (!selectedProject) return;
    const currentChecklist = [...(selectedProject.data.checklist || [])];
    currentChecklist[index].label = newLabel;
    updateNodeData(selectedProjectId!, { checklist: currentChecklist });
  };

  const handleRemoveChecklistItem = (index: number) => {
    if (!selectedProject) return;
    const currentChecklist = (selectedProject.data.checklist || []).filter((_, i) => i !== index);
    updateNodeData(selectedProjectId!, { checklist: currentChecklist });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-emerald-500';
      case 'doing': return 'bg-brand-neon-blue';
      default: return 'bg-zinc-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done': return 'Concluído';
      case 'doing': return 'Em Execução';
      case 'todo': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div className="h-full bg-[#09090b] flex overflow-hidden">
      {/* Sidebar - Lista de Projetos (Master) */}
      <aside className="w-72 bg-[#18181b] border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-brand-neon-purple" />
              Projetos
            </h2>
            <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-full">
              {projects.length}
            </span>
          </div>

          <button 
            onClick={() => setIsNewProjectModalOpen(true)}
            className="w-full py-3 bg-brand-neon-purple text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-neon-purple/20"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {projects.length === 0 ? (
            <div className="text-center py-8 text-zinc-600">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Nenhum projeto encontrado
              </p>
              <p className="text-[9px] mt-1 opacity-60">
                Crie uma campanha no Canvas
              </p>
            </div>
          ) : (
            projects.map(project => (
              <button
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  selectedProjectId === project.id
                    ? 'bg-brand-neon-purple/20 border-brand-neon-purple/50'
                    : 'bg-black/20 border-transparent hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold truncate ${
                    selectedProjectId === project.id ? 'text-white' : 'text-zinc-300'
                  }`}>
                    {project.name}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${
                    selectedProjectId === project.id ? 'text-brand-neon-purple' : 'text-zinc-600'
                  }`} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(project.status)}`} />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase">
                    {getStatusLabel(project.status)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content - Detalhes do Projeto */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {!selectedProject ? (
          <div className="h-full flex items-center justify-center text-zinc-600">
            <div className="text-center">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-sm font-bold">Selecione um projeto</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header do Projeto */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedProject.status)}`} />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {getStatusLabel(selectedProject.status)}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase italic">
                  {selectedProject.name}
                </h1>
              </div>
              
              <button
                onClick={() => {
                  setActiveTab('canvas');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-brand-neon-purple/20 border border-brand-neon-purple/40 text-brand-neon-purple rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-neon-purple hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                <Link2 className="w-3 h-3" />
                Mapeamento Visual (Canvas)
              </button>
            </div>

            {/* Dashboard Financeiro Operacional - A VERDADE DO BANCO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#09090b] border-2 border-emerald-500/50 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <span className="text-[14px] font-black text-white uppercase tracking-widest">Master Financial Truth</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded">ENTITY: PROJECT</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[13px] font-bold text-zinc-500">
                    <span>VALOR DO CONTRATO:</span>
                    <span className="text-white">R$ {(selectedProject.totalValue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-bold text-zinc-500">
                    <span>CUSTO ESTIMADO:</span>
                    <span className="text-red-400">R$ {(selectedProject.costValue || 0).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-zinc-800 flex justify-between items-end">
                    <span className="text-[11px] font-black text-emerald-500 uppercase">MARGEM BRUTA:</span>
                    <span className="text-3xl font-black text-emerald-400">
                      R$ {(selectedProject.totalValue - selectedProject.costValue).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 border-4 border-zinc-600 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-zinc-400" />
                  <span className="text-[14px] font-black text-white uppercase tracking-widest text-zinc-400">Status da Frota</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900 border-2 border-white/10 rounded-xl">
                    <span className="text-[12px] font-black text-white uppercase">Carro 01 (Doblô)</span>
                    <span className="px-3 py-1 bg-brand-neon-blue text-[9px] font-black text-white rounded-lg">DISPONÍVEL</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 border-2 border-amber-500/50 rounded-xl">
                    <span className="text-[12px] font-black text-white uppercase">Carro 02 (Sede VR)</span>
                    <div className="flex flex-col items-end">
                      <span className="px-3 py-1 bg-amber-500 text-[9px] font-black text-white rounded-lg">RESERVADO</span>
                      <span className="text-[8px] font-bold text-amber-500 mt-1 uppercase">Em trânsito p/ Resende</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logística de Praças e Cidades */}
            <div className="bg-slate-800 border-4 border-brand-neon-blue/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-brand-neon-blue" />
                <span className="text-[14px] font-black text-white uppercase tracking-widest">Roteiro de Praças (Angra, VR, BM)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-900 border-2 border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[12px] font-black text-white uppercase">Volta Redonda (Sede)</span>
                       <span className="text-[10px] font-bold text-zinc-500">- 0 KM</span>
                    </div>
                    <div className="h-1.5 bg-brand-neon-blue rounded-full w-full" />
                  </div>
                  
                  <div className="p-4 bg-slate-900 border-2 border-white/10 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[12px] font-black text-white uppercase">Resende (Pólo Ind.)</span>
                       <span className="text-[10px] font-bold text-zinc-500">- 45 KM (R$ 85,00 Gas.)</span>
                    </div>
                    <div className="h-1.5 bg-zinc-700 rounded-full w-full" />
                  </div>
                </div>

                <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="w-10 h-10 text-amber-500 mb-2 animate-pulse" />
                  <p className="text-[12px] font-black text-amber-500 uppercase mb-1">⚠️ Risco Operacional</p>
                  <p className="text-[11px] font-bold text-zinc-400">Previsão de Chuva Forte para Amanhã em Resende. Reavaliar Captação Externa.</p>
                </div>
              </div>
            </div>

            {/* Descrição do Projeto */}
            <div className="bg-brand-900/50 border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">
                    Descrição do Projeto
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setEditDescription(selectedProject.data.description || '');
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-zinc-500 hover:text-white" />
                </button>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 focus:border-brand-neon-purple outline-none resize-none"
                    placeholder="Descreva o projeto, objetivos, particularidades..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-black uppercase tracking-wider"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-white/10 text-zinc-400 rounded-lg text-xs font-black uppercase tracking-wider"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {selectedProject.data.description || 'Clique no ícone de edição para adicionar uma descrição...'}
                </p>
              )}
            </div>

            {/* Checklist do Projeto */}
            <div className="bg-brand-900/50 border border-white/10 rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">
                    Checklist do Projeto
                  </span>
                  {selectedProject.data.checklist && (
                    <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
                      {selectedProject.data.checklist.filter(c => c.done).length}/{selectedProject.data.checklist.length}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {(selectedProject.data.checklist || []).map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-black/30 rounded-xl group"
                  >
                    <button
                      onClick={() => handleToggleChecklistItem(index)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                        item.done 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-white/20 hover:border-emerald-500/50'
                      }`}
                    >
                      {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateChecklistLabel(index, e.target.value)}
                      className={`flex-1 bg-transparent text-sm font-medium focus:outline-none ${
                        item.done ? 'text-zinc-500 line-through' : 'text-white'
                      }`}
                    />
                    
                    <button
                      onClick={() => handleRemoveChecklistItem(index)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={handleAddChecklistItem}
                  className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:border-white/20 hover:text-zinc-400 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-3 h-3" />
                  Adicionar Item
                </button>
              </div>
            </div>

            {/* Nodes Vinculados */}
            {childNodes.length > 0 && (
              <div className="bg-brand-900/50 border border-white/10 rounded-2xl p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link2 className="w-4 h-4 text-brand-neon-blue" />
                  <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">
                    Nodes Vinculados ({childNodes.length})
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {childNodes.map(node => (
                    <div 
                      key={node.id}
                      className="flex items-center gap-3 p-3 bg-black/30 rounded-xl border border-white/5"
                    >
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(node.data.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{node.data.label}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase">
                          {node.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Novo Projeto (Input Tree) */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewProjectModalOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
               <ProjectInputTree onClose={() => setIsNewProjectModalOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectManagement;
