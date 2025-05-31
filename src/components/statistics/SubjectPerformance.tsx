
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PerformanceData {
  disciplina: string;
  assunto: string;
  total_questions: number;
  correct_answers: number;
  accuracy_percentage: number;
  last_answered_at: string;
}

interface SubjectPerformanceProps {
  performanceData: PerformanceData[];
}

export const SubjectPerformance = ({ performanceData }: SubjectPerformanceProps) => {
  // Agrupar por disciplina
  const groupedByDiscipline = performanceData.reduce((acc, item) => {
    if (!acc[item.disciplina]) {
      acc[item.disciplina] = [];
    }
    acc[item.disciplina].push(item);
    return acc;
  }, {} as Record<string, PerformanceData[]>);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (accuracy >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getProgressColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-500";
    if (accuracy >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDiscipline).map(([disciplina, subjects]) => {
        // Calcular estatísticas da disciplina
        const totalQuestions = subjects.reduce((sum, s) => sum + s.total_questions, 0);
        const totalCorrect = subjects.reduce((sum, s) => sum + s.correct_answers, 0);
        const disciplineAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

        return (
          <Card key={disciplina} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-police-800 to-police-600 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{disciplina}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {subjects.length} assuntos
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {totalQuestions} questões
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {disciplineAccuracy.toFixed(1)}% acerto
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {subjects
                  .sort((a, b) => b.accuracy_percentage - a.accuracy_percentage)
                  .map((subject, index) => (
                    <div key={subject.assunto} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{subject.assunto}</h4>
                          <p className="text-sm text-gray-600">
                            {subject.total_questions} questões • Última resposta: {new Date(subject.last_answered_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Badge className={getAccuracyColor(subject.accuracy_percentage)}>
                          {subject.accuracy_percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{subject.correct_answers}/{subject.total_questions} acertos</span>
                        </div>
                        <div className="relative">
                          <Progress value={subject.accuracy_percentage} className="h-2" />
                          <div 
                            className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(subject.accuracy_percentage)}`}
                            style={{ width: `${subject.accuracy_percentage}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-green-600">{subject.correct_answers}</div>
                          <div className="text-xs text-gray-500">Acertos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-red-600">{subject.total_questions - subject.correct_answers}</div>
                          <div className="text-xs text-gray-500">Erros</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
