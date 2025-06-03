
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Flame, Award } from "lucide-react";

interface UserStatsCardProps {
  userPoints: {
    total_points: number;
    correct_answers: number;
    total_answers: number;
    streak_days: number;
    best_streak: number;
  } | null;
  userPosition: number | null;
}

export const UserStatsCard = ({ userPoints, userPosition }: UserStatsCardProps) => {
  if (!userPoints) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 mb-4">
            <Trophy className="h-12 w-12 mx-auto mb-2" />
            <p className="text-gray-600">Responda algumas questões para começar a ganhar pontos!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const accuracy = userPoints.total_answers > 0 
    ? Math.round((userPoints.correct_answers / userPoints.total_answers) * 100)
    : 0;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Trophy className="h-5 w-5" />
          Suas Estatísticas
          {userPosition && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              #{userPosition} no Ranking
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{userPoints.total_points}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Award className="h-3 w-3" />
              Pontos
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{userPoints.correct_answers}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              Acertos
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{accuracy}%</div>
            <div className="text-sm text-gray-600">Precisão</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{userPoints.streak_days}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Flame className="h-3 w-3" />
              Sequência
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Melhor sequência: {userPoints.best_streak} dias</span>
            <span>Total de questões: {userPoints.total_answers}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
