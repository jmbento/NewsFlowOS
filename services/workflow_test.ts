
import { useStore } from '../store';

/**
 * Workflow Stress Test Utility (v5.1)
 * Simula uma campanha completa do zero até o deploy em rede social.
 */

export const simularCampanhaCompleta = async () => {
  const store = useStore.getState();
  console.log("🚀 [STRESS_TEST]: Iniciando Simulação de Campanha...");

  try {
    // 1. Simular Entrada de Reunião (IA Meeting)
    const mockAnalysis = {
      campaignName: `Stress Test ${new Date().toLocaleTimeString()}`,
      tasks: [
        { label: "Briefing & Conceito", assignee: "BXD Bot" },
        { label: "Criação de Artes", assignee: "BXD Bot" },
        { label: "Revisão e Aprovação", assignee: "Senior Lead" }
      ]
    };

    await store.autoGenerateNodesFromMeeting(mockAnalysis);
    console.log("✅ [STRESS_TEST]: Nós gerados via IA.");

    // Aguardar renderização e sincronização
    await new Promise(r => setTimeout(r, 2000));

    // 2. Localizar nós criados
    const currentNodes = useStore.getState().nodes;
    const sortedNodes = [...currentNodes].sort((a, b) => a.id.localeCompare(b.id)).reverse().slice(0, 4);
    
    // 3. Percorrer o fluxo (Cascata de Handover)
    for (const node of sortedNodes) {
      console.log(`📡 [STRESS_TEST]: Processando Nó [${node.id}] - Status: Doing`);
      await store.onWorkflowProgress(node.id, 'doing');
      
      await new Promise(r => setTimeout(r, 2000));
      
      console.log(`✅ [STRESS_TEST]: Finalizando Nó [${node.id}] - Handover Triggered`);
      await store.onWorkflowProgress(node.id, 'done');
      
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log("🏁 [STRESS_TEST]: Simulação concluída com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("❌ [STRESS_TEST]: Falha na simulação:", error);
    return { success: false, error };
  }
};
