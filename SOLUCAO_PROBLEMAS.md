# 🆘 SOLUÇÃO DE PROBLEMAS COMUNS - Deploy

## ❌ Problemas e Soluções

### 1. "Git não encontrado"

**Erro:** `git: command not found`

**Solução:**
```bash
# macOS - Instalar via Homebrew
brew install git

# OU baixar em: https://git-scm.com/download/mac
```

---

### 2. "Vercel CLI não encontrado"

**Erro:** `vercel: command not found`

**Solução:**
```bash
# Instalar globalmente
npm i -g vercel

# Verificar instalação
vercel --version
```

---

### 3. "Permission denied" no GitHub Push

**Erro:** `Permission denied (publickey)` ou `Authentication failed`

**Solução A - Personal Access Token:**
1. Acesse: https://github.com/settings/tokens
2. Generate new token (classic)
3. Marque: `repo`
4. Copie o token
5. Use o token como senha (não sua senha do GitHub!)

**Solução B - Configurar SSH:**
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu@email.com"

# Adicionar chave ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub: Settings → SSH and GPG keys → New SSH key
# Depois mudar remote:
git remote set-url origin git@github.com:jmbento/NewsFlowOS.git
```

---

### 4. "Repository not found"

**Erro:** `Repository not found` ou `remote: Repository not found`

**Solução:**
- Verifique se você tem acesso ao repositório `jmbento/NewsFlowOS`
- Se não for seu repositório, você precisa ser adicionado como colaborador
- OU crie um novo repositório e atualize o remote

---

### 5. "Not authenticated" no Vercel

**Erro:** `Error: Not authenticated`

**Solução:**
```bash
# Fazer login novamente
vercel login

# Verificar login
vercel whoami
```

---

### 6. "Build failed" no Vercel

**Erro:** Build falha durante deploy

**Solução:**
```bash
# Testar build local primeiro
npm install
npm run build

# Se funcionar local, o problema pode ser:
# - Variáveis de ambiente não configuradas
# - Dependências faltando
# - Erros de TypeScript

# Verificar erros
npm run build 2>&1 | grep -i error
```

---

### 7. "Variáveis de ambiente não configuradas"

**Erro:** App não conecta com Supabase

**Solução:**
```bash
# Verificar variáveis no Vercel
vercel env ls

# Se não tiver, adicionar:
./VERCEL_ENV_SETUP.sh

# OU manualmente:
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

---

### 8. "Git não está configurado"

**Erro:** `Please tell me who you are`

**Solução:**
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"

# Verificar
git config --global user.name
git config --global user.email
```

---

### 9. "Not a git repository"

**Erro:** `fatal: not a git repository`

**Solução:**
```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
git init
git remote add origin https://github.com/jmbento/NewsFlowOS.git
```

---

### 10. "Remote origin already exists"

**Erro:** `fatal: remote origin already exists`

**Solução:**
```bash
# Ver remote atual
git remote -v

# Se estiver errado, atualizar:
git remote set-url origin https://github.com/jmbento/NewsFlowOS.git

# OU remover e adicionar novamente:
git remote remove origin
git remote add origin https://github.com/jmbento/NewsFlowOS.git
```

---

## 🔍 Diagnóstico Rápido

Execute este script para ver o que está faltando:

```bash
./DIAGNOSTICO.sh
```

Isso vai mostrar:
- ✅ O que está instalado
- ⚠️ O que precisa ser configurado
- ❌ O que está faltando

---

## 📞 Me Diga o Erro Específico

Se nenhuma solução acima funcionou, me diga:

1. **Qual comando você executou?**
2. **Qual erro apareceu?** (cole o erro completo)
3. **Em qual passo está travando?**

Com essas informações, posso te ajudar especificamente! 🚀
