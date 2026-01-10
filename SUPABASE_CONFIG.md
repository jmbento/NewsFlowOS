# 🔑 Configuração Supabase - NewsFlow OS

## 📋 Informações do Projeto

**Project Ref:** `ajgqxifhvlwudqlhsfqy`

**Project URL:** `https://ajgqxifhvlwudqlhsfqy.supabase.co`

**API URL:** `https://ajgqxifhvlwudqlhsfqy.supabase.co/rest/v1`

## 🔐 Variáveis de Ambiente

### Para Vercel Dashboard

Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables

Adicione:

```
Nome: VITE_SUPABASE_URL
Valor: https://ajgqxifhvlwudqlhsfqy.supabase.co
Ambiente: Production, Preview, Development
```

```
Nome: VITE_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
Ambiente: Production, Preview, Development
```

### Para Local (.env.local)

Crie arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://ajgqxifhvlwudqlhsfqy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
```

## 🚀 Configuração via CLI

### Opção 1: Script Automatizado

```bash
chmod +x VERCEL_ENV_SETUP.sh
./VERCEL_ENV_SETUP.sh
```

### Opção 2: Comandos Manuais

```bash
# Adicionar variáveis para produção
vercel env add VITE_SUPABASE_URL production
# Cole: https://ajgqxifhvlwudqlhsfqy.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
```

## 🔗 Link Supabase Local

Se usar Supabase CLI:

```bash
supabase link --project-ref ajgqxifhvlwudqlhsfqy
```

## 📊 Acessar Dashboard

**Supabase Dashboard:** https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy

**SQL Editor:** https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy/sql

## 📋 Próximos Passos

1. ✅ Configure variáveis no Vercel (use script ou dashboard)
2. ✅ Execute migrations no Supabase Dashboard → SQL Editor
3. ✅ Teste conexão: `npm run dev`
4. ✅ Deploy: `vercel --prod`

---

**Status:** ✅ Configuração detectada e documentada
