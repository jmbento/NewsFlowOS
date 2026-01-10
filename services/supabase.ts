/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase não configuradas. Usando modo offline.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
