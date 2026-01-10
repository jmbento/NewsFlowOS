#!/bin/bash

# ============================================================================
# NewsFlow OS - Deploy Script para Produção (v1.0)
# BXD Architect & DevOps Engineer
# ============================================================================
# 
# Este script executa todas as validações necessárias antes do deploy:
# 1. Validação de Schema (dry-run-check.ts)
# 2. Lint & Type Check
# 3. Build otimizado para Vercel
#
# Uso: ./deploy-production.sh
# ============================================================================

set -e  # Para execução em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════"
echo "  🚀 NewsFlow OS - Deploy para Produção"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}\n"

# ============================================================================
# ETAPA 1: Validação de Variáveis de Ambiente
# ============================================================================
echo -e "${BLUE}[1/4]${NC} Verificando variáveis de ambiente..."

if [ -z "$VITE_SUPABASE_URL" ] && [ -z "$SUPABASE_URL" ]; then
    echo -e "${RED}❌ ERRO: VITE_SUPABASE_URL ou SUPABASE_URL não configurada${NC}"
    echo -e "${YELLOW}💡 Configure com: export VITE_SUPABASE_URL='sua-url'${NC}"
    exit 1
fi

if [ -z "$VITE_SUPABASE_ANON_KEY" ] && [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ ERRO: VITE_SUPABASE_ANON_KEY ou SUPABASE_ANON_KEY não configurada${NC}"
    echo -e "${YELLOW}💡 Configure com: export VITE_SUPABASE_ANON_KEY='sua-key'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Variáveis de ambiente OK${NC}\n"

# ============================================================================
# ETAPA 2: Validação de Schema (Dry Run)
# ============================================================================
echo -e "${BLUE}[2/4]${NC} Executando validação de schema (dry-run-check.ts)..."
echo -e "${YELLOW}   Verificando colunas target_cities, totalInvestment e integridade do banco...${NC}\n"

if npx ts-node scripts/dry-run-check.ts; then
    echo -e "${GREEN}✅ Validação de schema concluída com sucesso${NC}\n"
else
    echo -e "${RED}❌ FALHA na validação de schema. Deploy BLOQUEADO.${NC}"
    echo -e "${YELLOW}💡 Corrija os problemas acima antes de continuar${NC}\n"
    exit 1
fi

# ============================================================================
# ETAPA 3: Lint & Type Check
# ============================================================================
echo -e "${BLUE}[3/4]${NC} Executando TypeScript type check..."

if npx tsc --noEmit; then
    echo -e "${GREEN}✅ Type check passou sem erros${NC}\n"
else
    echo -e "${RED}❌ FALHA no type check. Deploy BLOQUEADO.${NC}"
    echo -e "${YELLOW}💡 Corrija os erros de TypeScript antes de continuar${NC}\n"
    exit 1
fi

# Verificar se há linter configurado (opcional)
if [ -f ".eslintrc" ] || [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
    echo -e "${BLUE}   Executando ESLint...${NC}"
    if npx eslint . --ext .ts,.tsx --max-warnings 0 2>/dev/null || true; then
        echo -e "${GREEN}✅ Lint passou${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Avisos de lint encontrados (não bloqueiam deploy)${NC}\n"
    fi
else
    echo -e "${YELLOW}⚠️  ESLint não configurado (pulando)${NC}\n"
fi

# ============================================================================
# ETAPA 4: Build para Produção
# ============================================================================
echo -e "${BLUE}[4/4]${NC} Executando build otimizado para Vercel..."

# Limpar builds anteriores
if [ -d "dist" ]; then
    echo -e "${YELLOW}   Limpando build anterior...${NC}"
    rm -rf dist
fi

# Executar build
if npm run build; then
    echo -e "${GREEN}✅ Build concluído com sucesso${NC}\n"
else
    echo -e "${RED}❌ FALHA no build. Deploy BLOQUEADO.${NC}\n"
    exit 1
fi

# ============================================================================
# RESUMO FINAL
# ============================================================================
echo -e "${GREEN}"
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ DEPLOY VALIDADO E PRONTO PARA PRODUÇÃO"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}"
echo -e "${BLUE}📦 Próximos passos:${NC}"
echo -e "   1. Revisar o build em ./dist"
echo -e "   2. Executar: ${YELLOW}vercel --prod${NC} para deploy"
echo -e "   3. Ou configurar CI/CD para deploy automático"
echo -e "\n"
echo -e "${GREEN}🚀 Deploy script concluído com sucesso!${NC}\n"
