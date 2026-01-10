#!/bin/bash

# ============================================================================
# NewsFlow OS - Configuração de Variáveis no Vercel
# ============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════"
echo "  🔑 Configuração de Variáveis no Vercel"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}\n"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado. Instalando...${NC}"
    npm i -g vercel
fi

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Faça login no Vercel primeiro:${NC}"
    vercel login
fi

echo -e "${GREEN}✅ Vercel CLI configurado${NC}\n"

# Variáveis do Supabase
SUPABASE_URL="https://ajgqxifhvlwudqlhsfqy.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU"

echo -e "${BLUE}📋 Variáveis a configurar:${NC}"
echo "   VITE_SUPABASE_URL=$SUPABASE_URL"
echo "   VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
echo ""

read -p "Deseja configurar essas variáveis no Vercel? (s/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}🔧 Configurando variáveis...${NC}"
    
    # Adicionar variáveis para produção
    echo "📦 Adicionando para produção..."
    vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL" || echo "Variável já existe ou erro ao adicionar"
    vercel env add VITE_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY" || echo "Variável já existe ou erro ao adicionar"
    
    # Adicionar para preview
    echo "📦 Adicionando para preview..."
    vercel env add VITE_SUPABASE_URL preview <<< "$SUPABASE_URL" || echo "Variável já existe ou erro ao adicionar"
    vercel env add VITE_SUPABASE_ANON_KEY preview <<< "$SUPABASE_ANON_KEY" || echo "Variável já existe ou erro ao adicionar"
    
    # Adicionar para desenvolvimento
    echo "📦 Adicionando para desenvolvimento..."
    vercel env add VITE_SUPABASE_URL development <<< "$SUPABASE_URL" || echo "Variável já existe ou erro ao adicionar"
    vercel env add VITE_SUPABASE_ANON_KEY development <<< "$SUPABASE_ANON_KEY" || echo "Variável já existe ou erro ao adicionar"
    
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
