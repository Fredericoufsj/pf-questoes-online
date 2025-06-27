
interface QuestionContentProps {
  enunciado?: string;
  comando: string;
}

export const QuestionContent = ({ enunciado, comando }: QuestionContentProps) => {
  return (
    <>
      {enunciado && (
        <div className="mb-4">
          <h3 className="font-medium text-police-800 mb-2">Enunciado:</h3>
          <p className="text-gray-700 leading-relaxed">{enunciado}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-medium text-police-800 mb-3">Comando:</h3>
        <p className="text-gray-800 font-medium leading-relaxed bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
          {comando}
        </p>
      </div>
    </>
  );
};
