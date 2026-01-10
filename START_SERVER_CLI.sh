#!/bin/bash

# Script para iniciar servidor via CLI usando Python
# Resolve problemas de permissão do sandbox

echo "🚀 Iniciando NewsFlow OS via Python HTTP Server..."
echo ""

cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Verificar se Python está disponível
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado. Instalando dependências..."
    exit 1
fi

# Tornar executável
chmod +x server.py

# Iniciar servidor
echo "🌐 Servidor iniciando em http://localhost:3000"
echo ""
python3 server.py
