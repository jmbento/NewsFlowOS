# 🚨 COMANDO RÁPIDO - Para Reunião AGORA

## ⚡ Execute ESTES comandos no seu Terminal do MacBook:

```bash
# 1. Ir para o diretório
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes

# 2. Se der erro de .env.local, renomeie temporariamente:
mv .env.local .env.local.backup 2>/dev/null || true

# 3. Iniciar servidor
npm run dev
```

## 🌐 Acesse imediatamente:

**http://localhost:3000**

---

## 🔄 Se ainda não funcionar, tente:

```bash
# Opção 2: Build rápido e preview
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
npm run build
npm run preview
```

Acesse: **http://localhost:4173**

---

## 🎯 O que você verá:

1. **Canvas do React Flow** - Arraste nós e conecte
2. **NodeInspector** - Clique em um nó para ver detalhes
3. **Seção Financeira** - Em nós do tipo `campaign`
4. **Governança** - Campos bloqueados se não for ADMIN_COMERCIAL

---

## 🧪 Para testar governança na reunião:

Abra o Console (F12) e execute:

```javascript
// Permitir edição
import { setCurrentUser } from './services/governance';
setCurrentUser({ id: '1', email: 'comercial@newsflow.com', role: 'ADMIN_COMERCIAL' });
```

---

**EXECUTE AGORA NO SEU TERMINAL!** ⚡
