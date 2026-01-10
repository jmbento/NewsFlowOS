#!/bin/bash

echo "🔧 Resolvendo tela preta - Compilando aplicação..."
echo ""

cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Parar servidor Python se estiver rodando
echo "🛑 Parando servidores antigos..."
lsof -ti:3000 | xargs kill 2>/dev/null || true
sleep 1

# Fazer build
echo "📦 Compilando aplicação React..."
npm run build

# Verificar se build foi bem-sucedido
if [ -d "dist" ]; then
    echo ""
    echo "✅ Build concluído com sucesso!"
    echo ""
    echo "🌐 Iniciando servidor na pasta dist..."
    cd dist
    python3 -m http.server 3000 &
    SERVER_PID=$!
    
    echo ""
    echo "════════════════════════════════════════════════"
    echo "  ✅ SERVIDOR RODANDO!"
    echo "════════════════════════════════════════════════"
    echo "  🌐 Acesse: http://localhost:3000"
    echo "  🛑 Para parar: kill $SERVER_PID"
    echo "════════════════════════════════════════════════"
else
    echo ""
    echo "❌ Build falhou. Tentando iniciar Vite dev server..."
    echo ""
    echo "🌐 Iniciando Vite dev server (com hot-reload)..."
    npm run dev
fi
