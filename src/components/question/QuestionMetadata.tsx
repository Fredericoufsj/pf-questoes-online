
import { Badge } from "@/components/ui/badge";

interface QuestionMetadataProps {
  disciplina: string;
  assunto: string;
}

export const QuestionMetadata = ({ disciplina, assunto }: QuestionMetadataProps) => {
  return (
    <div className="mb-6 p-4 bg-police-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-police-800">Disciplina:</span>
          <Badge variant="outline" className="ml-2 border-police-200 text-police-700">
            {disciplina}
          </Badge>
        </div>
        <div>
          <span className="font-medium text-police-800">Assunto:</span>
          <Badge variant="outline" className="ml-2 border-police-200 text-police-700">
            {assunto}
          </Badge>
        </div>
      </div>
    </div>
  );
};
