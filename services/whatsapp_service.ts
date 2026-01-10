
/**
 * WhatsApp Service Mock
 * Serviço centralizado para notificações de handover e progresso de workflow.
 */

export type WorkflowAlertType = 'success' | 'alert' | 'info';

export const sendWorkflowAlert = async (
  nodeType: string, 
  message: string, 
  type: WorkflowAlertType = 'info'
) => {
  // Simulação de log estruturado para o Antigravity / Backend
  console.log(`[WHATSAPP_HANDOVER_ALERT] type=${type} node=${nodeType} msg="${message}"`);
  
  // No futuro, isso dispararia uma Edge Function ou webhook de API (ex: Ayrshare ou Supabase Webhook)
  try {
    // Simulando delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      transactionId: `wa-${crypto.randomUUID().substring(0, 8)}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Failed to send workflow alert:", error);
    return { success: false, error: "Network Error" };
  }
};
