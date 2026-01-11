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
        await updateUserProfile(data.user);
        setUserConsent('session-' + Date.now());
        setActiveTab('home');
      }
    } catch (error: any) {
      alert('Erro ao fazer login: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      alert('Erro ao fazer login com Google: ' + error.message);
    }
  };

  const updateUserProfile = async (user: any) => {
    try {
      // Capturar avatar_url do Google se disponível
      const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
      const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0];
      
      if (avatarUrl || name) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user?.id,
            email: user?.email,
            name: name,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id',
          });
        
        if (error) console.error('Erro ao atualizar perfil:', error);
      }
    } catch (error) {
      console.error('Erro ao processar perfil:', error);
    }
  };

  // Verificar se há callback do Google OAuth
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await updateUserProfile(session.user);
        setUserConsent('session-' + Date.now());
        setActiveTab('home');
      }
    };
    checkAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await updateUserProfile(session.user);
        setUserConsent('session-' + Date.now());
        setActiveTab('home');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
                onClick={handleGoogleLogin}
                className="w-full px-6 py-3 bg-white border-2 border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                style={{
                  borderRadius: '12px',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">ou</span>
                </div>
              </div>
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
