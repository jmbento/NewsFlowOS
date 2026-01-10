#!/bin/bash

# NewsFlow OS - Executar Migration 004 via Supabase CLI
# Este script executa a migration diretamente no Supabase

echo "═══════════════════════════════════════════════════════════════"
echo "  🔄 Executando Migration 004: Work Status"
echo "═══════════════════════════════════════════════════════════════"
echo ""

PROJECT_REF="ajgqxifhvlwudqlhsfqy"
MIGRATION_FILE="supabase/migrations/004_work_status.sql"

# Verificar se o arquivo existe
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ ERRO: Arquivo de migration não encontrado: $MIGRATION_FILE"
    exit 1
fi

echo "📋 Migration encontrada: $MIGRATION_FILE"
echo ""

# Tentar executar via Supabase CLI
echo "🔧 Tentando executar via Supabase CLI..."
echo ""

# Método 1: Usar db push (se o projeto estiver linkado)
if supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.${PROJECT_REF}.supabase.co:5432/postgres" 2>/dev/null; then
    echo "✅ Migration executada via db push!"
    exit 0
fi

# Método 2: Executar SQL diretamente via psql (se disponível)
echo "⚠️  Método CLI não disponível."
echo ""
echo "📋 EXECUTE MANUALMENTE NO SUPABASE DASHBOARD:"
echo ""
echo "1. Acesse: https://${PROJECT_REF}.supabase.co"
echo "2. Vá em: SQL Editor"
echo "3. Cole o conteúdo abaixo:"
echo ""
echo "═══════════════════════════════════════════════════════════════"
cat "$MIGRATION_FILE"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "✅ Após executar, a migration estará completa!"
