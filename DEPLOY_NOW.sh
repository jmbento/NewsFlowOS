#!/bin/bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
git add -A
git commit -m "fix: remove undefined user reference"
git push
vercel --prod --yes
echo "✅ DEPLOY CONCLUÍDO!"
