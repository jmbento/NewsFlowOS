-- NewsFlow OS - Organograma Migration
-- Execute este SQL no Supabase Dashboard: SQL Editor

-- 1. Criar tabela organograma_nodes
CREATE TABLE IF NOT EXISTS public.organograma_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, node_id)
);

-- 2. Criar tabela organograma_edges
CREATE TABLE IF NOT EXISTS public.organograma_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    edge_id TEXT NOT NULL,
    source TEXT NOT NULL,
    target TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, edge_id)
);

-- 3. Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.organograma_nodes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.organograma_edges;

-- 4. Adicionar RLS
ALTER TABLE public.organograma_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organograma_edges ENABLE ROW LEVEL SECURITY;

-- Policy para usuários gerenciarem seus próprios organogramas
CREATE POLICY "Users can manage their own organograma nodes"
ON public.organograma_nodes FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own organograma edges"
ON public.organograma_edges FOR ALL
USING (auth.uid() = user_id);

-- 5. Criar índices
CREATE INDEX IF NOT EXISTS idx_organograma_nodes_user_id ON public.organograma_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_organograma_edges_user_id ON public.organograma_edges(user_id);

-- 6. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_organograma_nodes_updated_at
    BEFORE UPDATE ON public.organograma_nodes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organograma_edges_updated_at
    BEFORE UPDATE ON public.organograma_edges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
