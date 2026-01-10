
import { AppNode } from '../types';

export interface ClippingItem {
  id: string;
  label: string;
  link?: string;
  status: string;
  isExtra: boolean;
  type: string;
}

export interface ClippingReport {
  projectName: string;
  soldCount: number;
  deliveredCount: number;
  extrasCount: number;
  items: ClippingItem[];
  timestamp: string;
}

export const ClippingEngine = {
  /**
   * Gera um relatório de clipping baseado no estado atual dos nós.
   */
  generateReport: (nodes: AppNode[], projectName: string): ClippingReport => {
    const items: ClippingItem[] = nodes
      .filter(n => n.type !== 'campaign') // Ignora o nó de trigger
      .map(n => ({
        id: n.id,
        label: n.data.label,
        link: n.data.imageUrl || n.data.postContent || undefined, // Simulação de link
        status: n.data.status,
        isExtra: n.data.status === 'ORDER_EXTRA',
        type: n.type
      }));

    const soldItems = items.filter(i => !i.isExtra);
    const extras = items.filter(i => i.isExtra);
    const delivered = items.filter(i => i.status === 'done');

    return {
      projectName,
      soldCount: soldItems.length,
      deliveredCount: delivered.length,
      extrasCount: extras.length,
      items,
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Simula a exportação para PDF (Log console por enquanto)
   */
  exportToPDF: (report: ClippingReport) => {
    console.log(`📄 [CLIPPING_PDF]: Generating report for ${report.projectName}...`);
    console.table({
      'Projeto': report.projectName,
      'Itens em Escopo': report.soldCount,
      'Peças Extras': report.extrasCount,
      'Entregues': report.deliveredCount,
      'ROI Estimado': '150%' // Simulação
    });
    return true;
  }
};
