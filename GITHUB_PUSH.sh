#!/bin/bash

# ============================================================================
# NewsFlow OS - Push para GitHub
# Script automatizado para fazer push inicial para o repositório
# ============================================================================

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

REPO_URL="https://github.com/jmbento/NewsFlowOS.git"

echo -e "${BLUE}"
echo "═══════════════════════════════════════════════════════════"
echo "  🔗 Push para GitHub - NewsFlow OS"
echo "═══════════════════════════════════════════════════════════"
echo -e "${NC}\n"

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não encontrado. Instale o Git primeiro.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Verificando status do repositório...${NC}\n"

# Verificar se já é um repositório Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Repositório Git não encontrado. Inicializando...${NC}"
    git init
    echo -e "${GREEN}✅ Repositório Git inicializado${NC}\n"
fi

# Verificar remote origin
if git remote get-url origin &> /dev/null; then
    CURRENT_REMOTE=$(git remote get-url origin)
    if [ "$CURRENT_REMOTE" != "$REPO_URL" ]; then
        echo -e "${YELLOW}⚠️  Remote origin diferente. Atualizando...${NC}"
        git remote set-url origin "$REPO_URL"
        echo -e "${GREEN}✅ Remote origin atualizado${NC}\n"
    else
        echo -e "${GREEN}✅ Remote origin já configurado corretamente${NC}\n"
    fi
else
    echo -e "${BLUE}📝 Adicionando remote origin...${NC}"
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✅ Remote origin adicionado${NC}\n"
fi

# Verificar se há mudanças
if git diff --quiet && git diff --cached --quiet; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança para commit.${NC}"
    echo -e "${BLUE}💡 Todos os arquivos já estão commitados.${NC}\n"
    
    read -p "Deseja fazer push mesmo assim? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Operação cancelada.${NC}"
        exit 0
    fi
else
    echo -e "${BLUE}📦 Adicionando arquivos...${NC}"
    git add .
    echo -e "${GREEN}✅ Arquivos adicionados${NC}\n"
    
    echo -e "${BLUE}📝 Criando commit...${NC}"
    git commit -m "feat: NewsFlow OS - Deploy inicial

- Sistema completo de gestão editorial
- Canvas de workflow interativo (React Flow)
- CRM comercial com pipeline
- Organograma interativo (OrgCanvas)
- Brand Hub - Repositório de assets
- Sistema de feedback (FeedbackFAB)
- Dashboard Master com métricas
- Tracker & Time Tracking (MyWork)
- Integração Supabase completa
- Deploy configurado para Vercel
- UI/UX Light Precision Design System
- 100% em Português
- 16 rotas ativas
- 28 componentes React
- 18 serviços TypeScript"
    
    echo -e "${GREEN}✅ Commit criado${NC}\n"
fi

# Verificar branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${BLUE}📝 Renomeando branch para 'main'...${NC}"
    git branch -M main
    echo -e "${GREEN}✅ Branch renomeado para 'main'${NC}\n"
fi

# Push
echo -e "${BLUE}🚀 Fazendo push para GitHub...${NC}\n"
echo -e "${YELLOW}⚠️  Você precisará fazer login no GitHub se ainda não estiver autenticado.${NC}\n"

git push -u origin main

echo ""
echo -e "${GREEN}✅ Push concluído com sucesso!${NC}\n"
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo "   1. Acesse: https://github.com/jmbento/NewsFlowOS"
echo "   2. Verifique se o código foi enviado"
echo "   3. Conecte o repositório no Vercel Dashboard"
echo "   4. Configure variáveis de ambiente no Vercel"
echo "   5. Deploy automático será ativado! 🚀"
echo ""
