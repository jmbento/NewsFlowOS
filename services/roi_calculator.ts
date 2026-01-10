
import { ROIStats } from '../types';

/**
 * ROI Calculator Service (v11.0)
 * Baseado nos diferenciais competitivos do Diário do Vale.
 */

const DIARIO_METRICS = {
  PRINT_CIRCULATION: 12000,
  PRINT_PASS_ALONG: 3.5, // 1 jornal lido por 3.5 pessoas
  SITE_VIEWS_MONTHLY: 1600000,
  INSTAGRAM_REACH_MONTHLY: 15000000,
  FACEBOOK_REACH_MONTHLY: 2500000,
  AVERAGE_STAY_TIME: 180, // segundos (3 min)
};

export const ROICalculator = {
  /**
   * Calcula as estatísticas de ROI de um projeto/campanha
   */
  calculateProjectROI: (investment: number, durationDays: number = 30): ROIStats => {
    // 1. Médias de impacto diário (proporcional à duração)
    const factor = durationDays / 30;
    
    const reachImpresso = Math.round(DIARIO_METRICS.PRINT_CIRCULATION * DIARIO_METRICS.PRINT_PASS_ALONG * durationDays);
    const reachDigital = Math.round(DIARIO_METRICS.SITE_VIEWS_MONTHLY * factor);
    const reachSocial = Math.round((DIARIO_METRICS.INSTAGRAM_REACH_MONTHLY + DIARIO_METRICS.FACEBOOK_REACH_MONTHLY) * factor);
    const reachVideo = Math.round(reachSocial * 0.4); // 40% do social focado em vídeo (Drops/Reportagens)

    const totalReach = reachImpresso + reachDigital + reachSocial;
    const costPerView = totalReach > 0 ? investment / totalReach : 0;
    const engagementRate = 6.8; // Média estimada (%)

    return {
      investment,
      totalReach,
      costPerView,
      engagementRate,
      goalsVsActual: [
        { channel: 'Impresso', goal: reachImpresso * 0.9, actual: reachImpresso },
        { channel: 'Digital', goal: reachDigital * 0.85, actual: reachDigital },
        { channel: 'Social', goal: reachSocial * 1.1, actual: reachSocial },
        { channel: 'Vídeo', goal: reachVideo * 0.8, actual: reachVideo }
      ]
    };
  },

  /**
   * Divide o investimento pelo alcance para gerar o CPV
   */
  calculateCPV: (investment: number, reach: number): number => {
    return reach > 0 ? investment / reach : 0;
  }
};
