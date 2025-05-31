
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserAnswer {
  user_answer: string;
  is_correct: boolean;
  answered_at: string;
}

interface AnswerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAnswers: UserAnswer[];
  questionId: string;
}

export const AnswerHistoryModal = ({ 
  isOpen, 
  onClose, 
  userAnswers, 
  questionId 
}: AnswerHistoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📊 Histórico de Respostas
            <Badge variant="outline" className="ml-2">
              Questão {questionId}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total de tentativas: {userAnswers.length}</span>
            <span>
              Acertos: {userAnswers.filter(a => a.is_correct).length} / {userAnswers.length}
            </span>
          </div>

          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {userAnswers.map((answer, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    answer.is_correct 
                      ? "border-green-200 bg-green-50" 
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={answer.is_correct ? "default" : "destructive"}
                        className={answer.is_correct ? "bg-green-500" : ""}
                      >
                        {answer.is_correct ? "✅ Correto" : "❌ Incorreto"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Tentativa {userAnswers.length - index}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(answer.answered_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Resposta escolhida:</span>
                    <p className="mt-1 text-gray-800 bg-white p-2 rounded border">
                      {answer.user_answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
