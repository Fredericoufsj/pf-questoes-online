
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PerformanceData {
  disciplina: string;
  assunto: string;
  total_questions: number;
  correct_answers: number;
  accuracy_percentage: number;
  last_answered_at: string;
}

interface PerformanceChartProps {
  performanceData: PerformanceData[];
}

export const PerformanceChart = ({ performanceData }: PerformanceChartProps) => {
  // Preparar dados para o gráfico de barras (por disciplina)
  const disciplineData = performanceData.reduce((acc, item) => {
    const existing = acc.find(d => d.disciplina === item.disciplina);
    if (existing) {
      existing.total_questions += item.total_questions;
      existing.correct_answers += item.correct_answers;
      existing.accuracy_percentage = (existing.correct_answers / existing.total_questions) * 100;
    } else {
      acc.push({
        disciplina: item.disciplina,
        total_questions: item.total_questions,
        correct_answers: item.correct_answers,
        accuracy_percentage: (item.correct_answers / item.total_questions) * 100
      });
    }
    return acc;
  }, [] as any[]);

  // Preparar dados para o gráfico de pizza (distribuição de acertos/erros)
  const totalCorrect = performanceData.reduce((sum, item) => sum + item.correct_answers, 0);
  const totalQuestions = performanceData.reduce((sum, item) => sum + item.total_questions, 0);
  const totalIncorrect = totalQuestions - totalCorrect;

  const pieData = [
    { name: 'Acertos', value: totalCorrect, color: '#10b981' },
    { name: 'Erros', value: totalIncorrect, color: '#ef4444' }
  ];

  // Top 5 melhores assuntos
  const topSubjects = [...performanceData]
    .filter(item => item.total_questions >= 3) // Apenas assuntos com pelo menos 3 questões
    .sort((a, b) => b.accuracy_percentage - a.accuracy_percentage)
    .slice(0, 5);

  // Top 5 assuntos que precisam de mais atenção
  const weakSubjects = [...performanceData]
    .filter(item => item.total_questions >= 3)
    .sort((a, b) => a.accuracy_percentage - b.accuracy_percentage)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Gráfico de Performance por Disciplina */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Performance por Disciplina</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disciplineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="disciplina" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'accuracy_percentage') return [`${value.toFixed(1)}%`, 'Taxa de Acerto'];
                    return [value, name === 'total_questions' ? 'Total de Questões' : 'Acertos'];
                  }}
                />
                <Bar dataKey="total_questions" fill="#3b82f6" name="total_questions" />
                <Bar dataKey="correct_answers" fill="#10b981" name="correct_answers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Distribuição Geral */}
        <Card>
          <CardHeader>
            <CardTitle>🥧 Distribuição de Acertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Resumidas */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Resumo Estatístico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800">Taxa de Acerto Geral</span>
                <span className="text-2xl font-bold text-green-600">
                  {totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">Total de Questões</span>
                <span className="text-2xl font-bold text-blue-600">{totalQuestions}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">Disciplinas Estudadas</span>
                <span className="text-2xl font-bold text-purple-600">
                  {new Set(performanceData.map(item => item.disciplina)).size}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-orange-800">Assuntos Diferentes</span>
                <span className="text-2xl font-bold text-orange-600">{performanceData.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Assuntos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">🏆 Melhores Assuntos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSubjects.map((subject, index) => (
                <div key={subject.assunto} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-800">#{index + 1} {subject.assunto}</div>
                    <div className="text-sm text-green-600">{subject.disciplina}</div>
                    <div className="text-xs text-green-500">{subject.total_questions} questões</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{subject.accuracy_percentage.toFixed(1)}%</div>
                    <div className="text-sm text-green-500">{subject.correct_answers}/{subject.total_questions}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">⚠️ Precisa Melhorar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weakSubjects.map((subject, index) => (
                <div key={subject.assunto} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-red-800">#{index + 1} {subject.assunto}</div>
                    <div className="text-sm text-red-600">{subject.disciplina}</div>
                    <div className="text-xs text-red-500">{subject.total_questions} questões</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">{subject.accuracy_percentage.toFixed(1)}%</div>
                    <div className="text-sm text-red-500">{subject.correct_answers}/{subject.total_questions}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
