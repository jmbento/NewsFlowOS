
import { MeetingData } from '../types';

/**
 * WhatsApp Alerts Service (Governança 2.0)
 * Responsável pelo envio imediato das atas processadas pela IA.
 */

export const WhatsAppAlerts = {
  /**
   * Envia a ata estruturada com demandas, responsáveis e prazos.
   */
  sendMeetingMinute: async (meetingData: MeetingData, projectName: string) => {
    console.log(`📡 [WHATSAPP_ALERTS]: Despachando Ata de Reunião para o projeto "${projectName}"...`);
    
    const tasksFormatted = (meetingData.taskList || [])
      .map(t => `🔹 *${t.task}*\n   👤 Responsável: ${t.owner}\n   📅 Prazo: ${t.deadline}`)
      .join('\n\n');

    const message = `
🏛️ *GOVERNANÇA: ATA DE REUNIÃO*
---------------------------------------
📌 *Projeto:* ${projectName}
📢 *Pauta:* ${meetingData.label}

📝 *Resumo Executivo:*
${meetingData.transcript || 'Capturado e processado via NewsFlow AI Engine.'}

✅ *PLANO DE AÇÃO ADOTADO:*
${tasksFormatted || '_Nenhuma tarefa direta detectada pela IA._'}

📍 *Acompanhe no Canvas:* newsflow.app/canvas/${projectName.toLowerCase().replace(/ /g, '-')}
---------------------------------------
_Governança 2.0 via NewsFlow OS_
    `;

    console.log(`📨 [WHATSAPP_MESSAGE]: \n${message}`);
    
    // Simulação de gateway WhatsApp
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  },

  /**
   * Alerta de deadline atrasado ou próximo
   */
  sendDeadlineAlert: async (nodeLabel: string, daysOverdue: number, assignee?: string) => {
    console.log(`📡 [WHATSAPP_ALERTS]: Alerta de deadline para "${nodeLabel}"...`);
    
    const message = daysOverdue < 0
      ? `
⚠️ *ALERTA: DEADLINE ATRASADO*
---------------------------------------
📌 *Tarefa:* ${nodeLabel}
⏰ *Atraso:* ${Math.abs(daysOverdue)} dia(s)
👤 *Responsável:* ${assignee || 'Não atribuído'}
---------------------------------------
_Ação necessária imediata._
    `
      : `
⏰ *ALERTA: DEADLINE PRÓXIMO*
---------------------------------------
📌 *Tarefa:* ${nodeLabel}
⏰ *Prazo:* ${daysOverdue} dia(s)
👤 *Responsável:* ${assignee || 'Não atribuído'}
---------------------------------------
_Verifique o progresso._
    `;

    console.log(`📨 [WHATSAPP_MESSAGE]: \n${message}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  /**
   * Alerta de dependência bloqueada
   */
  sendDependencyAlert: async (blockedTask: string, blocker: string, blockerAssignee?: string) => {
    console.log(`📡 [WHATSAPP_ALERTS]: Alerta de dependência bloqueada...`);
    
    const message = `
🔗 *ALERTA: DEPENDÊNCIA BLOQUEADA*
---------------------------------------
📌 *Tarefa Bloqueada:* ${blockedTask}
🚫 *Bloqueada por:* ${blocker}
👤 *Responsável do Bloqueio:* ${blockerAssignee || 'Não atribuído'}
---------------------------------------
_Resolva a dependência para continuar._
    `;

    console.log(`📨 [WHATSAPP_MESSAGE]: \n${message}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  /**
   * Alerta de pedido de atenção
   */
  sendAttentionRequest: async (memberName: string, message?: string) => {
    console.log(`📡 [WHATSAPP_ALERTS]: Pedido de atenção de ${memberName}...`);
    
    const alertMessage = message
      ? `
🚨 *PEDIDO DE ATENÇÃO*
---------------------------------------
👤 *De:* ${memberName}
💬 *Mensagem:* ${message}
---------------------------------------
_Revisar urgente._
    `
      : `
🚨 *PEDIDO DE ATENÇÃO*
---------------------------------------
👤 *De:* ${memberName}
💬 *Solicita atenção da administração*
---------------------------------------
_Revisar urgente._
    `;

    console.log(`📨 [WHATSAPP_MESSAGE]: \n${alertMessage}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  /**
   * Alerta de sugestão de pauta
   */
  sendPautaSuggestion: async (memberName: string, suggestion: string) => {
    console.log(`📡 [WHATSAPP_ALERTS]: Sugestão de pauta de ${memberName}...`);
    
    const message = `
💡 *SUGESTÃO DE PAUTA*
---------------------------------------
👤 *De:* ${memberName}
📝 *Sugestão:*
${suggestion}
---------------------------------------
_Considerar para próxima reunião._
    `;

    console.log(`📨 [WHATSAPP_MESSAGE]: \n${message}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  },

  /**
   * Alerta quando um cliente visualiza uma proposta digital (rastreamento comercial).
   */
  sendProposalViewAlert: async (projectName: string, clientName: string, value: number) => {
    console.log(`📡 [WHATSAPP_ALERTS]: Alerta de visualização para o projeto "${projectName}"...`);
    
    const message = `
🔥 *ALERTA COMERCIAL: PROPOSTA VISUALIZADA*
---------------------------------------
👤 *Cliente:* ${clientName}
📌 *Projeto:* ${projectName}
💰 *Valor:* R$ ${value.toLocaleString()}

🚀 O cliente acaba de abrir o link da proposta! 
💡 *DICA:* Aguarde 5-10 minutos e faça o follow-up estratégico.

📍 *Acompanhe no CRM:* newsflow.app/sales
---------------------------------------
_Inteligência Comercial via NewsFlow OS_
    `;

    console.log(`📨 [WHATSAPP_MESSAGE]: \n${message}`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};
