
import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { NodeData } from '../types';
import { useStore } from '../store';
import { 
  Layers,
  FileText,
  Globe,
  Video,
  Mic,
  Layout,
  Rocket,
  Info,
  Instagram,
  Facebook,
  Edit,
  Plus,
  CheckCircle2,
  X,
  MoreVertical,
  Unlink,
  CheckCircle,
  Clock,
  AlertCircle,
  Video as VideoIcon,
  PenTool,
  DollarSign,
  FileCheck,
  Calendar,
  Presentation
} from 'lucide-react';

// Node Type Color Bars (Bordas laterais coloridas)
// Audiovisual: Roxo, Editorial: Verde, Comercial: Dourado
const NODE_TYPE_COLORS: Record<string, string> = {
  campaign: 'border-l-amber-500', // Comercial - Dourado
  os: 'border-l-blue-600',
  site: 'border-l-emerald-600', // Editorial - Verde
  print: 'border-l-emerald-600', // Editorial - Verde
  video: 'border-l-purple-600', // Audiovisual - Roxo
  podcast: 'border-l-purple-600', // Audiovisual - Roxo
  task: 'border-l-indigo-600',
  custom_action: 'border-l-slate-600',
  demand: 'border-l-cyan-600',
};

// Labels oficiais (caixa alta)
const NODE_TYPE_LABELS: Record<string, string> = {
  campaign: 'CAMPANHA',
  os: 'OS',
  site: 'PUBLICAÇÃO',
  print: 'MATÉRIA PAGA',
  video: 'EVENTO ESPECIAL',
  podcast: 'PODCAST',
  task: 'TAREFA',
  custom_action: 'AÇÃO',
  demand: 'DEMANDA',
};

// Ícones oficiais para PUBLICAÇÃO
const PUBLICATION_ICONS = [Instagram, Facebook, Video, Globe, FileText];

const NODE_TYPE_ICONS: Record<string, any> = {
  campaign: Layers,
  os: FileText,
  site: FileText,
  video: Video,
  podcast: Mic,
  print: Layout,
  task: Rocket,
  custom_action: FileText,
  demand: FileText,
};

// Status configurations
const STATUS_CONFIG = {
  todo: { label: 'A Fazer', color: 'bg-slate-400' },
  doing: { label: 'Em Execução', color: 'bg-amber-500' },
  review: { label: 'Revisão', color: 'bg-blue-500' },
  done: { label: 'Concluído', color: 'bg-emerald-500' },
  RESOURCE_CONFLICT: { label: 'Conflito', color: 'bg-rose-500' },
};

// Approval Status
type ApprovalStatus = 'PENDING' | 'REVIEW' | 'APPROVED';

const APPROVAL_CONFIG: Record<ApprovalStatus, { label: string; icon: any; color: string }> = {
  PENDING: { label: 'Pendente', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-300' },
  REVIEW: { label: 'Revisão', icon: AlertCircle, color: 'bg-blue-100 text-blue-700 border-blue-300' },
  APPROVED: { label: 'Aprovado', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
};

// Workflow Steps por tipo
const WORKFLOW_STEPS = {
  video: ['Captação/Logística', 'Decupagem', 'Edição V1', 'Edição V2', 'Edição VF', 'Redes Sociais'],
  podcast: ['Captação/Logística', 'Decupagem', 'Edição V1', 'Edição V2', 'Edição VF', 'Redes Sociais'],
  print: ['Nº Páginas', 'Diagramação', 'Data Edição'],
  site: ['Nº Páginas', 'Diagramação', 'Data Edição'],
  campaign: ['Ideação', 'Proposta', 'Apresentação', 'Execução'],
  os: ['Ideação', 'Proposta', 'Apresentação', 'Execução'],
};

// Função para encontrar o node raiz (campanha/OS)
const findRootNode = (nodeId: string, nodes: any[], edges: any[], visited: Set<string> = new Set()): any | null => {
  // Prevenir loops infinitos
  if (visited.has(nodeId)) return null;
  visited.add(nodeId);

  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  // Se for campanha ou OS, é o próprio raiz
  if (node.type === 'campaign' || node.type === 'os') {
    return node;
  }

  // Buscar edge que conecta a este node
  const incomingEdge = edges.find(e => e.target === nodeId);
  if (!incomingEdge) return null;

  // Recursivamente buscar o raiz
  return findRootNode(incomingEdge.source, nodes, edges, visited);
};

// Função para obter label com herança
const getInheritedLabel = (node: any, nodes: any[], edges: any[]): string => {
  const rootNode = findRootNode(node.id, nodes, edges);
  if (rootNode && rootNode.data?.label) {
    return `${rootNode.data.label} - ${node.data?.label || 'Subtarefa'}`;
  }
  return node.data?.label || 'Sem vínculo';
};

// Badge de Aprovação
const ApprovalBadge = ({ status, onToggle }: { status: ApprovalStatus; onToggle: () => void }) => {
  const config = APPROVAL_CONFIG[status];
  const Icon = config.icon;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`px-3 py-1.5 rounded-md text-xs font-semibold border flex flex-row items-center gap-2 transition-colors ${config.color} hover:opacity-80`}
      title={`Status: ${config.label}`}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{config.label}</span>
    </button>
  );
};

// Menu de Contexto do Node
const NodeContextMenu = ({ 
  nodeId, 
  x, 
  y, 
  onClose, 
  onDisconnect 
}: { 
  nodeId: string; 
  x: number; 
  y: number; 
  onClose: () => void; 
  onDisconnect: () => void;
}) => {
  const { deleteNode, duplicateNode } = useStore();

  return (
    <div
      className="fixed bg-white border border-slate-300 rounded-md shadow-lg z-50 py-1 min-w-[180px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          const event = new CustomEvent('openNodeInspector', { detail: { nodeId } });
          window.dispatchEvent(event);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <Edit className="w-4 h-4" />
        Editar Node
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          duplicateNode(nodeId);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Duplicar
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDisconnect();
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <Unlink className="w-4 h-4" />
        Desconectar Node
      </button>
      <div className="border-t border-slate-200 my-1" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteNode(nodeId);
          onClose();
        }}
        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <X className="w-4 h-4" />
        Excluir
      </button>
    </div>
  );
};

// Compact Base Node - Light Precision High-Contrast com Glassmorphism
export const N8NBaseNode = ({ 
  id, 
  title, 
  nodeType,
  children, 
  selected, 
  data 
}: { 
  id: string, 
  title: string, 
  nodeType: string, 
  children?: React.ReactNode, 
  selected?: boolean, 
  data: NodeData 
}) => {
  const { nodes, edges, updateNodeData, deleteEdge } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [elapsedTime, setElapsedTime] = useState<string>('');

  const typeColor = NODE_TYPE_COLORS[nodeType] || 'border-l-slate-600';
  const Icon = NODE_TYPE_ICONS[nodeType] || FileText;
  const status = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.todo;
  
  // Obter label com herança
  const inheritedLabel = getInheritedLabel(
    { id, data, type: nodeType },
    nodes,
    edges
  );

  // Status de aprovação (padrão: PENDING)
  const approvalStatus: ApprovalStatus = (data.approvalStatus as ApprovalStatus) || 'PENDING';

  // Workflow steps baseado no tipo
  const workflowSteps = WORKFLOW_STEPS[nodeType as keyof typeof WORKFLOW_STEPS] || [];

  // Contador de tempo decorrido quando status é "doing"
  useEffect(() => {
    if (data.status === 'doing') {
      const startTime = data.statusChangedAt || data.timeTracking?.startTime || Date.now();
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime('');
    }
  }, [data.status, data.statusChangedAt, data.timeTracking?.startTime]);

  // Toggle de aprovação
  const toggleApproval = () => {
    const nextStatus: ApprovalStatus = 
      approvalStatus === 'PENDING' ? 'REVIEW' :
      approvalStatus === 'REVIEW' ? 'APPROVED' : 'PENDING';
    updateNodeData(id, { approvalStatus: nextStatus });
  };
  
  // Toggle de etapa do workflow
  const toggleWorkflowStep = (stepIdx: number) => {
    const stepKey = `step_${stepIdx}`;
    const currentProgress = data.workflowProgress || {};
    updateNodeData(id, {
      workflowProgress: {
        ...currentProgress,
        [stepKey]: !currentProgress[stepKey]
      }
    });
  };

  // Desconectar node (remove todas as edges conectadas)
  const handleDisconnect = () => {
    const connectedEdges = edges.filter(e => e.source === id || e.target === id);
    connectedEdges.forEach(edge => {
      deleteEdge(edge.id);
    });
    // Limpar herança no label e resetar dados relacionados
    const currentData = nodes.find(n => n.id === id)?.data;
    updateNodeData(id, { 
      parentCampaignId: undefined,
    });
    // Forçar atualização do label para remover herança visual
    if (currentData?.label?.includes(' - ')) {
      const baseLabel = currentData.label.split(' - ')[1] || currentData.label;
      updateNodeData(id, { label: baseLabel });
    }
  };

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  return (
    <>
      <div 
        className={`
          bg-white/95 backdrop-blur-[12px]
          border-l-4 ${typeColor}
          border-t border-r border-b border-slate-300
          rounded-md shadow-sm
          transition-all duration-150
          ${selected ? 'ring-2 ring-purple-500 border-purple-500 shadow-lg' : 'hover:border-slate-400'}
        `}
        style={{ 
          minWidth: '200px', 
          maxWidth: '240px',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onContextMenu={handleContextMenu}
      >
        <NodeResizer 
          color="#8B5CF6" 
          isVisible={selected} 
          minWidth={200} 
          minHeight={80} 
          handleStyle={{ width: 6, height: 6, borderRadius: 2 }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2 p-3 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded flex items-center justify-center bg-slate-100`}>
              <Icon className={`w-3.5 h-3.5 text-slate-900`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-black leading-tight line-clamp-1" style={{ color: '#000000', fontWeight: 800 }}>
                {NODE_TYPE_LABELS[nodeType] || title}
              </h3>
              <p className="text-xs font-semibold text-slate-900 mt-0.5 line-clamp-1">
                {inheritedLabel}
              </p>
            </div>
          </div>
          {/* Menu Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e);
            }}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            title="Menu"
          >
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Badge de Aprovação */}
          <div className="flex items-center justify-between">
            <ApprovalBadge status={approvalStatus} onToggle={toggleApproval} />
            <div className={`w-2 h-2 rounded-full ${status.color}`} title={status.label} />
          </div>

          {/* Workflow Steps com Timeline */}
          {workflowSteps.length > 0 && (
            <div className="space-y-2">
              {/* Barra de Progresso Visual */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-full transition-all duration-300"
                  style={{ 
                    width: `${((workflowSteps.findIndex((_, idx) => {
                      const stepKey = `step_${idx}`;
                      return !data.workflowProgress?.[stepKey];
                    }) === -1 ? workflowSteps.length : workflowSteps.findIndex((_, idx) => {
                      const stepKey = `step_${idx}`;
                      return !data.workflowProgress?.[stepKey];
                    })) / workflowSteps.length) * 100}%`
                  }}
                />
              </div>
              
              {/* Lista de Etapas com Checkboxes Interativos */}
              <div className="space-y-1.5">
                {workflowSteps.map((step, idx) => {
                  const stepKey = `step_${idx}`;
                  const isDone = data.workflowProgress?.[stepKey] || false;
                  const isCurrent = idx === workflowSteps.findIndex((_, i) => {
                    const k = `step_${i}`;
                    return !data.workflowProgress?.[k];
                  });
                  
                  return (
                    <label 
                      key={idx} 
                      className="flex items-center gap-2 text-xs cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWorkflowStep(idx);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleWorkflowStep(idx)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className={`text-slate-700 flex-1 ${isDone ? 'line-through text-slate-500' : isCurrent ? 'font-semibold text-purple-700' : ''}`}>
                        {step}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Campos específicos para MATÉRIA ESPECIAL */}
          {(nodeType === 'print' || nodeType === 'site') && (
            <div className="space-y-2 text-xs border-t border-slate-200 pt-2 mt-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Nº Páginas:</span>
                <span className="text-slate-700">{data.numPages || 'Não definido'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Diagramação:</span>
                <span className="text-slate-700">{data.layout || 'Não definido'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Data Edição:</span>
                <span className="text-slate-700">{data.editionDate || '__/__/____'}</span>
              </div>
            </div>
          )}

          {/* Campos específicos para AUDIOVISUAL */}
          {(nodeType === 'video' || nodeType === 'podcast') && (
            <div className="space-y-2 text-xs border-t border-slate-200 pt-2 mt-2">
              {data.roteiroBriefing && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                  <div className="font-semibold text-purple-900 mb-1">Roteiro/Briefing:</div>
                  <div className="text-purple-700 text-[10px] line-clamp-2">{data.roteiroBriefing}</div>
                  {data.estimatedTime && (
                    <div className="mt-1 text-[10px] text-purple-600">
                      ⏱️ Estimativa: {data.estimatedTime}h
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Campos específicos para COMERCIAL */}
          {(nodeType === 'campaign' || nodeType === 'os') && (
            <div className="space-y-2 text-xs border-t border-slate-200 pt-2 mt-2">
              {data.proposalValue !== undefined && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-slate-900">Valor da Proposta:</span>
                  <span className="text-slate-700">R$ {data.proposalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {data.approvalStatus && (
                <div className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-slate-900">Status de Aprovação:</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    data.approvalStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    data.approvalStatus === 'REVIEW' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {data.approvalStatus === 'APPROVED' ? 'Aprovado' :
                     data.approvalStatus === 'REVIEW' ? 'Em Revisão' : 'Pendente'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Contador de Tempo Decorrido */}
          {data.status === 'doing' && elapsedTime && (
            <div className="flex items-center gap-2 text-xs border-t border-slate-200 pt-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-semibold text-slate-900">Tempo Decorrido:</span>
              <span className="text-amber-700 font-mono">{elapsedTime}</span>
            </div>
          )}

          {children}
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600 px-3 bg-slate-50/50">
          {/* Cliente / Evento / Job */}
          <div className="mb-1">
            <span className="font-medium">{data.clientName || data.projectName || data.eventName || 'Sem nome'}</span>
          </div>
          {/* Origem do fluxo */}
          <div>
            <span>Vindo de: {data.origin || 'Desconhecido'}</span>
          </div>
        </div>

        {/* Handles */}
        <Handle 
          type="target"
          position={Position.Left}
          className="w-2! h-2! bg-slate-400! border-2! border-white!"
        />
        <Handle 
          type="source"
          position={Position.Right}
          className="w-2! h-2! bg-slate-400! border-2! border-white!"
        />
      </div>

      {/* Context Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <NodeContextMenu
            nodeId={id}
            x={menuPosition.x}
            y={menuPosition.y}
            onClose={() => setShowMenu(false)}
            onDisconnect={handleDisconnect}
          />
        </>
      )}
    </>
  );
};

// Campaign Node
export const CampaignNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="CAMPANHA" nodeType="campaign" selected={selected} data={data} />
);

export const OSNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="OS" nodeType="os" selected={selected} data={data} />
);

export const SiteNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="PUBLICAÇÃO" nodeType="site" selected={selected} data={data} />
);

export const PrintNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="MATÉRIA PAGA" nodeType="print" selected={selected} data={data} />
);

export const VideoNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="EVENTO ESPECIAL" nodeType="video" selected={selected} data={data} />
);

export const PodcastNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="PODCAST" nodeType="podcast" selected={selected} data={data} />
);

export const TaskNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="TAREFA" nodeType="task" selected={selected} data={data} />
);

export const CustomActionNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="AÇÃO" nodeType="custom_action" selected={selected} data={data} />
);

export const DemandNode = ({ id, data, selected }: NodeProps<NodeData>) => (
  <N8NBaseNode id={id} title="DEMANDA" nodeType="demand" selected={selected} data={data} />
);

export const nodeTypes = {
  campaign: CampaignNode,
  os: OSNode,
  site: SiteNode,
  print: PrintNode,
  video: VideoNode,
  podcast: PodcastNode,
  task: TaskNode,
  custom_action: CustomActionNode,
  demand: DemandNode,
};
