# Guia de Deploy: NewsFlow OS (v5.0) 🚀🌐

Siga este checklist para colocar a plataforma em órbita de produção.

## 1. Cloud Infrastructure (Supabase)
- Crie um projeto no Supabase.
- Execute o arquivo `services/schema.sql` (ou equivalente) no SQL Editor.
- Garanta que as tabelas `nodes`, `edges`, `messages` e `profiles` existam.
- Ative o **Realtime** para a tabela `messages`.

## 2. Environment Variables (Vercel)
Configure as seguintes chaves no painel da Vercel:

| Variável | Valor/Origem |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Project Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Supabase Project Settings > API (anon public) |
| `VITE_GEMINI_API_KEY` | Google AI Studio (Gemini Pro) |
| `WHATSAPP_API_KEY` | Meta for Developers (WA Business API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Apenas para Edge Functions (Uso Interno) |

## 3. Deploy Command
```bash
npm install
npm run build
```
O Vercel detectará o `vercel.json` e configurará os redirecionamentos SPA automaticamente.

---
**Lead Architect**: BXD (Finalized v5.2)
