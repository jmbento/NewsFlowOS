
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Panel,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store';
import { nodeTypes as customNodeTypes } from './CustomNodes';
import { MeetingNode } from './MeetingNode';
import NodeInspector from './NodeInspector';
import { ClippingEngine } from '../services/clipping_engine';
import { ProjectInputTree } from './ProjectInputTree';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Settings2, 
  X, 
  Activity, 
  CloudRain, 
  CloudLightning, 
  CloudFog,
  Cpu,
  Layers,
  FileText,
  PlayCircle,
  Pen,
  Globe,
  PenTool,
  Users,
  Zap,
  RotateCcw
} from 'lucide-react';

const nodeTypes = {
  ...customNodeTypes,
  meeting: MeetingNode,
};

const defaultEdgeOptions = {
  style: { stroke: '#475569', strokeWidth: 3 },
  animated: false,
};

const connectionLineStyle = { 
  stroke: '#a855f7', 
  strokeWidth: 4,
  strokeDasharray: '0'
};

const HandshakeIndicator = () => {
  const { syncStatus } = useStore();
  
  const statusConfig = {
    offline: { color: 'bg-zinc-500', icon: CloudFog, text: 'Desconectado' },
    online: { color: 'bg-emerald-500', icon: Activity, text: 'Conectado' },
    syncing: { color: 'bg-brand-neon-blue', icon: CloudRain, text: 'Sincronizando' },
    error: { color: 'bg-red-500', icon: CloudLightning, text: 'Erro de Sincronização' },
  };

  const current = statusConfig[syncStatus] || statusConfig.offline;
  const Icon = current.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-brand-900/60 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl">
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${current.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}></div>
        {syncStatus === 'syncing' && (
          <div className={`absolute -inset-1 rounded-full ${current.color} animate-ping opacity-40`}></div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-0.5">
          {current.text}
        </span>
        <div className="flex items-center gap-1.5 opacity-50">
           <Icon className="w-2.5 h-2.5 text-zinc-400" />
           <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Protocolo de Conexão v3.2</span>
        </div>
      </div>
    </div>
  );
};

const ContextMenu = ({ x, y, nodeId, onClose, onEdit }: { x: number, y: number, nodeId: string, onClose: () => void, onEdit: (id: string) => void }) => {
  const { deleteNode, duplicateNode, selectSubTree } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="fixed z-3000 bg-[#18181b] border border-zinc-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.6)] py-2 w-56 animate-in fade-in zoom-in-95 duration-200"
      style={{ left: x, top: y }}
    >
      <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-zinc-500 font-black border-b border-zinc-800 mb-1">
        CMD: Operações
      </div>
      <button 
        onClick={() => { onEdit(nodeId); onClose(); }}
        className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-white transition-all group"
      >
        <Settings2 className="w-4 h-4 text-zinc-400 group-hover:rotate-90 transition-transform" /> 
        <span className="text-[11px] font-black uppercase">Configurar Node</span>
      </button>
      <button 
        onClick={() => { selectSubTree(nodeId); onClose(); }}
        className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-blue-400 transition-all group"
      >
        <Layers className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
        <span className="text-[11px] font-black uppercase italic">Selecionar Sub-árvore</span>
      </button>
      <button 
        onClick={() => { duplicateNode(nodeId); onClose(); }}
        className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-white transition-all group"
      >
        <Copy className="w-4 h-4 text-zinc-400 group-hover:scale-110 transition-transform" /> 
        <span className="text-[11px] font-black uppercase">Duplicar Objeto</span>
      </button>
      <div className="h-px bg-zinc-800 my-1 mx-2" />
      <button 
        onClick={() => { deleteNode(nodeId); onClose(); }}
        className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 text-red-500 transition-all"
      >
        <Trash2 className="w-4 h-4" /> 
        <span className="text-[11px] font-black uppercase">Deletar do Canvas</span>
      </button>
    </div>
  );
};

const PaneContextMenu = ({ x, y, onClose }: { x: number, y: number, onClose: () => void }) => {
  const { addNode } = useStore();
  const { screenToFlowPosition } = useReactFlow();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAdd = (type: any) => {
    const position = screenToFlowPosition({ x, y });
    addNode(type, position);
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-3000 bg-[#18181b] border border-zinc-700 rounded-xl shadow-2xl py-2 w-64 animate-in fade-in zoom-in-95 duration-200"
      style={{ left: x, top: y }}
    >
      <div className="px-4 py-2 border-b border-zinc-800 mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]">Criar Componente Neural</span>
      </div>
      {[
        { type: 'campaign', label: 'Campanha', color: 'bg-amber-500' },
        { type: 'paid_report', label: 'Reportagem Paga', color: 'bg-emerald-500' },
        { type: 'special_event', label: 'Evento Especial', color: 'bg-indigo-500' },
        { type: 'os', label: 'OS (Ordem de Serviço)', color: 'bg-blue-500' },
        { type: 'demand', label: 'Demanda', color: 'bg-zinc-400' },
        { type: 'publication', label: 'Publicação Social', color: 'bg-pink-500' },
        { type: 'config', label: 'Configuração', color: 'bg-zinc-600' },
        { type: 'project_master', label: 'Outros (Master)', color: 'bg-white' }
      ].map(item => (
        <button 
          key={item.type}
          onClick={() => handleAdd(item.type)}
          className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-4 group transition-all"
        >
          <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
          <span className="text-[11px] font-black text-[#FFFFFF] uppercase group-hover:translate-x-1 transition-all leading-none">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

const EditModal = ({ nodeId, onClose }: { nodeId: string, onClose: () => void }) => {
  const { nodes, updateNodeData } = useStore();
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  const [formData, setFormData] = useState({
    label: node.data.label,
    description: node.data.description || '',
    assignee: node.data.assignee || '',
    assignedTo: node.data.assignedTo || '',
    dueDate: node.data.dueDate || '',
    deadline: node.data.deadline || '',
    editoria: node.data.editoria || '',
    status: node.data.status
  });

  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!formData.label.trim()) {
      setError("O título do componente não pode estar vazio.");
      return;
    }
    updateNodeData(nodeId, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-300 w-full max-w-xl rounded-md shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Editar Componente</h2>
            <p className="text-xs text-slate-500 mt-1 font-mono">UUID: {node.id.substring(0, 8)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5 bg-white">
          <div className="space-y-2">
            <label className="text-label text-slate-600 flex items-center gap-2">
               <Cpu className="w-3.5 h-3.5" /> Título do Componente
            </label>
            <input 
              type="text" 
              value={formData.label}
              onChange={e => { setFormData({...formData, label: e.target.value}); setError(null); }}
              className={`w-full bg-white border ${error ? 'border-red-300' : 'border-slate-300'} rounded-md px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all placeholder:text-slate-400`}
              placeholder="Digite o título..."
            />
            {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-label text-slate-600">Status Operacional</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full bg-white border border-slate-300 rounded-md px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 appearance-none"
              >
                <option value="todo">Pendente</option>
                <option value="doing">Em Execução</option>
                <option value="done">Finalizado</option>
                <option value="backlog">Backlog</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-label text-slate-600">Editoria</label>
              <input 
                type="text" 
                value={formData.editoria}
                onChange={e => setFormData({...formData, editoria: e.target.value})}
                placeholder="Ex: Política, Esportes..."
                className="w-full bg-white border border-slate-300 rounded-md px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 placeholder:text-slate-400" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label text-slate-600">Responsável</label>
            <input 
              type="text" 
              value={formData.assignedTo || formData.assignee}
              onChange={e => setFormData({...formData, assignedTo: e.target.value, assignee: e.target.value})}
              placeholder="Nome do editor ou designer..."
              className="w-full bg-white border border-slate-300 rounded-md px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 placeholder:text-slate-400" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-label text-slate-600">Notas / Descrição</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white border border-slate-300 rounded-md px-4 py-3 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 resize-none placeholder:text-slate-400" 
              placeholder="Adicione notas ou descrição..."
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end items-center">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">Cancelar</button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-md hover:opacity-90 transition-all shadow-sm"
          >
            Atualizar Componente
          </button>
        </div>
      </div>
    </div>
  );
};

const FlowInner = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, undo, redo } = useStore();
  const [menu, setMenu] = useState<{ x: number, y: number, nodeId: string } | null>(null);
  const [paneMenu, setPaneMenu] = useState<{ x: number, y: number } | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [showInputTree, setShowInputTree] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  // Undo/Redo Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: any) => {
      event.preventDefault();
      setPaneMenu(null);
      setMenu({ nodeId: node.id, x: event.clientX, y: event.clientY });
    },
    []
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setMenu(null);
      setPaneMenu({ x: event.clientX, y: event.clientY });
    },
    []
  );

  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNode('demand', position);
    },
    [addNode, screenToFlowPosition]
  );

  const onPaneClick = useCallback(() => {
    setMenu(null);
    setPaneMenu(null);
  }, []);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onPaneClick={onPaneClick}
        onPaneDoubleClick={onPaneDoubleClick}
        onNodeDragStart={() => useStore.getState().pushToUndo()}
        onNodeResizeStart={() => useStore.getState().pushToUndo()}
        nodeTypes={nodeTypes}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Background 
          color="#CBD5E1"
          gap={24} 
          size={1}
          variant="dots"
        />
        <Controls className="!bg-white dark:!bg-slate-800 !border !border-slate-200 dark:!border-slate-700 !rounded-lg !shadow-md" />

        {/* FAB - Quick Input */}
        <Panel position="bottom-right" className="mr-4 mb-4">
           <button 
             onClick={() => setPaneMenu({ x: window.innerWidth - 250, y: window.innerHeight - 300 })}
             className="fab-button"
             title="Adicionar Node"
           >
             <Plus className="w-6 h-6" />
           </button>
        </Panel>

        {/* Status Indicator */}
        <Panel position="top-right" className="flex items-center gap-2">
           <HandshakeIndicator />
        </Panel>
      </ReactFlow>

      {menu && <ContextMenu {...menu} onEdit={setEditingNodeId} onClose={() => setMenu(null)} />}
      {paneMenu && <PaneContextMenu {...paneMenu} onClose={() => setPaneMenu(null)} />}
      {editingNodeId && <EditModal nodeId={editingNodeId} onClose={() => setEditingNodeId(null)} />}
      <NodeInspector />

      {showInputTree && (
        <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <ProjectInputTree onClose={() => setShowInputTree(false)} />
        </div>
      )}
    </div>
  );
};

const FlowCanvas = () => (
  <ReactFlowProvider>
    <FlowInner />
  </ReactFlowProvider>
);

export default FlowCanvas;


