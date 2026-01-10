import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Workflow, GitBranch, Clock, Keyboard, Link2 } from 'lucide-react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const tips = [
    {
      category: 'Canvas - Conexões',
      icon: Workflow,
      items: [
        { title: 'Criar Node', description: 'Clique com o botão direito no canvas para abrir o menu de criação' },
        { title: 'Conectar Nodes', description: 'Arraste da saída de um node (handle circular) até a entrada de outro para criar conexões' },
        { title: 'Mover Nodes', description: 'Clique e arraste qualquer node para reposicioná-lo no canvas' },
        { title: 'Desconectar Node', description: 'Clique com botão direito no node e selecione "Desconectar Node" para remover conexões' },
        { title: 'Zoom e Navegação', description: 'Use a roda do mouse para zoom ou os controles no canto inferior esquerdo' },
      ]
    },
    {
      category: 'Herança de Nomes',
      icon: GitBranch,
      items: [
        { title: 'Como Funciona', description: 'Nodes filhos herdam automaticamente o nome da Campanha ou OS raiz' },
        { title: 'Formato', description: 'O label aparece como "[NOME DA CAMPANHA] - Subtarefa"' },
        { title: 'Sem Vínculo', description: 'Se um node for desconectado, o campo de herança fica vazio (Placeholder: "Sem vínculo")' },
        { title: 'Identificação', description: 'A herança ajuda a rastrear a origem de cada tarefa no workflow' },
      ]
    },
    {
      category: 'Time Tracking',
      icon: Clock,
      items: [
        { title: 'Iniciar Trabalho', description: 'Clique no botão "Start" dentro de cada tarefa para começar a registrar tempo' },
        { title: 'Parar Trabalho', description: 'Clique em "Stop" para pausar o registro de tempo' },
        { title: 'Contador em Tempo Real', description: 'O sistema registra automaticamente o tempo trabalhado enquanto o botão está ativo' },
        { title: 'Visualização', description: 'Veja suas horas trabalhadas na página "Meu Trabalho" (My Work)' },
      ]
    },
    {
      category: 'Atalhos de Teclado',
      icon: Keyboard,
      items: [
        { title: 'Desfazer', description: 'Ctrl + Z (ou Cmd + Z no Mac) para desfazer a última ação' },
        { title: 'Refazer', description: 'Ctrl + Shift + Z (ou Cmd + Shift + Z no Mac) para refazer' },
        { title: 'Salvar Automático', description: 'O sistema salva automaticamente a cada 2 segundos (indicador no topo)' },
        { title: 'Agrupar Nodes', description: 'Selecione múltiplos nodes (Shift + Clique) e clique com botão direito > "Agrupar Selecionados"' },
        { title: 'Editar Node', description: 'Clique no ícone de lápis no node ou duplo-clique para editar' },
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
            className="fixed right-0 top-0 h-full w-full max-w-md z-[9999] flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderLeft: '1px solid #CBD5E1',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-200" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center" style={{ borderRadius: '12px' }}>
                  <HelpCircle className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>Guia Rápido NewsFlow</h2>
                  <p className="text-sm" style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>Dicas rápidas para usar o NewsFlow OS</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors"
                style={{ borderRadius: '12px' }}
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar" style={{ gap: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
              {tips.map((category, idx) => (
                <div key={idx} className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <category.icon className="w-6 h-6" style={{ color: '#0F172A' }} />
                    <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>{category.category}</h3>
                  </div>
                  <div className="space-y-3 pl-9">
                    {category.items.map((item, itemIdx) => (
                      <div 
                        key={itemIdx} 
                        className="p-4 bg-white border border-slate-200"
                        style={{ 
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                        }}
                      >
                        <h4 className="text-sm font-semibold mb-2" style={{ color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>{item.title}</h4>
                        <p className="text-sm leading-relaxed" style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-200 bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>
              <p className="text-sm text-center" style={{ color: '#64748B' }}>
                Precisa de mais ajuda? Entre em contato com o administrador do sistema.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
