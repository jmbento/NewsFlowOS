#!/bin/bash

echo "🧪 Testando build sem validação de schema..."
echo ""

cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Build direto sem prebuild (pula check-schema)
echo "📦 Executando build..."
npx vite build 2>&1 | tail -20

echo ""
echo "✅ Teste concluído!"
