
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionStudySuggestion } from "../QuestionStudySuggestion";
import { QuestionExplanation } from "../QuestionExplanation";
import { Question } from "../../types/Question";

interface QuestionResultProps {
  isCorrect: boolean;
  respostaCorreta: string;
  comentario: string;
  question: Question;
  onTryAgain: () => void;
}

export const QuestionResult = ({
  isCorrect,
  respostaCorreta,
  comentario,
  question,
  onTryAgain
}: QuestionResultProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="p-6 rounded-lg border-l-4 animate-fade-in" style={{
        borderLeftColor: isCorrect ? "#10b981" : "#ef4444",
        backgroundColor: isCorrect ? "#f0fdf4" : "#fef2f2"
      }}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-lg font-bold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
            {isCorrect ? "✅ Correto!" : "❌ Incorreto!"}
          </span>
          <Badge 
            variant={isCorrect ? "default" : "destructive"}
            className={isCorrect ? "bg-green-500" : ""}
          >
            Resposta: {respostaCorreta}
          </Badge>
        </div>
        <div className="text-gray-700">
          <h4 className="font-medium mb-2">Comentário:</h4>
          <p className="leading-relaxed">{comentario}</p>
        </div>
      </div>

      <QuestionStudySuggestion 
        disciplina={question.disciplina}
        assunto={question.assunto}
        isCorrect={isCorrect}
      />

      <QuestionExplanation question={question} />

      <Button 
        onClick={onTryAgain}
        variant="outline"
        className="w-full border-police-200 text-police-700 hover:bg-police-50"
      >
        Tentar Novamente
      </Button>
    </div>
  );
};
