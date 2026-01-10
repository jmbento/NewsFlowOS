import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { NodeData } from '../types';
import {
  Play,
  Square,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  MessageSquare,
  Lightbulb,
  Bell,
  TrendingUp,
  Timer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeEntry {
  nodeId: string;
  startTime: number;
  elapsed: number; // em segundos
  isRunning: boolean;
}

const MyWork: React.FC = () => {
  const { nodes, updateNodeData, team } = useStore();
  const [currentUser, setCurrentUser] = useState<string>('Marco'); // TODO: Pegar do contexto de autenticação
  const [timeEntries, setTimeEntries] = useState<Record<string, TimeEntry>>({});
  const [showAttentionModal, setShowAttentionModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  // Filtrar nodes do usuário atual
  const myNodes = useMemo(() => {
    return nodes.filter(
      (node) =>
        node.data.assignee === currentUser ||
        node.data.assignedTo === currentUser ||
        node.data.assignee?.includes(currentUser)
    );
  }, [nodes, currentUser]);

  // Inicializar time entries
  useEffect(() => {
    const entries: Record<string, TimeEntry> = {};
    myNodes.forEach((node) => {
      const existing = node.data.timeTracking as any;
      entries[node.id] = {
        nodeId: node.id,
        startTime: existing?.startTime || 0,
        elapsed: existing?.elapsed || 0,
        isRunning: existing?.isRunning || false,
      };
    });
    setTimeEntries(entries);
  }, [myNodes]);

  // Timer para atualizar tempo decorrido
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeEntries((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((nodeId) => {
          if (updated[nodeId].isRunning) {
            updated[nodeId].elapsed = Math.floor(
              (Date.now() - updated[nodeId].startTime) / 1000
            );
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleTimer = (nodeId: string) => {
    const entry = timeEntries[nodeId];
    const now = Date.now();

    if (entry.isRunning) {
      // Stop
      const newElapsed = entry.elapsed;
      setTimeEntries((prev) => ({
        ...prev,
        [nodeId]: {
          ...prev[nodeId],
          isRunning: false,
          elapsed: newElapsed,
        },
      }));

      updateNodeData(nodeId, {
        timeTracking: {
          startTime: 0,
          elapsed: newElapsed,
          isRunning: false,
          lastUpdate: new Date().toISOString(),
        },
      });
    } else {
      // Start
      setTimeEntries((prev) => ({
        ...prev,
        [nodeId]: {
          ...prev[nodeId],
          startTime: now - prev[nodeId].elapsed * 1000,
          isRunning: true,
        },
      }));

      updateNodeData(nodeId, {
        timeTracking: {
          startTime: now - entry.elapsed * 1000,
          elapsed: entry.elapsed,
          isRunning: true,
          lastUpdate: new Date().toISOString(),
        },
      });
    }
  };

  const handleStatusChange = (nodeId: string, newStatus: NodeData['status']) => {
    updateNodeData(nodeId, { status: newStatus });
    // Notificar admin em tempo real (via Supabase realtime)
  };

  const handleRequestAttention = async () => {
    setShowAttentionModal(false);
    const { WhatsAppAlerts } = await import('../services/whatsapp_alerts');
    await WhatsAppAlerts.sendAttentionRequest(currentUser);
  };

  const handleSuggestPauta = async (suggestion: string) => {
    setShowSuggestionModal(false);
    const { WhatsAppAlerts } = await import('../services/whatsapp_alerts');
    await WhatsAppAlerts.sendPautaSuggestion(currentUser, suggestion);
  };

  const statusConfig = {
    todo: { label: 'A Fazer', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: AlertCircle },
    doing: { label: 'Em Execução', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
    done: { label: 'Concluído', color: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  };

  return (
    <div className="w-full h-full bg-slate-50 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Meu Trabalho</h1>
            <p className="text-sm text-slate-600 mt-1">Gerencie suas tarefas e registre seu tempo</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAttentionModal(true)}
              className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-semibold hover:bg-amber-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <Bell className="w-4 h-4" />
              Pedir Atenção
            </button>
            <button
              onClick={() => setShowSuggestionModal(true)}
              className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm font-semibold hover:bg-purple-600 transition-all flex items-center gap-2 shadow-sm"
            >
              <Lightbulb className="w-4 h-4" />
              Sugestão de Pauta
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-slate-300 rounded-md p-4">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Total de Tarefas</p>
            <p className="text-2xl font-semibold text-slate-900">{myNodes.length}</p>
          </div>
          <div className="bg-white border border-slate-300 rounded-md p-4">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Em Execução</p>
            <p className="text-2xl font-semibold text-amber-600">
              {myNodes.filter((n) => n.data.status === 'doing').length}
            </p>
          </div>
          <div className="bg-white border border-slate-300 rounded-md p-4">
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Horas Hoje</p>
            <p className="text-2xl font-semibold text-slate-900">
              {formatTime(
                Object.values(timeEntries).reduce((acc, entry) => acc + entry.elapsed, 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence>
          {myNodes.map((node) => {
            const entry = timeEntries[node.id] || { nodeId: node.id, startTime: 0, elapsed: 0, isRunning: false };
            const status = statusConfig[node.data.status] || statusConfig.todo;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-300 rounded-md p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-slate-900">{node.data.label}</h3>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 ${status.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>

                    {node.data.description && (
                      <p className="text-sm text-slate-600 mb-3">{node.data.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {node.data.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Prazo: {new Date(node.data.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5" />
                        <span>Tempo: {formatTime(entry.elapsed)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Time Tracker */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTimer(node.id)}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${
                          entry.isRunning
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        } shadow-sm`}
                      >
                        {entry.isRunning ? (
                          <>
                            <Square className="w-4 h-4" />
                            Parar
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Iniciar
                          </>
                        )}
                      </button>
                      {entry.isRunning && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>

                    {/* Status Selector */}
                    <select
                      value={node.data.status}
                      onChange={(e) => handleStatusChange(node.id, e.target.value as NodeData['status'])}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none"
                    >
                      <option value="todo">A Fazer</option>
                      <option value="doing">Em Execução</option>
                      <option value="done">Concluído</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAttentionModal && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setShowAttentionModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white border border-slate-300 rounded-md shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Pedir Atenção</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Uma notificação será enviada para a administração solicitando atenção.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAttentionModal(false)}
                    className="flex-1 px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRequestAttention}
                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-semibold hover:bg-amber-600 transition-all"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {showSuggestionModal && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setShowSuggestionModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white border border-slate-300 rounded-md shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Sugestão de Pauta</h3>
                <textarea
                  placeholder="Descreva sua sugestão de pauta..."
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none resize-none h-32 mb-4 placeholder:text-slate-400"
                  id="suggestion-input"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSuggestionModal(false)}
                    className="flex-1 px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const input = document.getElementById('suggestion-input') as HTMLTextAreaElement;
                      handleSuggestPauta(input.value);
                    }}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md text-sm font-semibold hover:bg-purple-600 transition-all"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyWork;
