-- NewsFlow OS - Profiles Approval Migration
-- Execute este SQL no Supabase Dashboard: SQL Editor

-- 1. Adicionar coluna approved se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'approved'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN approved BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. Adicionar colunas cargo e setor se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'cargo'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN cargo TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'setor'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN setor TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'name'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN name TEXT;
    END IF;
END $$;

-- 2. Habilitar Realtime para a tabela profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- 3. Adicionar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy para usuários verem seu próprio perfil
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy para usuários atualizarem seu próprio perfil
CREATE POLICY "Users can update their own profile"
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

-- Policy para admins atualizarem perfis
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'ADMIN'
    )
);

-- 4. Criar função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, cargo, setor, approved)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'cargo', ''),
        COALESCE(NEW.raw_user_meta_data->>'setor', ''),
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. Criar índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON public.profiles(approved);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
