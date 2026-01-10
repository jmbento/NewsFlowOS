# 🔧 Solução: Tela Preta

## ⚠️ Problema

O servidor Python serve arquivos estáticos, mas a aplicação React precisa ser **compilada** primeiro.

## ✅ Solução Rápida

### Opção 1: Script Automatizado (Recomendado)

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
./RESOLVER_TELA_PRETA.sh
```

### Opção 2: Comandos Manuais

```bash
# 1. Parar servidor Python atual
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
lsof -ti:3000 | xargs kill 2>/dev/null

# 2. Fazer build da aplicação
npm run build

# 3. Servir a pasta dist
cd dist
python3 -m http.server 3000
```

### Opção 3: Vite Dev Server (Melhor para desenvolvimento)

```bash
cd /Volumes/bxdMAC/Projetos-apps/newsflow-nodes
npm run dev
```

Acesse: **http://localhost:3000**

---

## 🎯 Por que tela preta?

- O servidor Python serve arquivos `.html`, `.js`, `.css` estáticos
- A aplicação React usa TypeScript/JSX que precisa ser compilado
- Sem build, o navegador não consegue processar os arquivos

## ✅ Solução

1. **Build primeiro**: `npm run build` compila tudo para `dist/`
2. **Servir dist/**: Servir a pasta `dist` com os arquivos compilados
3. **OU usar Vite**: `npm run dev` compila e serve automaticamente

---

**Execute o script ou os comandos acima no seu terminal!** 🚀
