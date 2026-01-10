# 🎨 MAPA VISUAL COMPLETO - NewsFlow Nodes

## 📋 ÍNDICE DE PÁGINAS/VIEWS

### 1. **CANVAS (FlowCanvas)** - `/components/FlowCanvas.tsx`
**Rota:** `activeTab === 'canvas'`

#### Elementos Visuais:
- **Background:** Fundo escuro com padrão de estrelas animadas
- **React Flow Canvas:** Área principal para arrastar e conectar nós
- **Painel Superior Direito:** 
  - Botões para criar nós (PROD, CAMPANHA, ORDEM SERVIÇO, EDIÇÃO MÍDIA, REDES SOCIAIS, MEETING, PEÇA ADITIVA, GERAR CLIPPING)
  - Background blur com borda
- **Painel Superior Esquerdo:** HandshakeIndicator
- **MiniMap:** Canto inferior direito
- **Controls:** Zoom, fit view
- **NodeInspector:** Painel lateral direito quando nó selecionado

#### Problemas Identificados:
- ❌ Muitos botões no painel superior (8 botões)
- ❌ Texto abreviado em mobile (P, C, OS, M, R, GOV, +, CLIP)
- ❌ Falta hierarquia visual clara
- ❌ Cores muito similares entre botões

---

### 2. **KANBAN BOARD** - `/components/KanbanBoard.tsx`
**Rota:** `activeTab === 'kanban'`

#### Elementos Visuais:
- **Header:**
  - Título: "Pipeline Editorial"
  - Badge: "Ativos" com contador
- **Grid 3 Colunas:**
  - **A Fazer** (todo) - Cor: zinc-500
  - **Em Execução** (doing) - Cor: brand-neon-blue
  - **Concluído** (done) - Cor: emerald-500
- **Cards de Tarefas:** Cada coluna contém cards arrastáveis

#### Problemas Identificados:
- ❌ Header muito grande
- ❌ Cards sem hierarquia visual clara
- ❌ Cores de status pouco contrastantes

---

### 3. **CALENDÁRIO EDITORIAL** - `/components/EditorialCalendar.tsx`
**Rota:** `activeTab === 'calendar'`

#### Elementos Visuais:
- Calendário mensal
- Eventos e deadlines
- Integração com nodes do canvas

#### Problemas Identificados:
- ⚠️ Não revisado ainda

---

### 4. **CURATORSHIP ADMIN (Master)** - `/components/CuratorshipAdmin.tsx`
**Rota:** `activeTab === 'master'`

#### Elementos Visuais:
- Painel de curadoria
- Aprovações e revisões
- Governança de conteúdo

#### Problemas Identificados:
- ⚠️ Não revisado ainda

---

### 5. **SALES CRM** - `/components/SalesCRM.tsx`
**Rota:** `activeTab === 'sales'`

#### Elementos Visuais:
- **Header:**
  - Título: "Sales Hub"
  - Cards de métricas: Pipeline Total, Conversão
  - Botão: "Novo Lead"
- **Kanban Pipeline:**
  - Colunas horizontais com scroll
  - Cards de leads arrastáveis
  - Status: Qualificação, Proposta, Negociação, Fechado

#### Problemas Identificados:
- ❌ Cards de métricas muito pequenos
- ❌ Pipeline horizontal pode confundir
- ❌ Falta destaque para leads importantes

---

### 6. **CLIENT REPORT VIEW** - `/components/ClientReportView.tsx`
**Rota:** `activeTab === 'report'`

#### Elementos Visuais:
- **Header Premium:**
  - Badge: "Report Executive 2026"
  - Título grande: "Relatório de Performance: {projectLabel}"
  - Cards: Impacto Total, CPV Gerado
- **KPI Grid (4 cards):**
  - Alcance Orgânico
  - Engajamento
  - Custo p/ View
  - Autoridade
- **Charts Section:**
  - Gráfico de barras: "Alcance por Canal"
  - Cards laterais: Editoria de Confiança, Abrangência Regional
- **Clipping Gallery:**
  - Grid de cards com screenshots
  - Cards com hover effects

#### Problemas Identificados:
- ❌ Muitos elementos competindo por atenção
- ❌ Header muito grande
- ❌ KPI cards muito pequenos
- ❌ Falta hierarquia visual clara

---

### 7. **DASHBOARD** - `/components/Dashboard.tsx`
**Rota:** `activeTab === 'dashboard'`

#### Elementos Visuais:
- **Hero Welcome:**
  - Badge: "NewsFlow OS v12.0"
  - Título: "Bem-vindo ao NewsFlow"
  - Botão: "Ir para o Canvas"
- **Quick Stats (3 cards):**
  - Total de Nós
  - Concluídos
  - Em Progresso
- **Quick Links (3 cards):**
  - Guia de Onboarding
  - Sales Hub CRM
  - Relatório de ROI

#### Problemas Identificados:
- ❌ Cards muito similares
- ❌ Falta destaque para ações principais

---

### 8. **ONBOARDING GUIDE** - `/components/OnboardingGuide.tsx`
**Rota:** `activeTab === 'onboarding'`

#### Elementos Visuais:
- Guia passo a passo
- Tutorial interativo

#### Problemas Identificados:
- ⚠️ Não revisado ainda

---

## 🎨 COMPONENTES GLOBAIS

### **SIDEBAR (App.tsx)**
- **Logo:** Topo com gradiente purple-blue
- **Navegação:** 6 botões verticais
  - Canvas (Workflow icon)
  - Kanban (LayoutDashboard icon)
  - Calendar (Calendar icon)
  - Master (ShieldCheck icon)
  - Sales (Briefcase icon)
  - Report (BarChart3 icon)
- **Footer:** Settings, Avatar

#### Problemas Identificados:
- ❌ Botões muito pequenos (w-12 h-12)
- ❌ Falta labels/texto
- ❌ Ícones podem ser confusos

---

### **HEADER (App.tsx)**
- **Esquerda:**
  - Logo: "NEWSFLOW NODES"
  - Badge: "Global Engine v3.1"
- **Direita:**
  - Status de sync (Sincronizando/Salvo)
  - ThemeLanguageToggle
  - Bell (notificações)
  - Status Online

#### Problemas Identificados:
- ❌ Muitos elementos pequenos
- ❌ Falta espaço respiração
- ❌ Status pouco visível

---

### **NODE INSPECTOR** - `/components/NodeInspector.tsx`
**Aparece quando:** Nó selecionado no canvas

#### Elementos Visuais:
- **Header:**
  - Ícone PenTool
  - Título: "Node Inspector"
  - ID do nó
  - Botão fechar (X)
- **Conteúdo:**
  - Input: Título do Nó
  - Status buttons: todo, doing, done, ORDER_EXTRA
  - Checklist Manager
  - Campos específicos por tipo de nó
  - Dados Financeiros (se campaign)

#### Problemas Identificados:
- ❌ Muitos campos pequenos
- ❌ Textos muito pequenos (text-[9px])
- ❌ Falta espaçamento
- ❌ Labels pouco legíveis

---

### **MEETING AI** - `/components/MeetingAI.tsx`
**Posição:** Bottom center, flutuante

#### Elementos Visuais:
- **Botão Principal:**
  - Ícone Mic/Square
  - Texto: "VOCAL AUTOMATION" / "INICIAR REUNIÃO"
  - Status: recording, processing, idle
- **Waveform Animation:** Quando gravando

#### Problemas Identificados:
- ❌ Botão muito grande
- ❌ Texto pode ser confuso
- ❌ Posição pode atrapalhar

---

### **CHAT INTERFACE** - `/components/ChatInterface.tsx`
**Posição:** Bottom left, flutuante

#### Elementos Visuais:
- **Header:**
  - Ícone Smartphone
  - Título: "Chat Bridge"
  - Status: "WhatsApp Live"
- **Messages Area:**
  - Bubbles de mensagens
  - User (direita) vs AI/WA (esquerda)
- **Input:**
  - Campo de texto
  - Botão Send

#### Problemas Identificados:
- ❌ Oculto em mobile
- ❌ Pode sobrepor conteúdo
- ❌ Tamanho fixo pode não funcionar bem

---

## 🎨 CUSTOM NODES - `/components/CustomNodes.tsx`

### **Campaign Node (Trigger)**
- Header: Amber background
- Body: Label, Editoria, Templates, Investimento, Abrangência

### **OS Node (Action)**
- Header: Blue background
- Body: Checklist grid, Progress bar

### **Content Production Node (AI)**
- Header: Purple background
- Body: Textarea, Botão "Optimize for Social", Image prompt

### **Social Output Node (Output)**
- Header: Emerald background
- Body: Social icons, Schedule, Preview

#### Problemas Identificados:
- ❌ Nós muito pequenos (w-[260px])
- ❌ Textos muito pequenos
- ❌ Falta contraste
- ❌ Cores de header pouco distintas

---

## 🚨 PROBLEMAS GERAIS DE DESIGN

### 1. **HIERARQUIA VISUAL**
- ❌ Muitos elementos competindo por atenção
- ❌ Falta destaque para ações principais
- ❌ Tamanhos de fonte inconsistentes

### 2. **ESPAÇAMENTO**
- ❌ Elementos muito próximos
- ❌ Falta "respiro" entre seções
- ❌ Padding inconsistente

### 3. **CONTRASTE**
- ❌ Textos muito claros em backgrounds escuros
- ❌ Bordas pouco visíveis
- ❌ Cores muito similares

### 4. **ORGANIZAÇÃO**
- ❌ Muitos botões no mesmo espaço
- ❌ Falta agrupamento visual
- ❌ Navegação confusa

### 5. **TIPOGRAFIA**
- ❌ Tamanhos muito pequenos (text-[8px], text-[9px])
- ❌ Fontes pouco legíveis
- ❌ Tracking muito apertado

### 6. **CORES**
- ❌ Muitas cores diferentes
- ❌ Falta paleta consistente
- ❌ Cores de status pouco distintas

---

## 📝 SUGESTÕES DE MELHORIA

### **PRIORIDADE ALTA:**
1. ✅ Aumentar tamanhos de fonte (mínimo 12px)
2. ✅ Melhorar contraste (textos mais claros)
3. ✅ Aumentar espaçamento entre elementos
4. ✅ Reduzir número de botões visíveis
5. ✅ Criar hierarquia visual clara

### **PRIORIDADE MÉDIA:**
1. ✅ Padronizar cores de status
2. ✅ Melhorar agrupamento visual
3. ✅ Adicionar labels nos botões da sidebar
4. ✅ Simplificar header
5. ✅ Melhorar cards de métricas

### **PRIORIDADE BAIXA:**
1. ✅ Adicionar animações sutis
2. ✅ Melhorar feedback visual
3. ✅ Otimizar para mobile
4. ✅ Adicionar tooltips
5. ✅ Melhorar acessibilidade

---

## 🎯 PRÓXIMOS PASSOS

1. **Revisar cada página individualmente**
2. **Simplificar elementos visuais**
3. **Aumentar tamanhos e espaçamentos**
4. **Melhorar contraste e legibilidade**
5. **Criar hierarquia visual clara**

---

**Última atualização:** $(date)
