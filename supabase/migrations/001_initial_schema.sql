-- NewsFlow OS - Schema Migration
-- Execute este SQL no Supabase Dashboard: SQL Editor

-- =============================================
-- TABELA: nodes
-- =============================================
CREATE TABLE IF NOT EXISTS public.nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    position_x REAL DEFAULT 0,
    position_y REAL DEFAULT 0,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: edges
-- =============================================
CREATE TABLE IF NOT EXISTS public.edges (
    id TEXT PRIMARY KEY,
    source TEXT NOT NULL REFERENCES public.nodes (id) ON DELETE CASCADE,
    target TEXT NOT NULL REFERENCES public.nodes (id) ON DELETE CASCADE,
    animated BOOLEAN DEFAULT true,
    style JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: leads (CRM)
-- =============================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    status TEXT DEFAULT 'COLD',
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABELA: messages (Chat/Atas)
-- =============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.edges ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para desenvolvimento (ajuste para produção)
CREATE POLICY "Allow all for nodes" ON public.nodes FOR ALL USING (true);

CREATE POLICY "Allow all for edges" ON public.edges FOR ALL USING (true);

CREATE POLICY "Allow all for leads" ON public.leads FOR ALL USING (true);

CREATE POLICY "Allow all for messages" ON public.messages FOR ALL USING (true);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_nodes_type ON public.nodes(type);

CREATE INDEX IF NOT EXISTS idx_edges_source ON public.edges (source);

CREATE INDEX IF NOT EXISTS idx_edges_target ON public.edges (target);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);