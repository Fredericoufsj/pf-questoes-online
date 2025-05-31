
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UserStats {
  total_answers: number;
  correct_answers: number;
  accuracy_percentage: number;
  disciplines_count: number;
  subjects_count: number;
}

interface PerformanceOverviewProps {
  userStats: UserStats;
}

export const PerformanceOverview = ({ userStats }: PerformanceOverviewProps) => {
  const incorrectAnswers = userStats.total_answers - userStats.correct_answers;
  
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (accuracy >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total de Questões */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-700">Total de Questões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-800">{userStats.total_answers}</div>
          <p className="text-xs text-blue-600 mt-1">Questões respondidas</p>
        </CardContent>
      </Card>

      {/* Acertos */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-700">Acertos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-800">{userStats.correct_answers}</div>
          <p className="text-xs text-green-600 mt-1">Respostas corretas</p>
        </CardContent>
      </Card>

      {/* Erros */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-700">Erros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-800">{incorrectAnswers}</div>
          <p className="text-xs text-red-600 mt-1">Respostas incorretas</p>
        </CardContent>
      </Card>

      {/* Aproveitamento */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-purple-700">Aproveitamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${getAccuracyColor(userStats.accuracy_percentage)}`}>
            {userStats.accuracy_percentage.toFixed(1)}%
          </div>
          <p className="text-xs text-purple-600 mt-1">Taxa de acerto</p>
        </CardContent>
      </Card>

      {/* Card de Progresso Detalhado */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Resumo de Desempenho
            <Badge className={getAccuracyBadgeColor(userStats.accuracy_percentage)}>
              {userStats.accuracy_percentage >= 80 ? "Excelente" : 
               userStats.accuracy_percentage >= 60 ? "Bom" : "Precisa Melhorar"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Taxa de Acerto</span>
                <span className="text-sm text-gray-600">{userStats.accuracy_percentage.toFixed(1)}%</span>
              </div>
              <Progress value={userStats.accuracy_percentage} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userStats.disciplines_count}</div>
              <p className="text-sm text-gray-600">Disciplinas estudadas</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userStats.subjects_count}</div>
              <p className="text-sm text-gray-600">Assuntos diferentes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600">✅</span>
                <span className="font-medium text-green-800">Acertos</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{userStats.correct_answers}</div>
              <div className="text-sm text-green-600">
                {((userStats.correct_answers / userStats.total_answers) * 100).toFixed(1)}% do total
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-600">❌</span>
                <span className="font-medium text-red-800">Erros</span>
              </div>
              <div className="text-2xl font-bold text-red-700">{incorrectAnswers}</div>
              <div className="text-sm text-red-600">
                {((incorrectAnswers / userStats.total_answers) * 100).toFixed(1)}% do total
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
