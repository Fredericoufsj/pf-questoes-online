
import { Badge } from "@/components/ui/badge";
import { QuestionReportModal } from "../QuestionReportModal";

interface QuestionHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  questionId: string;
  ano: number;
  banca: string;
  orgao: string;
  hasAnswered: boolean;
  lastAnswer?: {
    is_correct: boolean;
  };
  userAnswersCount: number;
  onBadgeClick: () => void;
  userId?: string;
}

export const QuestionHeader = ({
  questionNumber,
  totalQuestions,
  questionId,
  ano,
  banca,
  orgao,
  hasAnswered,
  lastAnswer,
  userAnswersCount,
  onBadgeClick,
  userId
}: QuestionHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-police-800 to-police-600 text-white rounded-t-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Questão {questionNumber} de {totalQuestions}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {questionId}
            </Badge>
            {hasAnswered && lastAnswer && (
              <Badge 
                variant="secondary" 
                className={`cursor-pointer transition-all hover:scale-105 ${
                  lastAnswer.is_correct 
                    ? "bg-green-500/80 text-white hover:bg-green-600/80" 
                    : "bg-red-500/80 text-white hover:bg-red-600/80"
                }`}
                onClick={onBadgeClick}
                title="Clique para ver o histórico completo"
              >
                {lastAnswer.is_correct ? "✅" : "❌"} Respondida ({userAnswersCount}x)
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span>📅 {ano}</span>
            <span>•</span>
            <span>🏛️ {banca}</span>
            <span>•</span>
            <span>🎯 {orgao}</span>
          </div>
        </div>
        <div className="ml-4">
          <QuestionReportModal 
            questionId={questionId} 
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};
