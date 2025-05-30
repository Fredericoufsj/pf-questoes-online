
export interface Question {
  id: string;
  ano: number;
  banca: string;
  orgao: string;
  prova: string;
  disciplina: string;
  assunto: string;
  enunciado: string;
  comando: string;
  alternativas: string[];
  resposta_correta: string;
  comentario: string;
}

export interface QuestionFilters {
  search: string;
  ano: number[];
  banca: string[];
  disciplina: string[];
  assunto: string[];
  orgao: string[];
}
