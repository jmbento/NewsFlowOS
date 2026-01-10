
import { MeetingData } from '../types';

/**
 * WhatsApp Notificator Service
 * Gerencia o envio de atas e resumos de reuniões para stakeholders.
 */

export const WhatsAppNotificator = {
  /**
   * Envia o resumo completo da reunião (Ata + Tarefas).
   */
  sendMeetingSummary: async (meetingData: MeetingData, projectName: string) => {
    console.log(`📱 [WHATSAPP_NOTIFY]: Sending meeting summary for "${meetingData.label}" in project "${projectName}"...`);
    
    const message = `
📝 *ATA DE REUNIÃO: ${meetingData.label.toUpperCase()}*
📌 *Projeto:* ${projectName}

📋 *Agenda:*
${meetingData.agenda}

✅ *Tarefas Geradas pela IA:*
${meetingData.taskList.map(t => `- [ ] ${t.task} (${t.owner}) - Até ${t.deadline}`).join('\n')}

🔗 *Link do Meet:* ${meetingData.videoLink || 'N/A'}

---
_Gerado automaticamente pelo NewsFlow AI Meeting Engine_
    `;

    console.log(`📨 [WHATSAPP_MESSAGE_SENT]: \n${message}`);
    
    // Simulação de sucesso de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
};
