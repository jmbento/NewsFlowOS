/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validar variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não configuradas!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'NÃO DEFINIDA');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'DEFINIDA' : 'NÃO DEFINIDA');
  console.error('💡 Configure as variáveis no Vercel: Settings → Environment Variables');
}

// Criar cliente mesmo sem variáveis para evitar crash (modo offline)
// Em produção, as variáveis devem estar configuradas no Vercel
let supabaseClient;
try {
  supabaseClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
  );
} catch (error) {
  console.error('❌ Erro ao criar cliente Supabase:', error);
  // Criar um cliente dummy para evitar crash
  supabaseClient = createClient(
    'https://placeholder.supabase.co',
    'placeholder-key'
  );
}

export const supabase = supabaseClient;

export const checkConnection = async (): Promise<{ online: boolean; latency: number }> => {
  const start = performance.now();
  try {
    const { error } = await supabase.from('nodes').select('id').limit(1);
    const end = performance.now();
    return { online: !error, latency: Math.round(end - start) };
  } catch (err) {
    return { online: false, latency: 0 };
  }
};
