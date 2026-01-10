import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { supabase } from '../services/supabase';
import { LayoutDashboard, Grid3x3, List, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

type ViewMode = 'cards' | 'list';

interface Project {
  id: string;
  name: string;
  campaign_type?: string;
  target_cities?: string[];
  total_investment?: number;
  created_at: string;
  updated_at?: string;
}

export const Home: React.FC = () => {
  const { nodes } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Buscar projetos do Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Erro ao buscar projetos:', err);
        // Fallback: usar nodes como projetos se a tabela não existir
        const fallbackProjects: Project[] = nodes
          .filter(n => n.type === 'campaign')
          .map(n => ({
            id: n.id,
            name: n.data?.label || 'Projeto sem nome',
            campaign_type: n.data?.campaignType,
            total_investment: n.data?.totalValue || 0,
            created_at: n.data?.createdAt || new Date().toISOString(),
          }));
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [nodes]);

  // Filtra os últimos 5 nodes criados (fallback)
  const recentNodes = React.useMemo(() => {
    return [...nodes]
      .sort((a, b) => {
        const aDate = new Date((a.data?.createdAt as string) || 0).getTime();
        const bDate = new Date((b.data?.createdAt as string) || 0).getTime();
        return bDate - aDate;
      })
      .slice(0, 5);
  }, [nodes]);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-slate-50 min-h-screen overflow-y-auto custom-scrollbar">
      {/* Header com Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Projetos</h1>
          <p className="text-sm text-slate-600">Gerencie seus projetos e campanhas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === 'cards'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
            title="Visualização em Cards"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md border transition-colors ${
              viewMode === 'list'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
            title="Visualização em Lista"
          >
            <List className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Lista de Projetos */}
      {loading ? (
        <div className="bg-white border border-slate-300 rounded-md p-12 text-center">
          <p className="text-sm text-slate-600">Carregando projetos...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-slate-300 rounded-md p-12 text-center">
          <LayoutDashboard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm text-slate-600 mb-2">Nenhum projeto encontrado</p>
          <p className="text-xs text-slate-500">Crie seu primeiro projeto para começar</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-300 rounded-md p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.name}</h3>
              {project.campaign_type && (
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{project.campaign_type}</p>
              )}
              {project.total_investment && (
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  R$ {project.total_investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              )}
              {project.target_cities && project.target_cities.length > 0 && (
                <p className="text-xs text-slate-600 mb-2">
                  {project.target_cities.length} {project.target_cities.length === 1 ? 'cidade' : 'cidades'}
                </p>
              )}
              <p className="text-xs text-slate-500">
                Criado em {new Date(project.created_at).toLocaleDateString('pt-BR')}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-300 rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-300">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Investimento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">Data</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{project.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 uppercase">{project.campaign_type || '-'}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                    {project.total_investment
                      ? `R$ ${project.total_investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(project.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recentes (Fallback) */}
      {recentNodes.length > 0 && (
        <section className="bg-white border border-slate-300 rounded-md p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 uppercase tracking-wide">Recentes</h2>
          <ul className="space-y-2">
            {recentNodes.map((node) => (
              <li
                key={node.id}
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-md hover:border-slate-300 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-sm font-medium text-slate-800">{node.data?.label || 'Node sem título'}</span>
                <span className="text-xs text-slate-500">{node.type}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
