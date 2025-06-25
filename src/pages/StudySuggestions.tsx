
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudySuggestionsCard } from "../components/studysuggestions/StudySuggestionsCard";
import { ExamStatisticsCard } from "../components/studysuggestions/ExamStatisticsCard";
import { useStudySuggestions } from "../hooks/useStudySuggestions";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, Rocket } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="twinkling"></div>
        </div>
        <Card className="w-full max-w-md mx-4 bg-slate-800/50 backdrop-blur-sm border-cyan-500/30 relative z-10">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">Acesso Restrito ao Sistema IA</h2>
            <p className="text-slate-400 mb-4">
              Apenas astronautas registrados podem acessar a navegação inteligente por IA.
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
              🤖 Sistema de Navegação IA
            </h1>
            <p className="text-cyan-200 text-lg">
              Navegação inteligente baseada em análise espacial avançada e dados históricos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="suggestions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 backdrop-blur-sm border-cyan-500/30">
            <TabsTrigger value="suggestions" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">🎯 Rotas Personalizadas</TabsTrigger>
            <TabsTrigger value="statistics" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300">📊 Análise Histórica</TabsTrigger>
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
