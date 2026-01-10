-- NewsFlow OS - Workspaces Migration
-- Execute este SQL no Supabase Dashboard: SQL Editor

-- =============================================
-- TABELA: workspaces
-- =============================================
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    layout_json JSONB NOT NULL DEFAULT '{"nodes": [], "edges": []}',
    user_id TEXT, -- Pode ser UUID ou string identificando o usuário
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON public.workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_updated_at ON public.workspaces(updated_at DESC);

-- Habilitar RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Policy para permitir que usuários vejam seus próprios workspaces
CREATE POLICY "Users can view their own workspaces"
ON public.workspaces FOR SELECT
USING (true); -- Por enquanto permissivo, ajustar depois com auth.uid()

-- Policy para permitir que usuários criem workspaces
CREATE POLICY "Users can insert workspaces"
ON public.workspaces FOR INSERT
WITH CHECK (true);

-- Policy para permitir que usuários atualizem seus próprios workspaces
CREATE POLICY "Users can update their own workspaces"
ON public.workspaces FOR UPDATE
USING (true)
WITH CHECK (true);

-- Policy para permitir que usuários deletem seus próprios workspaces
CREATE POLICY "Users can delete their own workspaces"
ON public.workspaces FOR DELETE
USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_workspaces_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_workspaces_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.workspaces IS 'Ambientes/Workspaces do NewsFlow OS - Cada workspace contém um layout completo de nodes e edges';
COMMENT ON COLUMN public.workspaces.layout_json IS 'JSON contendo nodes e edges do workspace: {"nodes": [...], "edges": [...]}';
COMMENT ON COLUMN public.workspaces.user_id IS 'Identificador do usuário (pode ser UUID do auth.users ou string customizada)';
COMMENT ON COLUMN public.workspaces.is_default IS 'Indica se este é o workspace padrão do usuário';
