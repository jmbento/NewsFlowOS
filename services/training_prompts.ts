
/**
 * Training Prompts Service (v12.0)
 * Prompts pré-configurados para auxiliar o comercial na argumentação de vendas.
 */

export const TrainingPrompts = {
  ARGUMENTO_ALCANCE: {
    title: "📊 Argumento de Alcance",
    prompt: `O Diário do Vale possui números impressionantes de audiência digital:
    
• **15 MILHÕES** de visualizações mensais no Instagram (@diariodovale_).
• **1.6 MILHÃO** de visualizações mensais no site diariodovale.com.br.
• **2.5 MILHÕES** de alcance mensal no Facebook.
• Tempo médio de leitura de **3 minutos** por matéria.

Isso significa que seu investimento atinge uma audiência engajada e qualificada, com métricas de retenção superiores ao mercado regional.`,
    useCase: "Quando o cliente questionar o alcance digital da campanha."
  },

  ARGUMENTO_ABRANGENCIA: {
    title: "🗺️ Argumento de Abrangência",
    prompt: `O Diário do Vale é o único veículo com presença consolidada em **20 cidades estratégicas** do Sul Fluminense:

• **Volta Redonda** (Centro Econômico)
• **Barra Mansa** (Hub Industrial)
• **Resende** (Polo Automotivo)
• **Itatiaia**, **Porto Real**, **Pinheiral**, **Vassouras**, **Barra do Piraí**, entre outras.

Nenhum outro veículo cobre a região com essa capilaridade. Seu investimento não fica restrito a uma cidade, ele permeia todo o ecossistema econômico do Sul Fluminense.`,
    useCase: "Quando o cliente tiver operações em múltiplas cidades da região."
  },

  ARGUMENTO_AUTORIDADE: {
    title: "🏆 Argumento de Autoridade",
    prompt: `O Diário do Vale detém **33 anos de liderança absoluta** no mercado editorial do Sul Fluminense:

• **Credibilidade institucional**: Reconhecido como a voz oficial da região.
• **Indexação permanente**: Conteúdo ranqueado eternamente no Google News.
• **Editoria de referência**: Jornalistas premiados e equipe de produção multimídia.
• **Tiragem diária de 12.000 exemplares** com taxa de leitura compartilhada de 3.5x.

Associar sua marca ao Diário do Vale é associar-se à história, à confiança e à autoridade do Sul Fluminense.`,
    useCase: "Quando o cliente buscar credibilidade e posicionamento de marca."
  },

  ARGUMENTO_ESG: {
    title: "🌿 Argumento ESG",
    prompt: `O pacote ESG do Diário do Vale (R$ 40k) é um investimento em narrativa sustentável:

• **4 Reportagens Exclusivas** em vídeo (3-5 min cada).
• **4 Capas de Jornal Impresso** dedicadas às práticas ESG da empresa.
• **Drops de 30 segundos** para redes sociais (altíssimo engajamento).
• **Indexação eterna** no Google, garantindo visibilidade por anos.

ESG não é custo, é posicionamento estratégico. Empresas com narrativa ESG bem construída têm valorização de marca 23% superior.`,
    useCase: "Quando o cliente tiver metas de sustentabilidade ou relatórios ESG."
  },

  ARGUMENTO_INSTITUCIONAL: {
    title: "🎂 Argumento Institucional (Aniversários)",
    prompt: `O pacote Institucional (R$ 25k) é ideal para aniversários de empresa:

• **Storytelling Impresso**: Matéria de página inteira contando a história da empresa.
• **Documentário Curto**: Vídeo de 3-5 minutos para redes sociais e site.
• **Drops de Reels**: Conteúdo viral de 30 segundos.
• **Cronograma de 3 semanas**: Aquecimento → Lançamento → Visão de Futuro.

Transforme a comemoração em uma campanha de reposicionamento de marca.`,
    useCase: "Quando o cliente estiver celebrando marcos institucionais."
  }
};

export const getPromptByType = (type: keyof typeof TrainingPrompts) => TrainingPrompts[type];
