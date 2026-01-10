
import React, { useState } from 'react';
import { useOnSelectionChange } from 'reactflow';
import { useStore } from '../store';
import { 
  X, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';

const NodeInspector = () => {
  const { updateNodeData, nodes } = useStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodeId(nodes.length === 1 ? nodes[0].id : null);
    },
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const data = selectedNode?.data;
  const id = selectedNode?.id;

  if (!selectedNode || !data || !id) return null;

  const handleFinalize = () => {
    updateNodeData(id, { status: 'done' });
    setSelectedNodeId(null);
  };

  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      className="fixed md:absolute top-4 right-4 bottom-4 w-80 bg-white border border-slate-300 rounded-md shadow-lg z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Editar Node</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">{selectedNode.type}</p>
        </div>
        <button 
          onClick={() => setSelectedNodeId(null)}
          className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-white">
        
        {/* Title */}
        <div className="space-y-2">
          <label className="text-label text-slate-600">Título</label>
          <input 
            type="text" 
            value={data.label || ''}
            onChange={(e) => updateNodeData(id, { label: e.target.value })}
            className="w-full bg-white border border-slate-300 text-sm rounded-md px-3 py-2.5 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:text-slate-400"
            placeholder="Digite o título..."
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-label text-slate-600">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { s: 'todo', l: 'A Fazer', icon: Clock, badge: 'badge-todo' },
              { s: 'doing', l: 'Executando', icon: Send, badge: 'badge-doing' },
              { s: 'done', l: 'Concluído', icon: CheckCircle2, badge: 'badge-done' },
              { s: 'RESOURCE_CONFLICT', l: 'Conflito', icon: AlertTriangle, badge: 'badge-blocked' }
            ].map((item) => (
              <button
                key={item.s}
                onClick={() => updateNodeData(id, { status: item.s as any })}
                className={`px-3 py-2.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all border ${
                  data.status === item.s 
                    ? `${item.badge} border-current` 
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.l}
              </button>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <label className="text-label text-slate-600 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Prazo
          </label>
          <input 
            type="date"
            value={data.deadline || ''}
            onChange={(e) => updateNodeData(id, { deadline: e.target.value })}
            className="w-full bg-white border border-slate-300 text-sm rounded-md px-3 py-2.5 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
          />
        </div>

        {/* Assignee */}
        <div className="space-y-2">
          <label className="text-label text-slate-600">Responsável</label>
          <input 
            type="text"
            value={data.assignee || ''}
            onChange={(e) => updateNodeData(id, { assignee: e.target.value })}
            placeholder="Nome do responsável"
            className="w-full bg-white border border-slate-300 text-sm rounded-md px-3 py-2.5 text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all placeholder:text-slate-400"
          />
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        <button 
          onClick={handleFinalize}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Concluir Tarefa
        </button>
        <button 
          onClick={() => setSelectedNodeId(null)}
          className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-md text-sm font-semibold transition-all"
        >
          Fechar
        </button>
      </div>
    </motion.aside>
  );
};

export default NodeInspector;
