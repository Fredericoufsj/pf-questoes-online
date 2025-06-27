
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AlertTriangle } from "lucide-react";

interface QuestionReportModalProps {
  questionId: string;
  userId?: string;
}

export const QuestionReportModal = ({ questionId, userId }: QuestionReportModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reportTypeOptions = [
    { value: "erro_alternativa", label: "Erro nas alternativas" },
    { value: "erro_gabarito", label: "Erro no gabarito/resposta correta" },
    { value: "erro_enunciado", label: "Erro no enunciado" },
    { value: "erro_comentario", label: "Erro no comentário/explicação" },
    { value: "outros", label: "Outros erros" }
  ];

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "🔐 Login necessário",
        description: "Você precisa estar logado para reportar erros.",
        variant: "destructive"
      });
      return;
    }

    if (!reportType || !description.trim()) {
      toast({
        title: "⚠️ Campos obrigatórios",
        description: "Por favor, selecione o tipo de erro e descreva o problema.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('question_reports')
        .insert({
          user_id: userId,
          question_id: questionId,
          report_type: reportType,
          description: description.trim()
        });

      if (error) {
        console.error('Erro ao enviar reporte:', error);
        toast({
          title: "❌ Erro no sistema",
          description: "Não foi possível enviar o reporte. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "✅ Reporte enviado!",
        description: "Obrigado pelo feedback. Vamos analisar sua sugestão.",
      });

      // Reset form and close modal
      setReportType("");
      setDescription("");
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao enviar reporte:', error);
      toast({
        title: "❌ Erro inesperado",
        description: "Algo deu errado. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-orange-400 text-orange-600 hover:bg-orange-50"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Reportar Erro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Reportar Erro na Questão
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="report-type">Tipo de erro *</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o tipo de erro" />
              </SelectTrigger>
              <SelectContent>
                {reportTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição do problema *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o erro encontrado..."
              className="mt-1 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-slate-500 mt-1">
              {description.length}/500 caracteres
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={loading || !reportType || !description.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {loading ? "Enviando..." : "Enviar Reporte"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
