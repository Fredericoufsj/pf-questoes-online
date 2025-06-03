
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
import { Crown, Trophy, Award } from "lucide-react";

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
            title: "Login realizado com sucesso!",
            description: "Bem-vindo à plataforma de questões.",
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
          title: "Erro ao carregar questões",
          description: "Não foi possível carregar as questões do banco de dados.",
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
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
    }
  };

  const handleUpgradeClick = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para acessar o plano premium.",
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
        title: "Erro ao processar pagamento",
        description: "Não foi possível iniciar o processo de pagamento.",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-police-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando questões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-police-900 to-police-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-2">Plataforma de Questões</h1>
              <p className="text-police-200 text-lg">Concurso Polícia Federal</p>
              <div className="flex justify-center gap-2 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  🎯 Preparação para PF
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  📚 Questões Comentadas
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  🏆 Sistema Inteligente
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/gamification'}
                    className="border-white text-white hover:bg-white hover:text-police-800 bg-transparent"
                  >
                    🎮 Gamificação
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/statistics'}
                    className="border-white text-white hover:bg-white hover:text-police-800 bg-transparent"
                  >
                    📊 Estatísticas
                  </Button>
                  <div className="text-right">
                    <p className="text-sm text-police-200">Logado como:</p>
                    <p className="font-medium">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {subscription.subscription_tier === 'premium' && (
                        <Badge className="bg-yellow-500 text-yellow-900">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {userPoints && (
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          <Trophy className="h-3 w-3 mr-1" />
                          {userPoints.total_points} pts
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="border-white text-white hover:bg-white hover:text-police-800 bg-transparent"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/auth'}
                  className="border-white text-white hover:bg-white hover:text-police-800 bg-transparent"
                >
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
              <Card className="text-center py-12 border-red-200 bg-red-50">
                <CardContent>
                  <div className="text-red-600 mb-4">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-xl font-medium text-red-700 mb-2">
                      Limite de questões atingido
                    </h3>
                    <p className="text-red-600 mb-4">
                      Você já respondeu 10 questões hoje. Faça upgrade para o Premium e tenha acesso ilimitado!
                    </p>
                    <Button 
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-police-600 to-police-500 hover:from-police-700 hover:to-police-600"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade para Premium - R$ 14,49/mês
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="border-police-200 text-police-700 hover:bg-police-50"
                  >
                    ← Anterior
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Questão {currentQuestionIndex + 1} de {filteredQuestions.length}
                    </span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-police-600 to-police-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === filteredQuestions.length - 1}
                    className="border-police-200 text-police-700 hover:bg-police-50"
                  >
                    Próxima →
                  </Button>
                </div>

                {/* Current Question */}
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={filteredQuestions.length}
                  userId={user?.id}
                  fetchDailyUsage={handleQuestionAnswered}
                />
              </>
            )}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Nenhuma questão encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Tente ajustar os filtros para encontrar questões
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-police-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-police-200">
            © 2024 Plataforma de Questões - Polícia Federal. 
            Sistema desenvolvido para preparação em concursos.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
