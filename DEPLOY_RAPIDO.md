# ⚡ DEPLOY RÁPIDO - Vercel

## 🚀 3 Passos para Deploy

### 1. Configure Variáveis no Vercel Dashboard

Acesse: https://vercel.com/dashboard → Seu Projeto → Settings → Environment Variables

Adicione:
- `VITE_SUPABASE_URL` = URL do seu projeto Supabase
- `VITE_SUPABASE_ANON_KEY` = Chave anon pública do Supabase

### 2. Execute Migrations no Supabase

Acesse: Supabase Dashboard → SQL Editor → Execute:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_logistics_and_meetings.sql`
3. `supabase/migrations/003_feedback_system.sql` (NOVO)

### 3. Deploy

```bash
# Opção 1: Via CLI
vercel --prod

# Opção 2: Via GitHub (automático)
git push origin main
```

✅ **Pronto!** Seu app estará no ar em ~2 minutos.
