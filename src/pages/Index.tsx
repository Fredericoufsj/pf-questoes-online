
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionFilters } from "../components/QuestionFilters";
import { QuestionCard } from "../components/QuestionCard";
import { StatsCard } from "../components/StatsCard";
import { SubscriptionBanner } from "../components/SubscriptionBanner";
import { Question, QuestionFilters as IQuestionFilters } from "../types/Question";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { useSubscription } from "../hooks/useSubscription";
import { useGamification } from "../hooks/useGamification";
import { Crown, Trophy, Award, Rocket, Zap, Star } from "lucide-react";

const Index = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [filters, setFilters] = useState<IQuestionFilters>({
    search: "",
    ano: [],
    banca: [],
    disciplina: [],
    assunto: [],
    orgao: []
  });

  const { 
    subscription, 
    dailyUsage,
    loading: subscriptionLoading,
    checkSubscription,
    fetchDailyUsage,
    canAccessQuestion,
    getRemainingQuestions
  } = useSubscription(user);

  const { userPoints, fetchUserPoints } = useGamification(user);

  // Check for existing session and set up auth listener
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          toast({
            title: "🚀 Bem-vindo à missão!",
            description: "Sua jornada espacial de conhecimento começou.",
          });
        }
      }
    );

    return () => authSubscription.unsubscribe();
  }, [toast]);

  // Fetch questions from Supabase
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar questões:', error);
        toast({
          title: "⚠️ Falha na comunicação",
          description: "Não foi possível conectar com a base espacial.",
          variant: "destructive"
        });
        return;
      }

      setQuestions(data || []);
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      // Search filter
      if (filters.search && !question.comando.toLowerCase().includes(filters.search.toLowerCase()) && 
          !question.enunciado.toLowerCase().includes(filters.search.toLowerCase()) &&
          !question.assunto.toLowerCase().includes(filters.search.toLowerCase()) &&
          !question.disciplina.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Other filters
      if (filters.ano.length > 0 && !filters.ano.includes(question.ano)) return false;
      if (filters.banca.length > 0 && !filters.banca.includes(question.banca)) return false;
      if (filters.disciplina.length > 0 && !filters.disciplina.includes(question.disciplina)) return false;
      if (filters.assunto.length > 0 && !filters.assunto.includes(question.assunto)) return false;
      if (filters.orgao.length > 0 && !filters.orgao.includes(question.orgao)) return false;

      return true;
    });
  }, [filters, questions]);

  // Reset current question index when filters change
  useEffect(() => {
    if (currentQuestionIndex >= filteredQuestions.length) {
      setCurrentQuestionIndex(0);
    }
  }, [filteredQuestions.length, currentQuestionIndex]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const clearFilters = () => {
    setFilters({
      search: "",
      ano: [],
      banca: [],
      disciplina: [],
      assunto: [],
      orgao: []
    });
    setCurrentQuestionIndex(0);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "❌ Erro na desconexão",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "🛸 Missão encerrada!",
        description: "Até a próxima exploração, astronauta!",
      });
    }
  };

  const handleUpgradeClick = async () => {
    if (!user) {
      toast({
        title: "🔐 Acesso restrito",
        description: "Faça login para acessar a nave premium.",
        variant: "destructive"
      });
      window.location.href = '/auth';
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast({
        title: "⚡ Falha no sistema",
        description: "Não foi possível iniciar o upgrade da nave.",
        variant: "destructive"
      });
    }
  };

  const handleQuestionAnswered = () => {
    fetchDailyUsage();
    fetchUserPoints();
  };

  // Stats
  const uniqueDisciplines = new Set(questions.map(q => q.disciplina)).size;
  const uniqueSubjects = new Set(questions.map(q => q.assunto)).size;

  const remainingQuestions = getRemainingQuestions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-cyan-200">🛸 Carregando missões...</p>
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
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🚀 Questonauta
              </h1>
              <p className="text-cyan-200 text-lg">Explorando o Universo do Conhecimento</p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30">
                  🌌 Missões Espaciais
                </Badge>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                  🛸 IA Avançada
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                  ⭐ Sistema Inteligente
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/gamification'}
                    className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 bg-transparent"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Conquistas
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/statistics'}
                    className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 bg-transparent"
                  >
                    📊 Dados da Missão
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/study-suggestions'}
                    className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 bg-transparent"
                  >
                    🎯 Navegação IA
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-cyan-300">Astronauta:</p>
                    <p className="font-medium text-white">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {subscription.subscription_tier === 'premium' && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900">
                          <Crown className="h-3 w-3 mr-1" />
                          Comandante
                        </Badge>
                      )}
                      {userPoints && (
                        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-200 border-cyan-500/30">
                          <Star className="h-3 w-3 mr-1" />
                          {userPoints.total_points} XP
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="border-red-400 text-red-300 hover:bg-red-400/20 bg-transparent"
                  >
                    🛸 Desembarcar
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/auth'}
                  className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/20 bg-transparent"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Embarcar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Subscription Banner */}
        {user && (
          <SubscriptionBanner
            subscription={subscription}
            remainingQuestions={remainingQuestions}
            onUpgrade={handleUpgradeClick}
          />
        )}

        {/* Stats */}
        <StatsCard
          totalQuestions={questions.length}
          filteredQuestions={filteredQuestions.length}
          uniqueDisciplines={uniqueDisciplines}
          uniqueSubjects={uniqueSubjects}
        />

        {/* Filters */}
        <QuestionFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          questions={questions}
        />

        {/* Question Display */}
        {filteredQuestions.length > 0 ? (
          <div className="space-y-6">
            {/* Check access before showing question */}
            {user && !canAccessQuestion() ? (
              <Card className="text-center py-12 border-red-400/30 bg-gradient-to-br from-red-900/20 to-purple-900/20 backdrop-blur-sm">
                <CardContent>
                  <div className="text-red-400 mb-4">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-xl font-medium text-red-300 mb-2">
                      Combustível esgotado
                    </h3>
                    <p className="text-red-400 mb-4">
                      Você já completou 10 missões hoje. Upgrade para Comandante e tenha acesso ilimitado!
                    </p>
                    <Button 
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade para Comandante - R$ 14,49/mês
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Current Question */}
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={filteredQuestions.length}
                  userId={user?.id}
                  fetchDailyUsage={handleQuestionAnswered}
                />

                {/* Navigation - agora abaixo da questão */}
                <div className="flex flex-col items-center gap-4 mt-6">
                  <div className="flex items-center gap-8">
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20 bg-slate-800/50 backdrop-blur-sm"
                    >
                      ← Missão Anterior
                    </Button>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm text-cyan-300">
                        Missão {currentQuestionIndex + 1} de {filteredQuestions.length}
                      </span>
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={goToNextQuestion}
                      disabled={currentQuestionIndex === filteredQuestions.length - 1}
                      className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20 bg-slate-800/50 backdrop-blur-sm"
                    >
                      Próxima Missão →
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <Card className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border-slate-600">
            <CardContent>
              <div className="text-cyan-400 mb-4">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-cyan-300 mb-2">
                  Nenhuma missão encontrada
                </h3>
                <p className="text-slate-400 mb-4">
                  Ajuste os filtros para encontrar novas missões espaciais
                </p>
                <Button onClick={clearFilters} variant="outline" className="border-cyan-400 text-cyan-300 hover:bg-cyan-400/20">
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-sm text-white py-8 mt-16 border-t border-cyan-500/30 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300">
            © 2024 Questonauta - Explorando o Universo do Conhecimento. 
            🚀 Sistema desenvolvido para astronautas do saber.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
