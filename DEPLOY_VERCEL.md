# 🚀 DEPLOY PARA VERCEL - NewsFlow OS

## ✅ Checklist de Deploy

### 1. Configurar Variáveis de Ambiente no Vercel

Acesse: [Vercel Dashboard](https://vercel.com/dashboard) → Seu Projeto → Settings → Environment Variables

Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

**Onde encontrar:**
- **VITE_SUPABASE_URL**: Supabase Dashboard → Project Settings → API → Project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase Dashboard → Project Settings → API → Project API keys → `anon` `public`

### 2. Executar Migrations do Supabase

Acesse: Supabase Dashboard → SQL Editor → New Query

Execute as migrations na ordem:

1. **001_initial_schema.sql** - Schema inicial (nodes, edges, leads, etc.)
2. **002_logistics_and_meetings.sql** - Logística e reuniões
3. **003_feedback_system.sql** - Sistema de feedbacks (NOVO)

**OU via CLI:**
```bash
# Se tiver Supabase CLI instalado
supabase db push
```

### 3. Verificar Configuração do Vercel

O arquivo `vercel.json` já está configurado:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Deploy via CLI

#### Opção 1: Deploy Automatizado (Recomendado)

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# 2. Executar script de deploy
chmod +x deploy-production.sh
./deploy-production.sh
```

#### Opção 2: Deploy Manual

```bash
# 1. Build local (teste)
npm run build

# 2. Deploy para produção
vercel --prod
```

#### Opção 3: Via GitHub (Recomendado para CI/CD)

1. Conecte seu repositório no Vercel Dashboard
2. Configure as variáveis de ambiente
3. Deploy automático a cada push no `main`

### 5. Verificar Build Script no package.json

O `package.json` já tem o script de build configurado:

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "prebuild": "npm run check-schema",
    "deploy": "npm run dry-run && vercel --prod"
  }
}
```

## 📋 Tabelas Necessárias no Supabase

Verifique se todas as tabelas estão criadas:

- ✅ `nodes` - Workflow nodes
- ✅ `edges` - Conexões entre nodes
- ✅ `leads` - Leads comerciais
- ✅ `projects` - Projetos
- ✅ `team` - Membros da equipe
- ✅ `commissions` - Comissões
- ✅ `feedbacks` - Feedbacks da equipe (NOVO)
- ✅ `vehicles` - Frota de veículos
- ✅ `assets` - Ativos/equipamentos

## 🔧 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"
- ✅ Verifique se as variáveis estão configuradas no Vercel Dashboard
- ✅ Certifique-se de que os nomes estão corretos: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
- ✅ Refaça o deploy após adicionar variáveis

### Erro: "Build failed"
- ✅ Verifique o log de build no Vercel Dashboard
- ✅ Execute `npm run build` localmente para identificar erros
- ✅ Verifique se todas as dependências estão no `package.json`

### Erro: "Supabase connection failed"
- ✅ Verifique se a URL do Supabase está correta
- ✅ Verifique se a chave anon está correta
- ✅ Verifique se as RLS policies estão configuradas corretamente

## 🎯 Após o Deploy

1. **Teste o sistema:**
   - Acesse a URL do Vercel
   - Teste login/autenticação
   - Teste criação de nodes
   - Teste sistema de feedback

2. **Monitorar logs:**
   - Vercel Dashboard → Deployments → Logs
   - Supabase Dashboard → Logs

3. **Configurar domínio customizado:**
   - Vercel Dashboard → Settings → Domains
   - Adicione seu domínio personalizado

## 📝 Notas Importantes

- ⚠️ **Nunca commite** arquivos `.env.local` ou `.env` no git
- ✅ Use sempre variáveis de ambiente do Vercel para produção
- ✅ O `vercel.json` está configurado para SPA (Single Page Application)
- ✅ O build output está em `dist/`

## 🚀 Comando Rápido

```bash
# Deploy completo em uma linha
npm run build && vercel --prod
```

---

**Status:** ✅ Pronto para deploy!
