import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceOverview } from "../components/statistics/PerformanceOverview";
import { SubjectPerformance } from "../components/statistics/SubjectPerformance";
import { PerformanceChart } from "../components/statistics/PerformanceChart";
import { WeakAreasTable } from "../components/statistics/WeakAreasTable";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Rocket } from "lucide-react";

interface UserStats {
  total_answers: number;
  correct_answers: number;
  accuracy_percentage: number;
  disciplines_count: number;
  subjects_count: number;
}

interface PerformanceData {
  disciplina: string;
  assunto: string;
  total_questions: number;
  correct_answers: number;
  accuracy_percentage: number;
  last_answered_at: string;
}

const Statistics = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
    if (user) {
      fetchStatistics();
    }
  }, [user]);

  const fetchStatistics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Buscar estatísticas gerais
      const { data: generalStats, error: generalError } = await supabase
        .from('user_performance_stats')
        .select('*')
        .eq('user_id', user.id);

      if (generalError) {
        console.error('Erro ao buscar estatísticas gerais:', generalError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as estatísticas.",
          variant: "destructive"
        });
        return;
      }

      if (generalStats && generalStats.length > 0) {
        // Calcular estatísticas agregadas
        const totalAnswers = generalStats.reduce((sum, stat) => sum + stat.total_questions, 0);
        const totalCorrect = generalStats.reduce((sum, stat) => sum + stat.correct_answers, 0);
        const overallAccuracy = totalAnswers > 0 ? (totalCorrect / totalAnswers) * 100 : 0;
        const uniqueDisciplines = new Set(generalStats.map(stat => stat.disciplina)).size;
        const uniqueSubjects = generalStats.length;

        setUserStats({
          total_answers: totalAnswers,
          correct_answers: totalCorrect,
          accuracy_percentage: overallAccuracy,
          disciplines_count: uniqueDisciplines,
          subjects_count: uniqueSubjects
        });

        setPerformanceData(generalStats);
      } else {
        setUserStats({
          total_answers: 0,
          correct_answers: 0,
          accuracy_percentage: 0,
          disciplines_count: 0,
          subjects_count: 0
        });
        setPerformanceData([]);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar estatísticas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
        <Card className="w-full max-w-md mx-4 bg-slate-800/50 backdrop-blur-sm border-cyan-500/30 relative z-10">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Acesso Restrito à Base</h2>
            <p className="text-slate-400 mb-4">
              Apenas astronautas registrados podem acessar os dados da missão.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Embarcar na Nave
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-cyan-200">🛸 Analisando dados da missão...</p>
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
              📊 Central de Dados da Missão
            </h1>
            <p className="text-cyan-200 text-lg">Análise completa do desempenho espacial</p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30">
                👨‍🚀 {user.email}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {userStats && userStats.total_answers > 0 ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border-cyan-500/30">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">🌟 Visão Geral</TabsTrigger>
              <TabsTrigger value="subjects" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">🎯 Por Setor</TabsTrigger>
              <TabsTrigger value="evolution" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">📈 Evolução</TabsTrigger>
              <TabsTrigger value="weak-areas" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">⚠️ Áreas Críticas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <PerformanceOverview userStats={userStats} />
            </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <SubjectPerformance performanceData={performanceData} />
            </TabsContent>

            <TabsContent value="evolution" className="space-y-6">
              <PerformanceChart performanceData={performanceData} />
            </TabsContent>

            <TabsContent value="weak-areas" className="space-y-6">
              <WeakAreasTable performanceData={performanceData} />
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border-cyan-500/30">
            <CardContent>
              <div className="text-cyan-400 mb-4">
                <div className="text-6xl mb-4">🛸</div>
                <h3 className="text-xl font-medium text-cyan-300 mb-2">
                  Nenhum dado de missão disponível
                </h3>
                <p className="text-slate-400 mb-4">
                  Complete algumas missões para começar a analisar seu desempenho espacial
                </p>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  🚀 Iniciar Missões
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Statistics;
