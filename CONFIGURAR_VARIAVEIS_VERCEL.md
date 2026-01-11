# 🔧 Configurar Variáveis de Ambiente no Vercel

## ⚠️ Problema
O aviso "VARIÁVEIS NÃO ENCONTRADAS NO PREBUILD" aparece porque as variáveis são injetadas em **runtime** no Vercel, não durante o prebuild.

## ✅ Solução: Configurar Variáveis no Vercel Dashboard

### Passo a Passo:

1. **Acesse o Dashboard do Vercel:**
   - https://vercel.com/jose-bentos-projects/newsflow-nodes/settings/environment-variables

2. **Adicione as Variáveis:**
   
   **Variável 1:**
   - **Nome:** `VITE_SUPABASE_URL`
   - **Valor:** `https://ajgqxifhvlwudqlhsfqy.supabase.co`
   - **Ambientes:** ✅ Production, ✅ Preview, ✅ Development

   **Variável 2:**
   - **Nome:** `VITE_SUPABASE_ANON_KEY`
   - **Valor:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3F4aWZodmx3dWRxbGhzZnF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTEyMTcsImV4cCI6MjA4MzE4NzIxN30._1Mab1y6k5gW4s3_Xhg6b5A5Xa_KLtM2yRiTyzReRuU`
   - **Ambientes:** ✅ Production, ✅ Preview, ✅ Development

3. **Clique em "Save"**

4. **Faça um novo deploy:**
   ```bash
   vercel --prod --yes
   ```

## 🔍 Verificar se Estão Configuradas

Após configurar, você pode verificar nos logs do build:
- ✅ `VITE_SUPABASE_URL = https://ajgqxifhvlwudqlhsfqy...`
- ✅ `VITE_SUPABASE_ANON_KEY = eyJhbGciOi...`

## 💡 Nota Importante

O aviso "VARIÁVEIS NÃO ENCONTRADAS NO PREBUILD" é **normal** no Vercel porque:
- As variáveis são injetadas **durante o build**, não no prebuild
- O script de validação roda no **prebuild** (antes das variáveis serem injetadas)
- Isso **não impede** o funcionamento da aplicação

O código já está preparado para funcionar mesmo com esse aviso, pois:
- O script detecta que está no Vercel e não falha
- As variáveis serão validadas em **runtime** (quando a aplicação roda)

## 🚀 Após Configurar

Após adicionar as variáveis no Vercel Dashboard, faça um novo deploy e o aviso deve desaparecer ou ser menos visível.
