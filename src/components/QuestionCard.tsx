
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "../types/Question";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard = ({ question, questionNumber, totalQuestions }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      setAnswered(true);
      setShowAnswer(true);
    }
  };

  const isCorrect = selectedAnswer === question.resposta_correta;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-police-800 to-police-600 text-white rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                Questão {questionNumber} de {totalQuestions}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {question.id}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span>📅 {question.ano}</span>
              <span>•</span>
              <span>🏛️ {question.banca}</span>
              <span>•</span>
              <span>🎯 {question.orgao}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Metadata */}
        <div className="mb-6 p-4 bg-police-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-police-800">Disciplina:</span>
              <Badge variant="outline" className="ml-2 border-police-200 text-police-700">
                {question.disciplina}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-police-800">Assunto:</span>
              <Badge variant="outline" className="ml-2 border-police-200 text-police-700">
                {question.assunto}
              </Badge>
            </div>
          </div>
        </div>

        {/* Question Text */}
        {question.enunciado && (
          <div className="mb-4">
            <h3 className="font-medium text-police-800 mb-2">Enunciado:</h3>
            <p className="text-gray-700 leading-relaxed">{question.enunciado}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-medium text-police-800 mb-3">Comando:</h3>
          <p className="text-gray-800 font-medium leading-relaxed bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            {question.comando}
          </p>
        </div>

        {/* Options */}
        <div className="mb-6">
          <h3 className="font-medium text-police-800 mb-3">Alternativas:</h3>
          <RadioGroup 
            value={selectedAnswer} 
            onValueChange={setSelectedAnswer}
            disabled={answered}
            className="space-y-3"
          >
            {question.alternativas.map((alternativa, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                  answered 
                    ? alternativa === question.resposta_correta
                      ? "border-green-500 bg-green-50"
                      : alternativa === selectedAnswer
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-gray-50"
                    : selectedAnswer === alternativa
                    ? "border-police-500 bg-police-50"
                    : "border-gray-200 hover:border-police-300 hover:bg-police-25"
                }`}
              >
                <RadioGroupItem 
                  value={alternativa} 
                  id={`option-${index}`}
                  className={answered && alternativa === question.resposta_correta ? "border-green-500" : ""}
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer font-medium"
                >
                  {alternativa}
                </Label>
                {answered && alternativa === question.resposta_correta && (
                  <Badge className="bg-green-500 text-white">Correta</Badge>
                )}
                {answered && alternativa === selectedAnswer && alternativa !== question.resposta_correta && (
                  <Badge variant="destructive">Sua resposta</Badge>
                )}
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Submit Button */}
        {!answered && (
          <Button 
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="w-full bg-gradient-to-r from-police-600 to-police-500 hover:from-police-700 hover:to-police-600 text-white font-medium py-3"
          >
            Responder
          </Button>
        )}

        {/* Answer and Explanation */}
        {showAnswer && (
          <div className="mt-6 p-6 rounded-lg border-l-4 animate-fade-in" style={{
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
                Resposta: {question.resposta_correta}
              </Badge>
            </div>
            <div className="text-gray-700">
              <h4 className="font-medium mb-2">Comentário:</h4>
              <p className="leading-relaxed">{question.comentario}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
