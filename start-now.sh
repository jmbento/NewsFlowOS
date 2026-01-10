#!/bin/bash

echo "🚀 INICIANDO SERVIDOR PARA REUNIÃO..."
echo ""

cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Tentar renomear .env.local se causar problema
if [ -f ".env.local" ]; then
    echo "⚠️  Renomeando .env.local temporariamente..."
    mv .env.local .env.local.backup 2>/dev/null || true
fi

echo "🌐 Iniciando servidor Vite..."
echo ""
echo "════════════════════════════════════════════════"
echo "  ✅ Acesse: http://localhost:3000"
echo "════════════════════════════════════════════════"
echo ""

npm run dev
