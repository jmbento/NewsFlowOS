# ⚡ COMANDOS RÁPIDOS - Copie e Cole

## 🚀 Setup Rápido (3 Minutos)

### 1. Login nas Plataformas

```bash
# GitHub (configure usuário)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"

# Vercel (abre navegador)
npm i -g vercel
vercel login

# Supabase (abre navegador - opcional)
npm i -g supabase
supabase login
```

### 2. Push para GitHub

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Execute script automatizado
./GITHUB_PUSH.sh

# OU manual:
git init
git remote add origin https://github.com/jmbento/NewsFlowOS.git
git branch -M main
git add .
git commit -m "feat: NewsFlow OS - Deploy inicial"
git push -u origin main
```

**Se pedir credenciais GitHub:**
- Username: seu username
- Password: Personal Access Token (não senha!)

### 3. Configurar Variáveis no Vercel

```bash
# Execute script automatizado (já tem suas credenciais)
./VERCEL_ENV_SETUP.sh

# OU manual:
vercel env add VITE_SUPABASE_URL production
# Cole: https://ajgqxifhvlwudqlhsfqy.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production  
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
```

### 4. Conectar Repositório no Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. **Add New Project** → **Import Git Repository**
3. Escolha: `jmbento/NewsFlowOS`
4. **Deploy!**

### 5. Executar Migrations no Supabase

1. Acesse: https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy/sql
2. Execute cada arquivo:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_logistics_and_meetings.sql`
   - `supabase/migrations/003_feedback_system.sql`

---

## ✅ Checklist Final

- [ ] Login GitHub feito
- [ ] Login Vercel feito (`vercel login`)
- [ ] Push para GitHub feito (`./GITHUB_PUSH.sh`)
- [ ] Variáveis configuradas no Vercel (`./VERCEL_ENV_SETUP.sh`)
- [ ] Repositório conectado no Vercel Dashboard
- [ ] Migrations executadas no Supabase
- [ ] Deploy funcionando! 🎉

---

**Status:** ✅ Pronto! Execute os comandos acima no seu terminal.
