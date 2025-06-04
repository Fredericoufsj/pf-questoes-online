
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { question, command, alternatives, correctAnswer, comment, subject, discipline } = await req.json()

    const huggingFaceToken = Deno.env.get('HUGGING_FACE_TOKEN')
    
    if (!huggingFaceToken) {
      throw new Error('Token do Hugging Face não configurado')
    }

    const prompt = `
Como um especialista em ${discipline}, especificamente em ${subject}, explique detalhadamente a seguinte questão de concurso:

QUESTÃO: ${question}
COMANDO: ${command}
ALTERNATIVAS: ${alternatives.join('; ')}
RESPOSTA CORRETA: ${correctAnswer}
COMENTÁRIO OFICIAL: ${comment}

Por favor, forneça uma explicação didática e detalhada que inclua:

1. CONCEITO PRINCIPAL: Explique o conceito fundamental abordado na questão
2. ANÁLISE DA QUESTÃO: Analise por que a resposta correta está certa e por que as outras estão erradas
3. EXEMPLOS PRÁTICOS: Dê exemplos relacionados ao tema para facilitar o entendimento
4. DICAS DE ESTUDO: Sugira pontos importantes para estudar sobre este assunto

Responda de forma clara, didática e estruturada, como se estivesse ensinando para um estudante.
`

    console.log('Enviando prompt para Hugging Face:', prompt.substring(0, 200) + '...')

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro da API Hugging Face:', response.status, errorText)
      throw new Error(`Erro da API: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Resposta da Hugging Face recebida')

    if (Array.isArray(result) && result.length > 0) {
      const explanation = result[0].generated_text
      
      // Remove o prompt da resposta, mantendo apenas a explicação gerada
      const cleanedExplanation = explanation.replace(prompt, '').trim()
      
      return new Response(
        JSON.stringify({ explanation: cleanedExplanation }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Formato de resposta inesperado da API')
    }

  } catch (error) {
    console.error('Erro ao gerar explicação:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao gerar explicação',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
