# 🚀 Deploy Automation - NewsFlow OS

## ✅ Configuração CI/CD Completa

### 📋 1. VERCEL.JSON - Configuração SPA

**Arquivo:** `vercel.json`

**Configurações Implementadas:**

✅ **Rewrites para SPA:**
- Todas as rotas (`/*`) redirecionam para `/index.html`
- Garante que todas as 16+ rotas funcionem sem erro 404

✅ **Cache Headers Otimizados:**
- Assets estáticos (JS, CSS, imagens) com cache de 1 ano
- Melhora performance e reduz custos de banda

✅ **Build Configuration:**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Rotas Suportadas:**
- ✅ `home` - Página Inicial
- ✅ `my-work` - Meu Trabalho
- ✅ `org-canvas` - Organograma
- ✅ `brand-hub` - Brand Hub
- ✅ `canvas` - Canvas Completo
- ✅ `search` - Pesquisa Rápida
- ✅ `templates` - Central de Templates
- ✅ `sales` - CRM Comercial
- ✅ `financial` - Financeiro
- ✅ `report` - Relatórios
- ✅ `master-dashboard` - Dashboard Master
- ✅ `profile` - Meu Perfil
- ✅ `automation` - Automações
- ✅ `trash` - Lixeira
- ✅ `admin` - Administração
- ✅ `team` - Equipes
- ✅ E todas as outras rotas do sistema

---

### 📦 2. BUILD COMMANDS - Otimizados

**Arquivo:** `package.json`

**Scripts Implementados:**

```json
{
  "validate-env": "node scripts/validate-env.js",    // ✅ Validação de variáveis
  "prebuild": "npm run validate-env",                 // ✅ Executa antes do build
  "build": "tsc --noEmit && vite build",              // ✅ Type check + build otimizado
  "build:ci": "vite build",                           // ✅ Build rápido para CI/CD
  "deploy:ci": "npm run build:ci && vercel --prod"    // ✅ Deploy automatizado
}
```

**Otimizações Aplicadas:**

✅ **TypeScript Check:**
- `tsc --noEmit` valida tipos antes do build
- Falha rápido se houver erros de tipo

✅ **Vite Build Otimizado:**
- Minificação com esbuild (mais rápido que terser)
- Code splitting automático
- Chunks separados para vendor libraries

✅ **CI/CD Build:**
- `build:ci` pula validações pesadas para deploy rápido
- Ideal para integração contínua

---

### 🔐 3. ENV VALIDATION - Script Completo

**Arquivo:** `scripts/validate-env.js`

**Funcionalidades:**

✅ **Validação de Variáveis Obrigatórias:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

✅ **Validações Inteligentes:**
- Detecta placeholders (`your-`, `YOUR-`)
- Valida formato de URL do Supabase
- Verifica tamanho mínimo da chave anon

✅ **Suporte a CI/CD:**
- Detecta ambiente Vercel automaticamente
- Mensagens de erro específicas para cada ambiente
- Exit codes corretos (0 = sucesso, 1 = erro)

✅ **Mascaramento de Valores:**
- Mostra apenas primeiros e últimos caracteres
- Protege credenciais em logs

**Uso:**

```bash
# Validação manual
npm run validate-env

# Validação automática (antes do build)
npm run build  # Executa validate-env automaticamente

# Validação no CI/CD (Vercel)
# Executado automaticamente no prebuild hook
```

---

## 🎯 Configuração Vercel Dashboard

### 1. Variáveis de Ambiente

**Acesse:** Vercel Dashboard → Seu Projeto → Settings → Environment Variables

**Adicione:**

```
VITE_SUPABASE_URL = https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY = your-supabase-anon-key
```

**Ambientes:** Production, Preview, Development

### 2. Build Settings

**Framework Preset:** Vite

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

**Root Directory:** `./` (raiz)

### 3. Deploy Automático

✅ **Configuração Atual:**
- Deploy automático a cada push na branch `main`
- Preview deployments para Pull Requests
- Validação de variáveis antes do build

---

## 📋 Checklist de Deploy

### Antes do Deploy:

- [x] ✅ `vercel.json` configurado para SPA
- [x] ✅ Build commands otimizados
- [x] ✅ Script de validação de variáveis criado
- [ ] ⚠️ Variáveis configuradas no Vercel Dashboard
- [ ] ⚠️ Teste local: `npm run build` (sem erros)
- [ ] ⚠️ Teste validação: `npm run validate-env` (sucesso)

### Durante o Deploy:

- [ ] Build passa na validação de variáveis
- [ ] Build completa sem erros
- [ ] Assets gerados corretamente no `dist/`

### Após o Deploy:

- [ ] Acessar URL de produção
- [ ] Testar rota `home` (sem 404)
- [ ] Testar rota `my-work` (sem 404)
- [ ] Testar rota `org-canvas` (sem 404)
- [ ] Testar rota `brand-hub` (sem 404)
- [ ] Testar todas as 16 rotas principais
- [ ] Verificar console do navegador (sem erros)
- [ ] Verificar conexão com Supabase (status: online)

---

## 🔍 Troubleshooting

### Erro: "VITE_SUPABASE_URL não está definida"

**Solução:**
1. Verifique se as variáveis estão configuradas no Vercel Dashboard
2. Selecione ambientes corretos (Production, Preview, Development)
3. Faça novo deploy após adicionar variáveis

### Erro: "404 Not Found" nas rotas

**Solução:**
1. Verifique se `vercel.json` tem os rewrites corretos
2. Confirme que `outputDirectory` está como `dist`
3. Verifique se o build gerou `dist/index.html`

### Build Lento no CI/CD

**Solução:**
1. Use `npm run build:ci` para build rápido
2. Verifique se não está rodando `check-schema` no CI
3. Use cache do npm no Vercel (automático)

### Erro de TypeScript no Build

**Solução:**
1. Execute `tsc --noEmit` localmente
2. Corrija erros de tipo antes do commit
3. Verifique `tsconfig.json` está correto

---

## 📊 Performance

### Otimizações Implementadas:

✅ **Code Splitting:**
- Vendor chunks separados (React, ReactFlow, UI libraries)
- Reduz tamanho do bundle inicial
- Melhora tempo de carregamento

✅ **Cache Headers:**
- Assets estáticos com cache de 1 ano
- Reduz requisições repetidas
- Melhora performance do usuário

✅ **Build Otimizado:**
- Minificação com esbuild
- Tree shaking automático
- Source maps apenas em dev

---

## 🚀 Próximos Passos

1. ✅ Configurar variáveis no Vercel Dashboard
2. ✅ Fazer primeiro deploy manual
3. ✅ Testar todas as rotas em produção
4. ✅ Configurar domínio customizado (opcional)
5. ✅ Habilitar analytics (opcional)

---

**Status:** ✅ CONFIGURAÇÃO COMPLETA E PRONTA PARA DEPLOY

**Última atualização:** $(date +"%Y-%m-%d %H:%M:%S")
