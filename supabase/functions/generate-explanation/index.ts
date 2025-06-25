
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExplanationRequest {
  question: string;
  answer: string;
  subject: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const huggingFaceToken = Deno.env.get("HUGGING_FACE_TOKEN");
    
    if (!huggingFaceToken) {
      console.error("Token do Hugging Face não configurado");
      return new Response(
        JSON.stringify({ error: "Token do Hugging Face não configurado" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const { question, answer, subject }: ExplanationRequest = await req.json();

    const prompt = `Como especialista em ${subject}, forneça uma explicação detalhada sobre esta questão espacial do universo Questonauta:

MISSÃO ESPACIAL: ${question}

RESPOSTA CORRETA: ${answer}

Por favor, forneça uma explicação que inclua:
1. 🌟 Conceito Principal: Explique o conceito fundamental
2. 🚀 Justificativa da Resposta: Por que esta é a resposta correta
3. 🛸 Exemplos Práticos: Situações onde este conhecimento se aplica
4. 💫 Dicas para Astronautas: Estratégias de estudo relacionadas

Mantenha um tom espacial e use terminologia do universo Questonauta (missões, astronautas, base espacial, etc.).`;

    console.log("Enviando requisição para Hugging Face...");
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${huggingFaceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API Hugging Face:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Erro da API: ${response.status}` }),
        { 
          status: response.status,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const result = await response.json();
    console.log("Resposta recebida da Hugging Face");

    let explanation = "";
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      explanation = result[0].generated_text.replace(prompt, "").trim();
    } else if (result.generated_text) {
      explanation = result.generated_text.replace(prompt, "").trim();
    } else {
      explanation = "🚀 Comando da base espacial: Não foi possível gerar explicação detalhada neste momento. Tente novamente mais tarde, astronauta!";
    }

    return new Response(
      JSON.stringify({ explanation }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error) {
    console.error("Erro na função generate-explanation:", error);
    return new Response(
      JSON.stringify({ error: "Falha na comunicação com a base espacial" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
