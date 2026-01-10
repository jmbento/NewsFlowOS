# 🔧 Solução: Servidor não está rodando

## ⚠️ Problema Identificado

O Vite está tentando ler o arquivo `.env.local` mas há restrições de permissão no ambiente sandbox.

## ✅ Solução: Execute no Seu Terminal

Como o sandbox tem restrições, você precisa executar diretamente no seu terminal do MacBook:

### Opção 1: Script Automatizado (Recomendado)

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
./start-dev.sh
```

### Opção 2: Comando Direto

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
npm run dev
```

### Opção 3: Se ainda der erro de permissão

Tente renomear temporariamente o `.env.local`:

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
mv .env.local .env.local.backup
npm run dev
```

Depois, se precisar, restaure:
```bash
mv .env.local.backup .env.local
```

## 🌐 Após Iniciar

O servidor estará disponível em:
- **http://localhost:3000**

Você verá algo como:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

## 🧪 Testar a Governança

1. Abra http://localhost:3000 no navegador
2. Abra o Console (F12)
3. Execute:

```javascript
// Para testar com ADMIN_COMERCIAL (pode editar)
import { setCurrentUser } from './services/governance';
setCurrentUser({ 
  id: '1', 
  email: 'comercial@newsflow.com', 
  role: 'ADMIN_COMERCIAL' 
});
console.log('✅ Usuário ADMIN_COMERCIAL definido');

// Depois selecione um nó do tipo 'campaign' e veja os campos financeiros editáveis
```

Ou para testar sem permissão:

```javascript
// Para testar sem permissão (campos bloqueados)
setCurrentUser({ 
  id: '2', 
  email: 'editor@newsflow.com', 
  role: 'EDITOR' 
});
console.log('🔒 Usuário EDITOR definido (sem permissão)');
```

## 📝 Nota sobre o Sandbox

O ambiente sandbox do Cursor tem restrições de acesso a arquivos que podem impedir o Vite de ler `.env.local`. Executando diretamente no seu terminal, essas restrições não se aplicam.

---

**Execute no seu terminal e me avise se funcionou!** 🚀
