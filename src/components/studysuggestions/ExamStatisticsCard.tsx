
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ExamStatistic {
  disciplina: string;
  assunto: string;
  total_questions: number;
  percentage: number;
  priority_level: string; // Changed from union type to string
  exam_year: number;
}

interface ExamStatisticsCardProps {
  examStats: ExamStatistic[];
  getPriorityColor: (level: string) => string;
}

export const ExamStatisticsCard = ({ examStats, getPriorityColor }: ExamStatisticsCardProps) => {
  const groupedStats = examStats.reduce((acc, stat) => {
    if (!acc[stat.priority_level]) {
      acc[stat.priority_level] = [];
    }
    acc[stat.priority_level].push(stat);
    return acc;
  }, {} as Record<string, ExamStatistic[]>);

  const priorityOrder = ['alta', 'media', 'baixa'];
  const priorityLabels = {
    alta: 'Alta Prioridade',
    media: 'Média Prioridade', 
    baixa: 'Baixa Prioridade'
  };

  const priorityIcons = {
    alta: '🔥',
    media: '⚡',
    baixa: '📝'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Estatísticas Históricas - PF 2021
        </CardTitle>
        <p className="text-sm text-gray-600">
          Distribuição das questões por disciplina baseada em provas anteriores
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {priorityOrder.map(priority => {
            const stats = groupedStats[priority] || [];
            if (stats.length === 0) return null;

            return (
              <div key={priority} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{priorityIcons[priority as keyof typeof priorityIcons]}</span>
                  <h3 className="font-semibold text-lg">{priorityLabels[priority as keyof typeof priorityLabels]}</h3>
                  <Badge variant="outline">{stats.length} disciplinas</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">{stat.disciplina}</h4>
                          {stat.assunto !== 'Geral' && (
                            <p className="text-xs text-gray-600">{stat.assunto}</p>
                          )}
                        </div>
                        <Badge className={getPriorityColor(stat.priority_level)}>
                          {stat.percentage}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Peso na prova</span>
                          <span>{stat.total_questions} questões</span>
                        </div>
                        <Progress value={stat.percentage} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
