# 🖥️ COMANDOS CLI - Vercel & Supabase

## 📦 Instalação

### Vercel CLI
```bash
npm i -g vercel
```

### Supabase CLI
```bash
# macOS
brew install supabase/tap/supabase

# OU via npm
npm i -g supabase
```

---

## 🚀 VERCEL CLI

### Autenticação
```bash
# Login
vercel login

# Logout
vercel logout

# Ver usuário atual
vercel whoami
```

### Deploy
```bash
# Deploy para preview (desenvolvimento)
vercel

# Deploy para produção
vercel --prod

# Deploy forçado (ignora cache)
vercel --prod --force

# Deploy com ambiente específico
vercel --prod --env VITE_SUPABASE_URL=https://...
```

### Projetos
```bash
# Listar projetos
vercel ls

# Criar novo projeto
vercel init

# Ver detalhes do projeto
vercel inspect [deployment-url]

# Remover projeto
vercel remove [project-name]
```

### Deployments
```bash
# Listar deployments
vercel ls [project-name]

# Ver logs de um deployment
vercel logs [deployment-url]

# Remover deployment
vercel rm [deployment-url]

# Promover preview para produção
vercel promote [deployment-url]
```

### Variáveis de Ambiente
```bash
# Listar variáveis
vercel env ls [project-name]

# Adicionar variável (interativo)
vercel env add VITE_SUPABASE_URL

# Adicionar variável (direto)
vercel env add VITE_SUPABASE_URL production

# Remover variável
vercel env rm VITE_SUPABASE_URL production

# Pull variáveis (criar .env.local)
vercel env pull .env.local
```

### Domínios
```bash
# Listar domínios
vercel domains ls [project-name]

# Adicionar domínio
vercel domains add exemplo.com [project-name]

# Remover domínio
vercel domains rm exemplo.com [project-name]

# Verificar DNS
vercel domains inspect exemplo.com
```

### Build & Dev
```bash
# Build local
vercel build

# Preview build local
vercel dev

# Ver build output
vercel build --debug
```

### Configuração
```bash
# Link projeto local com Vercel
vercel link

# Pull configuração do projeto
vercel pull
```

---

## 🗄️ SUPABASE CLI

### Autenticação
```bash
# Login
supabase login

# Logout
supabase logout

# Ver status
supabase status
```

### Inicialização
```bash
# Inicializar projeto local
supabase init

# Iniciar Supabase local
supabase start

# Parar Supabase local
supabase stop

# Resetar banco local
supabase db reset
```

### Migrations
```bash
# Criar nova migration
supabase migration new nome_da_migration

# Aplicar migrations locais
supabase db reset

# Aplicar migration específica
supabase migration up

# Ver status das migrations
supabase migration list

# Aplicar migrations no remoto (produção)
supabase db push

# Criar migration a partir de mudanças no banco
supabase db diff -f nome_migration
```

### Banco de Dados
```bash
# Conectar ao banco local via psql
supabase db connect

# Executar SQL local
supabase db execute "SELECT * FROM nodes;"

# Dump do banco
supabase db dump -f backup.sql

# Restaurar dump
supabase db restore backup.sql

# Resetar banco (drop e recreate)
supabase db reset
```

### Link com Projeto Remoto
```bash
# Link projeto local com remoto
supabase link --project-ref seu-project-ref

# Ver projeto linkado
supabase projects list

# Deslinkar
supabase unlink
```

### Edge Functions
```bash
# Listar functions
supabase functions list

# Criar function
supabase functions new nome_function

# Deploy function
supabase functions deploy nome_function

# Invocar function localmente
supabase functions invoke nome_function --no-verify-jwt

# Ver logs da function
supabase functions logs nome_function
```

### Storage
```bash
# Listar buckets
supabase storage list

# Criar bucket
supabase storage create nome_bucket --public

# Upload arquivo
supabase storage upload nome_bucket arquivo.jpg

# Download arquivo
supabase storage download nome_bucket arquivo.jpg

# Remover arquivo
supabase storage remove nome_bucket arquivo.jpg
```

### Generar Types TypeScript
```bash
# Gerar types do banco
supabase gen types typescript --local > types/supabase.ts

# Gerar types do remoto
supabase gen types typescript --project-id seu-project-id > types/supabase.ts
```

### Logs
```bash
# Ver logs do banco
supabase db logs

# Ver logs de API
supabase logs --type api

# Ver logs de auth
supabase logs --type auth

# Ver logs em tempo real
supabase logs --follow
```

---

## 🔄 WORKFLOW COMPLETO VIA CLI

### Setup Inicial
```bash
# 1. Login nas duas plataformas
vercel login
supabase login

# 2. Inicializar Supabase local
supabase init
supabase start

# 3. Link com projeto remoto do Supabase
supabase link --project-ref seu-project-ref

# 4. Link com projeto Vercel
vercel link
```

### Desenvolvimento Local
```bash
# 1. Aplicar migrations locais
supabase db reset

# 2. Gerar types TypeScript
supabase gen types typescript --local > types/supabase.ts

# 3. Iniciar dev server
npm run dev

# 4. Preview no Vercel local
vercel dev
```

### Deploy de Migrations
```bash
# 1. Criar nova migration
supabase migration new adicionar_campo_x

# 2. Editar arquivo da migration em:
# supabase/migrations/XXXXX_adicionar_campo_x.sql

# 3. Testar localmente
supabase db reset

# 4. Aplicar no remoto
supabase db push
```

### Deploy Completo
```bash
# 1. Aplicar migrations no Supabase
supabase db push

# 2. Gerar types atualizados
supabase gen types typescript --project-id seu-project-id > types/supabase.ts

# 3. Build local (teste)
npm run build

# 4. Deploy no Vercel
vercel --prod

# 5. Verificar deployment
vercel ls
vercel inspect [deployment-url]
```

### Variáveis de Ambiente
```bash
# 1. Adicionar no Vercel (via CLI)
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# 2. Listar variáveis
vercel env ls

# 3. Pull para local (criar .env.local)
vercel env pull .env.local
```

### Backup e Restore
```bash
# 1. Fazer backup do banco
supabase db dump -f backup_$(date +%Y%m%d).sql

# 2. Restaurar backup
supabase db restore backup_20250112.sql

# 3. Ver histórico de migrations
supabase migration list
```

---

## 🎯 COMANDOS ÚTEIS RÁPIDOS

### Vercel
```bash
# Deploy rápido
vercel --prod

# Ver logs em tempo real
vercel logs --follow

# Rollback (promover deployment anterior)
vercel promote [deployment-url-anterior]
```

### Supabase
```bash
# Status rápido
supabase status

# Reset rápido
supabase db reset

# Push rápido
supabase db push
```

---

## 📋 CHECKLIST DEPLOY VIA CLI

### Pré-Deploy
- [ ] `vercel login` ✅
- [ ] `supabase login` ✅
- [ ] `supabase link --project-ref` ✅
- [ ] Variáveis configuradas: `vercel env ls` ✅

### Deploy
- [ ] Migrations aplicadas: `supabase db push` ✅
- [ ] Build local funciona: `npm run build` ✅
- [ ] Deploy Vercel: `vercel --prod` ✅
- [ ] Verificar logs: `vercel logs [deployment]` ✅

---

**Dica:** Use aliases no seu `.zshrc` ou `.bashrc`:

```bash
alias vd='vercel --prod'
alias vls='vercel ls'
alias spush='supabase db push'
alias sstatus='supabase status'
alias sreset='supabase db reset'
```
