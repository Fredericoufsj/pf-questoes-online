import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "../types/Question";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AnswerHistoryModal } from "./AnswerHistoryModal";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userId?: string;
  fetchDailyUsage?: () => void;
}

interface UserAnswer {
  user_answer: string;
  is_correct: boolean;
  answered_at: string;
}

export const QuestionCard = ({ question, questionNumber, totalQuestions, userId, fetchDailyUsage }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { toast } = useToast();

  // Reset states when question changes
  useEffect(() => {
    setSelectedAnswer("");
    setShowAnswer(false);
    setAnswered(false);
    setUserAnswers([]);
    
    // Check if user has already answered this question
    if (userId) {
      checkUserAnswers();
    }
  }, [question.id, userId]);

  const checkUserAnswers = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_answers')
        .select('user_answer, is_correct, answered_at')
        .eq('user_id', userId)
        .eq('question_id', question.id)
        .order('answered_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar respostas do usuário:', error);
        return;
      }

      if (data && data.length > 0) {
        setUserAnswers(data);
      }
    } catch (error) {
      console.error('Erro ao verificar respostas:', error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === question.resposta_correta;
    setAnswered(true);
    setShowAnswer(true);

    // Save user answer if logged in
    if (userId) {
      try {
        const { error } = await supabase
          .from('user_answers')
          .insert({
            user_id: userId,
            question_id: question.id,
            user_answer: selectedAnswer,
            is_correct: isCorrect
          });

        if (error) {
          console.error('Erro ao salvar resposta:', error);
          toast({
            title: "Erro",
            description: "Não foi possível salvar sua resposta.",
            variant: "destructive"
          });
        } else {
          // Update local state with new answer
          const newAnswer = {
            user_answer: selectedAnswer,
            is_correct: isCorrect,
            answered_at: new Date().toISOString()
          };
          setUserAnswers(prev => [newAnswer, ...prev]);
          // Update daily usage after saving the answer
          if (fetchDailyUsage) fetchDailyUsage();
        }
      } catch (error) {
        console.error('Erro ao salvar resposta:', error);
      }
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer("");
    setShowAnswer(false);
    setAnswered(false);
  };

  const handleBadgeClick = () => {
    if (userAnswers.length > 0) {
      setShowHistoryModal(true);
    }
  };

  const isCorrect = selectedAnswer === question.resposta_correta;
  const hasAnswered = userAnswers.length > 0;
  const lastAnswer = userAnswers[0];

  return (
    <>
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
                {hasAnswered && (
                  <Badge 
                    variant="secondary" 
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      lastAnswer.is_correct 
                        ? "bg-green-500/80 text-white hover:bg-green-600/80" 
                        : "bg-red-500/80 text-white hover:bg-red-600/80"
                    }`}
                    onClick={handleBadgeClick}
                    title="Clique para ver o histórico completo"
                  >
                    {lastAnswer.is_correct ? "✅" : "❌"} Respondida ({userAnswers.length}x)
                  </Badge>
                )}
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
                    Resposta: {question.resposta_correta}
                  </Badge>
                </div>
                <div className="text-gray-700">
                  <h4 className="font-medium mb-2">Comentário:</h4>
                  <p className="leading-relaxed">{question.comentario}</p>
                </div>
              </div>

              {/* Try Again Button */}
              <Button 
                onClick={handleTryAgain}
                variant="outline"
                className="w-full border-police-200 text-police-700 hover:bg-police-50"
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Answer History Modal */}
      <AnswerHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        userAnswers={userAnswers}
        questionId={question.id}
      />
    </>
  );
};
