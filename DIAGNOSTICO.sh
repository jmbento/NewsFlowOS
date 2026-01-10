#!/bin/bash

# ============================================================================
# NewsFlow OS - Diagnóstico de Ambiente
# Script para verificar o que está instalado e configurado
# ============================================================================

echo "🔍 DIAGNÓSTICO DO AMBIENTE - NewsFlow OS"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📦 VERIFICANDO INSTALAÇÕES:${NC}\n"

# Git
echo -n "Git: "
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ Instalado${NC} ($(git --version | cut -d' ' -f3))"
else
    echo -e "${RED}❌ Não instalado${NC}"
fi

# Node
echo -n "Node.js: "
if command -v node &> /dev/null; then
    echo -e "${GREEN}✅ Instalado${NC} ($(node --version))"
else
    echo -e "${RED}❌ Não instalado${NC}"
fi

# npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ Instalado${NC} ($(npm --version))"
else
    echo -e "${RED}❌ Não instalado${NC}"
fi

# Vercel CLI
echo -n "Vercel CLI: "
if command -v vercel &> /dev/null; then
    echo -e "${GREEN}✅ Instalado${NC} ($(vercel --version 2>/dev/null || echo 'versão desconhecida'))"
else
    echo -e "${YELLOW}⚠️  Não instalado${NC} (execute: npm i -g vercel)"
fi

# Supabase CLI
echo -n "Supabase CLI: "
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✅ Instalado${NC} ($(supabase --version 2>/dev/null || echo 'versão desconhecida'))"
else
    echo -e "${YELLOW}⚠️  Não instalado${NC} (opcional - execute: npm i -g supabase)"
fi

echo ""
echo -e "${BLUE}🔐 VERIFICANDO CONFIGURAÇÕES GIT:${NC}\n"

# Git user.name
echo -n "Git user.name: "
GIT_NAME=$(git config --global user.name 2>/dev/null)
if [ -z "$GIT_NAME" ]; then
    echo -e "${YELLOW}⚠️  Não configurado${NC} (execute: git config --global user.name 'Seu Nome')"
else
    echo -e "${GREEN}✅ Configurado${NC} ($GIT_NAME)"
fi

# Git user.email
echo -n "Git user.email: "
GIT_EMAIL=$(git config --global user.email 2>/dev/null)
if [ -z "$GIT_EMAIL" ]; then
    echo -e "${YELLOW}⚠️  Não configurado${NC} (execute: git config --global user.email 'seu@email.com')"
else
    echo -e "${GREEN}✅ Configurado${NC} ($GIT_EMAIL)"
fi

echo ""
echo -e "${BLUE}📁 VERIFICANDO REPOSITÓRIO GIT:${NC}\n"

# Verificar se é repositório Git
if [ -d ".git" ]; then
    echo -e "${GREEN}✅ Repositório Git inicializado${NC}"
    
    # Verificar remote
    echo -n "Remote origin: "
    REMOTE=$(git remote get-url origin 2>/dev/null)
    if [ -z "$REMOTE" ]; then
        echo -e "${YELLOW}⚠️  Não configurado${NC}"
    else
        echo -e "${GREEN}✅ Configurado${NC} ($REMOTE)"
    fi
    
    # Verificar branch
    echo -n "Branch atual: "
    BRANCH=$(git branch --show-current 2>/dev/null)
    if [ -z "$BRANCH" ]; then
        echo -e "${YELLOW}⚠️  Nenhuma branch${NC}"
    else
        echo -e "${GREEN}✅ $BRANCH${NC}"
    fi
    
    # Verificar commits
    echo -n "Commits: "
    COMMITS=$(git log --oneline 2>/dev/null | wc -l | tr -d ' ')
    if [ "$COMMITS" -eq 0 ]; then
        echo -e "${YELLOW}⚠️  Nenhum commit${NC}"
    else
        echo -e "${GREEN}✅ $COMMITS commit(s)${NC}"
    fi
    
    # Verificar arquivos não commitados
    echo -n "Arquivos não commitados: "
    UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
    if [ "$UNCOMMITTED" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $UNCOMMITTED arquivo(s)${NC}"
    else
        echo -e "${GREEN}✅ Todos commitados${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Não é um repositório Git${NC} (execute: git init)"
fi

echo ""
echo -e "${BLUE}🔑 VERIFICANDO VARIÁVEIS DE AMBIENTE:${NC}\n"

# Verificar variáveis locais
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Arquivo .env.local encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env.local não encontrado${NC} (opcional para local)"
fi

# Verificar variáveis do sistema
echo -n "VITE_SUPABASE_URL: "
if [ -z "$VITE_SUPABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  Não configurado${NC}"
else
    echo -e "${GREEN}✅ Configurado${NC}"
fi

echo -n "VITE_SUPABASE_ANON_KEY: "
if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${YELLOW}⚠️  Não configurado${NC}"
else
    echo -e "${GREEN}✅ Configurado${NC}"
fi

echo ""
echo -e "${BLUE}📦 VERIFICANDO DEPENDÊNCIAS:${NC}\n"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules encontrado${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules não encontrado${NC} (execute: npm install)"
fi

if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json encontrado${NC}"
else
    echo -e "${RED}❌ package.json não encontrado${NC}"
fi

echo ""
echo -e "${BLUE}🚀 VERIFICANDO VERCEL:${NC}\n"

# Verificar login Vercel
if vercel whoami &> /dev/null; then
    USER=$(vercel whoami 2>/dev/null)
    echo -e "${GREEN}✅ Logado no Vercel${NC} ($USER)"
else
    echo -e "${YELLOW}⚠️  Não logado no Vercel${NC} (execute: vercel login)"
fi

echo ""
echo -e "${BLUE}📋 RESUMO:${NC}\n"
echo "Execute os comandos acima para verificar cada item."
echo "Me diga quais itens estão com ❌ ou ⚠️ para eu te ajudar!"
echo ""
