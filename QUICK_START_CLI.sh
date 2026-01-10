#!/bin/bash

# ============================================================================
# NewsFlow OS - Quick Start CLI Script
# Setup rápido via CLI para Vercel e Supabase
# ============================================================================

set -e

echo "🚀 NewsFlow OS - Quick Start CLI"
echo "=================================="
echo ""

# Verificar se CLI estão instalados
echo "📦 Verificando CLIs instalados..."
echo ""

if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI não encontrado. Instalando..."
    npm i -g vercel
else
    echo "✅ Vercel CLI instalado"
fi

if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI não encontrado. Instalando..."
    npm i -g supabase
else
    echo "✅ Supabase CLI instalado"
fi

echo ""
echo "🔐 Autenticação"
echo "================"
echo ""

# Login Vercel
if ! vercel whoami &> /dev/null; then
    echo "📝 Faça login no Vercel:"
    vercel login
else
    echo "✅ Vercel: Já autenticado ($(vercel whoami))"
fi

# Login Supabase
echo ""
echo "📝 Faça login no Supabase:"
supabase login

echo ""
echo "📋 Configuração"
echo "==============="
echo ""

# Link Vercel
echo "🔗 Linkando projeto com Vercel..."
read -p "Deseja linkar com projeto Vercel existente? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    vercel link
fi

# Link Supabase
echo ""
echo "🔗 Linkando projeto com Supabase..."
read -p "Digite o Project Ref do Supabase (ou Enter para pular): " project_ref
if [ ! -z "$project_ref" ]; then
    supabase link --project-ref "$project_ref"
fi

echo ""
echo "🗄️  Supabase Local"
echo "=================="
echo ""

read -p "Deseja iniciar Supabase localmente? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    if [ ! -f "supabase/config.toml" ]; then
        echo "📝 Inicializando projeto Supabase..."
        supabase init
    fi
    echo "🚀 Iniciando Supabase local..."
    supabase start
    echo ""
    echo "✅ Supabase local rodando!"
    echo "   URL: http://localhost:54321"
fi

echo ""
echo "📦 Dependências"
echo "==============="
echo ""

if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
else
    echo "✅ Dependências já instaladas"
fi

echo ""
echo "✅ Setup completo!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure variáveis de ambiente: vercel env add"
echo "   2. Aplique migrations: supabase db push"
echo "   3. Deploy: vercel --prod"
echo ""
