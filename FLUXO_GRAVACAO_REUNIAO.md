# 🎙️ Fluxo: O Que Acontece Quando Para a Gravação de Áudio

## 📍 Componentes Envolvidos

### 1. **MeetingAI.tsx** - Botão Flutuante
Localização: Canto inferior da tela

### 2. **MeetingNode.tsx** - Nó de Reunião no Canvas
Localização: Canvas do React Flow

---

## 🔄 FLUXO COMPLETO

### Quando você para a gravação no **MeetingAI** (botão flutuante):

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Parar Alinhamento"                 │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. stopRecording() é executado                          │
│    - setStatus('processing')                            │
│    - setIsRecording(false)                              │
│    - Animação de waveform desaparece                    │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Processamento de IA (3 segundos)                     │
│    - Status muda para "Processando IA..."              │
│    - Badge aparece: "Analisando contexto editorial..." │
│    - Botão fica desabilitado                            │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. IA Processa o Áudio                                  │
│    - Transcrição do áudio                               │
│    - Extração de entidades (tarefas, prazos, etc.)     │
│    - Geração de JSON estruturado                        │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. autoGenerateNodesFromMeeting() é chamado             │
│    - Cria nós de tarefas no canvas                      │
│    - Conecta ao nó de reunião                           │
│    - Adiciona checklists, deadlines, assignees          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Status volta para 'idle'                            │
│    - Botão volta ao estado inicial                      │
│    - Pronto para nova gravação                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 DADOS GERADOS

### Mock Result (Exemplo):
```javascript
{
  campaignName: "Lançamento NewsFlow V4.1",
  tasks: [
    { 
      label: "Produção de Vídeo Teaser", 
      assignee: "Video Edit", 
      deadline: "2024-01-10",
      checklist: ["Roteiro", "Gravação", "Edição Final"]
    },
    { 
      label: "Copywriting para Landing Page", 
      assignee: "Copywriter", 
      deadline: "2024-01-09",
      checklist: ["Headline", "Benefícios", "CTA"]
    },
    { 
      label: "Setup de Ads (IG/FB)", 
      assignee: "Traffic Manager", 
      deadline: "2024-01-11",
      checklist: ["Públicos", "Criativos", "Pixel"]
    }
  ]
}
```

---

## 🎯 Quando você para a gravação no **MeetingNode** (nó no canvas):

### Fluxo Diferente:

```
┌─────────────────────────────────────────────────────────┐
│ 1. Usuário clica em "Parar Gravação"                    │
│    - setIsRecording(false)                              │
│    - Botão volta para "Gravar Áudio"                    │
│    - ❌ NÃO processa automaticamente                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Usuário precisa clicar em "IA: Gerar Ata & Tarefas" │
│    - handleProcessIA() é executado                      │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Processamento de IA (3 segundos)                     │
│    - Gera transcript                                    │
│    - Extrai taskList                                    │
│    - Atualiza nó de reunião                             │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. autoGenerateNodesFromMeeting(id)                     │
│    - Cria nós filhos conectados                        │
│    - Cada tarefa vira um nó                             │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. WhatsAppAlerts.sendMeetingMinute()                   │
│    - Envia ata da reunião via WhatsApp                  │
│    - Notifica stakeholders                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 DETALHES TÉCNICOS

### MeetingAI.tsx - stopRecording()
```typescript
const stopRecording = () => {
  setStatus('processing');        // Muda para processando
  setIsRecording(false);          // Para a gravação
  
  // Simulação de processamento (3 segundos)
  setTimeout(async () => {
    const mockResult = {
      campaignName: "...",
      tasks: [...]
    };
    
    await autoGenerateNodesFromMeeting(mockResult);
    setStatus('idle');
  }, 3000);
};
```

### MeetingNode.tsx - handleProcessIA()
```typescript
const handleProcessIA = async () => {
  setIsProcessingIA(true);
  
  // Processa áudio
  setTimeout(async () => {
    const updatePayload = {
      transcript: "...",
      taskList: [...],
      isProcessing: false,
      status: 'done'
    };
    
    // 1. Atualiza nó
    updateNodeData(id, updatePayload);
    
    // 2. Gera nós filhos
    await autoGenerateNodesFromMeeting(id);
    
    // 3. Envia WhatsApp
    await WhatsAppAlerts.sendMeetingMinute(...);
  }, 3000);
};
```

---

## 📝 DIFERENÇAS ENTRE OS DOIS

| Aspecto | MeetingAI (Flutuante) | MeetingNode (Canvas) |
|---------|----------------------|----------------------|
| **Processamento Automático** | ✅ Sim (3s após parar) | ❌ Não (precisa clicar) |
| **Geração de Nós** | ✅ Sim | ✅ Sim |
| **Envio WhatsApp** | ❌ Não | ✅ Sim |
| **Atualização do Nó** | ❌ Não | ✅ Sim |
| **Transcript** | ❌ Não salvo | ✅ Salvo no nó |

---

## 🎨 FEEDBACK VISUAL

### Durante Gravação:
- ✅ Animação de waveform (12 barras animadas)
- ✅ Botão vermelho com ícone de stop
- ✅ Texto: "Gravando Áudio..."

### Após Parar (Processing):
- ✅ Badge flutuante: "Analisando contexto editorial..."
- ✅ Botão com spinner (Loader2)
- ✅ Texto: "Processando IA..."
- ✅ Botão desabilitado

### Após Processar:
- ✅ Nós aparecem no canvas
- ✅ Status volta para 'idle'
- ✅ Botão volta ao estado inicial

---

## 🔄 INTEGRAÇÃO COM STORE

### autoGenerateNodesFromMeeting()
**Localização**: `store.ts` (linha 328)

**O que faz**:
1. Busca o nó de reunião
2. Cria novos nós para cada tarefa
3. Conecta os nós ao nó de reunião
4. Adiciona checklists, deadlines, assignees
5. Persiste no Supabase

---

## 🚀 PRÓXIMOS PASSOS (Melhorias Futuras)

1. **Gravação Real de Áudio**
   - Usar MediaRecorder API
   - Salvar arquivo de áudio
   - Enviar para serviço de transcrição

2. **Integração com IA Real**
   - Google Speech-to-Text
   - Gemini para extração de entidades
   - Processamento em tempo real

3. **Notificações**
   - Toast quando processamento terminar
   - Som de conclusão
   - Badge de notificação

---

**✅ Fluxo completo documentado!**
