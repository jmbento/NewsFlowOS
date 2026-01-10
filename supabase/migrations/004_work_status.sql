-- NewsFlow OS - Work Status Migration
-- Execute este SQL no Supabase Dashboard: SQL Editor

-- =============================================
-- TABELA: profiles (se não existir)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'USER',
    work_status TEXT DEFAULT 'AVAILABLE' CHECK (work_status IN ('AVAILABLE', 'BUSY', 'DO_NOT_DISTURB')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Se a tabela já existir, apenas adicionar a coluna work_status
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'work_status'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN work_status TEXT DEFAULT 'AVAILABLE' CHECK (work_status IN ('AVAILABLE', 'BUSY', 'DO_NOT_DISTURB'));
    END IF;
END $$;

-- Comentário na coluna
COMMENT ON COLUMN public.profiles.work_status IS 'Status de trabalho do usuário: AVAILABLE (Ligado), BUSY (Ocupado), DO_NOT_DISTURB (Não Perturbe)';

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_profiles_work_status ON public.profiles(work_status);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy para usuários verem e atualizarem seu próprio perfil
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policy para admins verem todos os perfis
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);
