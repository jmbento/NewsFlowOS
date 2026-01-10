
import React from 'react';
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
  Video,
  Edit,
  Plus,
  CheckCircle2
} from 'lucide-react';

// Node Type Color Bars
const NODE_TYPE_COLORS: Record<string, string> = {
  campaign: 'bg-purple-500',
  os: 'bg-blue-500',
  site: 'bg-emerald-500',
  print: 'bg-amber-500',
  video: 'bg-rose-500',
  podcast: 'bg-pink-500',
  task: 'bg-indigo-500',
  custom_action: 'bg-slate-500',
  demand: 'bg-cyan-500',
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
  site: FileText, // placeholder, será substituído por PUBLICATION_ICONS no footer
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

// Compact Base Node - Light Minimalist Style
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
  const typeColor = NODE_TYPE_COLORS[nodeType] || 'bg-slate-500';
  const Icon = NODE_TYPE_ICONS[nodeType] || FileText;
  const status = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.todo;

  return (
    <div 
      className={`
        bg-white dark:bg-slate-800 
        border border-slate-300 dark:border-slate-600 
        rounded-md shadow-sm
        transition-all duration-150
        ${selected ? 'ring-2 ring-purple-500 border-purple-500 shadow-lg' : 'hover:border-slate-400'}
      `}
      style={{ minWidth: '180px', maxWidth: '220px' }}
    >
      <NodeResizer 
        color="#8B5CF6" 
        isVisible={selected} 
        minWidth={180} 
        minHeight={70} 
        handleStyle={{ width: 6, height: 6, borderRadius: 2 }}
      />

      {/* Type Color Bar */}
      <div className={`h-1 ${typeColor} rounded-t-md`} />

      {/* Header with Edit */}
      <div className="flex items-start justify-between gap-2 mb-2 p-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded flex items-center justify-center ${typeColor}/10`}>
            <Icon className={`w-3.5 h-3.5 ${typeColor.replace('bg-', 'text-')}`} />
          </div>
          <h3 className="text-xs font-bold text-slate-900 leading-tight line-clamp-2">
            {NODE_TYPE_LABELS[nodeType] || title}
          </h3>
        </div>
        {/* Edit Icon */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Abre NodeInspector ao clicar no botão de editar
            const event = new CustomEvent('openNodeInspector', { detail: { nodeId: id } });
            window.dispatchEvent(event);
          }} 
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          title="Editar nó"
        >
          <Edit className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        {children}
      </div>

      {/* Central Execution Point */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <button onClick={(e) => {
          e.stopPropagation();
          console.log('Mid-point trigger for node', id);
        }} className="pointer-events-auto w-6 h-6 bg-brand-neon-purple/20 border border-brand-neon-purple rounded-full flex items-center justify-center hover:bg-brand-neon-purple/40 transition-colors">
          <Plus className="w-3 h-3 text-brand-neon-purple" />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600 px-2 bg-slate-50">
        {/* Tipo + Nome do Node */}
        <div className="flex items-center gap-1 mb-1">
          <Icon className="w-3 h-3" />
          <span className="font-medium">{data.label || NODE_TYPE_LABELS[nodeType] || title}</span>
        </div>
        {/* Cliente / Evento / Job */}
        <div className="mb-1">
          <span>{data.clientName || data.projectName || data.eventName || 'Sem nome'}</span>
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
        className="w-2! h-2! bg-slate-400! border-2! border-white! dark:border-slate-800!"
      />
      <Handle 
        type="source"
        position={Position.Right}
        className="w-2! h-2! bg-slate-400! border-2! border-white! dark:border-slate-800!"
      />
    </div>
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
