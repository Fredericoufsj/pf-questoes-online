
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  correct_answers: number;
  total_answers: number;
  streak_days: number;
  best_streak: number;
  last_activity_date: string;
}

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

interface UserAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
}

interface RankingUser {
  user_id: string;
  total_points: number;
  correct_answers: number;
  total_answers: number;
  profiles?: {
    email: string;
    full_name: string;
  } | null;
}

export const useGamification = (user: User | null) => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserPoints = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar pontos:', error);
        return;
      }

      setUserPoints(data);
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (error) {
        console.error('Erro ao buscar conquistas:', error);
        return;
      }

      setAchievements(data || []);
    } catch (error) {
      console.error('Erro ao buscar conquistas:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar conquistas do usuário:', error);
        return;
      }

      setUserAchievements(data || []);
    } catch (error) {
      console.error('Erro ao buscar conquistas do usuário:', error);
    }
  };

  const fetchRanking = async () => {
    try {
      // First get user_points data
      const { data: userPointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, total_points, correct_answers, total_answers')
        .order('total_points', { ascending: false })
        .limit(10);

      if (pointsError) {
        console.error('Erro ao buscar ranking:', pointsError);
        return;
      }

      // Then get profiles data separately
      const userIds = userPointsData?.map(up => up.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
      }

      // Combine the data
      const rankingData = userPointsData?.map(userPoint => ({
        ...userPoint,
        profiles: profilesData?.find(profile => profile.id === userPoint.user_id) || null
      })) || [];

      setRanking(rankingData);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    }
  };

  const getUserPosition = () => {
    if (!user || !userPoints) return null;
    return ranking.findIndex(r => r.user_id === user.id) + 1;
  };

  const getUnlockedAchievements = () => {
    return userAchievements.map(ua => ua.achievement);
  };

  const getLockedAchievements = () => {
    const unlockedIds = userAchievements.map(ua => ua.achievement_id);
    return achievements.filter(a => !unlockedIds.includes(a.id));
  };

  const checkForNewAchievements = async () => {
    if (!user || !userPoints) return;

    // Verificar se há novas conquistas
    const currentAchievementIds = userAchievements.map(ua => ua.achievement_id);
    
    const potentialAchievements = achievements.filter(achievement => {
      if (currentAchievementIds.includes(achievement.id)) return false;

      switch (achievement.requirement_type) {
        case 'total_points':
          return userPoints.total_points >= achievement.requirement_value;
        case 'correct_answers':
          return userPoints.correct_answers >= achievement.requirement_value;
        case 'total_answers':
          return userPoints.total_answers >= achievement.requirement_value;
        case 'streak_days':
          return userPoints.streak_days >= achievement.requirement_value;
        default:
          return false;
      }
    });

    // Mostrar notificação para novas conquistas
    if (potentialAchievements.length > 0) {
      potentialAchievements.forEach(achievement => {
        toast({
          title: "🏆 Nova Conquista Desbloqueada!",
          description: `${achievement.icon} ${achievement.name} - ${achievement.description}`,
        });
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      fetchUserAchievements();
    }
    fetchAchievements();
    fetchRanking();
  }, [user]);

  useEffect(() => {
    checkForNewAchievements();
  }, [userPoints, achievements, userAchievements]);

  return {
    userPoints,
    achievements,
    userAchievements,
    ranking,
    loading,
    getUserPosition,
    getUnlockedAchievements,
    getLockedAchievements,
    fetchUserPoints,
    fetchRanking
  };
};
