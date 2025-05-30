import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionFilters } from "../components/QuestionFilters";
import { QuestionCard } from "../components/QuestionCard";
import { StatsCard } from "../components/StatsCard";
import { Question, QuestionFilters as IQuestionFilters } from "../types/Question";
import { mockQuestions } from "../data/mockQuestions";

const Index = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filters, setFilters] = useState<IQuestionFilters>({
    search: "",
    ano: [],
    banca: [],
    disciplina: [],
    assunto: [],
    orgao: []
  });

  // Filter questions based on current filters
  const filteredQuestions = useMemo(() => {
    return mockQuestions.filter(question => {
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
  }, [filters]);

  // Reset current question index when filters change
  useState(() => {
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

  // Stats
  const uniqueDisciplines = new Set(mockQuestions.map(q => q.disciplina)).size;
  const uniqueSubjects = new Set(mockQuestions.map(q => q.assunto)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-police-900 to-police-700 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <StatsCard
          totalQuestions={mockQuestions.length}
          filteredQuestions={filteredQuestions.length}
          uniqueDisciplines={uniqueDisciplines}
          uniqueSubjects={uniqueSubjects}
        />

        {/* Filters */}
        <QuestionFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        {/* Question Display */}
        {filteredQuestions.length > 0 ? (
          <div className="space-y-6">
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
            />
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
