# 🚀 DEPLOY COMPLETO - NewsFlow OS

## 📋 Passo a Passo Completo

### 1. 🔗 Setup GitHub

#### Opção A: Script Automatizado (Recomendado)

```bash
# Execute o script
./GITHUB_PUSH.sh
```

#### Opção B: Manual

```bash
# 1. Inicializar Git (se necessário)
git init

# 2. Adicionar remote
git remote add origin https://github.com/jmbento/NewsFlowOS.git

# 3. Configurar branch main
git branch -M main

# 4. Adicionar arquivos
git add .

# 5. Commit inicial
git commit -m "feat: NewsFlow OS - Deploy inicial

- Sistema completo de gestão editorial
- Canvas de workflow interativo
- CRM comercial
- Organograma interativo
- Brand Hub
- Sistema de feedback
- Dashboard Master
- Tracker & Time Tracking
- Integração Supabase completa"

# 6. Push para GitHub
git push -u origin main
```

### 2. 🗄️ Setup Supabase

#### Executar Migrations

1. Acesse: https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy/sql
2. Execute as migrations na ordem:

**Migration 1:** `supabase/migrations/001_initial_schema.sql`
- Cria tabelas: nodes, edges, leads, messages, profiles

**Migration 2:** `supabase/migrations/002_logistics_and_meetings.sql`
- Cria tabelas: assets, meeting_logs, nodes_metadata

**Migration 3:** `supabase/migrations/003_feedback_system.sql`
- Cria tabela: feedbacks (sistema de feedback)

#### OU via CLI:

```bash
# Link projeto remoto
supabase link --project-ref ajgqxifhvlwudqlhsfqy

# Push migrations
supabase db push
```

### 3. 🚀 Setup Vercel

#### Opção A: Conectar Repositório no Dashboard (Recomendado)

1. Acesse: https://vercel.com/dashboard
2. Clique em **Add New Project** ou **Import Project**
3. Selecione **Import Git Repository**
4. Escolha: `jmbento/NewsFlowOS`
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (raiz)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Configure variáveis de ambiente:
   ```
   VITE_SUPABASE_URL = https://ajgqxifhvlwudqlhsfqy.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
   ```
7. Selecione ambientes: **Production**, **Preview**, **Development**
8. Clique em **Deploy**

#### Opção B: Via CLI

```bash
# 1. Configurar variáveis (use script)
./VERCEL_ENV_SETUP.sh

# 2. Link projeto
vercel link

# 3. Deploy
vercel --prod
```

### 4. ✅ Verificar Deploy

Após o deploy:

1. **Teste a URL do Vercel:**
   - Verifique se o app carrega
   - Teste todas as funcionalidades
   - Verifique console para erros

2. **Teste Conexão Supabase:**
   - Teste criação de nodes
   - Teste sistema de feedback
   - Verifique se dados estão sendo salvos

3. **Verificar Logs:**
   - Vercel Dashboard → Deployments → Logs
   - Supabase Dashboard → Logs

---

## 🔄 Deploy Automático

Após conectar o repositório no Vercel:

- ✅ **Deploy Automático:** A cada push no `main`, o Vercel fará deploy automaticamente
- ✅ **Preview Deploys:** Branches e PRs geram previews automáticos
- ✅ **Rollback:** Pode reverter para qualquer deployment anterior

### Workflow Futuro

```bash
# 1. Fazer mudanças no código

# 2. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 3. Deploy automático no Vercel! 🚀
# (não precisa fazer nada, o Vercel faz automaticamente)
```

---

## 📋 Checklist Completo

### Setup Git
- [ ] `git init` (se necessário)
- [ ] `git remote add origin https://github.com/jmbento/NewsFlowOS.git`
- [ ] `git add .`
- [ ] `git commit -m "feat: deploy inicial"`
- [ ] `git push -u origin main`

### Setup Supabase
- [ ] Executar migration 001_initial_schema.sql
- [ ] Executar migration 002_logistics_and_meetings.sql
- [ ] Executar migration 003_feedback_system.sql
- [ ] Verificar tabelas criadas

### Setup Vercel
- [ ] Conectar repositório no Vercel Dashboard
- [ ] Configurar variáveis de ambiente (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Primeiro deploy
- [ ] Verificar se app está funcionando

### Verificação Final
- [ ] App carrega na URL do Vercel
- [ ] Conexão com Supabase funcionando
- [ ] Criação de nodes funciona
- [ ] Sistema de feedback funciona
- [ ] Deploy automático ativado

---

## 🎯 Comandos Rápidos

### Push para GitHub
```bash
./GITHUB_PUSH.sh
```

### Configurar Variáveis no Vercel
```bash
./VERCEL_ENV_SETUP.sh
```

### Deploy Completo
```bash
# 1. Push para GitHub
./GITHUB_PUSH.sh

# 2. Configurar variáveis (se ainda não configurou)
./VERCEL_ENV_SETUP.sh

# 3. Se conectar repositório no Vercel Dashboard, deploy será automático!
```

---

## 🔗 Links Úteis

- **Repositório GitHub:** https://github.com/jmbento/NewsFlowOS
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy
- **Supabase SQL Editor:** https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy/sql

---

## ⚠️ Importante

- ✅ **Nunca commite** arquivos `.env.local` ou `.env` com credenciais
- ✅ O `.gitignore` já está configurado para ignorar esses arquivos
- ✅ Use sempre variáveis de ambiente do Vercel para produção
- ✅ Use `SUPABASE_CONFIG.md` como referência para suas credenciais

---

**Status:** ✅ Tudo pronto para deploy completo!
