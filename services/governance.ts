/**
 * Governance Service (v1.0)
 * Sistema de controle de acesso baseado em roles para NewsFlow OS
 * 
 * REGRAS DE ACESSO:
 * - ADMIN_COMERCIAL: Pode editar totalInvestment e roiStats
 * - Outros usuários: Apenas leitura de valores financeiros
 */

export type UserRole = 'ADMIN_COMERCIAL' | 'EDITOR' | 'DESIGNER' | 'VIEWER' | 'ADMIN';

interface User {
  id: string;
  email: string;
  role: UserRole;
}

// Mock de autenticação (Iniciado como ADMIN para desenvolvimento em localhost)
let currentUser: User | null = {
  id: 'dev-user',
  email: 'admin@newsflow.os',
  role: 'ADMIN'
};

/**
 * Inicializa o usuário atual (mock - substituir por Supabase Auth em produção)
 */
export function setCurrentUser(user: User | null) {
  currentUser = user;
}

/**
 * Retorna o usuário atual
 */
export function getCurrentUser(): User | null {
  // Em produção, buscar do Supabase Auth
  // const { data: { user } } = await supabase.auth.getUser();
  // return user ? { id: user?.id, email: user?.email, role: user?.user_metadata?.role || 'VIEWER' } : null;
  
  return currentUser;
}

/**
 * Verifica se o usuário atual tem permissão para editar valores financeiros
 */
export function canEditFinancialData(): boolean {
  const user = getCurrentUser();
  return user?.role === 'ADMIN_COMERCIAL' || user?.role === 'ADMIN';
}

/**
 * Verifica se o usuário atual tem uma role específica
 */
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser();
  return user?.role === role || user?.role === 'ADMIN';
}

/**
 * Validação de edição de totalInvestment
 * Retorna true se permitido, false caso contrário
 */
export function validateInvestmentEdit(oldValue: number, newValue: number): { allowed: boolean; reason?: string } {
  if (!canEditFinancialData()) {
    return {
      allowed: false,
      reason: 'Apenas usuários com role ADMIN_COMERCIAL podem editar valores de investimento'
    };
  }

  // Validação adicional: valores devem estar dentro de faixas esperadas
  const validRanges = [25000, 40000]; // R$ 25k (Institucional) e R$ 40k (ESG)
  const isCloseToValidRange = validRanges.some(range => Math.abs(newValue - range) < 1000);

  if (!isCloseToValidRange && newValue > 0) {
    return {
      allowed: true, // Permite, mas pode gerar warning
      reason: `Valor R$ ${newValue.toLocaleString()} fora das faixas padrão (R$ 25k ou R$ 40k)`
    };
  }

  return { allowed: true };
}

/**
 * Validação de edição de ROI Stats
 */
export function validateROIEdit(): { allowed: boolean; reason?: string } {
  if (!canEditFinancialData()) {
    return {
      allowed: false,
      reason: 'Apenas usuários com role ADMIN_COMERCIAL podem editar estatísticas de ROI'
    };
  }

  return { allowed: true };
}

/**
 * Hook para uso em componentes React (opcional)
 */
export function useGovernance() {
  return {
    currentUser: getCurrentUser(),
    canEditFinancialData: canEditFinancialData(),
    hasRole,
    validateInvestmentEdit,
    validateROIEdit
  };
}
