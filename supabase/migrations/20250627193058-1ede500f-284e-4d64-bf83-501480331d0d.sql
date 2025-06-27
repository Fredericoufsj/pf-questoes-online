
-- Criar tabela para reportes de erros em questões
CREATE TABLE public.question_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  question_id TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('erro_alternativa', 'erro_gabarito', 'erro_enunciado', 'erro_comentario', 'outros')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'analisando', 'resolvido', 'rejeitado')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_notes TEXT
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_question_reports_question_id ON public.question_reports(question_id);
CREATE INDEX idx_question_reports_user_id ON public.question_reports(user_id);
CREATE INDEX idx_question_reports_status ON public.question_reports(status);

-- Habilitar Row Level Security
ALTER TABLE public.question_reports ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios reportes
CREATE POLICY "Users can view their own reports" 
  ON public.question_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários criarem reportes
CREATE POLICY "Users can create reports" 
  ON public.question_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem apenas seus próprios reportes (se necessário)
CREATE POLICY "Users can update their own reports" 
  ON public.question_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Adicionar foreign key para questões
ALTER TABLE public.question_reports 
ADD CONSTRAINT fk_question_reports_question_id 
FOREIGN KEY (question_id) REFERENCES public.questions(id);
