# 🗺️ NewsFlow OS - Mapa Completo do Sistema

## 📊 Estatísticas do Projeto

- **15 Componentes React**
- **14 Serviços**
- **1 Store Zustand** (725 linhas)
- **1 App Principal** (267 linhas)
- **Total**: ~5000+ linhas de código

---

## 🎯 MÓDULOS PRINCIPAIS

### 1. 🎨 INTERFACE (Components/)

```
FlowCanvas.tsx          → Canvas principal (React Flow)
CustomNodes.tsx         → 7 tipos de nós customizados
NodeInspector.tsx       → Editor de nós com governança
KanbanBoard.tsx         → Quadro de pautas
EditorialCalendar.tsx   → Calendário editorial
SalesCRM.tsx            → CRM de vendas
CuratorshipAdmin.tsx    → Curadoria master
ClientReportView.tsx    → Relatórios de ROI
Dashboard.tsx           → Dashboard geral
ChatInterface.tsx       → Chat/Atas
MeetingAI.tsx           → IA de reuniões
ProposalPublicView.tsx  → Visualização de propostas
OnboardingGuide.tsx     → Guia de onboarding
FieldChecklist.tsx      → Checklist de campos
MeetingNode.tsx         → Nó de reunião
```

### 2. ⚙️ SERVIÇOS (Services/)

```
store.ts                → Estado global (Zustand)
governance.ts           → Sistema de roles e permissões
supabase.ts             → Cliente Supabase
roi_calculator.ts       → Cálculo de ROI
ai_service.ts           → Integração IA
clipping_engine.ts      → Motor de clipping
notification_engine.ts  → Notificações
whatsapp_service.ts     → WhatsApp
google_integration.ts   → Google APIs
geminiService.ts        → Gemini AI
training_prompts.ts     → Prompts de treinamento
workflow_test.ts        → Testes de workflow
schema.sql              → Schema do banco
```

### 3. 📝 TIPOS (types.ts)

```
NodeType                → 9 tipos de nós
CampaignType            → 3 tipos de campanha
InternalProductionType  → 4 tipos de produção
Status                  → 6 status possíveis
LeadStatus              → 5 status de leads
ROIStats                → Estatísticas de ROI
ResourceAllocation      → Alocação de recursos
ProposalData            → Dados de proposta
Lead                    → Lead do CRM
NodeData                → Dados do nó
AppState                → Estado da aplicação
```

---

## 🔄 FLUXOS PRINCIPAIS

### Fluxo 1: Criação de Campanha
```
SalesCRM → addLead() → updateLeadStatus('WON') 
→ convertLeadToProject() → Campaign Node 
→ loadCampaignTemplate() → Nodes Gerados
```

### Fluxo 2: Workflow de Produção
```
Campaign Node → OS Node → Production Node 
→ Social Output → Done → Handover Automático
```

### Fluxo 3: Governança
```
updateNodeData() → validateInvestmentEdit() 
→ canEditFinancialData() → Bloqueio ou Permissão
```

### Fluxo 4: Sincronização
```
Local Change → Debounce 500ms → Supabase Update 
→ Real-time Subscription → UI Update
```

---

## 🎨 COMPONENTES VISUAIS

### Nós Customizados (n8n Style)
- **CampaignNode** - Trigger de campanha
- **OSNode** - Ordem de serviço
- **ContentProductionNode** - Fábrica de conteúdo
- **SocialOutputNode** - Saída social
- **CustomActionNode** - Ação flexível
- **MeetingNode** - Reunião/Governança

### Cores por Tipo
- 🟡 Trigger (Amber)
- 🔵 Action (Blue)
- 🟣 AI (Purple)
- 🟢 Output (Emerald)
- 🟦 Governance (Indigo)

---

## 🔐 SISTEMA DE GOVERNANÇA

### Roles
```
ADMIN_COMERCIAL  → Edita valores financeiros
ADMIN            → Acesso total
EDITOR           → Apenas leitura financeira
DESIGNER         → Apenas leitura financeira
VIEWER           → Apenas leitura
```

### Proteções
- ✅ `totalInvestment` - Bloqueado para não-admin
- ✅ `roiStats` - Bloqueado para não-admin
- ✅ Validação de faixas (R$ 25k, R$ 40k)
- ✅ UI visual com campos bloqueados

---

## 📊 INTEGRAÇÕES

### Supabase
- ✅ Real-time subscriptions
- ✅ Row Level Security
- ✅ Tabelas: nodes, edges, leads, messages

### IA
- ✅ Gemini AI (Google)
- ✅ Geração de conteúdo
- ✅ Otimização de posts
- ✅ Transcrições

### WhatsApp
- ✅ Webhook
- ✅ Notificações
- ✅ Alertas de workflow

### Google
- ✅ Google Meet
- ✅ Google Calendar
- ✅ Transcrições

---

## 🚀 COMANDOS ÚTEIS

### Desenvolvimento
```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run preview           # Preview do build
```

### Validação
```bash
npm run dry-run          # Validação de schema
npm run check-schema     # Verificação de schema
npx tsc --noEmit         # Type check
```

### Deploy
```bash
./deploy-production.sh   # Deploy completo
```

---

## 🎯 FUNCIONALIDADES DESTACADAS

### 1. Templates de Campanha
- **INSTITUCIONAL_ANNIVERSARY** (R$ 25k)
  - Storytelling Impresso
  - Documentário Curto
  - Drops Reels

- **ESG_PRACTICES** (R$ 40k)
  - 4 Reportagens de Vídeo
  - 4 Capas Impresso

### 2. Cálculo Automático de ROI
- Baseado em métricas reais do Diário do Vale
- Alcance: 15M Instagram + 1.6M Site
- CPV automático
- Engagement rate

### 3. Handover Automático
- Quando nó fica "done"
- Ativa próximos nós automaticamente
- Notifica stakeholders via WhatsApp
- Anima edges conectadas

### 4. Detecção de Conflitos
- Verifica recursos físicos (estúdios, equipes)
- Bloqueia sobreposição de horários
- Status "RESOURCE_CONFLICT"

---

## 📱 RESPONSIVIDADE

- ✅ Desktop-first design
- ✅ Glassmorphism
- ✅ Animações suaves
- ✅ Dark mode nativo

---

## 🔧 TECNOLOGIAS

- **React 19.2.3**
- **React Flow 11.11.4**
- **Zustand 5.0.9**
- **Supabase 2.90.0**
- **Framer Motion 12.24.10**
- **Chart.js 4.5.1**
- **TypeScript 5.8.2**
- **Vite 6.2.0**
- **Tailwind CSS 4.1.18**

---

**🎉 Sistema completo, modular e escalável!**
