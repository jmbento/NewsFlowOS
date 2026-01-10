-- NewsFlow OS - Expansão: Logística, Reuniões e Metadados
-- Execute este SQL no Supabase Dashboard: SQL Editor

-- 1. TABELA: assets (Frotas e Equipamentos)
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'VEHICLE' ou 'EQUIPMENT'
    status TEXT DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'IN_USE', 'MAINTENANCE'
    current_location TEXT DEFAULT 'VOLTA_REDONDA',
    data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA: meeting_logs (Atas e Tarefas geradas por IA)
CREATE TABLE IF NOT EXISTS public.meeting_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    meeting_node_id TEXT REFERENCES public.nodes (id) ON DELETE SET NULL,
    title TEXT,
    summary TEXT,
    full_transcription TEXT,
    tasks_extracted JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA: nodes_metadata (Metadados para Calendário e Agendamento)
CREATE TABLE IF NOT EXISTS public.nodes_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    node_id TEXT NOT NULL REFERENCES public.nodes (id) ON DELETE CASCADE,
    meta_key TEXT NOT NULL, -- 'scheduled_date', 'city_target', 'resource_id', 'professional_ids'
    meta_value TEXT,
    meta_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed de Ativos Iniciais (Logística BX)
INSERT INTO
    public.assets (name, type, status)
VALUES (
        'Carro 01 (Doblô)',
        'VEHICLE',
        'AVAILABLE'
    ),
    (
        'Carro 02 (Sede VR)',
        'VEHICLE',
        'AVAILABLE'
    ),
    (
        'Kit Câmera A (Sony Alpha)',
        'EQUIPMENT',
        'AVAILABLE'
    ),
    (
        'Kit Câmera B (Canon R6)',
        'EQUIPMENT',
        'AVAILABLE'
    ),
    (
        'Drone DJI Mavic 3',
        'EQUIPMENT',
        'AVAILABLE'
    ),
    (
        'Kit Áudio Externo',
        'EQUIPMENT',
        'AVAILABLE'
    );

-- RLS & Políticas
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.meeting_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.nodes_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for assets" ON public.assets FOR ALL USING (true);

CREATE POLICY "Allow all for meeting_logs" ON public.meeting_logs FOR ALL USING (true);

CREATE POLICY "Allow all for nodes_metadata" ON public.nodes_metadata FOR ALL USING (true);