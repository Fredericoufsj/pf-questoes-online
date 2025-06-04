
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Target } from "lucide-react";

interface QuestionStudySuggestionProps {
  disciplina: string;
  assunto: string;
  isCorrect: boolean;
}

export const QuestionStudySuggestion = ({ disciplina, assunto, isCorrect }: QuestionStudySuggestionProps) => {
  // Sugestões específicas por disciplina
  const getStudySuggestions = (disciplina: string, assunto: string) => {
    const suggestions: { [key: string]: { topics: string[], links: { title: string, url: string }[] } } = {
      "Contabilidade Geral": {
        topics: ["Balanço Patrimonial", "Demonstração do Resultado", "Plano de Contas", "Lançamentos Contábeis"],
        links: [
          { title: "Portal de Contabilidade", url: "https://www.portaldecontabilidade.com.br/" },
          { title: "CFC - Conselho Federal de Contabilidade", url: "https://cfc.org.br/" }
        ]
      },
      "Português": {
        topics: ["Gramática", "Interpretação de Texto", "Concordância", "Regência", "Crase"],
        links: [
          { title: "Português - Brasil Escola", url: "https://brasilescola.uol.com.br/portugues" },
          { title: "Gramática Online", url: "https://www.gramatica.net.br/" }
        ]
      },
      "Noções de Informática": {
        topics: ["Sistemas Operacionais", "Redes", "Segurança", "Internet", "Pacote Office"],
        links: [
          { title: "TI Especialistas", url: "https://www.tiespecialistas.com.br/" },
          { title: "Curso em Vídeo", url: "https://www.cursoemvideo.com/" }
        ]
      },
      "Raciocínio Lógico": {
        topics: ["Lógica Proposicional", "Sequências", "Análise Combinatória", "Probabilidade"],
        links: [
          { title: "Khan Academy - Matemática", url: "https://pt.khanacademy.org/math" },
          { title: "Matemática Rio", url: "https://www.matematicario.com.br/" }
        ]
      },
      "Direito Constitucional": {
        topics: ["Princípios Fundamentais", "Direitos e Garantias", "Organização do Estado", "Poder Judiciário"],
        links: [
          { title: "Planalto - Constituição Federal", url: "http://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" },
          { title: "STF - Supremo Tribunal Federal", url: "https://portal.stf.jus.br/" }
        ]
      },
      "Direito Administrativo": {
        topics: ["Princípios da Administração", "Atos Administrativos", "Licitações", "Contratos"],
        links: [
          { title: "Planalto - Leis", url: "http://www.planalto.gov.br/ccivil_03/leis/" },
          { title: "TCU - Tribunal de Contas da União", url: "https://portal.tcu.gov.br/" }
        ]
      },
      "Direito Penal": {
        topics: ["Teoria Geral do Crime", "Crimes contra a Pessoa", "Crimes contra o Patrimônio", "Lei de Drogas"],
        links: [
          { title: "Código Penal", url: "http://www.planalto.gov.br/ccivil_03/decreto-lei/del2848.htm" },
          { title: "STJ - Superior Tribunal de Justiça", url: "https://www.stj.jus.br/" }
        ]
      }
    };

    return suggestions[disciplina] || {
      topics: ["Fundamentos Básicos", "Conceitos Gerais", "Aplicações Práticas"],
      links: [
        { title: "Portal do Servidor", url: "https://www.portaldoservidor.ba.gov.br/" },
        { title: "Estratégia Concursos", url: "https://www.estrategiaconcursos.com.br/" }
      ]
    };
  };

  const suggestion = getStudySuggestions(disciplina, assunto);
  const message = isCorrect 
    ? "Parabéns! Para consolidar ainda mais seus conhecimentos, recomendamos:" 
    : "Para dominar este assunto e evitar erros futuros, foque em:";

  const handleStudyMoreClick = () => {
    // Redirecionar para questões da mesma disciplina/assunto
    const url = `/?disciplina=${encodeURIComponent(disciplina)}&assunto=${encodeURIComponent(assunto)}`;
    window.location.href = url;
  };

  return (
    <Card className={`mt-4 border-l-4 ${isCorrect ? 'border-l-blue-500 bg-blue-50' : 'border-l-orange-500 bg-orange-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-blue-600" />
          Sugestões de Estudo
          <Badge variant={isCorrect ? "default" : "secondary"} className={isCorrect ? "bg-blue-500" : "bg-orange-500"}>
            {disciplina}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-700 font-medium">{message}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <Target className="h-4 w-4" />
              Tópicos importantes para estudar:
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestion.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              Materiais recomendados:
            </h4>
            <div className="space-y-2">
              {suggestion.links.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(link.url, '_blank')}
                  className="mr-2 mb-2"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  {link.title}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <Button 
              onClick={handleStudyMoreClick}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Praticar mais questões de {disciplina}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
