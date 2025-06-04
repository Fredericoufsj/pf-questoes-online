
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface StudySuggestion {
  id: string;
  disciplina: string;
  assunto: string;
  suggestion_type: string; // Changed from union type to string
  priority_score: number;
  reason: string;
}

interface StudySuggestionsCardProps {
  suggestions: StudySuggestion[];
  loading: boolean;
  onRefresh: () => void;
  getSuggestionsByType: (type: string) => StudySuggestion[];
  getSuggestionIcon: (type: string) => string;
  getSuggestionTitle: (type: string) => string;
}

export const StudySuggestionsCard = ({
  suggestions,
  loading,
  onRefresh,
  getSuggestionsByType,
  getSuggestionIcon,
  getSuggestionTitle
}: StudySuggestionsCardProps) => {
  const suggestionTypes = ['weak_area', 'high_priority', 'recommended'];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'weak_area': return 'border-red-200 bg-red-50';
      case 'high_priority': return 'border-orange-200 bg-orange-50';
      case 'recommended': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handleStudyClick = (disciplina: string, assunto: string) => {
    const url = `/?disciplina=${encodeURIComponent(disciplina)}&assunto=${encodeURIComponent(assunto)}`;
    window.location.href = url;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            🎯 Sugestões de Estudo Personalizadas
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p>Responda algumas questões para receber sugestões personalizadas!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {suggestionTypes.map(type => {
              const typeSuggestions = getSuggestionsByType(type);
              if (typeSuggestions.length === 0) return null;

              return (
                <div key={type} className={`p-4 rounded-lg border ${getTypeColor(type)}`}>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    {getSuggestionIcon(type)} {getSuggestionTitle(type)}
                    <Badge variant="outline">{typeSuggestions.length} sugestões</Badge>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {typeSuggestions.slice(0, 6).map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="mb-2">
                          <h4 className="font-medium text-gray-800">{suggestion.assunto}</h4>
                          <p className="text-sm text-gray-600">{suggestion.disciplina}</p>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-3">{suggestion.reason}</p>
                        
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="text-xs">
                            Score: {suggestion.priority_score.toFixed(1)}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleStudyClick(suggestion.disciplina, suggestion.assunto)}
                          >
                            Estudar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {typeSuggestions.length > 6 && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      E mais {typeSuggestions.length - 6} sugestões...
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
