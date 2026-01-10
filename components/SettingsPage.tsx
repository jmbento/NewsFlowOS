import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Building2, Mail, LogOut, Save, Camera } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useStore } from '../store';

export const SettingsPage: React.FC = () => {
  const { setUserConsent, setActiveTab } = useStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    cargo: '',
    setor: '',
    email: '',
    avatar_url: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          name: data.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          cargo: data.cargo || data.role || '',
          setor: data.setor || '',
          email: data.email || user.email || '',
          avatar_url: data.avatar_url || data.avatar || user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        });
      } else {
        // Criar perfil se não existir
        setProfile({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          cargo: user.user_metadata?.cargo || '',
          setor: user.user_metadata?.setor || '',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        });
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          cargo: profile.cargo,
          setor: profile.setor,
          email: profile.email,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        });

      if (error) throw error;
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar perfil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUserConsent(null);
      setActiveTab('home');
      window.location.reload();
    } catch (error: any) {
      alert('Erro ao fazer logout: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-600 mt-4">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-50 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Configurações
          </h1>
          <p className="text-sm text-slate-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-300 rounded-xl shadow-sm p-8"
          style={{ borderRadius: '12px' }}
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Perfil
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-300 bg-slate-100">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Foto do perfil
              </p>
              <p className="text-xs text-slate-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                Sua foto é sincronizada automaticamente do Google
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Cargo
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={profile.cargo}
                  onChange={(e) => setProfile({ ...profile, cargo: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}
                  placeholder="Ex: Editor, Designer, Repórter"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Setor
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={profile.setor}
                  onChange={(e) => setProfile({ ...profile, setor: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none bg-white"
                  style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="">Selecione um setor</option>
                  <option value="Redação">Redação</option>
                  <option value="Audiovisual">Audiovisual</option>
                  <option value="Design">Design</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Logística">Logística</option>
                  <option value="TI">TI</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                O e-mail não pode ser alterado
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="px-6 py-3 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
              style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
