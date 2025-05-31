
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
import { ArrowLeft } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para visualizar suas estatísticas.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-police-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
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
            <h1 className="text-4xl font-bold mb-2">📊 Acompanhamento de Desempenho</h1>
            <p className="text-police-200 text-lg">Analise sua evolução e identifique pontos de melhoria</p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                👤 {user.email}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {userStats && userStats.total_answers > 0 ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="subjects">Por Disciplina</TabsTrigger>
              <TabsTrigger value="evolution">Evolução</TabsTrigger>
              <TabsTrigger value="weak-areas">Pontos Fracos</TabsTrigger>
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
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Nenhuma estatística disponível
                </h3>
                <p className="text-gray-500 mb-4">
                  Responda algumas questões para começar a acompanhar seu desempenho
                </p>
                <Button onClick={() => window.location.href = '/'} variant="outline">
                  Começar a Responder Questões
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
