#!/bin/bash
echo "🚀 Iniciando NewsFlow OS..."
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
echo "🌐 Servidor em: http://localhost:3000"
python3 -m http.server 3000
