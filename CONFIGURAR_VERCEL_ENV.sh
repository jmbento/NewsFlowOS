#!/bin/bash

# ============================================================================
# NewsFlow OS - Configurar Variáveis de Ambiente no Vercel
# ============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════"
echo "  🔑 Configurar Variáveis no Vercel - NewsFlow OS"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}\n"

# Variáveis do Supabase
SUPABASE_URL="https://ajgqxifhvlwudqlhsfqy.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado.${NC}"
    echo -e "${BLUE}💡 Instalando Vercel CLI...${NC}"
    npm i -g vercel
    echo -e "${GREEN}✅ Vercel CLI instalado${NC}\n"
fi

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você precisa fazer login no Vercel primeiro.${NC}"
    echo -e "${BLUE}💡 Executando: vercel login${NC}\n"
    vercel login
fi

echo -e "${GREEN}✅ Vercel CLI configurado${NC}\n"

# Verificar se está linkado a um projeto
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}⚠️  Projeto não está linkado ao Vercel.${NC}"
    echo -e "${BLUE}💡 Executando: vercel link${NC}\n"
    vercel link
fi

echo -e "${BLUE}📋 Variáveis a configurar:${NC}"
echo "   VITE_SUPABASE_URL=$SUPABASE_URL"
echo "   VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:0:50}..."
echo ""

read -p "Deseja configurar essas variáveis no Vercel? (s/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}🔧 Configurando variáveis...${NC}\n"
    
    # Adicionar variáveis para produção
    echo -e "${BLUE}📦 Adicionando para produção...${NC}"
    echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL production 2>&1 | grep -v "already exists" || echo "✅ VITE_SUPABASE_URL (production) configurada"
    echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY production 2>&1 | grep -v "already exists" || echo "✅ VITE_SUPABASE_ANON_KEY (production) configurada"
    
    # Adicionar para preview
    echo -e "\n${BLUE}📦 Adicionando para preview...${NC}"
    echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL preview 2>&1 | grep -v "already exists" || echo "✅ VITE_SUPABASE_URL (preview) configurada"
    echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY preview 2>&1 | grep -v "already exists" || echo "✅ VITE_SUPABASE_ANON_KEY (preview) configurada"
    
    # Adicionar para desenvolvimento
    echo -e "\n${BLUE}📦 Adicionando para desenvolvimento...${NC}"
    echo "$SUPABASE_URL" | vercel env add VITE_SUPABASE_URL development 2>&1 | grep -v "already exists" || echo "✅ VITE_SUPABASE_URL (development) configurada"
    echo "$SUPABASE_ANON_KEY" | vercel env add VITE_SUPABASE_ANON_KEY development 2>&1 | grep -v "already exists" || echo "✅ VITE_SUPABASE_ANON_KEY (development) configurada"
    
    echo ""
    echo -e "${GREEN}✅ Variáveis configuradas!${NC}"
    echo ""
    echo -e "${BLUE}📋 Listar variáveis configuradas:${NC}"
    vercel env ls
else
    echo ""
    echo -e "${YELLOW}ℹ️  Variáveis não foram configuradas.${NC}"
    echo -e "${YELLOW}💡 Configure manualmente no Vercel Dashboard ou execute novamente este script.${NC}"
fi

echo ""
echo -e "${GREEN}✅ Script concluído!${NC}\n"
