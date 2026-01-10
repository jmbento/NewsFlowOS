/**
 * LOGISTICS ENGINE - NEWSFLOW OS (v14.0)
 * Inteligência de Campo, Custos e Clima Integrada ao Supabase.
 */

import { supabase } from './supabase';

export interface LogisticsEstimation {
  distanceKm: number;
  estimatedFuelCost: number;
  teamDailyCost: number;
  totalLogisticsCost: number;
  weatherRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  weatherAlert?: string;
}

const CITY_DISTANCES: Record<string, number> = {
  'VOLTA_REDONDA': 0,
  'BARRA_MANSA': 12,
  'RESENDE': 48,
  'ITATIAIA': 62,
  'QUATIS': 52,
  'PORTO_REAL': 38,
  'PINHEIRAL': 22,
  'BARRA_DO_PIRAI': 42,
  'RIO_DAS_FLORES': 85,
  'VALENCA': 65,
  'VASSOURAS': 75,
  'MENDES': 70,
  'ENGENHEIRO_PAULO_DE_FRONTIN': 78,
  'PARACAMBI': 82,
  'MIGUEL_PEREIRA': 95,
  'PATY_DO_ALFERES': 102,
  'PARAIBA_DO_SUL': 105,
  'TRES_RIOS': 112,
  'COMENDADOR_LEVY_GASPARIAN': 128,
  'SAPUCAIA': 142
};

const FUEL_PRICE_PER_LITER = 6.20;
const AVG_KM_PER_LITER = 11;
const DAILY_RATE_PER_PERSON = 150.00;

export const PROFESSIONALS = [
  { id: 'p1', name: 'Alexandre (Capt)', role: 'CAPTURE' },
  { id: 'p2', name: 'Beatriz (Capt)', role: 'CAPTURE' },
  { id: 'p3', name: 'Carlos (Capt)', role: 'CAPTURE' },
  { id: 'p4', name: 'Daniele (Capt)', role: 'CAPTURE' },
  { id: 'p5', name: 'Eduardo (Capt)', role: 'CAPTURE' },
  { id: 'p6', name: 'Fernanda (Edit)', role: 'EDITOR' },
  { id: 'p7', name: 'Gabriel (Edit)', role: 'EDITOR' },
  { id: 'p8', name: 'Helena (Edit)', role: 'EDITOR' }
];

export const LogisticsEngine = {
  /**
   * Calcula a estimativa logística completa para um Job.
   */
  estimateJobLogistics: (city: string, teamSize: number = 2): LogisticsEstimation => {
    const cityName = city.toUpperCase().replace(/\s/g, '_');
    const distance = CITY_DISTANCES[cityName] || 50; 
    const totalKm = distance * 2; // Ida e Volta
    
    const fuelCost = (totalKm / AVG_KM_PER_LITER) * FUEL_PRICE_PER_LITER;
    const teamCost = teamSize * DAILY_RATE_PER_PERSON;
    
    return {
      distanceKm: totalKm,
      estimatedFuelCost: fuelCost,
      teamDailyCost: teamCost,
      totalLogisticsCost: fuelCost + teamCost,
      weatherRisk: 'LOW'
    };
  },

  /**
   * Verifica disponibilidade de ativos (Frota e Equipamentos)
   * Implementa a Trava de Conflito via Supabase.
   */
  checkAssetAvailability: async (assetId: string, startTime: string, endTime: string): Promise<boolean> => {
    // Se for captação externa, Kit de Áudio é crítico
    const criticalAssets = assetId === 'KIT_CAMERA_A' || assetId === 'KIT_CAMERA_B' 
      ? [assetId, 'KIT_AUDIO_EXTERNO'] 
      : [assetId];

    const { data, error } = await supabase
      .from('nodes')
      .select('id, data')
      .filter('data->resourceAllocation->>status', 'neq', 'done');

    if (error || !data) return true;

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const conflict = data.find(node => {
      const alloc = node.data.resourceAllocation;
      if (!alloc) return false;
      
      const isCriticalConflict = criticalAssets.includes(alloc.resourceId);
      if (!isCriticalConflict) return false;

      const nStart = new Date(alloc.startTime).getTime();
      const nEnd = new Date(alloc.endTime).getTime();

      return (start >= nStart && start < nEnd) || (end > nStart && end <= nEnd);
    });

    return !conflict;
  },

  /**
   * Orquestrador de Equipes (Squads)
   * CAPTAÇÃO: 3 profissionais | EDIÇÃO: 2 profissionais
   */
  checkSquadAvailability: async (role: 'CAPTURE' | 'EDITOR', count: number, startTime: string, endTime: string): Promise<{ available: boolean, assignedIds: string[] }> => {
    const { data: activeJobs } = await supabase
      .from('nodes')
      .select('data')
      .filter('data->resourceAllocation->>professionalIds', 'not.is', null);

    const busyIds = new Set<string>();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    activeJobs?.forEach(job => {
      const alloc = job.data.resourceAllocation;
      const nStart = new Date(alloc.startTime).getTime();
      const nEnd = new Date(alloc.endTime).getTime();

      const overlaps = (start >= nStart && start < nEnd) || (end > nStart && end <= nEnd);
      if (overlaps && alloc.professionalIds) {
        alloc.professionalIds.forEach((id: string) => busyIds.add(id));
      }
    });

    const eligible = PROFESSIONALS.filter(p => p.role === role && !busyIds.has(p.id));
    
    if (eligible.length >= count) {
      return { available: true, assignedIds: eligible.slice(0, count).map(p => p.id) };
    }

    return { available: false, assignedIds: [] };
  },

  /**
   * Integração Clima: Decisão GO/NO-GO
   */
  getWeatherRisk: async (city: string): Promise<{ risk: 'LOW' | 'MEDIUM' | 'HIGH', alert: string, decision: 'GO' | 'NO-GO' }> => {
    const mockRisks: Record<string, any> = {
      'RESENDE': { risk: 'HIGH', alert: 'Tempestade prevista para tarde. Risco de raios.', decision: 'NO-GO' },
      'ANGRA_DOS_REIS': { risk: 'MEDIUM', alert: 'Ventania moderada. Atenção para uso de Drone.', decision: 'GO' },
      'VOLTA_REDONDA': { risk: 'LOW', alert: 'Céu limpo. Condições ideais.', decision: 'GO' }
    };

    const info = mockRisks[city.toUpperCase()] || { risk: 'LOW', alert: 'Sem alertas meteorológicos críticos.', decision: 'GO' };
    return info;
  }
};
