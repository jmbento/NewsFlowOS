# 🔗 Configuração GitHub - NewsFlow OS

## 📋 Informações do Repositório

**Repositório:** https://github.com/jmbento/NewsFlowOS.git

**Status:** Repositório vazio - pronto para receber o código

---

## 🚀 Setup Inicial via CLI

### 1. Inicializar Git (se ainda não foi inicializado)

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Verificar se já existe repositório Git
git status

# Se não existir, inicializar
git init

# Configurar usuário (se necessário)
git config user.name "Seu Nome"
git config user.email "seu.email@example.com"
```

### 2. Adicionar Remote do GitHub

```bash
# Adicionar remote origin
git remote add origin https://github.com/jmbento/NewsFlowOS.git

# OU se já existir um remote, atualizar
git remote set-url origin https://github.com/jmbento/NewsFlowOS.git

# Verificar remotes configurados
git remote -v
```

### 3. Adicionar Arquivos e Fazer Commit

```bash
# Adicionar todos os arquivos
git add .

# Verificar o que será commitado
git status

# Fazer commit inicial
git commit -m "feat: NewsFlow OS - Deploy inicial

- Sistema completo de gestão editorial
- Canvas de workflow interativo
- CRM comercial
- Organograma interativo
- Brand Hub
- Sistema de feedback
- Dashboard Master
- Tracker & Time Tracking
- Integração Supabase
- Deploy configurado para Vercel"
```

### 4. Push para GitHub

```bash
# Push para branch main
git branch -M main
git push -u origin main
```

---

## 🔄 Workflow de Desenvolvimento

### Adicionar Mudanças

```bash
# Ver status
git status

# Adicionar arquivos específicos
git add arquivo.tsx

# OU adicionar tudo
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push origin main
```

### Criar Branch para Feature

```bash
# Criar e mudar para nova branch
git checkout -b feature/nome-da-feature

# Trabalhar na feature...

# Commit
git add .
git commit -m "feat: adiciona feature X"

# Push branch
git push origin feature/nome-da-feature

# Criar Pull Request no GitHub
# Depois merge na main
```

---

## 📦 Integração com Vercel

### Opção 1: Conectar Repositório no Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Clique em **Add New Project**
3. Selecione **Import Git Repository**
4. Escolha: `jmbento/NewsFlowOS`
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Configure variáveis de ambiente:
   - `VITE_SUPABASE_URL` = `https://ajgqxifhvlwudqlhsfqy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (sua chave)
7. Clique em **Deploy**

### Opção 2: Via Vercel CLI

```bash
# Link projeto com repositório
vercel link

# Selecionar projeto existente ou criar novo
# Conectar com GitHub: jmbento/NewsFlowOS

# Deploy
vercel --prod
```

---

## 🔐 Variáveis de Ambiente no Vercel

Após conectar o repositório, configure as variáveis:

### Via Dashboard

1. Vercel Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicione:
   - `VITE_SUPABASE_URL` = `https://ajgqxifhvlwudqlhsfqy.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Selecione ambientes: Production, Preview, Development

### Via CLI

```bash
# Usar script automatizado
./VERCEL_ENV_SETUP.sh

# OU manualmente
vercel env add VITE_SUPABASE_URL production
# Cole: https://ajgqxifhvlwudqlhsfqy.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Deploy Automático

Após conectar o repositório no Vercel:

- ✅ **Deploy Automático:** A cada push no `main`, o Vercel fará deploy automaticamente
- ✅ **Preview Deploys:** Branches e PRs geram previews automáticos
- ✅ **Rollback:** Pode reverter para qualquer deployment anterior

---

## 📋 Checklist Completo

### Setup Git
- [ ] `git init` (se necessário)
- [ ] `git remote add origin https://github.com/jmbento/NewsFlowOS.git`
- [ ] `git add .`
- [ ] `git commit -m "feat: deploy inicial"`
- [ ] `git push -u origin main`

### Setup Vercel
- [ ] Conectar repositório no Vercel Dashboard
- [ ] Configurar variáveis de ambiente
- [ ] Primeiro deploy

### Setup Supabase
- [ ] Executar migrations (001, 002, 003)
- [ ] Verificar tabelas criadas
- [ ] Testar conexão

---

## 🎯 Comandos Rápidos

```bash
# Setup completo em uma linha
git init && git remote add origin https://github.com/jmbento/NewsFlowOS.git && git add . && git commit -m "feat: deploy inicial" && git branch -M main && git push -u origin main
```

---

## 🔗 Links Úteis

- **Repositório:** https://github.com/jmbento/NewsFlowOS
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy

---

**Status:** ✅ Pronto para conectar ao GitHub e fazer deploy!
