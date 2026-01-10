
import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge, Connection, Edge } from 'reactflow';
import { AppState, AppNode, AppEdge, NodeType, NodeData, Message, SyncStatus, InternalProductionType, ResourceAllocation } from './types';
import { supabase } from './services/supabase';
import { notifyStakeholders } from './services/notification_engine';
import { canEditFinancialData, validateInvestmentEdit, validateROIEdit } from './services/governance';
import { LogisticsEngine } from './services/logistics_engine';
import { WhatsAppAlerts } from './services/whatsapp_alerts';

const STORAGE_KEY = 'newsflow_nodes_state_v3';
let updateTimeout: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  activeTab: 'canvas',
  isRecording: false,
  isMaster: true,
  messages: [],
  leads: [
    // Leads fictícios para demonstração do Kanban
    {
      id: 'lead-demo-1',
      status: 'PROSPECT',
      data: {
        clientName: 'Prefeitura de Resende',
        projectName: 'Campanha Turismo Regional',
        projectDescription: 'Divulgação dos pontos turísticos da região para atrair visitantes no período de férias.',
        totalValue: 45000,
        targetCities: ['Resende', 'Itatiaia'],
        campaignType: 'CITY_ANNIVERSARY',
        expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-1',
      handled_by: 'user-2',
      created_at: new Date().toISOString()
    },
    {
      id: 'lead-demo-2',
      status: 'PROSPECT',
      data: {
        clientName: 'CSN - Companhia Siderúrgica Nacional',
        projectName: 'Aniversário 85 Anos',
        projectDescription: 'Campanha institucional celebrando 85 anos da CSN com foco em sustentabilidade e inovação.',
        totalValue: 120000,
        targetCities: ['Volta Redonda', 'Barra Mansa', 'Resende'],
        campaignType: 'INSTITUCIONAL_ANNIVERSARY',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-1',
      handled_by: 'user-3',
      created_at: new Date().toISOString()
    },
    {
      id: 'lead-demo-3',
      status: 'PITCH',
      data: {
        clientName: 'Volkswagen Caminhões',
        projectName: 'Lançamento Novo Modelo',
        projectDescription: 'Cobertura do lançamento do novo caminhão elétrico com evento para imprensa e test-drive.',
        totalValue: 65000,
        targetCities: ['Resende'],
        campaignType: 'INSTITUCIONAL_ANNIVERSARY',
        expirationDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-2',
      handled_by: 'user-1',
      created_at: new Date().toISOString()
    },
    {
      id: 'lead-demo-4',
      status: 'PITCH',
      data: {
        clientName: 'Associação Comercial de Barra Mansa',
        projectName: 'Black Friday Regional',
        projectDescription: 'Campanha de divulgação da Black Friday do comércio local com lives e entrevistas.',
        totalValue: 28000,
        targetCities: ['Barra Mansa'],
        campaignType: 'CITY_ANNIVERSARY',
        expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-3',
      handled_by: 'user-2',
      created_at: new Date().toISOString()
    },
    {
      id: 'lead-demo-5',
      status: 'PROPOSAL',
      data: {
        clientName: 'Hospital São Lucas',
        projectName: 'Campanha de Prevenção',
        projectDescription: 'Série de vídeos educativos sobre prevenção de doenças cardiovasculares.',
        totalValue: 35000,
        targetCities: ['Volta Redonda'],
        campaignType: 'ESG_PRACTICES',
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-1',
      handled_by: 'user-3',
      created_at: new Date().toISOString()
    },
    {
      id: 'lead-demo-6',
      status: 'NEGOTIATION',
      data: {
        clientName: 'Grupo Pançardes',
        projectName: 'Institucional Diário do Vale',
        projectDescription: 'Campanha de valorização da marca do jornal com foco em jornalismo de qualidade.',
        totalValue: 85000,
        targetCities: ['Volta Redonda', 'Barra Mansa', 'Resende', 'Pinheiral'],
        campaignType: 'INSTITUCIONAL_ANNIVERSARY',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-2',
      handled_by: 'user-1',
      created_at: new Date().toISOString()
    },
    {
      id: 'lead-demo-7',
      status: 'NEGOTIATION',
      data: {
        clientName: 'Universidade Federal Fluminense',
        projectName: 'Vestibular 2026',
        projectDescription: 'Divulgação do processo seletivo com entrevistas e tour virtual pelo campus.',
        totalValue: 42000,
        targetCities: ['Volta Redonda'],
        campaignType: 'INSTITUCIONAL_ANNIVERSARY',
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-3',
      handled_by: 'user-2',
      created_at: new Date().toISOString()
    },
    {
      id: 'lead-demo-8',
      status: 'WON',
      data: {
        clientName: 'Supermercados Guanabara',
        projectName: 'Aniversário 40 Anos',
        projectDescription: 'Campanha completa de aniversário com vídeos institucionais e cobertura de eventos.',
        totalValue: 95000,
        targetCities: ['Volta Redonda', 'Barra Mansa'],
        campaignType: 'INSTITUCIONAL_ANNIVERSARY',
        expirationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      referral_by: 'user-1',
      handled_by: 'user-1',
      created_at: new Date().toISOString()
    }
  ],
  // Clipboard state (stores copied nodes & edges)
  clipboard: { nodes: [] as AppNode[], edges: [] as AppEdge[] },
  // History stacks (max 100)
  undoStack: [] as { type: string; payload: any }[],
  redoStack: [] as { type: string; payload: any }[],
  // Toast notifications
  toast: { message: '' as string, visible: false as boolean },
  projects: [
    // Projetos fictícios para demonstração do FLOW (Kanban)
    {
      id: 'proj-demo-1',
      name: 'Campanha Turismo Regional - Prefeitura Resende',
      status: 'todo',
      nodes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'proj-demo-2',
      name: 'Aniversário 85 Anos CSN',
      status: 'doing',
      nodes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'proj-demo-3',
      name: 'Lançamento Caminhão Elétrico - VW',
      status: 'doing',
      nodes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'proj-demo-4',
      name: 'Campanha Prevenção - Hospital São Lucas',
      status: 'review',
      nodes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'proj-demo-5',
      name: 'Institucional Diário do Vale',
      status: 'done',
      nodes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  syncStatus: 'offline',
  team: [
    // Equipe fictícia para demonstração do Ghost Mode
    {
      id: 'team-1',
      name: 'Marco Santos',
      role: 'Diretor',
      sector: 'Administrativo' as const,
      function: 'Diretoria Executiva',
      whatsapp: '24999990001',
      email: 'marco@diariodovale.com.br',
      status: 'ACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco',
      availability_status: 'ACTIVE' as const,
    },
    {
      id: 'team-2',
      name: 'Luciano Ferreira',
      role: 'Editor-Chefe',
      sector: 'Redação' as const,
      function: 'Coordenação Editorial',
      whatsapp: '24999990002',
      email: 'luciano@diariodovale.com.br',
      status: 'ACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luciano',
      availability_status: 'ACTIVE' as const,
    },
    {
      id: 'team-3',
      name: 'Renata Oliveira',
      role: 'Jornalista',
      sector: 'Redação' as const,
      function: 'Reportagem',
      whatsapp: '24999990003',
      email: 'renata@diariodovale.com.br',
      status: 'ACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Renata',
      availability_status: 'VACATION' as const,
      away_from: '2026-01-05',
      away_until: '2026-01-20',
      away_reason: 'Férias',
    },
    {
      id: 'team-4',
      name: 'Bill Costa',
      role: 'Cinegrafista',
      sector: 'Audiovisual' as const,
      function: 'Captação de Vídeo',
      whatsapp: '24999990004',
      email: 'bill@diariodovale.com.br',
      status: 'ACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bill',
      availability_status: 'ACTIVE' as const,
    },
    {
      id: 'team-5',
      name: 'Alba Mendes',
      role: 'Logística',
      sector: 'Logística' as const,
      function: 'Coordenação de Frota',
      whatsapp: '24999990005',
      email: 'alba@diariodovale.com.br',
      status: 'ACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alba',
      availability_status: 'SICK_LEAVE' as const,
      away_from: '2026-01-08',
      away_until: '2026-01-12',
      away_reason: 'Licença Médica',
    },
    {
      id: 'team-6',
      name: 'Jader Lima',
      role: 'Designer',
      sector: 'Marketing' as const,
      function: 'Design Gráfico',
      whatsapp: '24999990006',
      email: 'jader@diariodovale.com.br',
      status: 'ACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jader',
      availability_status: 'ACTIVE' as const,
    },
    {
      id: 'team-7',
      name: 'Carlos Antigo',
      role: 'Ex-Produtor',
      sector: 'Audiovisual' as const,
      function: 'Produção',
      whatsapp: '24999990007',
      email: 'carlos@diariodovale.com.br',
      status: 'INACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      availability_status: 'OFFBOARDED' as const,
      away_reason: 'Desligado em Dez/2025',
    },
    {
      id: 'team-8',
      name: 'Paula Tech',
      role: 'Desenvolvedora',
      sector: 'TI' as const,
      function: 'Sistemas',
      whatsapp: '24999990008',
      email: 'paula@diariodovale.com.br',
      status: 'ACTIVE' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paula',
      availability_status: 'ACTIVE' as const,
    },
  ],
  vehicles: [],
  userConsent: null,
  commissions: [],
  theme: (localStorage.getItem('newsflow_theme') as 'dark' | 'light') || 'light',

  // Carregamento Inicial (Híbrido: Local + Supabase)
  initialize: async () => {
    // 1. Carregar workspaces primeiro (isso carregará o último workspace automaticamente)
    await get().loadWorkspaces();

    const savedConsent = localStorage.getItem('newsflow_consent');
    if (savedConsent) {
      try {
        set({ userConsent: JSON.parse(savedConsent) });
      } catch (e) {}
    }

    // 2. Se não houver workspace carregado, tentar carregar do LocalStorage como fallback
    if (get().nodes.length === 0) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          set({ nodes: parsed.nodes || [], edges: parsed.edges || [] });
        } catch (e) {
          console.error("Local load failed", e);
        }
      }
    }

    // 3. Tentar sincronizar com Supabase (fallback se workspace não carregou)
    if (get().nodes.length === 0) {
      try {
        set({ syncStatus: 'syncing' });
        const { data: dbNodes, error: nodesErr } = await supabase.from('nodes').select('*');
        const { data: dbEdges, error: edgesErr } = await supabase.from('edges').select('*');
        const { data: dbMessages, error: msgErr } = await supabase.from('messages').select('*').order('timestamp', { ascending: true });
        const { data: dbLeads, error: leadsErr } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        const { data: dbProjects, error: proErr } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

        if (!nodesErr && !edgesErr && dbNodes && dbEdges) {
          const formattedNodes: AppNode[] = dbNodes.map(n => ({
            id: n.id,
            type: n.type,
            position: { x: n.position_x, y: n.position_y },
            data: n.data
          }));

          const formattedEdges: AppEdge[] = dbEdges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            animated: e.animated,
            style: e.style,
            data: e.data
          }));

          const formattedMessages: Message[] = (dbMessages || []).map(m => ({
            id: m.id,
            sender: m.sender as any,
            text: m.text,
            timestamp: new Date(m.timestamp)
          }));

          set({ 
            nodes: formattedNodes.length > 0 ? formattedNodes : get().nodes, 
            edges: formattedEdges.length > 0 ? formattedEdges : get().edges,
            messages: formattedMessages,
            leads: dbLeads || [],
            projects: dbProjects || [],
            syncStatus: 'online'
          });
        }
      } catch (err) {
        console.warn("Supabase sync failed", err);
        set({ syncStatus: 'error' });
      }
    }

    // 4. Iniciar Real-time Subscription e carregar Time
    get().subscribeToMessages();
    get().loadTeam();
  },

  subscribeToMessages: () => {
    supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as any;
        
        // Evita duplicidade se a mensagem foi enviada por este cliente
        const exists = get().messages.some(m => m.id === newMessage.id);
        if (exists) return;

        const formattedMsg: Message = {
          id: newMessage.id,
          sender: newMessage.sender as any,
          text: newMessage.text,
          isWhatsApp: newMessage.is_whatsapp,
          timestamp: new Date(newMessage.timestamp)
        };

        set({ messages: [...get().messages, formattedMsg] });

        // Ping Visual/Sonoro (Mock)
        if (formattedMsg.isWhatsApp) {
          console.log("🔔 [WHATSAPP_PING]: Nova mensagem de stakeholder recebida!");
        }
      })
      .subscribe();
  },

  pushToUndo: () => {
    const { nodes, edges, undoStack } = get();
    const newStack = [...undoStack, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }];
    if (newStack.length > 20) newStack.shift();
    set({ undoStack: newStack, redoStack: [] });
  },

  undo: () => {
    const { nodes, edges, undoStack, redoStack } = get();
    if (undoStack.length === 0) return;

    const last = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    
    set({ 
      nodes: last.nodes, 
      edges: last.edges,
      undoStack: newUndoStack,
      redoStack: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...redoStack].slice(0, 20)
    });
  },

  redo: () => {
    const { nodes, edges, undoStack, redoStack } = get();
    if (redoStack.length === 0) return;

    const next = redoStack[0];
    const newRedoStack = redoStack.slice(1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      redoStack: newRedoStack,
      undoStack: [...undoStack, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }].slice(-20)
    });
  },

  selectSubTree: (nodeId) => {
    const { nodes, edges } = get();
    const descendants = new Set<string>();
    
    const findDescendants = (id: string) => {
      descendants.add(id);
      edges.filter(e => e.source === id).forEach(e => {
        if (!descendants.has(e.target)) findDescendants(e.target);
      });
    };

    findDescendants(nodeId);
    
    const nextNodes = nodes.map(n => ({
      ...n,
      selected: descendants.has(n.id)
    }));
    
    set({ nodes: nextNodes });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setMessages: (messages) => set({ messages }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  setIsRecording: (isRecording) => set({ isRecording }),
  
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('newsflow_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(newTheme);
  },

  onNodesChange: (changes) => {
    const nextNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: nextNodes });
    
    // Debounce de 500ms para persistência no Supabase
    if (updateTimeout) clearTimeout(updateTimeout);
    
    set({ syncStatus: 'syncing' });
    updateTimeout = setTimeout(async () => {
      try {
        const promises = changes.map(async (change) => {
          if (change.type === 'position' && change.position) {
            return supabase.from('nodes').update({ 
              position_x: change.position.x, 
              position_y: change.position.y 
            }).eq('id', change.id);
          }
          if (change.type === 'dimensions' && change.dimensions) {
             const node = nextNodes.find(n => n.id === change.id);
             if (node) {
               return supabase.from('nodes').update({ 
                 data: { ...node.data, width: change.dimensions.width, height: change.dimensions.height } 
               }).eq('id', change.id);
             }
          }
          if (change.type === 'remove') {
            return supabase.from('nodes').delete().eq('id', change.id);
          }
          return null;
        });

        await Promise.all(promises);
        set({ syncStatus: 'online' });
      } catch (err) {
        console.error("Sync error", err);
        set({ syncStatus: 'error' });
      }
    }, 500);
  },

  onEdgesChange: (changes) => {
    const nextEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: nextEdges });

    changes.forEach(async (change) => {
      if (change.type === 'remove') {
        await supabase.from('edges').delete().eq('id', change.id);
      }
    });
  },

  onConnect: async (params: Connection) => {
    get().pushToUndo();
    const newEdge: AppEdge = {
      ...params,
      id: `e-${params.source}-${params.target}-${Math.random().toString(36).substring(7)}`,
      animated: true,
      style: { stroke: '#a855f7', strokeWidth: 2 },
    } as AppEdge;

    set({ edges: addEdge(newEdge, get().edges), syncStatus: 'syncing' });

    try {
      await supabase.from('edges').insert({
        id: newEdge.id,
        source: newEdge.source,
        target: newEdge.target,
        animated: true,
        style: newEdge.style
      });
      set({ syncStatus: 'online' });
    } catch (err) {
      set({ syncStatus: 'error' });
    }
  },

  updateNodeData: async (id, newData) => {
    get().pushToUndo();
    const { nodes, checkResourceAvailability } = get();
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    let finalData = { ...node.data, ...newData };

    // Especial: Sincronizar com tabela Master 'projects' se for um nó de Campaign
    if (node.type === 'campaign' && (newData.totalInvestment !== undefined || newData.label || newData.scheduledDate)) {
      get().syncProjectWithNode(id, {
        name: newData.label || node.data.label,
        totalValue: newData.totalInvestment !== undefined ? newData.totalInvestment : node.data.totalInvestment,
        deadline: newData.scheduledDate || node.data.scheduledDate
      });
    }

    // 1. Validação de Investimento (ESG vs Cinbal) & Sincronização de ROI
    if (newData.totalInvestment !== undefined) {
      const validation = validateInvestmentEdit(node.data.totalInvestment || 0, newData.totalInvestment);
      if (!validation.allowed) {
        throw new Error(validation.reason || 'Edição de investimento não permitida');
      }

      // Validação de Valores Fixos
      const campaignType = node.data.campaignType || 'INSTITUCIONAL_ANNIVERSARY';
      if (campaignType === 'ESG_PRACTICES' && newData.totalInvestment !== 40000) {
        console.warn("⚠️ [ROI_ENGINE]: Valor ESG deve ser R$ 40.000,00");
      } else if (campaignType === 'INSTITUCIONAL_ANNIVERSARY' && newData.totalInvestment !== 25000) {
        console.warn("⚠️ [ROI_ENGINE]: Valor Cinbal/Institucional deve ser R$ 25.000,00");
      }

      // FIX ROI SYNC: Cálculo [Investimento / Total_Reach] ocorre ANTES do set
      const { ROICalculator } = await import('./services/roi_calculator');
      const roi = ROICalculator.calculateProjectROI(newData.totalInvestment);
      finalData.roiStats = roi;
    }

    if (newData.roiStats !== undefined) {
      const validation = validateROIEdit();
      if (!validation.allowed) {
        throw new Error(validation.reason || 'Edição de ROI não permitida');
      }
    }
    
    // 2. Trava de Conflito de Logística (Assets & Squad Integration)
    if ((newData.deadline || newData.resourceAllocation || newData.status === 'doing') && node) {
       const alloc = newData.resourceAllocation || node.data.resourceAllocation;
       const targetStatus = newData.status || node.data.status;
       
       if (alloc && alloc.startTime && alloc.endTime) {
         // Check Asset conflict
         const isAvailable = await LogisticsEngine.checkAssetAvailability(alloc.resourceId, alloc.startTime, alloc.endTime);
         
         if (!isAvailable) {
           console.warn("🚫 [LOGISTICS_CONFLICT]: Ocupação duplicada detectada no Supabase.");
           finalData.status = 'RESOURCE_CONFLICT';
         } else {
           // Se status mudou para 'doing', tenta alocar Squad automático
           if (targetStatus === 'doing' && !alloc.professionalIds) {
             const role = (node.type === 'production' || node.data.label.includes('Captação')) ? 'CAPTURE' : 'EDITOR';
             const count = role === 'CAPTURE' ? 3 : 2;
             
             const squad = await LogisticsEngine.checkSquadAvailability(role, count, alloc.startTime, alloc.endTime);
             if (squad.available) {
               console.log(`✅ [SQUAD_ALOC]: Alocados ${squad.assignedIds.length} profissionais para ${node.id}`);
               finalData.resourceAllocation = { ...alloc, professionalIds: squad.assignedIds };
             } else {
               console.warn(`⚠️ [SQUAD_FAILURE]: Falta de profissionais ${role} para alocação.`);
               finalData.status = 'RESOURCE_CONFLICT'; // Trava por falta de equipe
             }
           }
           
           if (finalData.status === 'RESOURCE_CONFLICT' && isAvailable) {
             finalData.status = 'todo';
           }
         }
       }
    }

    const nextNodes = nodes.map((n) => {
      if (n.id === id) {
        return { ...n, data: finalData };
      }
      return n;
    });

    // Alertas em tempo real para mudanças de status
    if (newData.status && newData.status !== node.data.status) {
      // Notificar admin via WhatsApp se status mudou para 'done'
      if (newData.status === 'done') {
        WhatsAppAlerts.sendMeetingMinute(
          { ...finalData, label: node.data.label } as any,
          node.data.label || 'Tarefa'
        ).catch(console.error);
      }
    }

    // Alertas de deadline
    if (newData.deadline || node.data.deadline) {
      const deadline = new Date(newData.deadline || node.data.deadline!);
      const now = new Date();
      const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDeadline <= 1 && finalData.status !== 'done') {
        WhatsAppAlerts.sendDeadlineAlert(
          finalData.label || node.data.label,
          daysUntilDeadline,
          finalData.assignee || finalData.assignedTo
        ).catch(console.error);
      }
    }

    // Alertas de dependência
    if (finalData.status === 'RESOURCE_CONFLICT') {
      WhatsAppAlerts.sendDependencyAlert(
        finalData.label || node.data.label,
        'Recurso em conflito',
        finalData.assignee || finalData.assignedTo
      ).catch(console.error);
    }

    const nextEdges = get().edges.map(edge => {
      const sourceNode = nextNodes.find(n => n.id === edge.source);
      const targetNode = nextNodes.find(n => n.id === edge.target);
      const isGlowing = sourceNode?.data.status === 'done' || targetNode?.data.status === 'done';
      return {
        ...edge,
        animated: isGlowing,
        style: { 
          ...edge.style, 
          stroke: isGlowing ? '#10b981' : '#a855f7',
          strokeWidth: isGlowing ? 4 : 2,
          filter: isGlowing ? 'drop-shadow(0 0 8px #10b981)' : 'none'
        }
      };
    });

    set({ nodes: nextNodes, edges: nextEdges, syncStatus: 'syncing' });

    try {
      await supabase.from('nodes').update({ data: finalData }).eq('id', id);
      set({ syncStatus: 'online' });
    } catch (err) {
      set({ syncStatus: 'error' });
    }
  },

  addNode: async (type, position = { x: 100, y: 100 }, initialData = {}) => {
    get().pushToUndo();
    const id = `${type}-${Math.random().toString(36).substring(7)}`;
    const newNode: AppNode = {
      id,
      type,
      position,
      data: {
        label: `Nova ${type}`,
        status: 'todo',
        ...initialData,
      },
    };

    set({ nodes: [...get().nodes, newNode], syncStatus: 'syncing' });

    try {
      await supabase.from('nodes').insert({
        id,
        type,
        position_x: position.x,
        position_y: position.y,
        data: newNode.data
      });
      set({ syncStatus: 'online' });
    } catch (err) {
      set({ syncStatus: 'error' });
    }
  },

  deleteEdge: async (edgeId: string) => {
    get().pushToUndo();
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
      syncStatus: 'syncing'
    });
    try {
      await supabase.from('edges').delete().eq('id', edgeId);
      set({ syncStatus: 'online' });
    } catch (err) {
      console.error("Failed to delete edge", err);
      set({ syncStatus: 'error' });
    }
  },

  deleteNode: async (id) => {
    get().pushToUndo();
    set({
      nodes: get().nodes.filter((node) => node.id !== id),
      edges: get().edges.filter((edge) => edge.source !== id && edge.target !== id),
      syncStatus: 'syncing'
    });
    try {
      await supabase.from('nodes').delete().eq('id', id);
      set({ syncStatus: 'online' });
    } catch (err) {
      set({ syncStatus: 'error' });
    }
  },

  duplicateNode: async (id) => {
    get().pushToUndo();
    const nodeToDuplicate = get().nodes.find((n) => n.id === id);
    if (nodeToDuplicate) {
      await get().addNode(
        nodeToDuplicate.type as NodeType, 
        { x: nodeToDuplicate.position.x + 50, y: nodeToDuplicate.position.y + 50 },
        { ...nodeToDuplicate.data }
      );
    }
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  addMessage: async (msg) => {
    set({ messages: [...get().messages, msg] });
    
    // Persistência no Supabase
    try {
      await supabase.from('messages').insert({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.timestamp.toISOString()
      });
    } catch (err) {
 	  console.error("Failed to persist message", err);
    }
  },

  autoGenerateNodesFromMeeting: async (meetingNodeId: string) => {
    const { nodes, updateNodeData } = get();
    const meetingNode = nodes.find(n => n.id === meetingNodeId);
    if (!meetingNode || !meetingNode.data.generatedTasks) return;

    console.log(`🤖 [IA_NODE_GENERATOR]: Expandindo workflow a partir da pauta: ${meetingNode.data.label}`);
    
    const newNodes: AppNode[] = [];
    const newEdges: AppEdge[] = [];
    const baseX = meetingNode.position.x + 350;
    const baseY = meetingNode.position.y;

    meetingNode.data.generatedTasks.forEach((taskItem, index) => {
      const id = `task-${Math.random().toString(36).substring(7)}`;
      newNodes.push({
        id,
        type: 'custom_action',
        position: { x: baseX, y: baseY + (index * 160) },
        data: {
          label: taskItem.label,
          status: 'todo',
          description: `Demanda de governança: ${meetingNode.data.label}`,
          checklist: []
        }
      });

      newEdges.push({
        id: `e-${meetingNodeId}-${id}`,
        source: meetingNodeId,
        target: id,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 3, filter: 'drop-shadow(0 0 5px #6366f1)' }
      });
    });

    set(state => ({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      syncStatus: 'syncing'
    }));

    // Persistência
    try {
      await Promise.all([
        ...newNodes.map(n => supabase.from('nodes').insert({
          id: n.id, type: n.type, position_x: n.position.x, position_y: n.position.y, data: n.data
        })),
        ...newEdges.map(e => supabase.from('edges').insert({
          id: e.id, source: e.source, target: e.target, animated: true, style: e.style
        }))
      ]);
      set({ syncStatus: 'online' });
    } catch (err) {
      console.error("Batch persistent failed", err);
      set({ syncStatus: 'error' });
    }
  },


  loadCampaignTemplate: async (type, campaignId) => {
    console.log(`🚀 [TEMPLATE_ENGINE]: Loading ${type} for Campaign ${campaignId}...`);
    set({ syncStatus: 'syncing' });

    const campaignNode = get().nodes.find(n => n.id === campaignId);
    if (!campaignNode) return;

    const newNodes: AppNode[] = [];
    const newEdges: AppEdge[] = [];
    const baseX = campaignNode.position.x;
    const baseY = campaignNode.position.y;

    if (type === 'INSTITUCIONAL_ANNIVERSARY') {
      const templates = [
        { label: 'Storytelling Impresso', type: 'os', x: 250, y: -100 },
        { label: 'Documentário Curto', type: 'media_edition', x: 250, y: 100 },
        { label: 'Drops Reels', type: 'production', x: 500, y: 0 }
      ];

      templates.forEach((t, i) => {
        const id = `${t.type}-${Math.random().toString(36).substring(7)}`;
        newNodes.push({
          id,
          type: t.type as any,
          position: { x: baseX + t.x, y: baseY + t.y },
          data: { label: t.label, status: 'todo' }
        });
        newEdges.push({
          id: `e-${campaignId}-${id}`,
          source: campaignId,
          target: id,
          animated: true,
          style: { stroke: '#a855f7', strokeWidth: 3 }
        });
      });
    }

    if (type === 'ESG_PRACTICES') {
      // 4 Reportagens de Vídeo
      for (let i = 0; i < 4; i++) {
        const id = `media-${Math.random().toString(36).substring(7)}`;
        newNodes.push({
          id,
          type: 'media_edition',
          position: { x: baseX + 300, y: baseY - 300 + (i * 150) },
          data: { label: `Reportagem Vídeo ESG ${i+1}`, status: 'todo' }
        });
        newEdges.push({ id: `e-${campaignId}-${id}`, source: campaignId, target: id, animated: true, style: { stroke: '#06b6d4', strokeWidth: 3 } });
      }
      // 4 Capas Impresso
      for (let i = 0; i < 4; i++) {
        const id = `os-${Math.random().toString(36).substring(7)}`;
        newNodes.push({
          id,
          type: 'os',
          position: { x: baseX + 600, y: baseY - 300 + (i * 150) },
          data: { label: `Capa Impresso ESG ${i+1}`, status: 'todo' }
        });
        newEdges.push({ id: `e-${campaignId}-${id}`, source: campaignId, target: id, animated: true, style: { stroke: '#a855f7', strokeWidth: 3 } });
      }
    }

    set({ 
      nodes: [...get().nodes, ...newNodes],
      edges: [...get().edges, ...newEdges],
      syncStatus: 'online'
    });

    // Persistência em lote
    try {
      const nodePromises = newNodes.map(n => supabase.from('nodes').insert({ id: n.id, type: n.type, position_x: n.position.x, position_y: n.position.y, data: n.data }));
      const edgePromises = newEdges.map(e => supabase.from('edges').insert({ id: e.id, source: e.source, target: e.target, animated: true, style: e.style }));
      await Promise.all([...nodePromises, ...edgePromises]);
    } catch (err) {
      console.error("Failed to persist template nodes", err);
    }
  },

  // CRM Actions
  addLead: async (leadData) => {
    set({ syncStatus: 'syncing' });
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({ status: leadData.status, data: leadData.data })
        .select()
        .single();

      if (!error && data) {
        set({ leads: [data, ...get().leads], syncStatus: 'online' });
      }
    } catch (err) {
      console.error("Failed to add lead", err);
      set({ syncStatus: 'error' });
    }
  },

  updateLeadStatus: async (id, status) => {
    const prevStatus = get().leads.find(l => l.id === id)?.status;
    
    const nextLeads = get().leads.map(lead => 
      lead.id === id ? { ...lead, status } : lead
    );
    set({ leads: nextLeads, syncStatus: 'syncing' });

    try {
      await supabase.from('leads').update({ status }).eq('id', id);
      set({ syncStatus: 'online' });

      // Se virou WON e antes não era, converte automaticamente e dispara logística
      if (status === 'WON' && prevStatus !== 'WON') {
        const lead = get().leads.find(l => l.id === id);
        if (lead) {
          console.log(`🎯 [CRM_WON]: Projeto Fechado! Iniciando automação para: ${lead.data.projectName}`);
          
          // 1. Converter para Projeto
          await get().convertLeadToProject(id);
          
          // 2. Calcular Comissões (Regra de Negócio)
          await get().calculateCommissions(id, lead.data.totalValue, lead.referral_by, lead.handled_by);
          
          // 3. Notificar Diretoria
          const msg = `💰 NOVIDADE COMERCIAL: O projeto "${lead.data.projectName}" foi FECHADO por R$ ${lead.data.totalValue.toLocaleString()}.`;
          await get().addMessage({
            id: `msg-${Math.random().toString(36).substring(7)}`,
            sender: 'ai',
            text: msg,
            timestamp: new Date()
          });
        }
      }
    } catch (err) {
      console.error("Failed to update lead status", err);
      set({ syncStatus: 'error' });
    }
  },

  triggerProposalViewedAlert: async (leadId: string) => {
    const lead = get().leads.find(l => l.id === leadId);
    if (lead) {
      await WhatsAppAlerts.sendProposalViewAlert(
        lead.data.projectName,
        lead.data.clientName,
        lead.data.totalValue
      );
    }
  },

  convertLeadToProject: async (leadId) => {
    await get().initiateProjectFromProposal(leadId);
  },

  initiateProjectFromProposal: async (proposalId) => {
    const lead = get().leads.find(l => l.id === proposalId);
    if (!lead) return;

    console.log(`🎯 [PROJECT_INITIATION]: Converting Proposal ${lead.data.projectName} to Project...`);
    set({ syncStatus: 'syncing' });

    const campaignId = `campaign-${Math.random().toString(36).substring(7)}`;
    const position = { x: 100, y: 100 };
    
    const campaignNode: AppNode = {
      id: campaignId,
      type: 'campaign',
      position,
      data: {
        label: lead.data.projectName,
        status: 'todo',
        editoria: 'Comercial',
        campaignType: lead.data.campaignType || 'INSTITUCIONAL_ANNIVERSARY',
        targetCities: lead.data.targetCities,
        totalInvestment: lead.data.totalValue
      }
    };

    set({ nodes: [campaignNode, ...get().nodes] });

    try {
      await supabase.from('nodes').insert({
        id: campaignId,
        type: 'campaign',
        position_x: position.x,
        position_y: position.y,
        data: campaignNode.data
      });

      // Carrega o template base
      await get().loadCampaignTemplate(campaignNode.data.campaignType!, campaignId);
      
      console.log(`✅ [PROJECT_INITIATION]: Project ${campaignId} initialized.`);
      set({ syncStatus: 'online' });
    } catch (err) {
      console.error("Project initiation failed", err);
      set({ syncStatus: 'error' });
    }
  },

  cloneNodeStructure: (nodeId) => {
    console.log(`📂 [CLONE_ENGINE]: Cloning structure from node ${nodeId}...`);
    const { nodes, edges } = get();
    
    const findDescendants = (id: string, visited = new Set<string>()): string[] => {
      visited.add(id);
      edges.filter(e => e.source === id).forEach(e => {
        if (!visited.has(e.target)) findDescendants(e.target, visited);
      });
      return Array.from(visited);
    };

    const targetNodeIds = findDescendants(nodeId);
    const nodesToClone = nodes.filter(n => targetNodeIds.includes(n.id));
    const edgesToClone = edges.filter(e => targetNodeIds.includes(e.source) && targetNodeIds.includes(e.target));

    const idMap: Record<string, string> = {};
    nodesToClone.forEach(n => {
      idMap[n.id] = `${n.type}-${Math.random().toString(36).substring(7)}`;
    });

    const newNodes = nodesToClone.map(n => ({
      ...n,
      id: idMap[n.id],
      position: { x: n.position.x + 100, y: n.position.y + 100 },
      data: { ...n.data, status: 'todo' as const }
    }));

    const newEdges = edgesToClone.map(e => ({
      ...e,
      id: `e-${idMap[e.source]}-${idMap[e.target]}`,
      source: idMap[e.source],
      target: idMap[e.target]
    }));

    set({ 
      nodes: [...nodes, ...newNodes],
      edges: [...edges, ...newEdges]
    });
  },

  checkResourceAvailability: async (date, type) => {
    console.log(`🔍 [RESOURCE_ENGINE]: Checking availability for ${type} on ${date}...`);
    
    // Mapeamento de Produção -> Recurso Físico
    const resourceMap: Record<InternalProductionType, ResourceAllocation['resourceId']> = {
      'INTERNAL_PODCAST': 'STUDIO_A',
      'TALK_DELAS': 'STUDIO_B',
      'DIARIO_TV': 'VIDEO_TEAM_1',
      'EXTERNAL_VIDEO_REPORT': 'VIDEO_TEAM_2'
    };

    const targetResource = resourceMap[type];
    const startTime = new Date(date).toISOString();
    const endTime = new Date(new Date(date).getTime() + (60 * 60 * 1000)).toISOString();

    return await LogisticsEngine.checkAssetAvailability(targetResource, startTime, endTime);
  },

  updateNodeImage: async (id: string, imageUrl: string) => {
    const nextNodes = get().nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, imageUrl, isProcessing: false } };
      }
      return node;
    });

    set({ nodes: nextNodes, syncStatus: 'syncing' });

    try {
      const { data } = nextNodes.find(n => n.id === id) || {};
      if (data) {
        await supabase.from('nodes').update({ data }).eq('id', id);
        set({ syncStatus: 'online' });
      }
    } catch (err) {
      console.error("Failed to update node image", err);
      set({ syncStatus: 'error' });
    }
  },

  archiveProductionEvidence: async (nodeId, url, screenshot) => {
    const { updateNodeData } = get();
    await updateNodeData(nodeId, { 
      evidenceUrl: url, 
      evidenceScreenshot: screenshot,
      status: 'done' 
    });
    console.log(`📸 [CLIPPING_ENGINE]: Evidência arquivada para o nó ${nodeId}.`);
  },

  onWorkflowProgress: async (id: string, status: NodeData['status']) => {
    // 1. Atualiza o nó atual
    await get().updateNodeData(id, { status });

    if (status === 'done') {
      const { edges, nodes } = get();
      
      // 2. Identifica nós conectados à saída (target) deste nó
      const outboundEdges = edges.filter(e => e.source === id);
      const targetIds = outboundEdges.map(e => e.target);

      // 3. Atualiza nós dependentes para 'doing' (Pronto para iniciar)
      const nextNodes = nodes.map(node => {
        if (targetIds.includes(node.id) && node.data.status === 'todo') {
          return { ...node, data: { ...node.data, status: 'doing' as const } };
        }
        return node;
      });

      // 4. Ativa animação 'Flow Light' nas Edges de saída
      const nextEdges = edges.map(edge => {
        if (edge.source === id) {
          return {
            ...edge,
            animated: true,
            style: { 
              ...edge.style, 
              stroke: '#10b981', 
              strokeWidth: 4,
              filter: 'drop-shadow(0 0 8px #10b981)'
            }
          };
        }
        return edge;
      });

      set({ nodes: nextNodes, edges: nextEdges, syncStatus: 'syncing' });

      // Persistir mudanças em lote (Simplificado para o nó principal)
      try {
        await Promise.all(targetIds.map(targetId => {
          const node = nextNodes.find(n => n.id === targetId);
          return supabase.from('nodes').update({ data: node?.data }).eq('id', targetId);
        }));

        // Seleciona node para inspeção
        await notifyStakeholders(id, 'HANDOVER');

        set({ syncStatus: 'online' });
      } catch (err) {
        set({ syncStatus: 'error' });
      }
    }
  },

  publishToSite: async (nodeId, data) => {
    // Implementação real de publicação (Ex: WordPress REST API)
    set({ syncStatus: 'syncing' });
    setTimeout(async () => {
      await get().updateNodeData(nodeId, { 
        isPublished: true, 
        publishedUrl: `https://diariodovale.com.br/noticia/${nodeId}` 
      });
      set({ syncStatus: 'online' });
    }, 1500);
  },

  syncProjectWithNode: async (campaignId, data) => {
    try {
      const { data: existing } = await supabase.from('projects').select('*').eq('campaign_id', campaignId).single();
      if (existing) {
        await supabase.from('projects').update({
          name: data.name,
          total_value: data.totalValue,
          deadline: data.deadline,
          updated_at: new Date().toISOString()
        }).eq('campaign_id', campaignId);
      } else {
        await supabase.from('projects').insert({
          id: `proj-${Math.random().toString(36).substring(7)}`,
          campaign_id: campaignId,
          name: data.name || 'Novo Projeto',
          total_value: data.totalValue || 0,
          deadline: data.deadline,
          status: 'ACTIVE'
        });
      }
      get().loadProjects();
    } catch (err) {
      console.warn("Project sync bypassed (table not ready?)");
    }
  },

  loadProjects: async () => {
    try {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) set({ projects: data });
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  },

  loadTeam: async () => {
    try {
      const { data } = await supabase.from('team').select('*').order('name', { ascending: true });
      if (data && data.length > 0) {
        set({ team: data });
      } else {
        throw new Error("Empty team");
      }
    } catch (err) {
      // Fallback para simulação robusta
      set({ team: [
        { id: '1', name: 'Luciano', role: 'Diretor Ex.', sector: 'Administrativo', function: 'Diretoria - Estratégico', whatsapp: '2499999999', email: 'luciano@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luciano', availability_status: 'ACTIVE' },
        { id: '2', name: 'Renata', role: 'Editora Chefe', sector: 'Redação', function: 'Diretoria - Redação', whatsapp: '2499999998', email: 'renata@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Renata', availability_status: 'VACATION', away_from: '2026-01-05', away_until: '2026-01-20', away_reason: 'Férias' },
        { id: '3', name: 'Bill', role: 'Coord. Audiovisual', sector: 'Audiovisual', function: 'Workflow & Tech', whatsapp: '2499999997', email: 'bill@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bill', availability_status: 'ACTIVE' },
        { id: '4', name: 'Alba', role: 'Logística', sector: 'Logística', function: 'Checklist & Equipe de Campo', whatsapp: '2499999996', email: 'alba@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alba', availability_status: 'SICK_LEAVE', away_from: '2026-01-08', away_until: '2026-01-12', away_reason: 'Licença Médica' },
        { id: '5', name: 'Marco', role: 'Videomaker', sector: 'Audiovisual', function: 'Captação & Edição Vídeo', whatsapp: '2498888888', email: 'marco@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco', availability_status: 'ACTIVE' },
        { id: '7', name: 'Ruan', role: 'Videomaker', sector: 'Audiovisual', function: 'Auxiliar de Captação', whatsapp: '2491111111', email: 'ruan@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ruan', availability_status: 'ACTIVE' },
        { id: '8', name: 'Evandro', role: 'Diagramador', sector: 'Audiovisual', function: 'Design Impresso / Arte Final', whatsapp: '2492222222', email: 'evandro@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evandro', availability_status: 'OFFBOARDED', away_reason: 'Desligado Dez/2025' },
        { id: '11', name: 'Junior', role: 'Desenvolvedor', sector: 'TI', function: 'Apps & Plataformas', whatsapp: '2495555555', email: 'junior@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Junior', availability_status: 'ACTIVE' },
        { id: '12', name: 'Cecilia', role: 'Designer', sector: 'TI', function: 'UX/UI & Criativo', whatsapp: '2496666666', email: 'cecilia@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cecilia', availability_status: 'ACTIVE' },
        { id: '13', name: 'Joel', role: 'Sistemas', sector: 'TI', function: 'Infra & Backend', whatsapp: '2497777776', email: 'joel@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joel', availability_status: 'ACTIVE' },
        { id: '14', name: 'Bento', role: 'Marketing', sector: 'Marketing', function: 'Estratégia & ROI', whatsapp: '2493333334', email: 'bento@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bento', availability_status: 'ACTIVE' },
        { id: '15', name: 'Leonardo', role: 'Social Media', sector: 'Marketing', function: 'Ads & Performance', whatsapp: '2494444445', email: 'leonardo@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leonardo', availability_status: 'ACTIVE' },
        { id: '16', name: 'Giulia', role: 'Repórter', sector: 'Redação', function: 'News & Conteúdo', whatsapp: '2491111112', email: 'giulia@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Giulia', availability_status: 'ACTIVE' },
        { id: '17', name: 'Livia', role: 'Editora', sector: 'Redação', function: 'Cote & Revisão', whatsapp: '2492222223', email: 'livia@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Livia', availability_status: 'ACTIVE' },
        { id: '18', name: 'Angelo', role: 'Diretoria', sector: 'Administrativo', function: 'Conselho Estratégico', whatsapp: '2490000001', email: 'angelo@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angelo', availability_status: 'ACTIVE' },
        { id: '19', name: 'Jader', role: 'Diretoria', sector: 'Administrativo', function: 'Conselho Estratégico', whatsapp: '2490000002', email: 'jader@diario.com', status: 'ACTIVE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jader', availability_status: 'ACTIVE' }
      ] as any});
      set({ vehicles: [
        { id: 'v1', name: 'CARRO 01', model: 'Mobi White', status: 'AVAILABLE' },
        { id: 'v2', name: 'CARRO 02', model: 'Duster Silver', status: 'AVAILABLE' }
      ]});
    }
  },

  inviteTeamMember: async (member) => {
    const newMember = {
      ...member,
      id: `tm-${Math.random().toString(36).substring(7)}`,
      status: 'ACTIVE' as const,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
    };
    
    set(state => ({ team: [...state.team, newMember] }));
    try {
      await supabase.from('team').insert(member);
    } catch (err) {
      console.warn("Table 'team' not ready in Supabase");
    }
  },

  updateTeamMember: async (id: string, updates: Partial<TeamMember>) => {
    set(state => ({
      team: state.team.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    }));
    
    try {
      await supabase.from('team').update(updates).eq('id', id);
    } catch (err) {
      console.warn("Table 'team' not ready in Supabase");
    }
  },

  createWizardProject: async (formData) => {
    console.log("🛠️ [PROJECT_WIZARD]: Iniciando Geração de Pipeline Avançado...");
    set({ syncStatus: 'syncing' });
    
    const campaignId = `campaign-${Math.random().toString(36).substring(7)}`;
    const baseX = Math.random() * 200, baseY = Math.random() * 200;
    
    const campaignNode: AppNode = {
      id: campaignId,
      type: 'campaign',
      position: { x: baseX, y: baseY },
      data: {
        label: formData.projectName.toUpperCase(),
        description: formData.description,
        totalInvestment: formData.totalValue,
        status: 'todo',
        targetCities: formData.targetCities || [],
        scheduledDate: formData.deadline,
        campaignType: formData.type || 'ESG_PRACTICES',
        assignee: formData.selectedTeam?.join(', '), // Trava de agenda visual
        resourceAllocation: formData.selectedVehicle ? {
          resourceId: formData.selectedVehicle as any,
          startTime: formData.deadline,
          endTime: formData.deadline,
          status: 'OK'
        } : undefined
      }
    };

    const newNodes: AppNode[] = [campaignNode];
    const newEdges: AppEdge[] = [];
    let currentX = baseX + 400;

    // Branches por escopo técnico avançado
    if (formData.scope?.videoPodcasts || formData.scope?.videoColab) {
       const vId = `vid-${Math.random().toString(36).substring(7)}`;
       newNodes.push({
         id: vId, type: 'production', position: { x: currentX, y: baseY - 250 },
         data: { label: `VÍDEO: ${formData.projectName}`, status: 'todo', internalProductionType: formData.scope.videoPodcasts ? 'INTERNAL_PODCAST' : 'EXTERNAL_VIDEO_REPORT' }
       });
       newEdges.push({ id: `e-${campaignId}-${vId}`, source: campaignId, target: vId, animated: true, style: { stroke: '#3b82f6' } });
    }

    if (formData.scope?.impressoDiagramacao || formData.scope?.impressoRevisaoPag5) {
      const pId = `prt-${Math.random().toString(36).substring(7)}`;
      newNodes.push({
        id: pId, type: 'custom_action', position: { x: currentX, y: baseY - 100 },
        data: { label: `IMPRESSO 3A: ${formData.projectName}`, status: 'todo' }
      });
      newEdges.push({ id: `e-${campaignId}-${pId}`, source: campaignId, target: pId, animated: true, style: { stroke: '#10b981' } });
    }

    if (formData.scope?.digitalSite || formData.scope?.digitalInstagram || formData.scope?.digitalTikTok || formData.scope?.digitalYouTube) {
      const dId = `dig-${Math.random().toString(36).substring(7)}`;
      newNodes.push({
        id: dId, type: 'social_output', position: { x: currentX, y: baseY + 100 },
        data: { label: `DIGITAL 3B: ${formData.projectName}`, status: 'todo' }
      });
      newEdges.push({ id: `e-${campaignId}-${dId}`, source: campaignId, target: dId, animated: true, style: { stroke: '#f43f5e' } });
    }

    if (formData.scope?.criativoIDVisual || formData.scope?.criativoKV || formData.scope?.criativoMotion || formData.scope?.criativoPostArts) {
      const cId = `crt-${Math.random().toString(36).substring(7)}`;
      newNodes.push({
        id: cId, type: 'creative', position: { x: currentX, y: baseY + 250 },
        data: { label: `CRIATIVO: ${formData.projectName}`, status: 'todo' }
      });
      newEdges.push({ id: `e-${campaignId}-${cId}`, source: campaignId, target: cId, animated: true, style: { stroke: '#f59e0b' } });
    }

    set(state => ({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      activeTab: 'canvas'
    }));

    // Sincronizar com tabela Master
    await get().syncProjectWithNode(campaignId, {
      name: formData.projectName,
      totalValue: formData.totalValue,
      deadline: formData.deadline,
      status: 'ACTIVE'
    });

    try {
      await Promise.all([
        ...newNodes.map(n => supabase.from('nodes').insert({
          id: n.id, type: n.type, position_x: n.position.x, position_y: n.position.y, data: n.data
        })),
        ...newEdges.map(e => supabase.from('edges').insert({
           id: e.id, source: e.source, target: e.target, animated: true
        }))
      ]);
      set({ syncStatus: 'online' });
    } catch (err) {
      console.warn("Supabase bypass no wizard");
      set({ syncStatus: 'online' });
    }
  },

  startProject: async (campaignId) => {
    // ... manter lógica existente ou refatorar se necessário
    console.log(`🚀 [START_PROJECT]: Ativando Orquestrador Operacional (ROTA 3A/3B)...`);
    const { nodes, updateNodeData } = get();
    const campaignNode = nodes.find(n => n.id === campaignId);
    if (!campaignNode) return;

    await updateNodeData(campaignId, { status: 'doing' });

    const baseX = campaignNode.position.x;
    const baseY = campaignNode.position.y;
    const newNodes: AppNode[] = [];
    const newEdges: AppEdge[] = [];

    // 1. NÓ DE CAPTAÇÃO COMERCIAL (ALBA CHECKLIST)
    const capId = `cap-${Math.random().toString(36).substring(7)}`;
    newNodes.push({
      id: capId,
      type: 'os',
      position: { x: baseX + 400, y: baseY },
      data: {
        label: 'CAPTAÇÃO COMERCIAL',
        status: 'todo',
        checklist: [
          { label: 'ALBA Saída: Câmera + Gimbal + Tripé', done: false },
          { label: 'ALBA Saída: Iluminação + Áudio', done: false },
          { label: 'ALBA Retorno: Baterias Carregadas', done: false },
          { label: 'ALBA Retorno: Arquivos na Rede', done: false },
          { label: 'ALBA Retorno: Devolução Equipamento', done: false }
        ]
      }
    });

    // 2. ROTA 3A: IMPRESSO
    const rota3AId = `rota3a-${Math.random().toString(36).substring(7)}`;
    newNodes.push({
      id: rota3AId,
      type: 'custom_action',
      position: { x: baseX + 800, y: baseY - 150 },
      data: {
        label: 'ROTA 3A: IMPRESSO',
        status: 'todo',
        checklist: [
          { label: 'Redação', done: false },
          { label: 'Edição', done: false },
          { label: 'Diagramação', done: false },
          { label: 'Revisão P.5', done: false },
          { label: 'Capa IMG + TextAlt', done: false }
        ]
      }
    });

    // 3. ROTA 3B: SITE
    const rota3BId = `rota3b-${Math.random().toString(36).substring(7)}`;
    newNodes.push({
      id: rota3BId,
      type: 'site',
      position: { x: baseX + 800, y: baseY + 150 },
      data: {
        label: 'ROTA 3B: SITE',
        status: 'todo',
        portalTitle: campaignNode.data.label,
        checklist: [
          { label: 'Links Equipe', done: false },
          { label: 'Título/Descrição', done: false },
          { label: 'Foto Curadoria', done: false },
          { label: 'Tags SEO', done: false },
          { label: 'Thumbnail', done: false }
        ]
      }
    });

    // Edges
    const edgesList = [
      { id: `e-${campaignId}-${capId}`, source: campaignId, target: capId },
      { id: `e-${capId}-${rota3AId}`, source: capId, target: rota3AId },
      { id: `e-${capId}-${rota3BId}`, source: capId, target: rota3BId }
    ];

    edgesList.forEach(e => {
      newEdges.push({
        ...e,
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 3 }
      });
    });

    set(state => ({
      nodes: [...state.nodes, ...newNodes],
      edges: [...state.edges, ...newEdges],
      syncStatus: 'syncing'
    }));

    try {
      await Promise.all([
        ...newNodes.map(n => supabase.from('nodes').insert({
          id: n.id, type: n.type, position_x: n.position.x, position_y: n.position.y, data: n.data
        })),
        ...newEdges.map(e => supabase.from('edges').insert({
          id: e.id, source: e.source, target: e.target, animated: true, style: e.style
        }))
      ]);
      set({ syncStatus: 'online' });
    } catch (err) {
      console.error("Failed to persist project bifurcation", err);
      set({ syncStatus: 'error' });
    }
  },

  setUserConsent: async (userId: string) => {
    const consent = {
      userId,
      consentedAt: new Date().toISOString(),
      version: '2.0-BXD'
    };
    set({ userConsent: consent });
    localStorage.setItem('newsflow_consent', JSON.stringify(consent));
  },

  calculateCommissions: async (projectId: string, totalValue: number, hunterId?: string, closerId?: string) => {
    const newCommissions: any[] = [];
    const date = new Date();
    date.setDate(date.getDate() + 30); // Vencimento em 30 dias

    // Nível 0 (Tecnologia/IA) - 2% (Overhead de Automação)
    newCommissions.push({
      id: `comm-${Math.random().toString(36).substring(7)}`,
      projectId,
      userId: 'IA-BXD',
      level: 0,
      value: totalValue * 0.02,
      status: 'PENDING',
      dueDate: date.toISOString()
    });

    // Nível 1 (Closer) - 5% se existir
    if (closerId) {
      newCommissions.push({
        id: `comm-${Math.random().toString(36).substring(7)}`,
        projectId,
        userId: closerId,
        level: 1,
        value: totalValue * 0.05,
        status: 'PENDING',
        dueDate: date.toISOString()
      });
    }

    // Nível 2 (Hunter) - 3% se existir
    if (hunterId) {
      newCommissions.push({
        id: `comm-${Math.random().toString(36).substring(7)}`,
        projectId,
        userId: hunterId,
        level: 2,
        value: totalValue * 0.03,
        status: 'PENDING',
        dueDate: date.toISOString()
      });
    }

    set(state => ({ commissions: [...state.commissions, ...newCommissions] }));
    console.log(`💸 [COMMISSIONS]: Calculadas ${newCommissions.length} comissões para o projeto.`);
  },

  updateCommissionStatus: async (id, status) => {
    set(state => ({
      commissions: state.commissions.map(c => 
        c.id === id ? { ...c, status, paymentDate: status === 'PAID' ? new Date().toISOString() : undefined } : c
      )
    }));
  },

  // Workspace Management
  currentWorkspaceId: null,
  workspaces: [],

  createWorkspace: async (name: string) => {
    try {
      const layoutJson = {
        nodes: get().nodes,
        edges: get().edges,
      };

      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name,
          layout_json: layoutJson,
          user_id: 'default_user', // TODO: Integrar com auth real
          is_default: get().workspaces.length === 0,
        })
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        workspaces: [...state.workspaces, data],
        currentWorkspaceId: data.id,
      }));

      return data.id;
    } catch (err) {
      console.error('Erro ao criar workspace:', err);
      throw err;
    }
  },

  loadWorkspace: async (workspaceId: string) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      if (error) throw error;

      if (data && data.layout_json) {
        set({
          nodes: data.layout_json.nodes || [],
          edges: data.layout_json.edges || [],
          currentWorkspaceId: workspaceId,
        });
        localStorage.setItem('newsflow_current_workspace', workspaceId);
      }
    } catch (err) {
      console.error('Erro ao carregar workspace:', err);
    }
  },

  switchWorkspace: async (workspaceId: string) => {
    await get().loadWorkspace(workspaceId);
  },

  loadWorkspaces: async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      set({ workspaces: data || [] });

      // Carregar último workspace ou criar um padrão
      if (data && data.length > 0) {
        const lastWorkspaceId = localStorage.getItem('newsflow_current_workspace') || data[0].id;
        await get().loadWorkspace(lastWorkspaceId);
      } else {
        // Criar workspace padrão se não existir nenhum
        const defaultId = await get().createWorkspace('Workspace Principal');
        localStorage.setItem('newsflow_current_workspace', defaultId);
      }
    } catch (err) {
      console.error('Erro ao carregar workspaces:', err);
    }
  },

  groupSelectedNodes: (groupName: string, groupColor: string = 'purple') => {
    const { nodes, edges, addNode, updateNodeData } = get();
    const selectedNodes = nodes.filter(n => n.selected);
    
    if (selectedNodes.length === 0) return;

    // Calcular bounding box dos nodes selecionados
    const positions = selectedNodes.map(n => n.position);
    const minX = Math.min(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxX = Math.max(...positions.map(p => p.x));
    const maxY = Math.max(...positions.map(p => p.y));

    const groupWidth = maxX - minX + 400;
    const groupHeight = maxY - minY + 200;
    const groupX = minX - 50;
    const groupY = minY - 50;

    // Criar node do tipo Group
    const groupId = `group-${Date.now()}`;
    addNode('custom_action', { x: groupX, y: groupY }, {
      label: groupName,
      status: 'todo',
      groupData: {
        nodeIds: selectedNodes.map(n => n.id),
        color: groupColor,
        width: groupWidth,
        height: groupHeight,
      },
    });

    // Atualizar nodes selecionados para serem filhos do grupo
    selectedNodes.forEach(node => {
      updateNodeData(node.id, {
        parentGroupId: groupId,
      });
    });
  },

  // Feedback System
  feedbacks: [],
  submitFeedback: async (feedbackData) => {
    const newFeedback = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      ...feedbackData,
      status: 'PENDING' as const,
    };

    set(state => ({
      feedbacks: [newFeedback, ...state.feedbacks],
    }));

    try {
      // Tentar inserir na tabela 'system_feedback', fallback para 'feedbacks'
      const { error: error1 } = await supabase.from('system_feedback').insert({
        id: newFeedback.id,
        message: newFeedback.message,
        category: newFeedback.category,
        attachment: newFeedback.attachment,
        attachment_name: newFeedback.attachmentName,
        submitted_by: newFeedback.submittedBy,
        submitted_at: newFeedback.submittedAt,
        status: 'PENDING',
      });

      if (error1) {
        // Fallback para tabela 'feedbacks' se 'system_feedback' não existir
        const { error: error2 } = await supabase.from('feedbacks').insert({
          id: newFeedback.id,
          message: newFeedback.message,
          category: newFeedback.category,
          attachment: newFeedback.attachment,
          attachment_name: newFeedback.attachmentName,
          submitted_by: newFeedback.submittedBy,
          submitted_at: newFeedback.submittedAt,
          status: 'PENDING',
        });
        if (error2) throw error2;
      }
      console.log(`✅ [FEEDBACK]: Feedback enviado com sucesso.`);
    } catch (err) {
      console.warn("Failed to save feedback in Supabase:", err);
    }
  },
} as any));
