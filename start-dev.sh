#!/bin/bash

# Script para iniciar o servidor de desenvolvimento
# Use este script se houver problemas de permissão com npm run dev

echo "🚀 Iniciando NewsFlow OS em modo desenvolvimento..."
echo ""

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Iniciar servidor
echo "🌐 Iniciando servidor Vite..."
echo "   Acesse: http://localhost:3000"
echo ""

npm run dev

