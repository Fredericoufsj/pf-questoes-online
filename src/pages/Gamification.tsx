
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="bg-slate-800/50 backdrop-blur-sm border-cyan-500/30 rounded-lg p-8 border">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Acesso Restrito ao Hall das Conquistas</h2>
            <p className="text-slate-400 mb-4">
              Apenas astronautas registrados podem acessar o sistema de conquistas.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Embarcar na Nave
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Starfield background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 text-white py-8 relative z-10 border-b border-cyan-500/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              🚀 Voltar à Base
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              🏆 Hall das Conquistas Espaciais
            </h1>
            <p className="text-cyan-200 text-lg">
              Desafios, medalhas e ranking de astronautas exploradores!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
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
