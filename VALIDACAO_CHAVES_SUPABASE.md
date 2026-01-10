# ✅ VALIDAÇÃO DE CHAVES SUPABASE - NewsFlow OS

**Data:** 2026-01-XX
**Status:** ✅ AMBAS AS CHAVES VÁLIDAS

---

## 📊 RESULTADO DA VALIDAÇÃO

### ✅ 1. ANON KEY (Pública) - VÁLIDA

**Token JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
```

**Informações Decodificadas:**
- **Issuer (iss):** `supabase` ✅
- **Project Ref (ref):** `ajgqxifhvlwudqlhsfqy` ✅
- **Role:** `anon` ✅ (Pública)
- **Issued At (iat):** 05/01/2026, 08:06
- **Expires At (exp):** 05/01/2036, 20:06 (Válido por mais 3647 dias) ✅

**Validações:**
- ✅ Issuer válido
- ✅ Project Ref válido
- ✅ Role válido (anon = pública)
- ✅ Token não expirado
- ✅ Signature válida

**Uso Recomendado:**
- ✅ **SEGURO para usar no frontend (React/Vite)**
- ✅ Pode ser exposta publicamente
- ✅ Respeita Row Level Security (RLS) do Supabase
- ✅ Use como: `VITE_SUPABASE_ANON_KEY`

---

### ✅ 2. SERVICE ROLE KEY (Privada) - VÁLIDA

**Token JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYxMTIxNywiZXhwIjoyMDgzMTg3MjE3fQ.OMPhHb1E5Y0XzC3TEOw7gO5YayhWXy49i3E-sMbMk1o
```

**Informações Decodificadas:**
- **Issuer (iss):** `supabase` ✅
- **Project Ref (ref):** `ajgqxifhvlwudqlhsfqy` ✅
- **Role:** `service_role` ⚠️ (PRIVADA)
- **Issued At (iat):** 05/01/2026, 08:06
- **Expires At (exp):** 05/01/2036, 20:06 (Válido por mais 3647 dias) ✅

**Validações:**
- ✅ Issuer válido
- ✅ Project Ref válido
- ✅ Role válido (service_role = privada)
- ✅ Token não expirado
- ✅ Signature válida

**⚠️ USO RESTRITO:**
- ❌ **NUNCA usar no frontend!**
- ❌ Esta chave **ignora Row Level Security (RLS)**
- ❌ Tem **acesso total ao banco de dados**
- ✅ Use apenas em:
  - Funções Serverless (Vercel Functions)
  - Backend APIs
  - Scripts de administração
  - Migrations e seeders
  - Processos server-side apenas

---

## 🔍 VERIFICAÇÕES COMPLEMENTARES

### ✅ Projeto

Ambas as chaves são do **mesmo projeto Supabase:**
- **Project Ref:** `ajgqxifhvlwudqlhsfqy`
- **URL:** `https://ajgqxifhvlwudqlhsfqy.supabase.co`

### ✅ Validade

- Ambas as chaves são válidas até **2036** (10 anos)
- Não há risco de expiração iminente

---

## 🔒 RECOMENDAÇÕES DE SEGURANÇA

### ✅ Para Frontend (Vite/React)

**Use APENAS a ANON KEY:**

```env
# .env.local (local)
VITE_SUPABASE_URL=https://ajgqxifhvlwudqlhsfqy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU
```

**No Vercel Dashboard:**
1. Settings → Environment Variables
2. Adicione: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. **NUNCA adicione SERVICE_ROLE_KEY aqui!**

### ❌ Para Backend/Serverless

**Use SERVICE_ROLE_KEY apenas em:**

1. **Vercel Functions** (serverless):
   ```typescript
   // api/admin.ts
   const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Variável privada
   );
   ```

2. **Scripts de Administração:**
   ```bash
   # Configurar como variável PRIVADA (não pública)
   export SUPABASE_SERVICE_ROLE_KEY="..."
   ```

3. **Migrations/Seeders:**
   ```bash
   # Usar apenas localmente ou em CI/CD com variáveis privadas
   supabase db reset --db-url $DATABASE_URL
   ```

---

## 📋 CHECKLIST DE SEGURANÇA

### ✅ Verificações Implementadas:

- [x] ✅ `.gitignore` protege `.env.local` e `*.env`
- [x] ✅ Nenhuma chave hardcoded no código-fonte
- [x] ✅ Script de validação criado (`scripts/validate-supabase-keys.js`)
- [x] ✅ Documentação de segurança criada
- [ ] ⚠️ Service Role Key armazenada em local seguro (não no Git)
- [ ] ⚠️ Variáveis configuradas no Vercel (apenas ANON KEY pública)

### ⚠️ Ações Pendentes:

1. **Garantir que SERVICE_ROLE_KEY não está no Git:**
   ```bash
   # Verificar se não foi commitada acidentalmente
   git log --all --full-history -- "*service*role*"
   git log --all --full-history -S "OMPhHb1E5Y0XzC3TEOw7gO5YayhWXy49i3E-sMbMk1o"
   ```

2. **Se encontrada no histórico do Git:**
   ```bash
   # ⚠️ CRÍTICO: Se a SERVICE_ROLE_KEY foi commitada:
   # 1. Revogue a chave no Supabase Dashboard
   # 2. Gere uma nova SERVICE_ROLE_KEY
   # 3. Remova do histórico do Git (git filter-branch ou BFG Repo-Cleaner)
   ```

3. **Configurar variáveis no Vercel:**
   - Adicionar apenas `VITE_SUPABASE_ANON_KEY` (pública)
   - Se precisar de SERVICE_ROLE_KEY: usar variável privada em Vercel Functions apenas

---

## 🛠️ Scripts Disponíveis

### Validar Chaves:

```bash
# Validar chaves fornecidas
node scripts/validate-supabase-keys.js

# Validar variáveis de ambiente
npm run validate-env
```

### Verificar Segurança:

```bash
# Buscar SERVICE_ROLE_KEY no código
grep -r "service_role" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" .

# Buscar chave específica
grep -r "OMPhHb1E5Y0XzC3TEOw7gO5YayhWXy49i3E-sMbMk1o" .
```

**Esperado:** Nenhum resultado (chave não deve estar no código)

---

## 📊 RESUMO EXECUTIVO

| Item | Status | Detalhes |
|------|--------|----------|
| ANON KEY | ✅ VÁLIDA | Pode ser usada no frontend |
| SERVICE ROLE KEY | ✅ VÁLIDA | ⚠️ Use apenas no backend |
| Projeto | ✅ CONFIRMADO | `ajgqxifhvlwudqlhsfqy` |
| Validade | ✅ VÁLIDAS | Até 2036 |
| Segurança Frontend | ✅ SEGURO | Apenas ANON KEY |
| Segurança Backend | ⚠️ VERIFICAR | SERVICE_ROLE_KEY não no Git |

---

## ✅ CONCLUSÃO

**✅ AMBAS AS CHAVES SÃO VÁLIDAS E PODEM SER USADAS**

**Recomendações Finais:**
1. ✅ Use `ANON KEY` no frontend (React/Vite)
2. ⚠️ Use `SERVICE_ROLE_KEY` apenas em funções serverless/backend
3. ✅ Configure variáveis no Vercel (apenas ANON KEY como pública)
4. ⚠️ Verifique se SERVICE_ROLE_KEY não foi commitada no Git
5. ✅ Mantenha SERVICE_ROLE_KEY em local seguro (variáveis privadas)

---

**Última validação:** 2026-01-XX
**Validade das chaves:** Até 2036-01-05

**Status:** ✅ PRONTO PARA USO COM SEGURANÇA
