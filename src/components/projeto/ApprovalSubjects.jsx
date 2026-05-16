export default function ApprovalSubjects({
  topics = [],
}) {

  const groupedSubjects =
    topics.reduce((acc, topic) => {

      if (!acc[topic.subject]) {
        acc[topic.subject] = [];
      }

      acc[topic.subject].push(topic);

      return acc;

    }, {});

  return (

    <div className="space-y-6">

      <div>

        <h2 className="text-2xl font-black text-white">
          📖 Mapa do Edital
        </h2>

        <p className="text-slate-400 mt-1">
          Acompanhe sua evolução real por matéria.
        </p>

      </div>

      {Object.entries(groupedSubjects)
        .map(([subject, subjectTopics]) => {

          const completed =
            subjectTopics.filter(
              topic => topic.completed
            ).length;

          const progress =
            Math.round(
              (completed /
                subjectTopics.length) * 100
            );

          return (

            <div
              key={subject}
              className="rounded-3xl border border-white/10 bg-slate-900/70 overflow-hidden"
            >

              <div className="p-5 border-b border-white/5">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-lg font-bold text-white">
                      {subject}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      {completed}/{subjectTopics.length} tópicos
                    </p>

                  </div>

                  <div className="text-2xl font-black text-cyan-400">
                    {progress}%
                  </div>

                </div>

                <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">

                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

              <div className="divide-y divide-white/5">

                {subjectTopics.map(topic => (

                  <div
                    key={topic.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-3 h-3 rounded-full ${
                          topic.completed
                            ? 'bg-green-400'
                            : 'bg-slate-600'
                        }`}
                      />

                      <div>

                        <div className="font-medium text-white">
                          {topic.name}
                        </div>

                        <div className="text-xs text-slate-400 mt-1">
                          {topic.total_questions || 0} questões
                        </div>

                      </div>

                    </div>

                    <div>

                      {topic.completed ? (

                        <div className="text-xs font-bold text-green-400">
                          DOMINADO
                        </div>

                      ) : (

                        <div className="text-xs font-bold text-yellow-400">
                          PENDENTE
                        </div>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          );

        })}

    </div>

  );

}