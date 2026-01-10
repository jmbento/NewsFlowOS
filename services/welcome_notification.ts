/**
 * Welcome Notification Service
 * Sistema de avisos de boas-vindas e notificações para a equipe
 */

export interface WelcomeMessage {
  id: string;
  title: string;
  message: string;
  targetDate: string; // ISO date
  isActive: boolean;
  dismissedBy?: string[]; // IDs de usuários que já viram
}

export const WelcomeNotification = {
  /**
   * Verifica se há mensagem de boas-vindas para exibir
   */
  checkWelcomeMessage: (): WelcomeMessage | null => {
    const today = new Date();
    const targetDate = new Date('2025-01-12'); // Segunda-feira, 12/01
    
    // Verifica se estamos na semana de 12/01
    const weekStart = new Date(targetDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Domingo da semana
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Sábado da semana
    
    if (today >= weekStart && today <= weekEnd) {
      const stored = localStorage.getItem('newsflow_welcome_12_01');
      if (!stored) {
        return {
          id: 'welcome-12-01',
          title: '🎉 Bem-vindos à Semana de Testes!',
          message: `Olá equipe Diário do Vale!

Esta é a semana oficial de testes do NewsFlow OS. Estamos prontos para receber seu feedback e melhorias!

📅 **Semana de Testes:** 12/01 a 18/01
🎯 **Objetivo:** Testar todas as funcionalidades e enviar feedbacks

💡 **Como ajudar:**
- Use o botão de feedback (canto inferior esquerdo) para reportar bugs, sugerir melhorias ou deixar elogios
- Teste todas as funcionalidades do sistema
- Compartilhe suas impressões com a equipe

🚀 Vamos juntos tornar o NewsFlow OS ainda melhor!

Equipe de Desenvolvimento`,
          targetDate: targetDate.toISOString(),
          isActive: true,
        };
      }
    }
    
    return null;
  },

  /**
   * Marca mensagem como visualizada
   */
  dismissWelcomeMessage: (messageId: string, userId: string) => {
    localStorage.setItem(`newsflow_welcome_${messageId}`, JSON.stringify({
      dismissed: true,
      dismissedBy: userId,
      dismissedAt: new Date().toISOString(),
    }));
  },

  /**
   * Exibe notificação de boas-vindas
   */
  showWelcomeNotification: (onDismiss: () => void) => {
    const message = WelcomeNotification.checkWelcomeMessage();
    if (!message) return null;

    // Criar modal de notificação
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50';
    modal.innerHTML = `
      <div class="bg-white border border-slate-300 rounded-lg shadow-xl max-w-lg w-full p-6">
        <div class="flex items-start justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-900">${message.title}</h2>
          <button onclick="this.closest('.fixed').remove()" class="p-1 rounded-full hover:bg-slate-100 text-slate-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="text-sm text-slate-700 whitespace-pre-line mb-4">${message.message}</div>
        <div class="flex justify-end">
          <button onclick="this.closest('.fixed').remove(); ${onDismiss.toString()}()" class="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700">
            Entendi!
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-dismiss após 30 segundos
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
        onDismiss();
      }
    }, 30000);
  },
};
