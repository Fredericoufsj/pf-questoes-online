
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  totalQuestions: number;
  filteredQuestions: number;
  uniqueDisciplines: number;
  uniqueSubjects: number;
}

export const StatsCard = ({ 
  totalQuestions, 
  filteredQuestions, 
  uniqueDisciplines, 
  uniqueSubjects 
}: StatsCardProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-police-50 to-police-100 border-police-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-police-800">{filteredQuestions}</div>
          <div className="text-sm text-police-600">Questões Filtradas</div>
          {filteredQuestions !== totalQuestions && (
            <Badge variant="outline" className="mt-1 text-xs">
              de {totalQuestions}
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-800">{totalQuestions}</div>
          <div className="text-sm text-blue-600">Total de Questões</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-800">{uniqueDisciplines}</div>
          <div className="text-sm text-green-600">Disciplinas</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-800">{uniqueSubjects}</div>
          <div className="text-sm text-orange-600">Assuntos</div>
        </CardContent>
      </Card>
    </div>
  );
};
