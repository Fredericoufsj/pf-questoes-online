
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PerformanceData {
  disciplina: string;
  assunto: string;
  total_questions: number;
  correct_answers: number;
  accuracy_percentage: number;
  last_answered_at: string;
}

interface WeakAreasTableProps {
  performanceData: PerformanceData[];
}

export const WeakAreasTable = ({ performanceData }: WeakAreasTableProps) => {
  // Identificar pontos fracos (menos de 70% de acerto e pelo menos 3 questões)
  const weakAreas = performanceData
    .filter(item => item.accuracy_percentage < 70 && item.total_questions >= 3)
    .sort((a, b) => a.accuracy_percentage - b.accuracy_percentage);

  // Assuntos que precisam de mais prática (menos de 5 questões respondidas)
  const needMorePractice = performanceData
    .filter(item => item.total_questions < 5)
    .sort((a, b) => a.total_questions - b.total_questions);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (accuracy >= 50) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getPriorityLevel = (accuracy: number, totalQuestions: number) => {
    if (accuracy < 50) return { level: "Alta", color: "bg-red-500" };
    if (accuracy < 70) return { level: "Média", color: "bg-orange-500" };
    if (totalQuestions < 3) return { level: "Baixa", color: "bg-yellow-500" };
    return { level: "Baixa", color: "bg-gray-500" };
  };

  return (
    <div className="space-y-6">
      {/* Pontos Fracos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚠️ Pontos Fracos Identificados
            <Badge variant="outline" className="ml-2">
              {weakAreas.length} assuntos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weakAreas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Taxa de Acerto</TableHead>
                    <TableHead>Questões</TableHead>
                    <TableHead>Última Tentativa</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weakAreas.map((item, index) => {
                    const priority = getPriorityLevel(item.accuracy_percentage, item.total_questions);
                    return (
                      <TableRow key={item.assunto}>
                        <TableCell>
                          <Badge className={`${priority.color} text-white`}>
                            {priority.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.disciplina}</TableCell>
                        <TableCell>{item.assunto}</TableCell>
                        <TableCell>
                          <Badge className={getAccuracyColor(item.accuracy_percentage)}>
                            {item.accuracy_percentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {item.correct_answers}/{item.total_questions}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(item.last_answered_at).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Redirecionar para a página principal com filtro aplicado
                              const url = `/?disciplina=${encodeURIComponent(item.disciplina)}&assunto=${encodeURIComponent(item.assunto)}`;
                              window.location.href = url;
                            }}
                          >
                            Praticar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎉</div>
              <p>Parabéns! Você não tem pontos fracos significativos.</p>
              <p className="text-sm">Continue praticando para manter seu bom desempenho.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assuntos que Precisam de Mais Prática */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📚 Precisa de Mais Prática
            <Badge variant="outline" className="ml-2">
              {needMorePractice.length} assuntos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {needMorePractice.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {needMorePractice.map((item) => (
                <div key={item.assunto} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-800 mb-1">{item.assunto}</h4>
                    <p className="text-sm text-gray-600">{item.disciplina}</p>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Questões respondidas:</span>
                      <span className="font-medium">{item.total_questions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de acerto:</span>
                      <Badge className={getAccuracyColor(item.accuracy_percentage)}>
                        {item.accuracy_percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      const url = `/?disciplina=${encodeURIComponent(item.disciplina)}&assunto=${encodeURIComponent(item.assunto)}`;
                      window.location.href = url;
                    }}
                  >
                    Praticar Mais
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">✅</div>
              <p>Você já praticou bastante em todos os assuntos!</p>
              <p className="text-sm">Continue respondendo questões para manter-se atualizado.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendações Personalizadas */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">🎯 Recomendações Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weakAreas.length > 0 && (
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-1">Foque nos pontos fracos</h5>
                <p className="text-sm text-blue-600">
                  Concentre-se primeiro nos assuntos com menor taxa de acerto: <strong>{weakAreas[0]?.assunto}</strong> ({weakAreas[0]?.accuracy_percentage.toFixed(1)}%)
                </p>
              </div>
            )}
            
            {needMorePractice.length > 0 && (
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-1">Aumente a prática</h5>
                <p className="text-sm text-blue-600">
                  Responda mais questões sobre: <strong>{needMorePractice.slice(0, 3).map(item => item.assunto).join(', ')}</strong>
                </p>
              </div>
            )}
            
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-800 mb-1">Meta sugerida</h5>
              <p className="text-sm text-blue-600">
                Tente atingir pelo menos 80% de acerto em todos os assuntos com mais de 10 questões respondidas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
