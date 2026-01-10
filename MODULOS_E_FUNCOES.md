# 📚 NewsFlow OS - Módulos e Funções Completas

## 🎯 Visão Geral do Sistema

O NewsFlow OS é uma plataforma completa de gestão editorial com:
- **React Flow Canvas** para workflows visuais
- **Zustand Store** para gerenciamento de estado
- **Supabase** para persistência em tempo real
- **Governança** baseada em roles
- **CRM** integrado
- **IA** para automação

---

## 🏗️ ESTRUTURA DE COMPONENTES

### 1. **App.tsx** - Componente Principal
**Localização**: `/App.tsx`

**Funcionalidades**:
- ✅ Navegação entre módulos (Sidebar)
- ✅ Background animado (estrelas)
- ✅ Status de sincronização em tempo real
- ✅ Header com indicadores de status
- ✅ Sistema de tabs/views

**Tabs Disponíveis**:
- `canvas` - Workflow Canvas (React Flow)
- `kanban` - Quadro de Pautas
- `calendar` - Calendário Editorial
- `master` - Curadoria Master
- `sales` - Sales Hub CRM
- `report` - Relatório de ROI
- `dashboard` - Dashboard Geral
- `onboarding` - Guia de Onboarding

---

### 2. **FlowCanvas.tsx** - Canvas de Workflow
**Funcionalidades**:
- ✅ Drag & Drop de nós
- ✅ Conexão entre nós (edges)
- ✅ Zoom e Pan
- ✅ Mini-map
- ✅ Controls toolbar
- ✅ NodeInspector integrado

**Tipos de Nós**:
- `campaign` - Campanha/Projeto
- `os` - Ordem de Serviço
- `media_edition` - Edição de Mídia
- `production` - Produção de Conteúdo
- `custom_action` - Ação Customizada
- `meeting` - Reunião/Governança
- `social_output` - Saída Social

---

### 3. **CustomNodes.tsx** - Componentes de Nós
**Nós Implementados**:

#### 🎯 CampaignNode
- Template selector (Institucional/ESG)
- Métricas de investimento
- Abrangência de cidades
- Tipo de campanha

#### 📋 OSNode
- Checklist interativo
- Barra de progresso
- Status visual

#### 🤖 ContentProductionNode
- Editor de conteúdo
- Otimização por IA
- Geração de imagens (Antigravity Vision)
- Preview de posts

#### 🌐 SocialOutputNode
- Integração com redes sociais
- Agendamento de posts
- Status de conexão

#### ⚡ CustomActionNode
- Editor flexível
- Checklist dinâmico
- Descrição customizada

---

### 4. **NodeInspector.tsx** - Editor de Nós
**Funcionalidades**:
- ✅ Edição de título e status
- ✅ Checklist manager
- ✅ Editor de conteúdo (para production nodes)
- ✅ **Governança Financeira** (ADMIN_COMERCIAL)
  - Edição de `totalInvestment`
  - Visualização de `roiStats`
  - Campos bloqueados para não-admin
- ✅ Atribuição de responsáveis
- ✅ Handover automático
- ✅ Melhoria de conteúdo por IA

---

### 5. **KanbanBoard.tsx** - Quadro de Pautas
**Funcionalidades**:
- ✅ Colunas: Todo, Doing, Done
- ✅ Drag & Drop entre colunas
- ✅ Filtros por editoria
- ✅ Busca
- ✅ Cards com informações resumidas

---

### 6. **EditorialCalendar.tsx** - Calendário Editorial
**Funcionalidades**:
- ✅ Visualização mensal/semanal
- ✅ Deadlines visuais
- ✅ Conflitos de recursos
- ✅ Agendamento de produções

---

### 7. **SalesCRM.tsx** - CRM de Vendas
**Funcionalidades**:
- ✅ Pipeline Kanban (PROSPECT → WON)
- ✅ Criação de leads
- ✅ Conversão automática para projetos
- ✅ Métricas de pipeline
- ✅ Taxa de conversão
- ✅ Cards de propostas

**Status de Leads**:
- `PROSPECT` - Prospecção
- `PROPOSAL_SENT` - Proposta Enviada
- `NEGOTIATION` - Negociação
- `WON` - Fechado
- `LOST` - Perdido

---

### 8. **CuratorshipAdmin.tsx** - Curadoria Master
**Funcionalidades**:
- ✅ Aprovação de conteúdo
- ✅ Moderação
- ✅ Curadoria de pautas

---

### 9. **ClientReportView.tsx** - Relatório de ROI
**Funcionalidades**:
- ✅ Gráficos de alcance (Chart.js)
- ✅ Métricas de ROI
- ✅ Comparativo Goal vs Actual
- ✅ Evidências de clipping
- ✅ Exportação de relatórios

---

### 10. **Dashboard.tsx** - Dashboard Geral
**Funcionalidades**:
- ✅ Visão geral do sistema
- ✅ Métricas consolidadas
- ✅ Gráficos e estatísticas

---

### 11. **ChatInterface.tsx** - Chat/Atas
**Funcionalidades**:
- ✅ Chat em tempo real
- ✅ Mensagens do WhatsApp
- ✅ Histórico de conversas
- ✅ Integração com Supabase

---

### 12. **MeetingAI.tsx** - IA de Reuniões
**Funcionalidades**:
- ✅ Transcrição de áudio
- ✅ Geração automática de pautas
- ✅ Criação de tasks a partir de reuniões
- ✅ Integração com Google Meet

---

### 13. **ProposalPublicView.tsx** - Visualização de Propostas
**Funcionalidades**:
- ✅ Visualização pública de propostas
- ✅ Aprovação de clientes
- ✅ Design profissional
- ✅ Métricas de investimento

---

### 14. **OnboardingGuide.tsx** - Guia de Onboarding
**Funcionalidades**:
- ✅ Tutorial interativo
- ✅ Introdução ao sistema
- ✅ Primeiros passos

---

## 🔧 SERVIÇOS (Services/)

### 1. **store.ts** - Zustand Store (Estado Global)
**Localização**: `/store.ts`

**Estado Gerenciado**:
```typescript
{
  nodes: AppNode[]           // Nós do canvas
  edges: AppEdge[]            // Conexões entre nós
  leads: Lead[]              // Leads do CRM
  activeTab: string          // Tab ativa
  messages: Message[]        // Mensagens do chat
  syncStatus: SyncStatus    // Status de sincronização
}
```

**Funções Principais**:
- `initialize()` - Carrega dados do Supabase
- `addNode()` - Adiciona novo nó
- `updateNodeData()` - Atualiza dados do nó (com governança)
- `deleteNode()` - Remove nó
- `onNodesChange()` - Handler de mudanças (debounce 500ms)
- `onEdgesChange()` - Handler de edges
- `onConnect()` - Cria nova conexão
- `loadCampaignTemplate()` - Carrega templates (Institucional/ESG)
- `addLead()` - Adiciona lead ao CRM
- `updateLeadStatus()` - Atualiza status do lead
- `convertLeadToProject()` - Converte lead em projeto
- `checkResourceAvailability()` - Verifica conflitos de recursos
- `onWorkflowProgress()` - Progresso do workflow (handover automático)
- `autoGenerateNodesFromMeeting()` - Gera nós a partir de reunião
- `archiveProductionEvidence()` - Arquivar evidências

---

### 2. **governance.ts** - Sistema de Governança
**Localização**: `/services/governance.ts`

**Roles**:
- `ADMIN_COMERCIAL` - Pode editar valores financeiros
- `ADMIN` - Acesso total
- `EDITOR` - Apenas leitura financeira
- `DESIGNER` - Apenas leitura financeira
- `VIEWER` - Apenas leitura

**Funções**:
- `canEditFinancialData()` - Verifica permissão
- `validateInvestmentEdit()` - Valida edição de investimento
- `validateROIEdit()` - Valida edição de ROI
- `setCurrentUser()` - Define usuário atual
- `getCurrentUser()` - Retorna usuário atual

**Proteções**:
- ✅ Bloqueio de edição de `totalInvestment`
- ✅ Bloqueio de edição de `roiStats`
- ✅ Validação de faixas (R$ 25k, R$ 40k)

---

### 3. **supabase.ts** - Cliente Supabase
**Localização**: `/services/supabase.ts`

**Funcionalidades**:
- ✅ Conexão com Supabase
- ✅ `checkConnection()` - Testa conexão
- ✅ Real-time subscriptions

**Tabelas**:
- `nodes` - Nós do canvas
- `edges` - Conexões
- `leads` - Leads do CRM
- `messages` - Mensagens do chat

---

### 4. **roi_calculator.ts** - Calculadora de ROI
**Localização**: `/services/roi_calculator.ts`

**Métricas Base**:
- Impresso: 12.000 tiragem × 3.5 pass-along
- Site: 1.6M views/mês
- Instagram: 15M reach/mês
- Facebook: 2.5M reach/mês

**Funções**:
- `calculateProjectROI()` - Calcula ROI completo
- `calculateCPV()` - Calcula custo por visualização

**Retorna**:
```typescript
{
  investment: number
  totalReach: number
  costPerView: number
  engagementRate: number
  goalsVsActual: Array<{
    channel: 'Impresso' | 'Digital' | 'Social' | 'Vídeo'
    goal: number
    actual: number
  }>
}
```

---

### 5. **ai_service.ts** - Serviço de IA
**Funcionalidades**:
- ✅ Integração com Gemini AI
- ✅ Geração de conteúdo
- ✅ Otimização de posts
- ✅ Análise de texto

---

### 6. **clipping_engine.ts** - Motor de Clipping
**Funcionalidades**:
- ✅ Captura de evidências
- ✅ Screenshots automáticos
- ✅ Arquivamento de produções

---

### 7. **notification_engine.ts** - Motor de Notificações
**Funcionalidades**:
- ✅ Notificações de stakeholders
- ✅ Alertas de handover
- ✅ Integração WhatsApp

---

### 8. **whatsapp_service.ts** - Serviço WhatsApp
**Funcionalidades**:
- ✅ Envio de alertas
- ✅ Notificações de workflow
- ✅ Integração com webhook

---

### 9. **google_integration.ts** - Integração Google
**Funcionalidades**:
- ✅ Google Meet
- ✅ Google Calendar
- ✅ Transcrições

---

## 📊 TIPOS E INTERFACES

### NodeTypes
```typescript
'campaign' | 'os' | 'media_edition' | 'creative' | 
'task' | 'production' | 'social_output' | 'custom_action' | 'meeting'
```

### CampaignTypes
```typescript
'INSTITUCIONAL_ANNIVERSARY' | 'ESG_PRACTICES' | 'CITY_ANNIVERSARY'
```

### InternalProductionTypes
```typescript
'INTERNAL_PODCAST' | 'TALK_DELAS' | 'DIARIO_TV' | 'EXTERNAL_VIDEO_REPORT'
```

### Status
```typescript
'todo' | 'doing' | 'done' | 'backlog' | 'ORDER_EXTRA' | 'RESOURCE_CONFLICT'
```

### LeadStatus
```typescript
'PROSPECT' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'WON' | 'LOST'
```

---

## 🔄 FLUXOS DE TRABALHO

### 1. **Criação de Campanha**
```
Lead (CRM) → WON → Campaign Node → Template Load → Nodes Gerados
```

### 2. **Workflow de Produção**
```
Campaign → OS → Production → Social Output → Done
```

### 3. **Handover Automático**
```
Node Done → Ativa próximos nós → Notifica stakeholders → WhatsApp
```

### 4. **Governança de Recursos**
```
Solicita recurso → Verifica disponibilidade → Aloca ou bloqueia
```

---

## 🎨 FEATURES VISUAIS

### Design System
- **Cores**:
  - `brand-neon-purple` - #a855f7
  - `brand-neon-blue` - #3b82f6
  - `emerald-500` - #10b981
  - `amber-500` - #f59e0b

### Animações
- ✅ Framer Motion para transições
- ✅ Estrelas animadas no background
- ✅ Glow effects nos nós
- ✅ Pulse animations
- ✅ Hover effects

### Glassmorphism
- ✅ Backdrop blur
- ✅ Transparências
- ✅ Bordas sutis

---

## 🔐 SEGURANÇA E GOVERNANÇA

### Proteções Implementadas
1. **Edição Financeira**: Apenas ADMIN_COMERCIAL
2. **Validação de Faixas**: R$ 25k e R$ 40k
3. **RLS Policies**: Row Level Security no Supabase
4. **Validação de Schema**: Dry-run antes do deploy

---

## 📦 DEPLOY E CI/CD

### Scripts Disponíveis
- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
- `npm run preview` - Preview do build
- `npm run dry-run` - Validação de schema
- `./deploy-production.sh` - Deploy completo

### Validações
- ✅ Schema validation
- ✅ Type check
- ✅ Lint
- ✅ Build test

---

## 🚀 PRÓXIMOS PASSOS

Para ver tudo funcionando:

1. **Inicie o servidor**:
```bash
npm run dev
```

2. **Acesse**: http://localhost:3000

3. **Teste os módulos**:
   - Crie um nó `campaign`
   - Adicione um lead no CRM
   - Veja o Kanban
   - Teste a governança (Console: `setCurrentUser`)

---

**🎉 Sistema completo e funcional!**
