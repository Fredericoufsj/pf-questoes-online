import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question } from "../types/Question";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AnswerHistoryModal } from "./AnswerHistoryModal";
import { QuestionHeader } from "./question/QuestionHeader";
import { QuestionMetadata } from "./question/QuestionMetadata";
import { QuestionContent } from "./question/QuestionContent";
import { QuestionOptions } from "./question/QuestionOptions";
import { QuestionResult } from "./question/QuestionResult";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userId?: string;
  fetchDailyUsage?: () => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
}

interface UserAnswer {
  user_answer: string;
  is_correct: boolean;
  answered_at: string;
}

export const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  userId, 
  fetchDailyUsage,
  goToPreviousQuestion,
  goToNextQuestion 
}: QuestionCardProps) => {
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

    // Verificar se o usuário está logado
    if (!userId) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para responder questões.",
        variant: "destructive"
      });
      // Redirect to auth page
      window.location.href = '/auth';
      return;
    }

    const isCorrect = selectedAnswer === question.resposta_correta;
    setAnswered(true);
    setShowAnswer(true);

    // Save user answer if logged in
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
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          questionId={question.id}
          ano={question.ano}
          banca={question.banca}
          orgao={question.orgao}
          hasAnswered={hasAnswered}
          lastAnswer={lastAnswer}
          userAnswersCount={userAnswers.length}
          onBadgeClick={handleBadgeClick}
          userId={userId}
        />

        <CardContent className="p-6">
          <QuestionMetadata
            disciplina={question.disciplina}
            assunto={question.assunto}
          />

          <QuestionContent
            enunciado={question.enunciado}
            comando={question.comando}
          />

          <QuestionOptions
            alternativas={question.alternativas}
            selectedAnswer={selectedAnswer}
            onSelectedAnswerChange={setSelectedAnswer}
            answered={answered}
            respostaCorreta={question.resposta_correta}
          />

          {/* Submit Button */}
          {!answered && (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={userId && !selectedAnswer}
              className="w-full bg-gradient-to-r from-police-600 to-police-500 hover:from-police-700 hover:to-police-600 text-white font-medium py-3"
            >
              {!userId ? "Faça login para responder" : "Responder"}
            </Button>
          )}

          {/* Answer and Explanation */}
          {showAnswer && (
            <QuestionResult
              isCorrect={isCorrect}
              respostaCorreta={question.resposta_correta}
              comentario={question.comentario}
              question={question}
              onTryAgain={handleTryAgain}
            />
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
