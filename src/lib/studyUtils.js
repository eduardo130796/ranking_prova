import {
  format,
  differenceInCalendarDays,
  parseISO,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns';

export const PARTICIPANTS = ['Eduardo', 'Isabela', 'Luiza'];

export const AVATARS = {
  Eduardo: '🦁',
  Isabela: '🐯',
  Luiza: '🦊',
};

export const CHALLENGE_START = '2025-05-01';
export const EXAM_DATE = '2025-09-28';

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

  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];

  const progress = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((points - level.minPoints) /
            (nextLevel.minPoints - level.minPoints)) *
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

export function calculatePoints(questions, accuracy) {
  let points = 0;

  if (questions >= 120) points = 5;
  else if (questions >= 80) points = 3;
  else if (questions >= 50) points = 2;
  else if (questions >= 30) points = 1;

  if (accuracy >= 90) points += 3;
  else if (accuracy >= 80) points += 2;
  else if (accuracy >= 70) points += 1;

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
  if (!entry?.created_at) return null;

  try {
    return format(parseISO(entry.created_at), 'yyyy-MM-dd');
  } catch {
    return null;
  }
}

export function getPlayerStats(entries, participant) {
  const playerEntries = entries.filter(
    e => e.participant === participant
  );

  const today = format(new Date(), 'yyyy-MM-dd');

  const todayEntries = playerEntries.filter(
    e => getEntryDate(e) === today
  );

  const totalPoints = playerEntries.reduce(
    (sum, e) => sum + (e.points || 0),
    0
  );

  const totalQuestions = playerEntries.reduce(
    (sum, e) => sum + (e.questions || 0),
    0
  );

  const avgAccuracy =
    playerEntries.length > 0
      ? Math.round(
          playerEntries.reduce(
            (sum, e) => sum + (e.accuracy || 0),
            0
          ) / playerEntries.length
        )
      : 0;

  const todayQuestions = todayEntries.reduce(
    (sum, e) => sum + (e.questions || 0),
    0
  );

  const todayAccuracy =
    todayEntries.length > 0
      ? Math.round(
          todayEntries.reduce(
            (sum, e) => sum + (e.accuracy || 0),
            0
          ) / todayEntries.length
        )
      : 0;

  const todayPoints = todayEntries.reduce(
    (sum, e) => sum + (e.points || 0),
    0
  );

  const todaySubjects = [
    ...new Set(
      todayEntries.map(e => e.subject).filter(Boolean)
    ),
  ];

  const metDailyGoal = todayQuestions >= DAILY_GOAL;
  const studiedToday = todayEntries.length > 0;

  // STREAK
  const studyDates = [
    ...new Set(
      playerEntries
        .map(getEntryDate)
        .filter(Boolean)
    ),
  ].sort().reverse();

  let streak = 0;
  let checkDate = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');

    if (studyDates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    } else {
      break;
    }
  }

  // WEEKLY
  const weekStart = startOfWeek(new Date(), {
    weekStartsOn: 1,
  });

  const weekEnd = endOfWeek(new Date(), {
    weekStartsOn: 1,
  });

  const weekEntries = playerEntries.filter(e => {
    if (!e.created_at) return false;

    try {
      const d = parseISO(e.created_at);

      return isWithinInterval(d, {
        start: weekStart,
        end: weekEnd,
      });
    } catch {
      return false;
    }
  });

  const weekQuestions = weekEntries.reduce(
    (sum, e) => sum + (e.questions || 0),
    0
  );

  const weeklyProgress = Math.min(
    100,
    Math.round((weekQuestions / WEEKLY_GOAL) * 100)
  );

  const weeklyGoalMet = weekQuestions >= WEEKLY_GOAL;

  const dailyProgress = Math.min(
    100,
    Math.round((todayQuestions / DAILY_GOAL) * 100)
  );

  // MULTAS
  const daysInChallenge = getDaysSinceStart();

  const daysStudied = new Set(
    playerEntries
      .map(getEntryDate)
      .filter(Boolean)
  ).size;

  const missedDays = Math.max(
    0,
    daysInChallenge - daysStudied
  );

  const fines = missedDays * 5;

  // DIA LIVRE
  const freeDaysEarned = weeklyGoalMet ? 1 : 0;

  const level = getLevel(totalPoints);

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
    weeklyProgress,
    weekQuestions,
    dailyProgress,
    weeklyGoalMet,
    freeDaysEarned,
    fines,
    entriesCount: playerEntries.length,
    level,
  };
}

function getMaxQuestionsInDay(entries) {
  const byDate = {};

  entries.forEach(e => {
    const date = getEntryDate(e);

    if (!date) return;

    byDate[date] =
      (byDate[date] || 0) + (e.questions || 0);
  });

  return Math.max(0, ...Object.values(byDate));
}

export function getAchievements(entries, participant) {
  const playerEntries = entries.filter(
    e => e.participant === participant
  );

  const stats = getPlayerStats(entries, participant);

  const maxQuestionsInDay =
    getMaxQuestionsInDay(playerEntries);

  return [
    {
      icon: '🔥',
      label: '7 dias seguidos',
      unlocked: stats.streak >= 7,
    },
    {
      icon: '🏅',
      label: '1000 questões',
      unlocked: stats.totalQuestions >= 1000,
    },
    {
      icon: '⚡',
      label: '100 questões em um dia',
      unlocked: maxQuestionsInDay >= 100,
    },
    {
      icon: '🎯',
      label: 'Precisão 80%+',
      unlocked: stats.avgAccuracy >= 80,
    },
    {
      icon: '🚀',
      label: 'Meta semanal',
      unlocked: stats.weeklyGoalMet,
    },
  ];
}

export function getRanking(entries) {
  return PARTICIPANTS.map(name => ({
    name,
    ...getPlayerStats(entries, name),
  })).sort(
    (a, b) =>
      b.totalPoints - a.totalPoints ||
      b.totalQuestions - a.totalQuestions
  );
}

export function generateActivityFeed(entries) {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.created_at) -
      new Date(a.created_at)
  );

  return sorted.slice(0, 20).map(entry => {
    const pts = entry.points || 0;

    let icon = '📖';
    let highlight = false;

    if (pts >= 8) {
      icon = '🔥';
      highlight = true;
    } else if (pts >= 5) {
      icon = '⚡';
      highlight = true;
    } else if (entry.questions >= 100) {
      icon = '🚀';
      highlight = true;
    } else if (entry.accuracy >= 90) {
      icon = '🎯';
    }

    return {
      id: entry.id,
      participant: entry.participant,
      text:
        entry.participant +
        ' fez ' +
        entry.questions +
        ' questões em ' +
        entry.subject +
        ' (' +
        entry.accuracy +
        '% acertos) → +' +
        pts +
        ' pts',

      icon,
      highlight,
      date: entry.created_at,
      points: pts,
    };
  });
}