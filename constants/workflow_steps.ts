/**
 * NEWSFLOW - FLUXO DIÁRIO OPERACIONAL (WHITEBOARD)
 * Define as etapas padrão para os projetos do Diário do Vale.
 */

export interface WorkflowStep {
  id: string;
  label: string;
  order: number;
  description: string;
  responsibleTeam: 'EDITORIAL' | 'DESIGN' | 'SOCIAL' | 'ADMIN';
}

export const DAILY_WORKFLOW_STEPS: WorkflowStep[] = [
  { 
    id: 'MORNING_MEETING', 
    label: 'REUNIÃO MATINAL', 
    order: 1, 
    description: 'Definição de pautas e alocação de equipes (09:00)',
    responsibleTeam: 'EDITORIAL'
  },
  { 
    id: 'RESEARCH_APURATION', 
    label: 'APURAÇÃO', 
    order: 2, 
    description: 'Levantamento de dados e entrevistas em campo',
    responsibleTeam: 'EDITORIAL'
  },
  { 
    id: 'PRODUCTION_PRINT_SITE', 
    label: 'IMPRESSO / SITE', 
    order: 3, 
    description: 'Redação da matéria principal para o jornal e portal',
    responsibleTeam: 'EDITORIAL'
  },
  { 
    id: 'SOCIAL_ADAPTATION', 
    label: 'ARTE REDES', 
    order: 4, 
    description: 'Criação de Key Visuals e adaptação para Social Media',
    responsibleTeam: 'DESIGN'
  }
];

export const VIDEO_COLAB_CHECKLIST = [
  { label: 'Inserção de Logo BX', done: false },
  { label: 'Tratamento de Fundo (Blurred BG)', done: false },
  { label: 'Correção de Cor (LUT Diário)', done: false },
  { label: 'Legenda Dinâmica (Madu Engine)', done: false },
  { label: 'Trigger: Repost Story c/ Link', done: false }
];
