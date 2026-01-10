import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Plus, Folder, Check, X, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WorkspaceManager: React.FC = () => {
  const { workspaces, currentWorkspaceId, createWorkspace, switchWorkspace, loadWorkspaces } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    setIsCreating(true);
    try {
      await createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao criar workspace:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-2"
        title="Gerenciar Ambientes"
      >
        <Folder className="w-4 h-4" />
        <span className="hidden md:inline">Ambientes</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-300 rounded-md shadow-lg z-50 w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Gerenciar Ambientes</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Lista de Workspaces */}
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto custom-scrollbar">
                {workspaces.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">Nenhum ambiente criado</p>
                ) : (
                  workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
                        currentWorkspaceId === workspace.id
                          ? 'bg-purple-50 border-purple-300'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Folder className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-900">{workspace.name}</span>
                        {currentWorkspaceId === workspace.id && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      {currentWorkspaceId !== workspace.id && (
                        <button
                          onClick={() => switchWorkspace(workspace.id)}
                          className="px-3 py-1 text-xs font-semibold text-purple-600 hover:bg-purple-100 rounded transition-colors"
                        >
                          Carregar
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Criar Novo Workspace */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkspace()}
                    placeholder="Nome do novo ambiente"
                    className="flex-1 input"
                  />
                  <button
                    onClick={handleCreateWorkspace}
                    disabled={isCreating || !newWorkspaceName.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Criar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
