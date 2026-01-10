# 🚀 Iniciar NewsFlow OS no Localhost

## ⚡ Início Rápido

### 1. Configurar Variáveis de Ambiente (se ainda não configurado)

```bash
export VITE_SUPABASE_URL='sua-url-do-supabase'
export VITE_SUPABASE_ANON_KEY='sua-chave-anon-do-supabase'
```

**OU** crie um arquivo `.env.local` na raiz:

```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

### 2. Instalar Dependências (se ainda não instalou)

```bash
npm install
```

### 3. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em:
- **Local**: http://localhost:3000
- **Rede**: http://0.0.0.0:3000 (acessível de outros dispositivos na mesma rede)

---

## 🧪 Testar a Governança

### 1. Abrir o Console do Navegador (F12)

### 2. Definir Usuário ADMIN_COMERCIAL (pode editar valores)

```javascript
// No console do navegador
import { setCurrentUser } from './services/governance';
setCurrentUser({ 
  id: '1', 
  email: 'comercial@newsflow.com', 
  role: 'ADMIN_COMERCIAL' 
});
console.log('✅ Usuário ADMIN_COMERCIAL definido');
```

### 3. Testar com Usuário Sem Permissão

```javascript
// No console do navegador
import { setCurrentUser } from './services/governance';
setCurrentUser({ 
  id: '2', 
  email: 'editor@newsflow.com', 
  role: 'EDITOR' 
});
console.log('🔒 Usuário EDITOR definido (sem permissão)');
```

### 4. Testar no NodeInspector

1. Crie ou selecione um nó do tipo `campaign` no canvas
2. Abra o NodeInspector (clique no nó)
3. Role até a seção "💰 Dados Financeiros"
4. Tente editar o campo "Investimento Total (R$)"

**Com ADMIN_COMERCIAL:**
- ✅ Campo editável
- ✅ Pode alterar valores

**Com EDITOR/DESIGNER:**
- 🔒 Campo bloqueado (vermelho claro)
- 🔒 Badge "ADMIN_COMERCIAL" visível
- ❌ Não pode editar

---

## 🎯 Funcionalidades para Testar

### ✅ Script de Deploy
```bash
./deploy-production.sh
```

### ✅ Validação de Schema
```bash
npm run dry-run
```

### ✅ Type Check
```bash
npx tsc --noEmit
```

### ✅ Build Local
```bash
npm run build
npm run preview  # Preview do build em http://localhost:4173
```

---

## 🔍 Verificar se Está Rodando

Após executar `npm run dev`, você verá:

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  press h + enter to show help
```

---

## 🐛 Troubleshooting

### Porta 3000 já em uso?

O Vite tentará usar outra porta automaticamente, ou você pode especificar:

```bash
npm run dev -- --port 3001
```

### Erro de conexão com Supabase?

1. Verifique as variáveis de ambiente
2. Teste a conexão: `npm run dry-run`
3. Verifique se a URL do Supabase está correta

### Erro de módulos não encontrados?

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Acessar de Outros Dispositivos

Se você estiver na mesma rede Wi-Fi:

1. Descubra o IP da sua máquina:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

2. Acesse de outro dispositivo:
```
http://SEU-IP:3000
```

---

**🎉 Pronto! A aplicação está rodando em localhost!**
