import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, ArrowRight, Mail, Lock, User, Briefcase, Building2, Camera } from 'lucide-react';
import { useStore } from '../store';
import { supabase } from '../services/supabase';

export const LoginLanding: React.FC = () => {
  const { setUserConsent, setActiveTab } = useStore();
  const [mode, setMode] = useState<'landing' | 'login' | 'register'>('landing');
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    cargo: '',
    setor: '',
    foto: null as File | null,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      if (data.user) {
        setUserConsent('session-' + Date.now());
        setActiveTab('home');
      }
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerStep === 1) {
      setRegisterStep(2);
      return;
    }
    if (registerStep === 2) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: registerData.email,
          password: registerData.password,
          options: {
            data: {
              name: registerData.name,
              cargo: registerData.cargo,
              setor: registerData.setor,
            }
          }
        });
        if (error) throw error;
        setRegisterStep(3);
      } catch (error: any) {
        alert('Erro ao cadastrar: ' + error.message);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRegisterData({ ...registerData, foto: file });
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #F8FAFC, #FFFFFF)', fontFamily: 'Inter, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-300 p-8"
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo_diario.png" className="h-12 object-contain" alt="Diário do Vale" />
        </div>

        {/* Landing Mode */}
        {mode === 'landing' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-black" style={{ color: '#0F172A', fontFamily: 'Inter, sans-serif' }}>Bem-vindo ao NewsFlow OS</h1>
                <p className="text-sm" style={{ color: '#64748B', fontFamily: 'Inter, sans-serif' }}>O novo pulso do Diário do Vale</p>
              </div>
            <div className="space-y-3">
              <button
                onClick={() => setMode('login')}
                className="w-full px-6 py-3 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <LogIn className="w-5 h-5" />
                Sou Cadastrado
              </button>
              <button
                onClick={() => setMode('register')}
                className="w-full px-6 py-3 bg-white border-2 border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                style={{
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <UserPlus className="w-5 h-5" />
                Novo por aqui?
              </button>
            </div>
          </div>
        )}

        {/* Login Mode */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Entrar</h2>
              <p className="text-sm text-slate-600">Acesse sua conta</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif' }}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('landing')}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
                style={{ borderRadius: '12px', fontFamily: 'Inter, sans-serif', color: '#64748B' }}
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Entrar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Register Mode - Step 1: Dados Básicos */}
        {mode === 'register' && registerStep === 1 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Cadastro</h2>
              <p className="text-sm text-slate-600">Preencha seus dados básicos</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode('landing')}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Register Mode - Step 2: Cargo e Setor */}
        {mode === 'register' && registerStep === 2 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Informações Profissionais</h2>
              <p className="text-sm text-slate-600">Complete seu perfil</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cargo</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={registerData.cargo}
                    onChange={(e) => setRegisterData({ ...registerData, cargo: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                    placeholder="Ex: Editor, Designer, Repórter"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Setor</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={registerData.setor}
                    onChange={(e) => setRegisterData({ ...registerData, setor: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent appearance-none bg-white"
                    required
                  >
                    <option value="">Selecione um setor</option>
                    <option value="Redação">Redação</option>
                    <option value="Audiovisual">Audiovisual</option>
                    <option value="Design">Design</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Logística">Logística</option>
                    <option value="TI">TI</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Foto (Opcional)</label>
                <div className="relative">
                  <label className="flex items-center gap-3 p-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <Camera className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {registerData.foto ? registerData.foto.name : 'Clique para adicionar foto'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRegisterStep(1)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Finalizar Cadastro <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Register Mode - Step 3: Boas-vindas */}
        {mode === 'register' && registerStep === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <UserPlus className="w-10 h-10 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Bem-vindo ao NewsFlow OS!</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seu cadastro foi realizado com sucesso. Aguarde a aprovação do administrador para acessar o sistema.
              </p>
            </div>
            <button
              onClick={() => {
                setMode('landing');
                setRegisterStep(1);
              }}
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-sm"
            >
              Voltar ao Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
