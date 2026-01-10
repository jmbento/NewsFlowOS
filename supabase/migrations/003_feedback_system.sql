-- Migration: Feedback System
-- Adiciona tabela de feedbacks da equipe

CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  message TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('BUG', 'FEATURE', 'PRAISE')),
  attachment TEXT,
  attachment_name TEXT,
  submitted_by TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'RESOLVED')),
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_category ON feedbacks(category);
CREATE INDEX IF NOT EXISTS idx_feedbacks_submitted_at ON feedbacks(submitted_at DESC);

-- RLS (Row Level Security)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem inserir feedbacks
CREATE POLICY "Anyone can submit feedback"
  ON feedbacks FOR INSERT
  WITH CHECK (true);

-- Política: Apenas admins podem ver todos os feedbacks
CREATE POLICY "Admins can view all feedbacks"
  ON feedbacks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'ADMIN'
    )
  );

-- Política: Apenas admins podem atualizar feedbacks
CREATE POLICY "Admins can update feedbacks"
  ON feedbacks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'ADMIN'
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_feedbacks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_feedbacks_updated_at
  BEFORE UPDATE ON feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION update_feedbacks_updated_at();
