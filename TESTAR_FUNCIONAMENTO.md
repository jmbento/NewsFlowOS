# 🧪 Como Testar o Funcionamento Real

## 🚀 Passo 1: Iniciar o Servidor

Execute no seu terminal:

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
npm run dev
```

Aguarde até ver:
```
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

---

## 🎯 Passo 2: Acessar a Aplicação

Abra no navegador:
**http://localhost:3000**

---

## 🧪 TESTES PARA FAZER

### 1. ✅ Testar Gravação de Reunião

#### No Botão Flutuante (MeetingAI):
1. Role até o final da página
2. Clique no botão grande "Iniciar Reunião"
3. Veja a animação de waveform aparecer
4. Clique em "Parar Alinhamento" (botão vermelho)
5. **O que acontece**:
   - Badge aparece: "Analisando contexto editorial..."
   - Após 3 segundos, nós aparecem no canvas
   - Cada tarefa vira um nó conectado

#### No Nó de Reunião (Canvas):
1. Crie um nó do tipo `meeting` no canvas
2. Clique em "Gravar Áudio"
3. Clique em "Parar Gravação"
4. Clique em "IA: Gerar Ata & Tarefas"
5. **O que acontece**:
   - Nós filhos são criados
   - Transcript é salvo
   - WhatsApp é enviado (simulado)

---

### 2. ✅ Testar Governança (ADMIN_COMERCIAL)

1. Abra o Console do Navegador (F12)
2. Execute:
```javascript
import { setCurrentUser } from './services/governance';
setCurrentUser({ 
  id: '1', 
  email: 'comercial@newsflow.com', 
  role: 'ADMIN_COMERCIAL' 
});
console.log('✅ Usuário ADMIN_COMERCIAL definido');
```

3. Crie ou selecione um nó do tipo `campaign`
4. Abra o NodeInspector (clique no nó)
5. Role até "💰 Dados Financeiros"
6. **Teste**:
   - ✅ Campo "Investimento Total" deve estar EDITÁVEL
   - ✅ Campo "ROI Stats" deve estar VISÍVEL

7. Agora teste sem permissão:
```javascript
setCurrentUser({ 
  id: '2', 
  email: 'editor@newsflow.com', 
  role: 'EDITOR' 
});
```

8. **Teste novamente**:
   - 🔒 Campos devem estar BLOQUEADOS (vermelho claro)
   - 🔒 Badge "ADMIN_COMERCIAL" visível
   - ❌ Não consegue editar valores

---

### 3. ✅ Testar Troca de Idioma

1. No header, clique no botão do globo (🌐)
2. **O que acontece**:
   - Idioma muda de PT para EN (ou vice-versa)
   - Tooltips mudam de idioma
   - Status muda de idioma

---

### 4. ✅ Testar Troca de Tema

1. No header, clique no botão sol/lua (☀️/🌙)
2. **O que acontece**:
   - Tema muda de Dark para Light (ou vice-versa)
   - Fundo fica branco (light) ou escuro (dark)
   - Texto fica preto (light) ou branco (dark)
   - Transição suave

---

### 5. ✅ Testar CRM (Sales Hub)

1. Clique no ícone de Briefcase na sidebar
2. **O que acontece**:
   - Abre o Sales Hub
   - Veja pipeline Kanban
   - Clique em "Novo Lead"
   - Veja lead aparecer

3. **Teste conversão**:
   - Clique em "Ganhar" em um lead
   - **O que acontece**:
     - Lead vira projeto automaticamente
     - Nó de campanha aparece no canvas
     - Template é carregado

---

### 6. ✅ Testar Canvas (React Flow)

1. Clique no ícone de Workflow na sidebar
2. **Teste**:
   - Arraste nós do painel lateral
   - Conecte nós (arraste de um handle para outro)
   - Clique em um nó para ver NodeInspector
   - Edite dados no inspector

---

### 7. ✅ Testar Templates de Campanha

1. Crie um nó do tipo `campaign`
2. No NodeInspector, escolha template:
   - "Institucional" (R$ 25k)
   - "ESG Practices" (R$ 40k)
3. **O que acontece**:
   - Nós filhos são criados automaticamente
   - Conectados ao nó de campanha
   - Posicionados ao lado

---

### 8. ✅ Testar Handover Automático

1. Crie um workflow: Campaign → OS → Production
2. Marque o nó Campaign como "done"
3. **O que acontece**:
   - Próximo nó (OS) muda para "doing"
   - Edge fica verde e animado
   - Notificação via WhatsApp (simulado)

---

## 🎬 DEMONSTRAÇÃO COMPLETA

### Fluxo End-to-End:

```
1. Criar Lead no CRM
   ↓
2. Converter para Projeto (WON)
   ↓
3. Nó de Campanha aparece no Canvas
   ↓
4. Carregar Template (Institucional/ESG)
   ↓
5. Nós filhos são criados
   ↓
6. Marcar nós como "done"
   ↓
7. Handover automático ativa próximos nós
   ↓
8. Gerar Relatório de ROI
```

---

## 🔍 O QUE OBSERVAR

### Feedback Visual:
- ✅ Animações suaves
- ✅ Transições de cor
- ✅ Glow effects nos nós
- ✅ Edges animadas quando "done"
- ✅ Badges de status
- ✅ Loading states

### Sincronização:
- ✅ Status "Sincronizando..." no header
- ✅ Status "Cloud" quando salvo
- ✅ Indicador "Online" verde

### Governança:
- ✅ Campos bloqueados visualmente
- ✅ Badge "ADMIN_COMERCIAL"
- ✅ Erro no console se tentar editar sem permissão

---

## 🐛 Troubleshooting

### Se não aparecer nada:
1. Verifique o console (F12) para erros
2. Verifique se Supabase está configurado
3. Tente recarregar a página

### Se gravação não funcionar:
- Atualmente é simulado (mock)
- Em produção, integraria com MediaRecorder API

### Se nós não aparecerem:
- Verifique o console para logs
- Procure por: `[IA_NODE_GENERATOR]`

---

## 📊 CHECKLIST DE TESTES

- [ ] Servidor rodando em localhost:3000
- [ ] Gravação de reunião funciona
- [ ] Nós são gerados após gravação
- [ ] Governança bloqueia edição sem permissão
- [ ] Troca de idioma funciona
- [ ] Troca de tema funciona
- [ ] CRM cria leads
- [ ] Conversão de lead para projeto
- [ ] Templates de campanha funcionam
- [ ] Handover automático funciona
- [ ] Canvas interativo funciona

---

**🎉 Teste tudo e veja o sistema funcionando!**
