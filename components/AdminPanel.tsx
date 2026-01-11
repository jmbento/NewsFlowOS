import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, XCircle, Clock, Shield, Mail, Briefcase, Building2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface PendingUser {
  id: string;
  email: string;
  name?: string;
  cargo?: string;
  setor?: string;
  created_at: string;
}

export const AdminPanel: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      // Buscar usuários que ainda não foram aprovados
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approved: true })
        .eq('id', userId);

      if (error) throw error;
      await loadPendingUsers();
    } catch (error: any) {
      alert('Erro ao aprovar usuário: ' + error.message);
    }
  };

  const rejectUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja rejeitar este usuário?')) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      await loadPendingUsers();
    } catch (error: any) {
      alert('Erro ao rejeitar usuário: ' + error.message);
    }
  };

  return (
    <div className="h-full bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Painel Administrativo</h1>
              <p className="text-sm text-slate-600">Gerencie usuários e permissões do sistema</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-slate-900">{pendingUsers.length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Aprovados</p>
                <p className="text-3xl font-bold text-slate-900">-</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-slate-900">-</p>
              </div>
              <Users className="w-8 h-8 text-slate-700" />
            </div>
          </div>
        </div>

        {/* Pending Users List */}
        <div className="bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Usuários Pendentes de Aprovação</h2>
            <p className="text-sm text-slate-600 mt-1">Revise e aprove novos cadastros</p>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-600 mt-4">Carregando usuários...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-sm text-slate-600">Nenhum usuário pendente no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pendingUsers.map((user) => (
                <motion.div
                  key={user?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{user?.name || 'Sem nome'}</h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              <span>{user?.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-15">
                        {user?.cargo && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Briefcase className="w-4 h-4" />
                            <span>{user?.cargo}</span>
                          </div>
                        )}
                        {user?.setor && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Building2 className="w-4 h-4" />
                            <span>{user?.setor}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 ml-15">
                        Cadastrado em {new Date(user?.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveUser(user?.id)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => rejectUser(user?.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
