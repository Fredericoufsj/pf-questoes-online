import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: string; // Changed from union type to string
  requirement_type: string;
  requirement_value: number;
  points_reward: number;
}

interface AchievementsSectionProps {
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
  userPoints: {
    total_points: number;
    correct_answers: number;
    total_answers: number;
    streak_days: number;
  } | null;
}

export const AchievementsSection = ({ 
  unlockedAchievements, 
  lockedAchievements, 
  userPoints 
}: AchievementsSectionProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgress = (achievement: Achievement) => {
    if (!userPoints) return 0;
    
    let current = 0;
    switch (achievement.requirement_type) {
      case 'total_points':
        current = userPoints.total_points;
        break;
      case 'correct_answers':
        current = userPoints.correct_answers;
        break;
      case 'total_answers':
        current = userPoints.total_answers;
        break;
      case 'streak_days':
        current = userPoints.streak_days;
        break;
    }
    
    return Math.min((current / achievement.requirement_value) * 100, 100);
  };

  const getCurrentValue = (achievement: Achievement) => {
    if (!userPoints) return 0;
    
    switch (achievement.requirement_type) {
      case 'total_points':
        return userPoints.total_points;
      case 'correct_answers':
        return userPoints.correct_answers;
      case 'total_answers':
        return userPoints.total_answers;
      case 'streak_days':
        return userPoints.streak_days;
      default:
        return 0;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Conquistas
          <Badge variant="secondary">
            {unlockedAchievements.length} de {unlockedAchievements.length + lockedAchievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unlocked" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unlocked">
              Desbloqueadas ({unlockedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="locked">
              Bloqueadas ({lockedAchievements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="space-y-3">
            {unlockedAchievements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <p>Nenhuma conquista desbloqueada ainda</p>
                <p className="text-sm">Responda questões para ganhar suas primeiras medalhas!</p>
              </div>
            ) : (
              unlockedAchievements.map(achievement => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{achievement.name}</h4>
                      <Badge className={getTypeColor(achievement.type)}>
                        {achievement.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <p className="text-xs text-green-600 font-medium">
                      +{achievement.points_reward} pontos
                    </p>
                  </div>
                  <div className="text-green-600">
                    ✅
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-3">
            {lockedAchievements.map(achievement => {
              const progress = getProgress(achievement);
              const currentValue = getCurrentValue(achievement);
              
              return (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-2xl opacity-50">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-700">{achievement.name}</h4>
                      <Badge className={getTypeColor(achievement.type)}>
                        {achievement.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{currentValue} / {achievement.requirement_value}</span>
                        <span>+{achievement.points_reward} pontos</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
