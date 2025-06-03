
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useGamification } from "../hooks/useGamification";
import { UserStatsCard } from "../components/gamification/UserStatsCard";
import { AchievementsSection } from "../components/gamification/AchievementsSection";
import { RankingCard } from "../components/gamification/RankingCard";

const Gamification = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const {
    userPoints,
    ranking,
    getUserPosition,
    getUnlockedAchievements,
    getLockedAchievements
  } = useGamification(user);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para ver o sistema de gamificação.
          </p>
          <Button onClick={() => window.location.href = '/auth'}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-police-900 to-police-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="border-white text-white hover:bg-white hover:text-police-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">🎮 Sistema de Gamificação</h1>
            <p className="text-police-200 text-lg">
              Ganhe pontos, desbloqueie conquistas e suba no ranking!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* User Stats */}
        <UserStatsCard 
          userPoints={userPoints} 
          userPosition={getUserPosition()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <AchievementsSection
            unlockedAchievements={getUnlockedAchievements()}
            lockedAchievements={getLockedAchievements()}
            userPoints={userPoints}
          />

          {/* Ranking */}
          <RankingCard 
            ranking={ranking}
            currentUserId={user?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default Gamification;
