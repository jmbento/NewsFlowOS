# 🚀 COMANDOS PARA DEPLOY - NewsFlow OS

## ⚡ Deploy Rápido (3 Passos)

### Passo 1: Configure Variáveis no Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em: **Settings** → **Environment Variables**
4. Adicione:

```
Nome: VITE_SUPABASE_URL
Valor: https://seu-projeto.supabase.co

Nome: VITE_SUPABASE_ANON_KEY
Valor: sua-chave-anon-publica
```

**Onde encontrar:**
- Supabase Dashboard → Project Settings → API → Project URL
- Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`

### Passo 2: Execute Migrations no Supabase

1. Acesse: Supabase Dashboard → SQL Editor
2. Execute cada migration na ordem:

```sql
-- 1. Schema inicial
-- Execute: supabase/migrations/001_initial_schema.sql

-- 2. Logística e reuniões
-- Execute: supabase/migrations/002_logistics_and_meetings.sql

-- 3. Sistema de feedback (NOVO)
-- Execute: supabase/migrations/003_feedback_system.sql
```

**OU via CLI:**
```bash
# Se tiver Supabase CLI
supabase db push
```

### Passo 3: Deploy para Vercel

#### Opção A: Via CLI (Recomendado)

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# 2. Login na Vercel
vercel login

# 3. Deploy para produção
vercel --prod
```

#### Opção B: Via GitHub (Automático)

1. Conecte seu repositório no Vercel Dashboard
2. Configure as variáveis de ambiente
3. A cada push no `main`, o deploy será automático

#### Opção C: Via Script Automatizado

```bash
# Executar script de deploy
chmod +x deploy-production.sh
./deploy-production.sh
```

## 📋 Checklist Final

Antes do deploy, verifique:

- [ ] Variáveis de ambiente configuradas no Vercel Dashboard
- [ ] Migrations executadas no Supabase
- [ ] Build local funciona (`npm run build`)
- [ ] Sem erros de lint (`npm run lint` ou sem erros visíveis)

## 🔍 Verificar Após Deploy

1. **Teste a URL do Vercel:**
   - Verifique se o app carrega
   - Teste login/autenticação
   - Teste criação de nodes
   - Teste sistema de feedback

2. **Verifique logs:**
   - Vercel Dashboard → Deployments → Logs
   - Supabase Dashboard → Logs

3. **Teste funcionalidades:**
   - ✅ Canvas de workflow
   - ✅ CRM comercial
   - ✅ Organograma
   - ✅ Brand Hub
   - ✅ Sistema de feedback
   - ✅ Dashboard Master

## 🛠️ Troubleshooting

### "Build failed" no Vercel
```bash
# Teste build local primeiro
npm run build
```

### "Variáveis de ambiente não configuradas"
- Verifique se as variáveis estão no Vercel Dashboard
- Certifique-se de que os nomes estão corretos
- Refaça o deploy após adicionar variáveis

### "Supabase connection failed"
- Verifique URL e chave do Supabase
- Teste conexão local com `npm run dev`
- Verifique RLS policies no Supabase

## ✅ Comando Completo (One-liner)

```bash
npm run build && vercel --prod
```

---

**Status:** ✅ Pronto para deploy!
