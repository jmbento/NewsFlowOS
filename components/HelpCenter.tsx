import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Workflow, Columns, MousePointer2, GitBranch, Save, Undo2, Redo2, Package } from 'lucide-react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const tips = [
    {
      category: 'Canvas',
      icon: Workflow,
      items: [
        { title: 'Criar Node', description: 'Clique com o botão direito no canvas para abrir o menu de criação' },
        { title: 'Conectar Nodes', description: 'Arraste da saída de um node até a entrada de outro' },
        { title: 'Mover Nodes', description: 'Clique e arraste qualquer node para reposicioná-lo' },
        { title: 'Zoom', description: 'Use a roda do mouse ou os controles no canto inferior esquerdo' },
      ]
    },
    {
      category: 'Kanban',
      icon: Columns,
      items: [
        { title: 'Mover Cards', description: 'Arraste os cards entre as colunas para alterar o status' },
        { title: 'Filtrar', description: 'Use os filtros no topo para visualizar apenas projetos específicos' },
        { title: 'Detalhes', description: 'Clique em um card para ver informações completas do projeto' },
      ]
    },
    {
      category: 'Atalhos',
      icon: MousePointer2,
      items: [
        { title: 'Desfazer', description: 'Ctrl + Z para desfazer a última ação' },
        { title: 'Refazer', description: 'Ctrl + Shift + Z para refazer' },
        { title: 'Salvar', description: 'O sistema salva automaticamente a cada 2 segundos' },
        { title: 'Agrupar', description: 'Selecione múltiplos nodes e clique com botão direito > Agrupar' },
      ]
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-300 shadow-xl z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Central de Ajuda</h2>
                  <p className="text-xs text-slate-500">Dicas rápidas para usar o NewsFlow OS</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {tips.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <category.icon className="w-5 h-5 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{category.category}</h3>
                  </div>
                  <div className="space-y-2 pl-7">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500 text-center">
                Precisa de mais ajuda? Entre em contato com o administrador do sistema.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
