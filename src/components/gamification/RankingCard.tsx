import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface RankingUser {
  user_id: string;
  total_points: number;
  correct_answers: number;
  total_answers: number;
  profiles?: {
    email: string;
    full_name: string;
  } | null; // Made profiles optional and nullable
}

interface RankingCardProps {
  ranking: RankingUser[];
  currentUserId?: string;
}

export const RankingCard = ({ ranking, currentUserId }: RankingCardProps) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-medium text-gray-500">#{position}</span>;
    }
  };

  const getPositionBg = (position: number, isCurrentUser: boolean) => {
    let bg = '';
    switch (position) {
      case 1: bg = 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'; break;
      case 2: bg = 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'; break;
      case 3: bg = 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'; break;
      default: bg = 'bg-white border-gray-200'; break;
    }
    
    if (isCurrentUser) {
      bg += ' ring-2 ring-blue-300';
    }
    
    return bg;
  };

  const getUserDisplayName = (user: RankingUser) => {
    if (user.profiles?.full_name) {
      return user.profiles.full_name;
    }
    if (user.profiles?.email) {
      return user.profiles.email.split('@')[0];
    }
    return 'Usuário';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Ranking Top 10
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ranking.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>Nenhum usuário no ranking ainda</p>
            <p className="text-sm">Seja o primeiro a responder questões!</p>
          </div>
        ) : (
          ranking.map((user, index) => {
            const position = index + 1;
            const isCurrentUser = user.user_id === currentUserId;
            const accuracy = user.total_answers > 0 
              ? Math.round((user.correct_answers / user.total_answers) * 100)
              : 0;

            return (
              <div 
                key={user.user_id} 
                className={`p-3 rounded-lg border transition-all ${getPositionBg(position, isCurrentUser)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getPositionIcon(position)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {getUserDisplayName(user)}
                        </span>
                        {isCurrentUser && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            Você
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {user.correct_answers} acertos • {accuracy}% precisão
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600">
                      {user.total_points}
                    </div>
                    <div className="text-xs text-gray-500">pontos</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
