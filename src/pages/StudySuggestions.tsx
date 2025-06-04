
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudySuggestionsCard } from "../components/studysuggestions/StudySuggestionsCard";
import { ExamStatisticsCard } from "../components/studysuggestions/ExamStatisticsCard";
import { useStudySuggestions } from "../hooks/useStudySuggestions";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";

const StudySuggestions = () => {
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
    suggestions,
    examStats,
    loading,
    generateSuggestions,
    getSuggestionsByType,
    getSuggestionIcon,
    getSuggestionTitle,
    getPriorityColor
  } = useStudySuggestions(user);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Acesso Restrito</h2>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para visualizar suas sugestões de estudo.
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
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
            <h1 className="text-4xl font-bold mb-2">🎯 Sugestões de Estudo Inteligentes</h1>
            <p className="text-police-200 text-lg">
              Estude de forma estratégica baseado em sua performance e dados históricos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="suggestions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">Sugestões Personalizadas</TabsTrigger>
            <TabsTrigger value="statistics">Estatísticas Históricas</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-6">
            <StudySuggestionsCard
              suggestions={suggestions}
              loading={loading}
              onRefresh={generateSuggestions}
              getSuggestionsByType={getSuggestionsByType}
              getSuggestionIcon={getSuggestionIcon}
              getSuggestionTitle={getSuggestionTitle}
            />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <ExamStatisticsCard
              examStats={examStats}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudySuggestions;
