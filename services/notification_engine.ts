
import { supabase } from './supabase';

/**
 * NotificationEngine (BXD Architect)
 * Gerencia a lógica de 'Push Notification' via WhatsApp Bridge.
 */

export const NOTIFICATION_TEMPLATES = {
  STATUS_CHANGE: (nodeLabel: string, status: string) => 
    `🚀 *NewsFlow Update*: O status do nó [${nodeLabel}] mudou para *${status.toUpperCase()}*.`,
  NEW_ASSIGNMENT: (nodeLabel: string, deadline: string) => 
    `📅 *Novo Job*: Você foi designado para [${nodeLabel}]. Prazo: ${deadline}.`,
  HANDOVER: (nodeLabel: string) => 
    `✅ *Handover Concluído*: A etapa [${nodeLabel}] foi finalizada. Próximo passo liberado!`
};

export const notifyStakeholders = async (nodeId: string, actionType: keyof typeof NOTIFICATION_TEMPLATES, customData?: any) => {
  try {
    // 1. Buscar dados do nó e responsáveis
    const { data: node, error: nodeError } = await supabase
      .from('nodes')
      .select('data, type')
      .eq('id', nodeId)
      .single();

    if (nodeError || !node) throw new Error("Nó não encontrado para notificação.");

    // 2. Formatar mensagem baseada no template
    let message = "";
    if (actionType === 'STATUS_CHANGE') {
      message = NOTIFICATION_TEMPLATES.STATUS_CHANGE(node.data.label, node.data.status);
    } else if (actionType === 'NEW_ASSIGNMENT') {
      message = NOTIFICATION_TEMPLATES.NEW_ASSIGNMENT(node.data.label, node.data.deadline || 'Não definido');
    } else {
      message = NOTIFICATION_TEMPLATES.HANDOVER(node.data.label);
    }

    // 3. Simulação de envio via WhatsApp (Disparando para o Webhook de saída ou logs)
    console.log(`[WHATSAPP_NOTIFICATION_ENGINE] Relaying to stakeholders...`);
    console.log(`Message: ${message}`);

    // Em produção, aqui faríamos um fetch para uma Edge Function que chama a API do WhatsApp Business
    /*
    await fetch(process.env.SUPABASE_WA_OUTBOUND_URL, {
      method: 'POST',
      body: JSON.stringify({ message, nodeId, type: node.type })
    });
    */

    return { success: true, deliveredAt: new Date().toISOString() };
  } catch (error) {
    console.error("Notification Engine Error:", error);
    return { success: false, error };
  }
};
