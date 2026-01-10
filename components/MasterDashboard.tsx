import React, { useMemo, useEffect, useState } from 'react';
import { useStore } from '../store';
import { Feedback } from '../types';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  Activity,
  Zap,
  BarChart3,
  Calendar,
  MessageSquare,
  Bug,
  Lightbulb,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

type DashboardTab = 'metrics' | 'feedback';

const MasterDashboard: React.FC = () => {
  const { nodes, team, feedbacks } = useStore();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('metrics');

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalNodes = nodes.length;
    const doneNodes = nodes.filter((n) => n.data.status === 'done').length;
    const doingNodes = nodes.filter((n) => n.data.status === 'doing').length;
    const todoNodes = nodes.filter((n) => n.data.status === 'todo').length;
    const conflictNodes = nodes.filter((n) => n.data.status === 'RESOURCE_CONFLICT').length;

    // Eficiência de Tropa
    const activeMembers = team.filter((m) => m.availability_status === 'ACTIVE').length;
    const totalMembers = team.length;
    const efficiency = totalMembers > 0 ? (activeMembers / totalMembers) * 100 : 0;

    // Gargalos de Tempo
    const overdueNodes = nodes.filter((node) => {
      if (!node.data.deadline) return false;
      return new Date(node.data.deadline) < new Date() && node.data.status !== 'done';
    });

    // Tempo total registrado
    const totalTime = nodes.reduce((acc, node) => {
      const tracking = node.data.timeTracking;
      return acc + (tracking?.elapsed || 0);
    }, 0);

    // Média de tempo por tarefa
    const avgTimePerTask = doneNodes > 0 ? totalTime / doneNodes : 0;

    return {
      totalNodes,
      doneNodes,
      doingNodes,
      todoNodes,
      conflictNodes,
      efficiency,
      overdueNodes: overdueNodes.length,
      totalTime,
      avgTimePerTask,
      completionRate: totalNodes > 0 ? (doneNodes / totalNodes) * 100 : 0,
    };
  }, [nodes, team]);

  // Detectar alertas
  useEffect(() => {
    const newAlerts: any[] = [];

    // Alertas de deadline
    nodes.forEach((node) => {
      if (node.data.deadline) {
        const deadline = new Date(node.data.deadline);
        const now = new Date();
        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilDeadline < 0 && node.data.status !== 'done') {
          newAlerts.push({
            id: `deadline-${node.id}`,
            type: 'deadline',
            severity: 'high',
            message: `⚠️ Atraso: ${node.data.label} está atrasado há ${Math.abs(daysUntilDeadline)} dias`,
            nodeId: node.id,
          });
        } else if (daysUntilDeadline <= 1 && node.data.status !== 'done') {
          newAlerts.push({
            id: `deadline-${node.id}`,
            type: 'deadline',
            severity: 'medium',
            message: `⏰ Prazo próximo: ${node.data.label} vence em ${daysUntilDeadline} dia(s)`,
            nodeId: node.id,
          });
        }
      }
    });

    // Alertas de dependência
    nodes.forEach((node) => {
      if (node.data.status === 'RESOURCE_CONFLICT') {
        newAlerts.push({
          id: `conflict-${node.id}`,
          type: 'dependency',
          severity: 'high',
          message: `🔗 Conflito: ${node.data.label} está bloqueado por dependência`,
          nodeId: node.id,
        });
      }
    });

    setAlerts(newAlerts);
  }, [nodes]);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const categoryConfig = {
    BUG: { label: 'Bug', icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    FEATURE: { label: 'Sugestão', icon: Lightbulb, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    PRAISE: { label: 'Elogio', icon: Heart, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  };

  return (
    <div className="w-full h-full bg-slate-50 p-6 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Dashboard Master</h1>
        <p className="text-sm text-slate-600">Monitoramento em tempo real da equipe e projetos</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
            activeTab === 'metrics'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Métricas
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${
            activeTab === 'feedback'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Feedback da Equipe ({feedbacks.length})
        </button>
      </div>

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-300 rounded-md p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-600 uppercase tracking-wider">Eficiência de Tropa</p>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{metrics.efficiency.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {team.filter((m) => m.availability_status === 'ACTIVE').length} de {team.length} ativos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-300 rounded-md p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-600 uppercase tracking-wider">Taxa de Conclusão</p>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{metrics.completionRate.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {metrics.doneNodes} de {metrics.totalNodes} concluídos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-300 rounded-md p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-600 uppercase tracking-wider">Gargalos</p>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{metrics.overdueNodes}</p>
          <p className="text-xs text-slate-500 mt-1">Tarefas atrasadas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-300 rounded-md p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-600 uppercase tracking-wider">Tempo Médio</p>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-semibold text-slate-900">{formatTime(metrics.avgTimePerTask)}</p>
          <p className="text-xs text-slate-500 mt-1">Por tarefa concluída</p>
        </motion.div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-slate-300 rounded-md p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Distribuição de Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="text-sm text-slate-600">A Fazer</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{metrics.todoNodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-600">Em Execução</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{metrics.doingNodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-600">Concluído</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{metrics.doneNodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-slate-600">Conflito</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{metrics.conflictNodes}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-md p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Atividade em Tempo Real</h3>
          <div className="space-y-3">
            {nodes
              .filter((n) => n.data.status === 'doing')
              .slice(0, 5)
              .map((node) => {
                const tracking = node.data.timeTracking;
                const isRunning = tracking?.isRunning || false;
                return (
                  <div key={node.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                      <span className="text-sm text-slate-600 truncate">{node.data.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {node.data.assignee || node.data.assignedTo || 'Sem responsável'}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white border border-slate-300 rounded-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Alertas do Sistema</h3>
          <span className="text-xs text-slate-500">{alerts.length} alertas</span>
        </div>
        <div className="space-y-2">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-md border ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Nenhum alerta no momento</p>
          )}
        </div>
      </>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {feedbacks.length === 0 ? (
            <div className="bg-white border border-slate-300 rounded-md p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm text-slate-600">Nenhum feedback recebido ainda.</p>
            </div>
          ) : (
            feedbacks.map((feedback) => {
              const config = categoryConfig[feedback.category];
              const CategoryIcon = config.icon;
              return (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-300 rounded-md p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md ${config.color}`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{config.label}</span>
                          {feedback.status === 'PENDING' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              Pendente
                            </span>
                          )}
                          {feedback.status === 'REVIEWED' && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              Revisado
                            </span>
                          )}
                          {feedback.status === 'RESOLVED' && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                              Resolvido
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Por {feedback.submittedBy} • {new Date(feedback.submittedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">{feedback.message}</p>
                  {feedback.attachment && (
                    <div className="mt-3">
                      <img
                        src={feedback.attachment}
                        alt={feedback.attachmentName || 'Anexo'}
                        className="max-w-full h-48 object-contain rounded-md border border-slate-200"
                      />
                      {feedback.attachmentName && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {feedback.attachmentName}
                        </p>
                      )}
                    </div>
                  )}
                  {feedback.adminResponse && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                      <p className="text-xs font-semibold text-slate-700 mb-1">Resposta do Admin:</p>
                      <p className="text-sm text-slate-600">{feedback.adminResponse}</p>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default MasterDashboard;
