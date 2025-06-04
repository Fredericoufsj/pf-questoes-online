
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface StudySuggestion {
  id: string;
  disciplina: string;
  assunto: string;
  suggestion_type: string; // Changed from union type to string
  priority_score: number;
  reason: string;
}

interface ExamStatistic {
  disciplina: string;
  assunto: string;
  total_questions: number;
  percentage: number;
  priority_level: string; // Changed from union type to string
  exam_year: number;
}

export const useStudySuggestions = (user: User | null) => {
  const [suggestions, setSuggestions] = useState<StudySuggestion[]>([]);
  const [examStats, setExamStats] = useState<ExamStatistic[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchExamStatistics = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_statistics')
        .select('*')
        .order('percentage', { ascending: false });

      if (error) {
        console.error('Erro ao buscar estatísticas da prova:', error);
        return;
      }

      setExamStats(data || []);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const generateSuggestions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Chamar a função do banco para gerar sugestões
      const { data, error } = await supabase.rpc('generate_study_suggestions', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Erro ao gerar sugestões:', error);
        toast({
          title: "Erro",
          description: "Não foi possível gerar as sugestões de estudo.",
          variant: "destructive"
        });
        return;
      }

      // Buscar as sugestões salvas
      const { data: savedSuggestions, error: fetchError } = await supabase
        .from('study_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('priority_score', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar sugestões:', fetchError);
        return;
      }

      setSuggestions(savedSuggestions || []);
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionsByType = (type: string) => {
    return suggestions.filter(s => s.suggestion_type === type);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'weak_area': return '⚠️';
      case 'high_priority': return '🔥';
      case 'recommended': return '💡';
      default: return '📚';
    }
  };

  const getSuggestionTitle = (type: string) => {
    switch (type) {
      case 'weak_area': return 'Áreas Fracas';
      case 'high_priority': return 'Alta Prioridade';
      case 'recommended': return 'Recomendadas';
      default: return 'Sugestões';
    }
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'alta': return 'text-red-600 bg-red-50 border-red-200';
      case 'media': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'baixa': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  useEffect(() => {
    fetchExamStatistics();
  }, []);

  useEffect(() => {
    if (user) {
      generateSuggestions();
    }
  }, [user]);

  return {
    suggestions,
    examStats,
    loading,
    generateSuggestions,
    getSuggestionsByType,
    getSuggestionIcon,
    getSuggestionTitle,
    getPriorityColor
  };
};
