# 🚀 NewsFlow OS - Instruções de Deploy para Produção

## 📋 Pré-requisitos

1. **Node.js** instalado (v18+)
2. **Vercel CLI** instalado (`npm i -g vercel`)
3. **Variáveis de ambiente** configuradas:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 🔧 Configuração Inicial

### 1. Configurar Variáveis de Ambiente

No terminal do MacBook, execute:

```bash
export VITE_SUPABASE_URL='sua-url-do-supabase'
export VITE_SUPABASE_ANON_KEY='sua-chave-anon-do-supabase'
```

**OU** crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

### 2. Instalar Dependências

```bash
npm install
```

## 🚀 Executando o Deploy

### Opção 1: Script Automatizado (Recomendado)

```bash
./deploy-production.sh
```

O script executará automaticamente:
1. ✅ Validação de variáveis de ambiente
2. ✅ Validação de schema (dry-run-check.ts)
   - Verifica conexão com Supabase
   - Valida colunas críticas (target_cities, totalInvestment)
   - Testa modelos R$ 25k (Institucional) e R$ 40k (ESG)
3. ✅ TypeScript type check
4. ✅ Build otimizado para produção

### Opção 2: Deploy Manual

Se preferir executar manualmente:

```bash
# 1. Validar schema
npm run dry-run

# 2. Type check
npx tsc --noEmit

# 3. Build
npm run build

# 4. Deploy no Vercel
vercel --prod
```

## 📊 Validações do Schema

O script `dry-run-check.ts` valida:

- ✅ **Conexão com Supabase**: Handshake com o banco
- ✅ **Colunas críticas**: `nodes.data`, `edges.source`, `leads.status`
- ✅ **Modelos de Proposta**:
  - R$ 25.000 (Institucional) - `INSTITUCIONAL_ANNIVERSARY`
  - R$ 40.000 (ESG) - `ESG_PRACTICES`
- ✅ **target_cities**: Valida cidades permitidas:
  - Resende
  - Barra Mansa
  - Volta Redonda
  - Itatiaia
  - Porto Real
  - Pinheiral

## 🔐 Governança de Acesso

### Roles Implementadas

- **ADMIN_COMERCIAL**: Pode editar `totalInvestment` e `roiStats`
- **ADMIN**: Acesso total
- **EDITOR/DESIGNER/VIEWER**: Apenas leitura de dados financeiros

### Como Configurar Usuário

Atualmente, o sistema usa um mock de autenticação. Para produção, integre com Supabase Auth:

```typescript
// Em services/governance.ts
import { supabase } from './supabase';

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Buscar role do user_metadata ou tabela de usuários
  return {
    id: user.id,
    email: user.email,
    role: user.user_metadata?.role || 'VIEWER'
  };
}
```

### Proteções Implementadas

1. **NodeInspector**: Campos de investimento e ROI bloqueados para não-ADMIN_COMERCIAL
2. **store.ts**: Validação no `updateNodeData` antes de persistir
3. **Validação de Faixas**: Alerta se valor não estiver próximo de R$ 25k ou R$ 40k

## 🐛 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"

```bash
# Verificar se estão configuradas
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Se vazias, configurar:
export VITE_SUPABASE_URL='sua-url'
export VITE_SUPABASE_ANON_KEY='sua-key'
```

### Erro: "Schema validation failed"

1. Verifique a conexão com Supabase
2. Execute manualmente: `npm run dry-run`
3. Verifique se as tabelas existem no banco

### Erro: "Type check failed"

```bash
# Ver erros detalhados
npx tsc --noEmit

# Corrigir erros de TypeScript antes de continuar
```

### Erro: "Build failed"

```bash
# Limpar cache e node_modules
rm -rf node_modules dist
npm install
npm run build
```

## 📝 Checklist de Deploy

Antes de executar o deploy, verifique:

- [ ] Variáveis de ambiente configuradas
- [ ] Schema do banco atualizado (migrations aplicadas)
- [ ] Type check passando (`npx tsc --noEmit`)
- [ ] Dry-run passando (`npm run dry-run`)
- [ ] Build local funcionando (`npm run build`)
- [ ] Vercel CLI instalado e autenticado (`vercel login`)

## 🔄 Deploy Automatizado (CI/CD)

Para configurar deploy automático no Vercel:

1. Conecte o repositório no dashboard do Vercel
2. Configure as variáveis de ambiente no Vercel
3. O Vercel executará automaticamente:
   - `npm run build` (definido em `package.json`)
   - Deploy para produção

**Nota**: O script `deploy-production.sh` pode ser integrado ao CI/CD como step de validação pré-deploy.

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs do script
2. Execute cada etapa manualmente para identificar o problema
3. Consulte a documentação do Supabase e Vercel

---

**Versão**: 1.0  
**Última atualização**: 2024  
**Mantido por**: BXD Architect & DevOps Engineer
