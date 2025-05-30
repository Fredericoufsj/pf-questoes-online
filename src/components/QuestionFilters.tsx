
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionFilters as IQuestionFilters } from "../types/Question";
import { mockQuestions } from "../data/mockQuestions";

interface QuestionFiltersProps {
  filters: IQuestionFilters;
  onFiltersChange: (filters: IQuestionFilters) => void;
  onClearFilters: () => void;
}

export const QuestionFilters = ({ filters, onFiltersChange, onClearFilters }: QuestionFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique values for filter options
  const uniqueValues = {
    anos: [...new Set(mockQuestions.map(q => q.ano))].sort((a, b) => b - a),
    bancas: [...new Set(mockQuestions.map(q => q.banca))].sort(),
    disciplinas: [...new Set(mockQuestions.map(q => q.disciplina))].sort(),
    assuntos: [...new Set(mockQuestions.map(q => q.assunto))].sort(),
    orgaos: [...new Set(mockQuestions.map(q => q.orgao))].sort(),
  };

  const handleCheckboxChange = (
    type: keyof Omit<IQuestionFilters, 'search'>,
    value: string | number,
    checked: boolean
  ) => {
    const currentValues = filters[type] as (string | number)[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);

    onFiltersChange({
      ...filters,
      [type]: newValues
    });
  };

  const activeFiltersCount = 
    filters.ano.length + 
    filters.banca.length + 
    filters.disciplina.length + 
    filters.assunto.length + 
    filters.orgao.length;

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-police-800">
            <Filter className="w-5 h-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-police-100 text-police-800">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-police-700 border-police-200 hover:bg-police-50"
            >
              {showAdvanced ? "Ocultar" : "Avançado"}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por palavra-chave..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 border-police-200 focus:border-police-500 focus:ring-police-500"
          />
        </div>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-police-100">
            {/* Anos */}
            <div>
              <h4 className="font-medium text-police-800 mb-3">Ano</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.anos.map(ano => (
                  <div key={ano} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ano-${ano}`}
                      checked={filters.ano.includes(ano)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('ano', ano, !!checked)
                      }
                    />
                    <label htmlFor={`ano-${ano}`} className="text-sm cursor-pointer">
                      {ano}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bancas */}
            <div>
              <h4 className="font-medium text-police-800 mb-3">Banca</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.bancas.map(banca => (
                  <div key={banca} className="flex items-center space-x-2">
                    <Checkbox
                      id={`banca-${banca}`}
                      checked={filters.banca.includes(banca)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('banca', banca, !!checked)
                      }
                    />
                    <label htmlFor={`banca-${banca}`} className="text-sm cursor-pointer">
                      {banca}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Disciplinas */}
            <div>
              <h4 className="font-medium text-police-800 mb-3">Disciplina</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.disciplinas.map(disciplina => (
                  <div key={disciplina} className="flex items-center space-x-2">
                    <Checkbox
                      id={`disciplina-${disciplina}`}
                      checked={filters.disciplina.includes(disciplina)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('disciplina', disciplina, !!checked)
                      }
                    />
                    <label htmlFor={`disciplina-${disciplina}`} className="text-sm cursor-pointer">
                      {disciplina}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Assuntos */}
            <div>
              <h4 className="font-medium text-police-800 mb-3">Assunto</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.assuntos.map(assunto => (
                  <div key={assunto} className="flex items-center space-x-2">
                    <Checkbox
                      id={`assunto-${assunto}`}
                      checked={filters.assunto.includes(assunto)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('assunto', assunto, !!checked)
                      }
                    />
                    <label htmlFor={`assunto-${assunto}`} className="text-sm cursor-pointer">
                      {assunto}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Órgãos */}
            <div>
              <h4 className="font-medium text-police-800 mb-3">Órgão</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueValues.orgaos.map(orgao => (
                  <div key={orgao} className="flex items-center space-x-2">
                    <Checkbox
                      id={`orgao-${orgao}`}
                      checked={filters.orgao.includes(orgao)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('orgao', orgao, !!checked)
                      }
                    />
                    <label htmlFor={`orgao-${orgao}`} className="text-sm cursor-pointer">
                      {orgao}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
