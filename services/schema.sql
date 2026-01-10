-- Tabela de Projetos (Opcional, mas útil para o futuro)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    campaign_type TEXT,
    target_cities TEXT[],
    total_investment DECIMAL(12,2),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Tabela de Nodes
CREATE TABLE IF NOT EXISTS nodes (
    id TEXT PRIMARY KEY,
    project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Tabela de Edges
CREATE TABLE IF NOT EXISTS edges (
    id TEXT PRIMARY KEY,
    project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
    source TEXT NOT NULL REFERENCES nodes (id) ON DELETE CASCADE,
    target TEXT NOT NULL REFERENCES nodes (id) ON DELETE CASCADE,
    data JSONB,
    animated BOOLEAN DEFAULT FALSE,
    style JSONB,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Tabela de Mensagens do Chat
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    is_whatsapp BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Políticas de RLS (Para este caso, vamos habilitar acesso público inicialmente)
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;

ALTER TABLE edges ENABLE ROW LEVEL SECURITY;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso Público" ON nodes FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acesso Público" ON edges FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acesso Público" ON projects FOR ALL USING (true)
WITH
    CHECK (true);

CREATE POLICY "Acesso Público" ON messages FOR ALL USING (true)
WITH
    CHECK (true);

-- Tabela de Leads (CRM)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    status TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso Público" ON leads FOR ALL USING (true)
WITH
    CHECK (true);