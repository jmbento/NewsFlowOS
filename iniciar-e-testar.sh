#!/bin/bash

echo "🚀 Iniciando NewsFlow OS para testes..."
echo ""

cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo ""
echo "════════════════════════════════════════════════"
echo "  🌐 Servidor iniciando..."
echo "════════════════════════════════════════════════"
echo ""
echo "  Acesse: http://localhost:3000"
echo ""
echo "  Testes disponíveis:"
echo "  ✅ Gravação de reunião"
echo "  ✅ Governança ADMIN_COMERCIAL"
echo "  ✅ Troca de idioma (PT/EN)"
echo "  ✅ Troca de tema (Dark/Light)"
echo "  ✅ CRM e conversão de leads"
echo "  ✅ Templates de campanha"
echo ""
echo "════════════════════════════════════════════════"
echo ""

npm run dev
