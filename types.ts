
import { Node, Edge } from 'reactflow';

export type NodeType = 
  | 'campaign' 
  | 'paid_report' 
  | 'special_event' 
  | 'os' 
  | 'demand' 
  | 'publication' 
  | 'config'
  | 'media_edition' 
  | 'creative' 
  | 'task' 
  | 'production' 
  | 'social_output' 
  | 'custom_action' 
  | 'meeting' 
  | 'site' 
  | 'post_it'
  | 'project_master';

export type CampaignType = 'INSTITUCIONAL_ANNIVERSARY' | 'ESG_PRACTICES' | 'CITY_ANNIVERSARY';

export type InternalProductionType = 'INTERNAL_PODCAST' | 'TALK_DELAS' | 'DIARIO_TV' | 'EXTERNAL_VIDEO_REPORT';

export interface ROIStats {
  investment: number;
  totalReach: number;
  costPerView: number;
  engagementRate: number;
  goalsVsActual: {
    channel: 'Impresso' | 'Digital' | 'Social' | 'Vídeo';
    goal: number;
    actual: number;
  }[];
}

export interface ResourceAllocation {
  resourceId: 'STUDIO_A' | 'STUDIO_B' | 'VIDEO_TEAM_1' | 'VIDEO_TEAM_2' | 'CARRO_01' | 'CARRO_02' | 'KIT_CAMERA_A' | 'KIT_CAMERA_B' | 'KIT_AUDIO_EXTERNO' | 'DRONE_MAVIC_3';
  startTime: string;
  endTime: string;
  status: 'CONFLICT' | 'OK';
  professionalIds?: string[];
}

export type AvailabilityStatus = 'ACTIVE' | 'VACATION' | 'SICK_LEAVE' | 'OFFBOARDED';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  sector: 'Audiovisual' | 'Redação' | 'Comercial' | 'Logística' | 'Marketing' | 'Administrativo' | 'TI' | 'Eventos';
  function: string;
  whatsapp: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  avatar?: string;
  salesLevel?: 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2';
  // Availability & Ghost Mode
  availability_status: AvailabilityStatus;
  away_from?: string; // ISO date
  away_until?: string; // ISO date
  away_reason?: string; // Motivo da ausência
}

export interface Vehicle {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE';
  model: string;
}

export interface Professional {
  id: string;
  name: string;
  role: 'CAPTURE' | 'EDITOR' | 'DESIGNER' | 'JOURNALIST' | string;
  status: 'AVAILABLE' | 'BUSY';
}

export const DIARIO_CITIES = [
  'Volta Redonda', 'Barra Mansa', 'Resende', 'Itatiaia', 'Porto Real', 'Pinheiral'
] as const;

export type LeadStatus = 'PROSPECT' | 'PITCH' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface ProposalData {
  clientName: string;
  projectName: string;
  totalValue: number;
  targetCities: string[];
  expirationDate: string;
  campaignType?: CampaignType;
}

export interface Lead {
  id: string;
  status: LeadStatus;
  data: ProposalData;
  created_at: string;
  referral_by?: string; // ID do Hunter (Nível 2)
  handled_by?: string;  // ID do Closer (Nível 1)
}

export type CommissionStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Commission {
  id: string;
  projectId: string;
  userId: string;
  level: 1 | 2 | 0;
  value: number;
  status: CommissionStatus;
  dueDate: string;
  paymentDate?: string;
}

export interface UserConsent {
  userId: string;
  consentedAt: string;
  version: string;
}

export interface Project {
  id: string;
  name: string;
  campaignId: string;
  totalValue: number;
  costValue: number;
  deadline: string;
  status: 'ACTIVE' | 'ARCHIVED';
  financialMetadata: any;
  created_at: string;
}

export interface CampaignNodeData extends NodeData {
  title: string;
  editoria: string;
  campaignType?: CampaignType;
  targetCities?: string[];
  totalInvestment?: number;
}

export interface OSNodeData extends NodeData {
  assignedTo: string;
  deadline: string;
  checklist: { label: string; done: boolean }[];
}

export interface MediaEditionData extends NodeData {
  mediaPreview?: string;
  approved?: boolean;
}

export interface ProductionNodeData extends NodeData {
  postContent: string;
  imagePrompt: string;
  imageUrl?: string;
  socialDestinations: { platform: string; selected: boolean }[];
  isProcessing?: boolean;
}

export interface CustomActionNodeData extends NodeData {
  description: string;
  checklist: { label: string; done: boolean }[];
  date?: string;
}

export interface MeetingData extends NodeData {
  agenda: string;
  videoLink?: string;
  transcript?: string;
  audioUrl?: string;
  taskList: { task: string; owner: string; deadline: string }[];
}

export interface NodeData {
  label: string;
  status: 'todo' | 'doing' | 'done' | 'backlog' | 'ORDER_EXTRA' | 'RESOURCE_CONFLICT';
  assignee?: string;
  assignedTo?: string; // Alias para OS
  dueDate?: string;
  deadline?: string; // Alias para OS
  description?: string;
  editoria?: string;
  checklist?: { label: string; done: boolean }[];
  mediaPreview?: string;
  approved?: boolean;
  postContent?: string;
  imagePrompt?: string;
  imageUrl?: string;
  socialDestinations?: { platform: string; selected: boolean }[];
  isProcessing?: boolean;
  scheduledAt?: string;
  campaignType?: CampaignType;
  targetCities?: string[];
  totalInvestment?: number;
  internalProductionType?: InternalProductionType;
  agenda?: string;
  videoLink?: string;
  transcript?: string;
  portalTitle?: string;
  portalSubtitle?: string;
  portalContent?: string;
  portalImage?: string;
  portalCredit?: string;
  portalTags?: string;
  multichannel?: {
    youtube: boolean;
    instagram: boolean;
    tiktok: boolean;
    site: boolean;
  };

  // REC Engine
  isRecording?: boolean;
  recordingStartTime?: number;
  audioUrl?: string; // .mp3 detect
  minutes?: string;
  generatedTasks?: { id: string; label: string; done: boolean }[];

  // Scheduling & Publication
  scheduledDate?: string;
  isPublished?: boolean;
  publishedUrl?: string;

  // Media
  mediaFiles?: { name: string; url: string; type: 'image' | 'video' | 'pdf' }[];
  
  // Logistics & Governance
  resourceAllocation?: ResourceAllocation;
  roiStats?: ROIStats;
  evidenceUrl?: string;
  evidenceScreenshot?: string;

  // Time Tracking
  timeTracking?: {
    startTime: number;
    elapsed: number; // em segundos
    isRunning: boolean;
    lastUpdate?: string;
  };

  // Approval System
  approvalStatus?: 'PENDING' | 'REVIEW' | 'APPROVED';

  // Workflow Progress (para workflows específicos)
  workflowProgress?: Record<string, boolean>; // Ex: { step_0: true, step_1: false }

  // Matéria Especial (Print) - Campos específicos
  numPages?: number;
  layout?: string;
  editionDate?: string; // Formato: __/__/____

  // Herança de Nome
  parentCampaignId?: string; // ID da campanha/OS raiz
}

// Feedback System
export interface Feedback {
  id: string;
  message: string;
  category: 'BUG' | 'FEATURE' | 'PRAISE';
  attachment?: string;
  attachmentName?: string;
  submittedBy: string;
  submittedAt: string;
  status?: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  adminResponse?: string;
}

export type AppNode = Node<NodeData>;
export type AppEdge = Edge;

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'whatsapp';
  text: string;
  isWhatsApp?: boolean;
  timestamp: Date;
}

export type SyncStatus = 'offline' | 'online' | 'syncing' | 'error';

export interface Workspace {
  id: string;
  name: string;
  layout_json: {
    nodes: AppNode[];
    edges: AppEdge[];
  };
  user_id?: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AppState {
  nodes: AppNode[];
  edges: AppEdge[];
  projects: Project[];
  undoStack: { nodes: AppNode[]; edges: AppEdge[] }[];
  redoStack: { nodes: AppNode[]; edges: AppEdge[] }[];
  leads: Lead[];
  activeTab: 'canvas' | 'kanban' | 'chat' | 'master' | 'calendar' | 'sales' | 'report' | 'dashboard' | 'onboarding' | 'meeting' | 'projects' | 'team' | 'org-canvas' | 'project_new' | 'financial';
  team: TeamMember[];
  vehicles: Vehicle[];
  isRecording: boolean;
  isMaster: boolean;
  messages: Message[];
  syncStatus: SyncStatus;
  userConsent: UserConsent | null;
  commissions: Commission[];
  theme: 'dark' | 'light';
  currentWorkspaceId: string | null;
  workspaces: Workspace[];
  
  // Actions
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: AppEdge[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  addNode: (type: NodeType, position?: { x: number; y: number }, initialData?: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (edgeId: string) => void;
  duplicateNode: (id: string) => void;
  setActiveTab: (tab: 'canvas' | 'my-work' | 'master-dashboard' | 'brand-hub' | 'kanban' | 'chat' | 'master' | 'calendar' | 'sales' | 'report' | 'dashboard' | 'onboarding' | 'meeting' | 'projects' | 'team' | 'org-canvas' | 'project_new' | 'financial') => void;
  setIsRecording: (recording: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  pushToUndo: () => void;
  undo: () => void;
  redo: () => void;
  selectSubTree: (nodeId: string) => void;
  addMessage: (msg: Message) => void;
  setMessages: (messages: Message[]) => void;
  initialize: () => Promise<void>;
  setSyncStatus: (status: SyncStatus) => void;
  autoGenerateNodesFromMeeting: (data: any) => Promise<void>;
  updateNodeImage: (id: string, imageUrl: string) => Promise<void>;
  onWorkflowProgress: (id: string, status: NodeData['status']) => Promise<void>;
  subscribeToMessages: () => void;
  loadCampaignTemplate: (type: CampaignType, campaignId: string) => Promise<void>;
  
  // CRM Actions
  addLead: (lead: Omit<Lead, 'id' | 'created_at'>) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<void>;
  triggerProposalViewedAlert: (leadId: string) => Promise<void>;
  convertLeadToProject: (leadId: string) => Promise<void>;
  
  // Custom Flow Actions
  initiateProjectFromProposal: (proposalId: string) => Promise<void>;
  cloneNodeStructure: (nodeId: string) => void;
  archiveProductionEvidence: (nodeId: string, url: string, screenshot?: string) => Promise<void>;
  checkResourceAvailability: (date: string, type: InternalProductionType) => Promise<boolean>;
  startProject: (campaignId: string) => Promise<void>;
  publishToSite: (nodeId: string, data: Partial<NodeData>) => Promise<void>;
  syncProjectWithNode: (campaignId: string, data: Partial<Project>) => Promise<void>;
  loadProjects: () => Promise<void>;
  
  // Team Actions
  inviteTeamMember: (member: Omit<TeamMember, 'id' | 'status'>) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  loadTeam: () => Promise<void>;
  
  // Advanced Project Actions
  createWizardProject: (data: any) => Promise<void>;
  
  // Governance & Commissions Actions
  setUserConsent: (userId: string) => Promise<void>;
  calculateCommissions: (projectId: string, totalValue: number, hunterId?: string, closerId?: string) => Promise<void>;
  updateCommissionStatus: (id: string, status: CommissionStatus) => Promise<void>;
  
  // Workspace Actions
  createWorkspace: (name: string) => Promise<string>;
  loadWorkspace: (workspaceId: string) => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  loadWorkspaces: () => Promise<void>;
  groupSelectedNodes: (groupName: string, groupColor?: string) => void;
  feedbacks: Feedback[];
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'submittedAt' | 'status'>) => Promise<void>;
  updateFeedbackStatus: (id: string, status: Feedback['status']) => Promise<void>;
}
