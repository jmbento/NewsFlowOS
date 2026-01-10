
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  ClipboardList, 
  PlayCircle, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Calendar,
  LayoutDashboard,
  Eye,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KanbanBoard = () => {
  const { projects } = useStore();
  const [draggedProject, setDraggedProject] = useState<string | null>(null);

  const columns = [
    { id: 'todo', label: 'Backlog / A Fazer', color: 'bg-zinc-600', icon: ClipboardList },
    { id: 'doing', label: 'Em Produção', color: 'bg-yellow-500', icon: PlayCircle },
    { id: 'review', label: 'Revisão', color: 'bg-blue-500', icon: Eye },
    { id: 'done', label: 'Finalizado', color: 'bg-emerald-500', icon: CheckCircle2 },
  ];

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedProject) {
      // TODO: Implementar updateProjectStatus no store
      console.log(`Moving project ${draggedProject} to ${newStatus}`);
      setDraggedProject(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedProject(null);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#09090b] p-8 flex flex-col overflow-hidden">
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight italic">
            <span className="text-yellow-500">FLOW</span>
          </h1>
          <p className="text-zinc-500 text-xs mt-1 uppercase font-bold tracking-widest">
            Visão Operacional Consolidada
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-5 py-3 bg-zinc-50 dark:bg-[#18181b] border border-zinc-200 dark:border-[#27272a] rounded-xl shadow-sm">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase font-black tracking-[0.2em] block mb-1">Projetos Ativos</span>
              <p className="text-lg font-black text-zinc-900 dark:text-white italic">{projects.length}</p>
           </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 overflow-auto pb-6">
        {columns.map(col => (
          <div 
            key={col.id} 
            className="flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${col.color}/10 flex items-center justify-center ${col.color.replace('bg-', 'text-')}`}>
                  <col.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
                  {col.label}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-white/5 rounded-full text-[10px] font-black text-zinc-400 dark:text-zinc-600">
                {projects.filter(p => p.status === col.id).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {projects.filter(p => p.status === col.id).map(project => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, project.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl hover:border-yellow-500 dark:hover:border-yellow-500 transition-all cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-md ${
                      draggedProject === project.id ? 'opacity-50 scale-95' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <GripVertical className="w-4 h-4 text-zinc-300 dark:text-zinc-700 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase italic tracking-tight flex-1">
                        {project.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
