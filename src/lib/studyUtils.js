import {
  format,
  differenceInCalendarDays,
  parseISO,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns';

export const PARTICIPANTS = [
  'Eduardo',
  'Isabela',
  'Luiza',
];

export const AVATARS = {
  Eduardo: '🦁',
  Isabela: '🐯',
  Luiza: '🦊',
};

export const CHALLENGE_START =
  '2026-05-20';

export const EXAM_DATE =
  '2026-09-09';

export const DAILY_GOAL = 30;

export const WEEKLY_GOAL = 350;

export const INITIAL_FUND = 100;

export const MOTIVATIONAL_QUOTES = [
  'A dor da disciplina é menor que a dor do arrependimento.',
  'Cada questão te aproxima da aprovação.',
  'Consistência vence talento quando talento não é consistente.',
  'O sucesso é a soma de pequenos esforços repetidos diariamente.',
  'Não pare quando estiver cansado. Pare quando terminar.',
  'A aprovação não é sorte, é preparação encontrando oportunidade.',
  'Hoje é um bom dia para estudar mais que ontem.',
  'Quem estuda enquanto os outros descansam, brilha quando os outros desejam.',
  'Seu futuro agradece o esforço de hoje.',
  'A diferença entre o ordinário e o extraordinário é aquele pequeno extra.',
  'Cada dia de estudo é um tijolo na sua aprovação.',
  'O campeão treina quando não está com vontade.',
];

export const LEVELS = [
  {
    name: 'Iniciante',
    minPoints: 0,
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/30',
    icon: '🌱',
  },
  {
    name: 'Guerreiro',
    minPoints: 10,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/30',
    icon: '⚔️',
  },
  {
    name: 'Elite',
    minPoints: 25,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    icon: '🛡️',
  },
  {
    name: 'Mestre',
    minPoints: 50,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
    icon: '🔮',
  },
  {
    name: 'Lendário',
    minPoints: 100,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30',
    icon: '👑',
  },
];

export function getLevel(points) {
  let level = LEVELS[0];

  for (const l of LEVELS) {
    if (points >= l.minPoints) {
      level = l;
    }
  }

  const nextLevel =
    LEVELS[
      LEVELS.indexOf(level) + 1
    ];

  const progress = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((points -
            level.minPoints) /
            (nextLevel.minPoints -
              level.minPoints)) *
            100
        )
      )
    : 100;

  return {
    ...level,
    nextLevel,
    progress,
  };
}

export function calculatePoints(
  questions,
  accuracy
) {
  let points = 0;

  // QUESTÕES
  if (questions >= 200) points += 8;
  else if (questions >= 150)
    points += 6;
  else if (questions >= 100)
    points += 4;
  else if (questions >= 60)
    points += 3;
  else if (questions >= 30)
    points += 2;

  // PRECISÃO
  if (accuracy >= 95) points += 4;
  else if (accuracy >= 90)
    points += 3;
  else if (accuracy >= 80)
    points += 2;
  else if (accuracy >= 70)
    points += 1;

  // PENALIDADE
  if (accuracy < 50) points -= 1;

  return Math.max(points, 0);
}

export function getDaysSinceStart() {
  return differenceInCalendarDays(
    new Date(),
    parseISO(CHALLENGE_START)
  );
}

export function getDaysUntilExam() {
  return Math.max(
    0,
    differenceInCalendarDays(
      parseISO(EXAM_DATE),
      new Date()
    )
  );
}

function getEntryDate(entry) {
  if (!entry?.created_at)
    return null;

  try {
    return format(
      new Date(entry.created_at),
      'yyyy-MM-dd'
    );
  } catch {
    return null;
  }
}

function getMaxQuestionsInDay(
  entries
) {
  const byDate = {};

  entries.forEach(e => {
    const date =
      getEntryDate(e);

    if (!date) return;

    byDate[date] =
      (byDate[date] || 0) +
      (e.questions || 0);
  });

  return Math.max(
    0,
    ...Object.values(byDate)
  );
}

export function getPlayerStats(
  entries,
  participant,
  penalties = [],
  freeDays = []
) {

  const playerEntries =
    entries.filter(
      e =>
        e.participant ===
        participant
    );

  const todayStr = format(
    new Date(),
    'yyyy-MM-dd'
  );

  const todayEntries =
    playerEntries.filter(
      e =>
        getEntryDate(e) ===
        todayStr
    );

  // =====================
  // BÁSICOS
  // =====================

  const totalPoints =
    playerEntries.reduce(
      (sum, e) =>
        sum + (e.points || 0),
      0
    );

  const totalQuestions =
    playerEntries.reduce(
      (sum, e) =>
        sum +
        (e.questions || 0),
      0
    );

  const avgAccuracy =
    playerEntries.length > 0
      ? Math.round(
          playerEntries.reduce(
            (sum, e) =>
              sum +
              (e.accuracy || 0),
            0
          ) /
            playerEntries.length
        )
      : 0;

  const todayQuestions =
    todayEntries.reduce(
      (sum, e) =>
        sum +
        (e.questions || 0),
      0
    );

  const todayAccuracy =
    todayEntries.length > 0
      ? Math.round(
          todayEntries.reduce(
            (sum, e) =>
              sum +
              (e.accuracy || 0),
            0
          ) /
            todayEntries.length
        )
      : 0;

  const todayPoints =
    todayEntries.reduce(
      (sum, e) =>
        sum + (e.points || 0),
      0
    );

  const todaySubjects = [
    ...new Set(
      todayEntries
        .map(e => e.subject)
        .filter(Boolean)
    ),
  ];

  const metDailyGoal =
    todayQuestions >=
    DAILY_GOAL;

  const studiedToday =
    todayEntries.length > 0;

  const atRiskToday =
    !metDailyGoal;

  // =====================
  // DIAS ESTUDADOS
  // =====================

  const studyDays = [
    ...new Set(
      playerEntries
        .map(getEntryDate)
        .filter(Boolean)
    ),
  ];

  const daysStudied =
    studyDays.length;

  const studyAveragePerDay =
    daysStudied > 0
      ? Math.round(
          totalQuestions /
            daysStudied
        )
      : 0;

  // =====================
  // FREE DAYS
  // =====================

  const participantFreeDays =
    freeDays.filter(
      d =>
        d.participant ===
        participant
    );

  const availableFreeDays =
    participantFreeDays.filter(
      d => !d.used
    ).length;

  const hasFreeDay =
    availableFreeDays > 0;

  // =====================
  // STREAK
  // =====================

  let streak = 0;

  const studyDatesSet =
    new Set(studyDays);

  const currentDate =
    new Date();

  for (
    let i = 0;
    i < 365;
    i++
  ) {
    const check =
      new Date(currentDate);

    check.setDate(
      currentDate.getDate() - i
    );

    const dateStr = format(
      check,
      'yyyy-MM-dd'
    );

    // DIA ATUAL
    if (i === 0) {

      const studiedToday =
        studyDatesSet.has(
          dateStr
        );

      const usedFreeDayToday =
        participantFreeDays.find(
          freeDay =>
            freeDay.used &&
            format(
              new Date(
                freeDay.used_date
              ),
              'yyyy-MM-dd'
            ) === dateStr
        );

      if (
        studiedToday ||
        usedFreeDayToday
      ) {
        streak++;
      }

      continue;
    }

    // ESTUDOU
    if (
      studyDatesSet.has(
        dateStr
      )
    ) {
      streak++;
      continue;
    }

    // FREE DAY
    const usedFreeDay =
      participantFreeDays.find(
        freeDay =>
          freeDay.used &&
          format(
            new Date(
              freeDay.used_date
            ),
            'yyyy-MM-dd'
          ) === dateStr
      );

    if (usedFreeDay) {
      streak++;
      continue;
    }

    // QUEBRA
    break;
  }

  // =====================
  // SEMANAL
  // =====================

  const weekStart =
    startOfWeek(
      new Date(),
      {
        weekStartsOn: 1,
      }
    );

  const weekEnd =
    endOfWeek(
      new Date(),
      {
        weekStartsOn: 1,
      }
    );

  const weekEntries =
    playerEntries.filter(
      e => {
        if (!e.created_at)
          return false;

        try {
          const d = parseISO(
            e.created_at
          );

          return isWithinInterval(
            d,
            {
              start:
                weekStart,
              end: weekEnd,
            }
          );
        } catch {
          return false;
        }
      }
    );

  const weekQuestions =
    weekEntries.reduce(
      (sum, e) =>
        sum +
        (e.questions || 0),
      0
    );

  const weeklyProgress =
    Math.min(
      100,
      Math.round(
        (weekQuestions /
          WEEKLY_GOAL) *
          100
      )
    );

  const weeklyGoalMet =
    weekQuestions >=
    WEEKLY_GOAL;

  const dailyProgress =
    Math.min(
      100,
      Math.round(
        (todayQuestions /
          DAILY_GOAL) *
          100
      )
    );

  // =====================
  // MULTAS
  // =====================

  const participantPenalties =
    penalties.filter(
      p =>
        p.participant ===
        participant
    );

  const fines =
    participantPenalties.reduce(
      (sum, p) =>
        sum + (p.amount || 0),
      0
    );

  // =====================
  // CHALLENGE
  // =====================

  const challengeProgress =
    Math.min(
      100,
      Math.round(
        (getDaysSinceStart() /
          differenceInCalendarDays(
            parseISO(
              EXAM_DATE
            ),
            parseISO(
              CHALLENGE_START
            )
          )) *
          100
      )
    );

  const currentFund =
    INITIAL_FUND - fines;

  // =====================
  // LEVEL
  // =====================

  const level =
    getLevel(totalPoints);

  return {
    totalPoints,
    totalQuestions,
    avgAccuracy,

    streak,

    todayQuestions,
    todayAccuracy,
    todayPoints,
    todaySubjects,

    metDailyGoal,
    studiedToday,
    atRiskToday,

    weeklyProgress,
    weekQuestions,
    weeklyGoalMet,

    dailyProgress,

    daysStudied,
    studyAveragePerDay,

    fines,

    availableFreeDays,
    hasFreeDay,

    challengeProgress,
    currentFund,

    entriesCount:
      playerEntries.length,

    level,
  };
}

export function getAchievements(
  player
) {

  return [
    {
      icon: '🔥',
      label:
        '7 dias seguidos',
      unlocked:
        player.streak >= 7,
    },

    {
      icon: '⚡',
      label:
        '30 dias seguidos',
      unlocked:
        player.streak >= 30,
    },

    {
      icon: '🏅',
      label:
        '1000 questões',
      unlocked:
        player.totalQuestions >=
        1000,
    },

    {
      icon: '🚀',
      label:
        '5000 questões',
      unlocked:
        player.totalQuestions >=
        5000,
    },

    {
      icon: '🎯',
      label:
        'Precisão 80%+',
      unlocked:
        player.avgAccuracy >=
        80,
    },

    {
      icon: '🧠',
      label:
        'Precisão 90%+',
      unlocked:
        player.avgAccuracy >=
        90,
    },

    {
      icon: '🚀',
      label:
        'Meta semanal',
      unlocked:
        player.weeklyGoalMet,
    },

    {
      icon: '🛌',
      label:
        'Primeiro dia livre',
      unlocked:
        player.availableFreeDays >=
        1,
    },

    {
      icon: '💸',
      label:
        'Sem multas',
      unlocked:
        player.fines === 0,
    },
  ];
}

export function getRanking(
  entries,
  penalties = [],
  freeDays = []
) {

  const ranking =
    PARTICIPANTS.map(
      name => ({
        name,
        ...getPlayerStats(
          entries,
          name,
          penalties,
          freeDays
        ),
      })
    );

  ranking.sort(
    (a, b) =>
      b.totalPoints -
        a.totalPoints ||
      b.streak -
        a.streak ||
      b.totalQuestions -
        a.totalQuestions
  );

  ranking.forEach(
    (player, index) => {
      player.position =
        index + 1;

      player.isLeader =
        player.position === 1;

      player.isLast =
        player.position ===
        ranking.length;
    }
  );
  return ranking;
}

export function generateActivityFeed(
  entries
) {

  const sorted = [
    ...entries,
  ].sort(
    (a, b) =>
      new Date(
        b.created_at
      ) -
      new Date(a.created_at)
  );

  return sorted
    .slice(0, 20)
    .map(entry => {

      const pts =
        entry.points || 0;

      let icon = '📚';

      let highlight = false;

      if (pts >= 8) {
        icon = '🔥';
        highlight = true;
      } else if (pts >= 5) {
        icon = '⚡';
        highlight = true;
      } else if (
        entry.questions >= 100
      ) {
        icon = '🚀';
        highlight = true;
      } else if (
        entry.questions >= 60
      ) {
        icon = '💪';
      } else if (
        entry.accuracy >= 90
      ) {
        icon = '🎯';
      }

      return {
        id: entry.id,

        participant:
          entry.participant,

        text:
          `${entry.participant} fez ${entry.questions} questões em ${
            entry.subject ||
            entry.subject_name ||
            entry.discipline ||
            'Matéria'
          } com ${
            entry.accuracy
          }% de acertos e ganhou +${pts} pts`,

        icon,
        highlight,

        date:
          entry.created_at,

        points: pts,
      };
    });
}