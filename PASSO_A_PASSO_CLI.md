# 🚀 PASSO A PASSO CLI - Deploy Completo

## 🆘 Guia Detalhado para Fazer Deploy

### 📋 Checklist Inicial

Antes de começar, verifique:

- [ ] Git instalado (`git --version`)
- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Vercel CLI instalado (`vercel --version`)

---

## 🔧 PASSO 1: Instalar Ferramentas (Se Necessário)

### Instalar Git (se não tiver)
```bash
# macOS - via Homebrew
brew install git

# Verificar instalação
git --version
```

### Instalar Node.js (se não tiver)
```bash
# macOS - via Homebrew
brew install node

# Verificar instalação
node --version
npm --version
```

### Instalar Vercel CLI
```bash
npm i -g vercel
vercel --version
```

### Instalar Supabase CLI (Opcional)
```bash
npm i -g supabase
supabase --version
```

---

## 🔐 PASSO 2: Configurar Git

### Verificar/Configurar Usuário Git

```bash
# Verificar configuração atual
git config --global user.name
git config --global user.email

# Se não estiver configurado, configure:
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

### Gerar Personal Access Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **Generate new token** → **Generate new token (classic)**
3. Dê um nome: `NewsFlowOS Deploy`
4. Selecione escopos:
   - ✅ `repo` (acesso completo aos repositórios)
5. Clique em **Generate token**
6. **COPIE O TOKEN** (ele só aparece uma vez!)

---

## 📦 PASSO 3: Preparar Projeto Local

### Navegar para o Diretório

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
```

### Verificar se é Repositório Git

```bash
# Verificar status
git status
```

**Se der erro "not a git repository":**
```bash
# Inicializar Git
git init
```

### Verificar Remote Origin

```bash
# Verificar remote atual
git remote -v

# Se não existir, adicionar:
git remote add origin https://github.com/jmbento/NewsFlowOS.git

# Se existir mas estiver errado, atualizar:
git remote set-url origin https://github.com/jmbento/NewsFlowOS.git
```

---

## 🚀 PASSO 4: Push para GitHub

### Opção A: Script Automatizado (Recomendado)

```bash
# Dar permissão de execução (se necessário)
chmod +x GITHUB_PUSH.sh

# Executar script
./GITHUB_PUSH.sh
```

**Quando pedir credenciais:**
- Username: seu username do GitHub
- Password: cole o Personal Access Token (não sua senha!)

### Opção B: Manual (Se Script Não Funcionar)

```bash
# 1. Verificar status
git status

# 2. Adicionar todos os arquivos
git add .

# 3. Verificar o que será commitado
git status

# 4. Fazer commit
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

# 5. Renomear branch para main (se necessário)
git branch -M main

# 6. Push para GitHub
git push -u origin main
```

**Se der erro de autenticação:**
```bash
# Usar Personal Access Token ao invés de senha
# Quando pedir password, cole o token que você copiou
```

---

## 🔑 PASSO 5: Login no Vercel

```bash
# Login no Vercel (abre navegador)
vercel login
```

**O que vai acontecer:**
1. Comando vai abrir seu navegador
2. Faça login no Vercel (pode usar GitHub)
3. Autorize o acesso
4. Volte ao terminal - deve mostrar "Success! Logged in"

**Verificar login:**
```bash
vercel whoami
```

**Se der erro:**
- Tente novamente: `vercel login`
- Use outra opção de login (GitHub, GitLab, etc.)

---

## 🌐 PASSO 6: Configurar Variáveis no Vercel

### Opção A: Script Automatizado

```bash
# Dar permissão (se necessário)
chmod +x VERCEL_ENV_SETUP.sh

# Executar script
./VERCEL_ENV_SETUP.sh
```

### Opção B: Manual

```bash
# Adicionar VITE_SUPABASE_URL para produção
vercel env add VITE_SUPABASE_URL production
# Quando pedir valor, cole: https://ajgqxifhvlwudqlhsfqy.supabase.co

# Adicionar VITE_SUPABASE_ANON_KEY para produção
vercel env add VITE_SUPABASE_ANON_KEY production
# Quando pedir valor, cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU

# Repetir para preview
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview

# Repetir para development
vercel env add VITE_SUPABASE_URL development
vercel env add VITE_SUPABASE_ANON_KEY development
```

**Verificar variáveis configuradas:**
```bash
vercel env ls
```

---

## 🔗 PASSO 7: Linkar Projeto com Vercel

### Opção A: Via Dashboard (Mais Fácil)

1. Acesse: https://vercel.com/dashboard
2. Clique em **Add New Project** ou **Import Project**
3. Selecione **Import Git Repository**
4. Escolha: `jmbento/NewsFlowOS`
5. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `./` (raiz)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Verifique se as variáveis aparecem (se já configurou via CLI)
7. Clique em **Deploy**

### Opção B: Via CLI

```bash
# Link projeto
vercel link

# Seguir instruções interativas:
# - Set up and deploy? Y
# - Which scope? (selecionar sua conta)
# - Link to existing project? N (primeira vez)
# - Project name? NewsFlowOS
# - Directory? ./ (raiz)

# Após linkar, deploy
vercel --prod
```

---

## 🗄️ PASSO 8: Executar Migrations no Supabase

### Via Dashboard (Mais Fácil)

1. Acesse: https://supabase.com/dashboard/project/ajgqxifhvlwudqlhsfqy/sql
2. Clique em **New Query**
3. Execute cada migration na ordem:

**Migration 1:** Copie e cole o conteúdo de:
```
supabase/migrations/001_initial_schema.sql
```
Clique em **Run**

**Migration 2:** Copie e cole o conteúdo de:
```
supabase/migrations/002_logistics_and_meetings.sql
```
Clique em **Run**

**Migration 3:** Copie e cole o conteúdo de:
```
supabase/migrations/003_feedback_system.sql
```
Clique em **Run**

### Via CLI (Se Linkou Projeto)

```bash
# Link projeto remoto
supabase link --project-ref ajgqxifhvlwudqlhsfqy

# Push migrations
supabase db push
```

---

## ✅ PASSO 9: Verificar Deploy

### Verificar Deployment no Vercel

```bash
# Listar deployments
vercel ls

# Ver detalhes do último deployment
vercel inspect [deployment-url]

# Ver logs
vercel logs [deployment-url]
```

### Testar Aplicação

1. Acesse a URL do Vercel (fornecida após deploy)
2. Teste funcionalidades:
   - ✅ App carrega
   - ✅ Conexão com Supabase funciona
   - ✅ Criação de nodes funciona
   - ✅ Sistema de feedback funciona

---

## 🆘 TROUBLESHOOTING

### Erro: "Permission denied" no GitHub Push

**Problema:** Git não tem permissão para fazer push.

**Solução 1: Usar Personal Access Token**
- Use o token ao invés da senha quando pedir password

**Solução 2: Configurar SSH**
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu.email@example.com"

# Adicionar chave ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub: Settings → SSH and GPG keys → New SSH key
```

### Erro: "Not authenticated" no Vercel

**Solução:**
```bash
# Logout e login novamente
vercel logout
vercel login
```

### Erro: "Project not found" no Supabase

**Solução:**
- Verifique se você tem acesso ao projeto `ajgqxifhvlwudqlhsfqy`
- Verifique se está logado: `supabase login`

### Erro: "Build failed" no Vercel

**Solução 1: Testar build local**
```bash
npm run build
```

**Solução 2: Verificar logs**
```bash
vercel logs [deployment-url]
```

**Solução 3: Verificar variáveis**
```bash
vercel env ls
# Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas
```

### Erro: "Command not found" (Git/Vercel/npm)

**Solução:**
```bash
# Instalar Git
brew install git

# Instalar Node.js
brew install node

# Instalar Vercel CLI
npm i -g vercel

# Instalar Supabase CLI
npm i -g supabase
```

---

## 📞 Comandos de Ajuda

```bash
# Git ajuda
git help
git help push

# Vercel ajuda
vercel help
vercel help env

# Supabase ajuda
supabase help
supabase help db
```

---

## ✅ Checklist Final

- [ ] Git instalado e configurado
- [ ] Node.js e npm instalados
- [ ] Vercel CLI instalado
- [ ] Personal Access Token criado no GitHub
- [ ] Git configurado (user.name e user.email)
- [ ] Repositório inicializado e remote adicionado
- [ ] Push para GitHub feito com sucesso
- [ ] Login no Vercel feito (`vercel login`)
- [ ] Variáveis configuradas no Vercel (`vercel env add`)
- [ ] Projeto linkado no Vercel (Dashboard ou CLI)
- [ ] Migrations executadas no Supabase
- [ ] Deploy funcionando!

---

**Status:** ✅ Guia completo criado - Siga os passos acima!
