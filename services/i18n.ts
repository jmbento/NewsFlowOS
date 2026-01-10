/**
 * Internationalization Service (i18n)
 * Suporte para Português e Inglês
 */

export type Language = 'pt' | 'en';

interface Translations {
  [key: string]: {
    pt: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.canvas': { pt: 'Sindicação Workflow', en: 'Workflow Canvas' },
  'nav.kanban': { pt: 'Quadro de Pautas', en: 'Kanban Board' },
  'nav.calendar': { pt: 'Calendário Editorial', en: 'Editorial Calendar' },
  'nav.master': { pt: 'Curadoria Master', en: 'Master Curation' },
  'nav.sales': { pt: 'Sales Hub CRM', en: 'Sales Hub CRM' },
  'nav.report': { pt: 'Relatório de ROI', en: 'ROI Report' },
  'nav.dashboard': { pt: 'Dashboard', en: 'Dashboard' },
  'nav.onboarding': { pt: 'Guia de Onboarding', en: 'Onboarding Guide' },
  
  // Status
  'status.online': { pt: 'Online', en: 'Online' },
  'status.syncing': { pt: 'Sincronizando...', en: 'Syncing...' },
  'status.offline': { pt: 'Offline', en: 'Offline' },
  'status.saved': { pt: 'Salvo', en: 'Saved' },
  'status.cloud': { pt: 'Cloud', en: 'Cloud' },
  
  // Campaign
  'campaign.investment': { pt: 'Investimento', en: 'Investment' },
  'campaign.coverage': { pt: 'Abrangência', en: 'Coverage' },
  'campaign.cities': { pt: 'Cidades', en: 'Cities' },
  'campaign.total': { pt: 'Investimento Total', en: 'Total Investment' },
  'campaign.roi': { pt: 'Estatísticas de ROI', en: 'ROI Statistics' },
  'campaign.reach': { pt: 'Alcance Total', en: 'Total Reach' },
  'campaign.cpv': { pt: 'CPV', en: 'CPV' },
  'campaign.engagement': { pt: 'Engagement', en: 'Engagement' },
  
  // Governance
  'governance.readonly': { pt: '(Somente Leitura)', en: '(Read Only)' },
  'governance.admin_required': { pt: '🔒 ADMIN_COMERCIAL', en: '🔒 ADMIN_COMERCIAL' },
  'governance.no_permission': { pt: 'Apenas usuários com role ADMIN_COMERCIAL podem editar valores de investimento', en: 'Only users with ADMIN_COMERCIAL role can edit investment values' },
  
  // CRM
  'crm.pipeline': { pt: 'Pipeline Total', en: 'Total Pipeline' },
  'crm.conversion': { pt: 'Conversão', en: 'Conversion' },
  'crm.new_lead': { pt: 'Novo Lead', en: 'New Lead' },
  'crm.prospect': { pt: 'Prospecção', en: 'Prospect' },
  'crm.proposal_sent': { pt: 'Proposta Enviada', en: 'Proposal Sent' },
  'crm.negotiation': { pt: 'Negociação', en: 'Negotiation' },
  'crm.won': { pt: 'Fechado (Won)', en: 'Won' },
  'crm.lost': { pt: 'Perdido (Lost)', en: 'Lost' },
  'crm.win': { pt: 'Ganhar', en: 'Win' },
  
  // Node Inspector
  'inspector.title': { pt: 'Título do Nó', en: 'Node Title' },
  'inspector.status': { pt: 'Status do Workflow', en: 'Workflow Status' },
  'inspector.checklist': { pt: 'Editor de Escopo & Checklist', en: 'Scope & Checklist Editor' },
  'inspector.add_item': { pt: 'Adicionar Item ao Escopo', en: 'Add Item to Scope' },
  'inspector.financial': { pt: 'Dados Financeiros', en: 'Financial Data' },
  'inspector.handover': { pt: 'Finalizar Etapa & Handover', en: 'Finish Step & Handover' },
  'inspector.close': { pt: 'Fechar', en: 'Close' },
  
  // Common
  'common.todo': { pt: 'A Fazer', en: 'To Do' },
  'common.doing': { pt: 'Em Andamento', en: 'In Progress' },
  'common.done': { pt: 'Concluído', en: 'Done' },
  'common.backlog': { pt: 'Backlog', en: 'Backlog' },
  'common.order_extra': { pt: 'Pedido Extra', en: 'Order Extra' },
};

let currentLanguage: Language = 'pt';

export const i18n = {
  /**
   * Define o idioma atual
   */
  setLanguage: (lang: Language) => {
    currentLanguage = lang;
    localStorage.setItem('newsflow_language', lang);
    // Dispara evento para atualizar componentes
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  },

  /**
   * Retorna o idioma atual
   */
  getLanguage: (): Language => {
    const saved = localStorage.getItem('newsflow_language') as Language;
    return saved || 'pt';
  },

  /**
   * Traduz uma chave
   */
  t: (key: string): string => {
    const lang = i18n.getLanguage();
    return translations[key]?.[lang] || key;
  },

  /**
   * Retorna todas as traduções de uma chave
   */
  getTranslations: (key: string) => {
    return translations[key] || { pt: key, en: key };
  },
};

// Inicializa com idioma salvo
currentLanguage = i18n.getLanguage();
