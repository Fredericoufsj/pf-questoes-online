
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Question } from "../types/Question";

interface QuestionExplanationProps {
  question: Question;
}

export const QuestionExplanation = ({ question }: QuestionExplanationProps) => {
  const [explanation, setExplanation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { toast } = useToast();

  const generateExplanation = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-explanation', {
        body: {
          question: question.enunciado,
          command: question.comando,
          alternatives: question.alternativas,
          correctAnswer: question.resposta_correta,
          comment: question.comentario,
          subject: question.assunto,
          discipline: question.disciplina
        }
      });

      if (error) {
        console.error('Erro ao gerar explicação:', error);
        toast({
          title: "Erro",
          description: "Não foi possível gerar a explicação. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      if (data?.explanation) {
        setExplanation(data.explanation);
        setHasGenerated(true);
        toast({
          title: "Sucesso",
          description: "Explicação detalhada gerada com sucesso!",
        });
      } else {
        throw new Error('Resposta vazia da API');
      }

    } catch (error) {
      console.error('Erro ao gerar explicação:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatExplanation = (text: string) => {
    // Quebra o texto em seções baseadas nos títulos
    const sections = text.split(/(?=\d+\.\s+[A-Z]+:)/);
    
    return sections.map((section, index) => {
      if (!section.trim()) return null;
      
      // Identifica se é um título (começa com número seguido de ponto e texto em maiúscula)
      const titleMatch = section.match(/^(\d+\.\s+[A-Z\s]+:)/);
      
      if (titleMatch) {
        const title = titleMatch[1];
        const content = section.replace(titleMatch[1], '').trim();
        
        return (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-police-800 mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {title}
            </h4>
            <p className="text-gray-700 leading-relaxed pl-6">{content}</p>
          </div>
        );
      } else {
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-3">
            {section.trim()}
          </p>
        );
      }
    }).filter(Boolean);
  };

  return (
    <div className="mt-6">
      {!hasGenerated ? (
        <Button
          onClick={generateExplanation}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Gerando explicação detalhada...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Obter Explicação Detalhada com IA
            </>
          )}
        </Button>
      ) : (
        <Card className="border-l-4 border-l-purple-500 bg-purple-50 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-purple-800">
              <Brain className="h-5 w-5" />
              Explicação Detalhada por IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              {formatExplanation(explanation)}
            </div>
            
            <div className="pt-4 border-t border-purple-200">
              <Button
                onClick={() => {
                  setHasGenerated(false);
                  setExplanation("");
                }}
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Brain className="h-3 w-3 mr-1" />
                Gerar Nova Explicação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
