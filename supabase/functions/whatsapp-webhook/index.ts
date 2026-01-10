
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  try {
    const { method } = req

    // Verificação de Webhook (GET)
    if (method === 'GET') {
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      if (mode === 'subscribe' && token === 'newsflow_secret_token') {
        return new Response(challenge, { status: 200 })
      }
      return new Response('Forbidden', { status: 403 })
    }

    // Recebimento de Mensagem (POST)
    const body = await req.json()
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]

    if (message) {
      const from = message.from // Telefone do remetente
      const text = message.text?.body

      // 1. Identificar usuário/projeto vinculado
      // (Simplificado para o exercício: inserindo direto em global messages)
      const { data: userData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('phone', from)
        .single()

      // 2. Inserir na tabela de mensagens
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          content: text,
          sender_name: userData?.full_name || from,
          sender_id: userData?.id || null,
          is_whatsapp: true,
          whatsapp_from: from
        })

      if (insertError) throw insertError

      // 3. IA de Resposta Automática (Keyword Logic)
      if (text.toLowerCase().includes('status') || text.toLowerCase().includes('prazo')) {
        // Busca o nó mais recente vinculado ao telefone
        const { data: nodeData } = await supabase
          .from('nodes')
          .select('data')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (nodeData) {
          const status = nodeData.data.status || 'todo'
          const deadline = nodeData.data.deadline || 'Não definido'
          
          // Aqui dispararia uma resposta via API do WhatsApp
          console.log(`[WA_AUTO_REPLY] Status: ${status}, Prazo: ${deadline}`)
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
