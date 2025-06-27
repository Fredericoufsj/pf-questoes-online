
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface QuestionOptionsProps {
  alternativas: string[];
  selectedAnswer: string;
  onSelectedAnswerChange: (value: string) => void;
  answered: boolean;
  respostaCorreta: string;
}

export const QuestionOptions = ({
  alternativas,
  selectedAnswer,
  onSelectedAnswerChange,
  answered,
  respostaCorreta
}: QuestionOptionsProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-police-800 mb-3">Alternativas:</h3>
      <RadioGroup 
        value={selectedAnswer} 
        onValueChange={onSelectedAnswerChange}
        disabled={answered}
        className="space-y-3"
      >
        {alternativas.map((alternativa, index) => (
          <div 
            key={index} 
            className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
              answered 
                ? alternativa === respostaCorreta
                  ? "border-green-500 bg-green-50"
                  : alternativa === selectedAnswer
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-gray-50"
                : selectedAnswer === alternativa
                ? "border-police-500 bg-police-50"
                : "border-gray-200 hover:border-police-300 hover:bg-police-25"
            }`}
          >
            <RadioGroupItem 
              value={alternativa} 
              id={`option-${index}`}
              className={answered && alternativa === respostaCorreta ? "border-green-500" : ""}
            />
            <Label 
              htmlFor={`option-${index}`} 
              className="flex-1 cursor-pointer font-medium"
            >
              {alternativa}
            </Label>
            {answered && alternativa === respostaCorreta && (
              <Badge className="bg-green-500 text-white">Correta</Badge>
            )}
            {answered && alternativa === selectedAnswer && alternativa !== respostaCorreta && (
              <Badge variant="destructive">Sua resposta</Badge>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
