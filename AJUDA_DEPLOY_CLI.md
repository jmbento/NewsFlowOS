# 🆘 AJUDA COM DEPLOY VIA CLI - Passo a Passo Detalhado

## 🎯 Vamos Fazer Juntos!

Siga cada passo abaixo e me diga onde está travando.

---

## 📋 PASSO 1: Verificar Instalações

Execute no terminal e me diga o resultado:

```bash
# Verificar Git
git --version

# Verificar Node/npm
node --version
npm --version

# Verificar Vercel CLI
vercel --version

# Verificar Supabase CLI (opcional)
supabase --version
```

**Me diga:** Quais comandos funcionaram e quais deram erro?

---

## 📋 PASSO 2: Configurar Git

Execute e me diga o resultado:

```bash
# Verificar se já está configurado
git config --global user.name
git config --global user.email

# Se não estiver configurado, configure:
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

**Me diga:** O que apareceu? Está configurado?

---

## 📋 PASSO 3: Inicializar Repositório Git

Execute no diretório do projeto:

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Verificar se já é um repositório Git
git status
```

**Se der erro "not a git repository":**

```bash
# Inicializar Git
git init

# Verificar novamente
git status
```

**Me diga:** O que apareceu? Conseguiu inicializar?

---

## 📋 PASSO 4: Adicionar Remote do GitHub

Execute:

```bash
# Verificar se já tem remote
git remote -v

# Se não tiver, adicionar:
git remote add origin https://github.com/jmbento/NewsFlowOS.git

# Verificar novamente
git remote -v
```

**Me diga:** Conseguiu adicionar o remote? O que apareceu?

---

## 📋 PASSO 5: Adicionar Arquivos e Commit

Execute:

```bash
# Ver status dos arquivos
git status

# Adicionar todos os arquivos
git add .

# Verificar o que será commitado
git status

# Fazer commit
git commit -m "feat: NewsFlow OS - Deploy inicial"
```

**Me diga:** Conseguiu fazer o commit? Algum erro?

---

## 📋 PASSO 6: Push para GitHub

Execute:

```bash
# Renomear branch para main (se necessário)
git branch -M main

# Tentar push
git push -u origin main
```

**Se pedir credenciais:**

### Opção A: Usar Personal Access Token

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Dê um nome: "NewsFlow OS Deploy"
4. Marque: `repo` (acesso completo aos repositórios)
5. Clique em "Generate token"
6. **COPIE O TOKEN** (só aparece uma vez!)

Quando pedir credenciais:
- **Username:** seu username do GitHub
- **Password:** cole o Personal Access Token (NÃO sua senha!)

### Opção B: Usar SSH (se tiver configurado)

```bash
# Mudar remote para SSH
git remote set-url origin git@github.com:jmbento/NewsFlowOS.git

# Tentar push novamente
git push -u origin main
```

**Me diga:** Conseguiu fazer push? Qual erro apareceu (se houver)?

---

## 📋 PASSO 7: Login no Vercel

Execute:

```bash
# Verificar se Vercel CLI está instalado
vercel --version

# Se não estiver, instalar:
npm i -g vercel

# Fazer login
vercel login
```

Isso vai abrir o navegador. Faça login com:
- GitHub (recomendado)
- GitLab
- Bitbucket
- Email/Senha

**Me diga:** Conseguiu fazer login? O que apareceu no terminal?

---

## 📋 PASSO 8: Configurar Variáveis no Vercel

Execute o script automatizado:

```bash
./VERCEL_ENV_SETUP.sh
```

**OU manualmente:**

```bash
# Adicionar variável 1
vercel env add VITE_SUPABASE_URL production
# Quando pedir o valor, cole: https://ajgqxifhvlwudqlhsfqy.supabase.co

# Adicionar variável 2
vercel env add VITE_SUPABASE_ANON_KEY production
# Quando pedir o valor, cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
```

**Me diga:** Conseguiu adicionar as variáveis? Algum erro?

---

## 📋 PASSO 9: Link Projeto com Vercel

Execute:

```bash
# Link projeto
vercel link
```

Siga as instruções interativas:
1. Selecione "Set up and deploy"
2. Escolha seu projeto (ou crie novo)
3. Confirme as configurações

**Me diga:** Conseguiu linkar? O que apareceu?

---

## 📋 PASSO 10: Deploy

Execute:

```bash
# Deploy para produção
vercel --prod
```

**Me diga:** O que apareceu? Deploy funcionou?

---

## 🆘 Troubleshooting

### Erro: "Permission denied" no GitHub

**Solução:** Use Personal Access Token ao invés de senha.

### Erro: "Repository not found"

**Solução:** Verifique se você tem acesso ao repositório `jmbento/NewsFlowOS`.

### Erro: "Not authenticated" no Vercel

**Solução:** Execute `vercel login` novamente.

### Erro: "Build failed"

**Solução:** Execute localmente primeiro:
```bash
npm install
npm run build
```

Me diga qual erro apareceu.

---

## 📝 Me Diga Onde Está Travando

Execute os comandos acima e me diga:
1. ✅ Qual passo você conseguiu completar?
2. ❌ Onde está travando?
3. 🔴 Qual erro apareceu?

Com essas informações, posso te ajudar especificamente! 🚀
