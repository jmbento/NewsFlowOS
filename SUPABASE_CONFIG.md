# 🔑 Configuração Supabase - NewsFlow OS

## 📋 Informações do Projeto

**Project Ref:** `your-project-ref`

**Project URL:** `https://your-project-ref.supabase.co`

**API URL:** `https://your-project-ref.supabase.co/rest/v1`

> **⚠️ IMPORTANTE:** Substitua `your-project-ref` pelo seu Project Ref real do Supabase Dashboard.

## 🔐 Variáveis de Ambiente

### Para Vercel Dashboard

Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables

Adicione:

```
Nome: VITE_SUPABASE_URL
Valor: https://your-project-ref.supabase.co
Ambiente: Production, Preview, Development
```

```
Nome: VITE_SUPABASE_ANON_KEY
Valor: your-supabase-anon-key
Ambiente: Production, Preview, Development
```

> **⚠️ IMPORTANTE:** Obtenha as credenciais reais em: Supabase Dashboard → Project Settings → API

### Para Local (.env.local)

Crie arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **⚠️ IMPORTANTE:** Copie o conteúdo de `.env.example` e preencha com suas credenciais reais.

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
# Quando solicitado, cole: https://your-project-ref.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Quando solicitado, cole: your-supabase-anon-key
```

> **⚠️ IMPORTANTE:** Use as credenciais reais obtidas no Supabase Dashboard.

## 🔗 Link Supabase Local

Se usar Supabase CLI:

```bash
supabase link --project-ref your-project-ref
```

> **⚠️ IMPORTANTE:** Substitua `your-project-ref` pelo seu Project Ref real.

## 📊 Acessar Dashboard

**Supabase Dashboard:** https://supabase.com/dashboard/project/your-project-ref

**SQL Editor:** https://supabase.com/dashboard/project/your-project-ref/sql

> **⚠️ IMPORTANTE:** Substitua `your-project-ref` pelo seu Project Ref real.

## 📋 Próximos Passos

1. ✅ Configure variáveis no Vercel (use script ou dashboard)
2. ✅ Execute migrations no Supabase Dashboard → SQL Editor
3. ✅ Teste conexão: `npm run dev`
4. ✅ Deploy: `vercel --prod`

---

**Status:** ✅ Configuração detectada e documentada
