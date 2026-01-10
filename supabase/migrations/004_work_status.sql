-- NewsFlow OS - Work Status Migration
-- Execute este SQL no Supabase Dashboard: SQL Editor

-- Adicionar coluna work_status na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS work_status TEXT DEFAULT 'AVAILABLE' CHECK (work_status IN ('AVAILABLE', 'BUSY', 'DO_NOT_DISTURB'));

-- Comentário na coluna
COMMENT ON COLUMN public.profiles.work_status IS 'Status de trabalho do usuário: AVAILABLE (Ligado), BUSY (Ocupado), DO_NOT_DISTURB (Não Perturbe)';

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_profiles_work_status ON public.profiles(work_status);
