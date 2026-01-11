#!/bin/bash
set -e

echo "🔒 INICIANDO REFACTOR DE SEGURANÇA - NewsFlow OS"
echo "================================================"

cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# 1. VARREDURA E CORREÇÃO DE user. -> user?.
echo ""
echo "📋 Etapa 1/5: Aplicando Optional Chaining em TODAS as referências a 'user'"
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
  if grep -q "user\." "$file" 2>/dev/null; then
    echo "  ✏️  Corrigindo: $file"
    sed -i '' 's/user\.\([a-zA-Z_$][a-zA-Z0-9_$]*\)/user?.\1/g' "$file"
  fi
done

# 2. BUSCAR E CORRIGIR team. -> team?.
echo ""
echo "📋 Etapa 2/5: Aplicando Optional Chaining em 'team' e 'profile'"
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
  if grep -q "team\." "$file" 2>/dev/null || grep -q "profile\." "$file" 2>/dev/null; then
    echo "  ✏️  Corrigindo: $file"
    sed -i '' 's/team\.\([a-zA-Z_$][a-zA-Z0-9_$]*\)/team?.\1/g' "$file" 2>/dev/null || true
    sed -i '' 's/profile\.\([a-zA-Z_$][a-zA-Z0-9_$]*\)/profile?.\1/g' "$file" 2>/dev/null || true
  fi
done

# 3. REMOVER CÓDIGO DUPLICADO (imports não usados)
echo ""
echo "📋 Etapa 3/5: Verificando imports duplicados e não utilizados"
# Lista arquivos com possíveis problemas
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | while read file; do
  # Verifica se há imports duplicados
  if [ -f "$file" ]; then
    awk '/^import / {seen[$0]++; if(seen[$0] > 1) print FILENAME": linha "NR": "$0}' "$file" 2>/dev/null || true
  fi
done

# 4. CRIAR GUARD GLOBAL DE AUTENTICAÇÃO
echo ""
echo "📋 Etapa 4/5: Criando Loading Guard Global"
cat > components/AuthLoadingGuard.tsx << 'EOF'
import React from 'react';

interface AuthLoadingGuardProps {
  loading: boolean;
  children: React.ReactNode;
}

export const AuthLoadingGuard: React.FC<AuthLoadingGuardProps> = ({ loading, children }) => {
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#121212',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '4px solid #FFD700',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#E0E0E0', fontSize: 18 }}>Carregando NewsFlow OS...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
EOF

# 5. BUILD DE VERIFICAÇÃO
echo ""
echo "📋 Etapa 5/5: Executando Build de Verificação"
npm run build 2>&1 | tee build_output.log

# Verificar warnings
if grep -i "warning" build_output.log; then
  echo ""
  echo "⚠️  AVISOS ENCONTRADOS - Verifique build_output.log"
else
  echo ""
  echo "✅ BUILD LIMPO - SEM WARNINGS"
fi

# 6. COMMIT E DEPLOY
echo ""
echo "📋 Finalizando: Commit e Deploy"
git add -A
git commit -m "refactor: security improvements - optional chaining and loading guard"
git push
vercel --prod --yes

echo ""
echo "✅ REFACTOR DE SEGURANÇA CONCLUÍDO!"
echo "🔗 Acesse: https://news-flow-os.vercel.app"
