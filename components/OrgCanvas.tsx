import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Connection,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../store';
import { TeamMember, AvailabilityStatus } from '../types';
import { supabase } from '../services/supabase';
import { UserNode } from './UserNode';
import {
  User,
  X,
  Edit,
  Plus,
  Briefcase,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plane,
  Heart,
  Building2,
  Users,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// NODE TYPES
// ============================================

interface MemberNodeData {
  member: TeamMember;
  type: 'member';
}

interface PositionNodeData {
  positionId: string;
  role: string;
  sector: string;
  function: string;
  memberId?: string; // null = vaga aberta
  type: 'position';
}

type OrgNodeData = MemberNodeData | PositionNodeData;

// Member Node Component
const MemberNode = ({ data, selected }: { data: MemberNodeData; selected?: boolean }) => {
  const { member } = data;
  const statusConfig = {
    ACTIVE: { color: 'bg-emerald-100 border-emerald-300 text-emerald-700', icon: CheckCircle2, label: 'Disponível' },
    VACATION: { color: 'bg-amber-100 border-amber-300 text-amber-700', icon: Plane, label: 'Férias' },
    SICK_LEAVE: { color: 'bg-rose-100 border-rose-300 text-rose-700', icon: Heart, label: 'Licença' },
    OFFBOARDED: { color: 'bg-slate-100 border-slate-300 text-slate-700', icon: AlertCircle, label: 'Desligado' },
  }[member.availability_status];

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`
        bg-white border-2 rounded-md shadow-sm transition-all
        ${selected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-300'}
        hover:border-slate-400 hover:shadow-md
        min-w-[200px] max-w-[240px]
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-slate-200 border border-slate-300 overflow-hidden flex-shrink-0">
            <img
              src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 truncate">{member.name}</h3>
            <p className="text-xs text-slate-600 truncate">{member.role}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Building2 className="w-3.5 h-3.5" />
          <span className="truncate">{member.sector}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Briefcase className="w-3.5 h-3.5" />
          <span className="truncate">{member.function}</span>
        </div>
        {member.salesLevel && (
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-purple-600 font-medium">
              Nível {member.salesLevel === 'LEVEL_0' ? '0' : member.salesLevel === 'LEVEL_1' ? '1' : '2'} Comercial
            </span>
          </div>
        )}
      </div>

      {/* Status Footer */}
      <div className={`px-4 py-2 border-t border-slate-200 ${statusConfig.color} flex items-center gap-2`}>
        <StatusIcon className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{statusConfig.label}</span>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
    </div>
  );
};

// Position Node (Vaga Aberta)
const PositionNode = ({ data, selected }: { data: PositionNodeData; selected?: boolean }) => {
  const { role, sector, function: func, memberId } = data;
  const isEmpty = !memberId;

  return (
    <div
      className={`
        bg-white border-2 rounded-md shadow-sm transition-all
        ${selected ? 'border-purple-500 ring-2 ring-purple-200' : isEmpty ? 'border-dashed border-slate-300' : 'border-slate-300'}
        hover:border-slate-400 hover:shadow-md
        min-w-[200px] max-w-[240px]
      `}
    >
      {/* Header */}
      <div className={`p-4 border-b border-slate-200 ${isEmpty ? 'bg-amber-50' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-md ${isEmpty ? 'bg-amber-200 border-amber-300' : 'bg-slate-200 border-slate-300'} border flex items-center justify-center flex-shrink-0`}>
            {isEmpty ? (
              <Plus className="w-6 h-6 text-amber-600" />
            ) : (
              <User className="w-6 h-6 text-slate-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold ${isEmpty ? 'text-amber-900' : 'text-slate-900'} truncate`}>
              {isEmpty ? 'Vaga Aberta' : role}
            </h3>
            <p className="text-xs text-slate-600 truncate">{sector}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Briefcase className="w-3.5 h-3.5" />
          <span className="truncate">{func}</span>
        </div>
        {isEmpty && (
          <div className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-200">
            Aguardando ocupante
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  member: MemberNode,
  position: PositionNode,
  user: UserNode,
};

// ============================================
// DRAWER LATERAL
// ============================================

interface MemberDrawerProps {
  member: TeamMember | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<TeamMember>) => void;
  activeProjects: any[];
}

const MemberDrawer: React.FC<MemberDrawerProps> = ({ member, onClose, onUpdate, activeProjects }) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>({});

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        role: member.role,
        sector: member.sector,
        function: member.function,
        whatsapp: member.whatsapp,
        email: member.email,
        salesLevel: member.salesLevel,
        availability_status: member.availability_status,
        away_from: member.away_from,
        away_until: member.away_until,
        away_reason: member.away_reason,
      });
    }
  }, [member]);

  if (!member) return null;

  const handleSave = () => {
    onUpdate(member.id, formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-white border-l border-slate-300 shadow-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-200 border border-slate-300 overflow-hidden">
            <img
              src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{member.name}</h3>
            <p className="text-xs text-slate-500">{member.role}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Dados Contratuais */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Dados Contratuais</h4>
          
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-label text-slate-600">Nome</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-label text-slate-600">Cargo</label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-label text-slate-600">Setor</label>
              <select
                value={formData.sector || ''}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value as any })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none"
              >
                <option value="Audiovisual">Audiovisual</option>
                <option value="Redação">Redação</option>
                <option value="Comercial">Comercial</option>
                <option value="Logística">Logística</option>
                <option value="Marketing">Marketing</option>
                <option value="Administrativo">Administrativo</option>
                <option value="TI">TI</option>
                <option value="Eventos">Eventos</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-label text-slate-600">Função</label>
              <input
                type="text"
                value={formData.function || ''}
                onChange={(e) => setFormData({ ...formData, function: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Nível Comercial */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Nível Comercial</h4>
          <div className="space-y-2">
            {['LEVEL_0', 'LEVEL_1', 'LEVEL_2'].map((level) => (
              <button
                key={level}
                onClick={() => setFormData({ ...formData, salesLevel: level as any })}
                className={`w-full px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                  formData.salesLevel === level
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                {level === 'LEVEL_0' ? 'Nível 0 (Sem Comercial)' : level === 'LEVEL_1' ? 'Nível 1 (Closer)' : 'Nível 2 (Hunter)'}
              </button>
            ))}
          </div>
        </div>

        {/* Status de Prontidão */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Status de Prontidão</h4>
          <div className="space-y-2">
            {(['ACTIVE', 'VACATION', 'SICK_LEAVE', 'OFFBOARDED'] as AvailabilityStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFormData({ ...formData, availability_status: status })}
                className={`w-full px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                  formData.availability_status === status
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
              >
                {status === 'ACTIVE' ? 'Disponível' : status === 'VACATION' ? 'Férias' : status === 'SICK_LEAVE' ? 'Licença' : 'Desligado'}
              </button>
            ))}
          </div>
        </div>

        {/* Projetos Ativos */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Projetos Ativos</h4>
          {activeProjects.length > 0 ? (
            <div className="space-y-2">
              {activeProjects.map((project) => (
                <div key={project.id} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                  <p className="text-sm font-medium text-slate-900">{project.name || project.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{project.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Nenhum projeto ativo</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-black text-white rounded-md text-sm font-semibold hover:opacity-90 transition-all"
        >
          Salvar
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const OrgCanvas: React.FC = () => {
  const { team, nodes: workflowNodes, updateTeamMember } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Build hierarchy and create nodes/edges
  useEffect(() => {
    const orgNodes: Node<OrgNodeData>[] = [];
    const orgEdges: Edge[] = [];

    // Group by hierarchy level
    const diretoria = team.filter((m) => m.function?.includes('Diretoria') || m.role?.includes('Diretor'));
    const nucleos = team.filter((m) => !diretoria.includes(m) && (m.sector || m.function));
    const atores = team.filter((m) => !diretoria.includes(m) && !nucleos.includes(m));

    // Create nodes
    let yOffset = 100;
    let xOffset = 100;

    // Diretoria (top)
    diretoria.forEach((member, idx) => {
      orgNodes.push({
        id: `member-${member.id}`,
        type: 'member',
        position: { x: xOffset + idx * 280, y: yOffset },
        data: { member, type: 'member' },
      });
    });

    // Núcleos (middle)
    yOffset = 350;
    xOffset = 100;
    const sectors = Array.from(new Set(nucleos.map((m) => m.sector)));
    sectors.forEach((sector, sectorIdx) => {
      const sectorMembers = nucleos.filter((m) => m.sector === sector);
      sectorMembers.forEach((member, idx) => {
        orgNodes.push({
          id: `member-${member.id}`,
          type: 'member',
          position: { x: xOffset + sectorIdx * 400 + idx * 280, y: yOffset },
          data: { member, type: 'member' },
        });

        // Connect to diretoria (first member)
        if (diretoria.length > 0) {
          orgEdges.push({
            id: `edge-${diretoria[0].id}-${member.id}`,
            source: `member-${diretoria[0].id}`,
            target: `member-${member.id}`,
            type: 'smoothstep',
            style: { stroke: '#CBD5E1', strokeWidth: 2 },
          });
        }
      });
    });

    // Atores (bottom)
    yOffset = 600;
    xOffset = 100;
    atores.forEach((member, idx) => {
      orgNodes.push({
        id: `member-${member.id}`,
        type: 'member',
        position: { x: xOffset + idx * 280, y: yOffset },
        data: { member, type: 'member' },
      });

      // Connect to sector (find closest sector member)
      const memberSector = member.sector;
      const sectorMember = nucleos.find((m) => m.sector === memberSector);
      if (sectorMember) {
        orgEdges.push({
          id: `edge-${sectorMember.id}-${member.id}`,
          source: `member-${sectorMember.id}`,
          target: `member-${member.id}`,
          type: 'smoothstep',
          style: { stroke: '#CBD5E1', strokeWidth: 2 },
        });
      }
    });

    setNodes(orgNodes);
    setEdges(orgEdges);
  }, [team]);

  // Get active projects for selected member
  const activeProjects = useMemo(() => {
    if (!selectedMember) return [];
    return workflowNodes.filter(
      (node) =>
        node.data.assignee === selectedMember.name ||
        node.data.assignedTo === selectedMember.name ||
        node.data.assignee?.includes(selectedMember.name)
    );
  }, [selectedMember, workflowNodes]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<OrgNodeData>) => {
    if (node.data.type === 'member') {
      setSelectedMember(node.data.member);
      setShowDrawer(true);
    }
  }, []);

  const handleConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;
    
    const newEdge = {
      id: `edge-${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      type: 'smoothstep',
      style: { stroke: '#CBD5E1', strokeWidth: 2 },
    };
    
    setEdges((eds) => [...eds, newEdge]);
  }, [setEdges]);

  const handleUpdateMember = useCallback(
    (id: string, updates: Partial<TeamMember>) => {
      updateTeamMember(id, updates);
      // Refresh nodes
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === `member-${id}` && n.data.type === 'member') {
            return {
              ...n,
              data: {
                ...n.data,
                member: { ...n.data.member, ...updates },
              },
            };
          }
          return n;
        })
      );
    },
    [updateTeamMember, setNodes]
  );

  return (
    <div className="w-full h-full bg-slate-50 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        connectionMode="loose"
      >
        <Background color="#CBD5E1" gap={24} size={1} variant="dots" />
        <Controls className="!bg-white !border !border-slate-300 !rounded-md !shadow-sm" />
        <MiniMap className="!bg-white !border !border-slate-300 !rounded-md" />

        <Panel position="top-left" className="m-4">
          <div className="bg-white border border-slate-300 rounded-md shadow-sm p-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Organograma</h2>
            <p className="text-xs text-slate-600">Clique em um membro para editar</p>
          </div>
        </Panel>
      </ReactFlow>

      {/* Drawer */}
      <AnimatePresence>
        {showDrawer && selectedMember && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => {
                setShowDrawer(false);
                setSelectedMember(null);
              }}
            />
            <MemberDrawer
              member={selectedMember}
              onClose={() => {
                setShowDrawer(false);
                setSelectedMember(null);
              }}
              onUpdate={handleUpdateMember}
              activeProjects={activeProjects}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrgCanvas;
