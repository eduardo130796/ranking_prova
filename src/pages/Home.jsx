import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getRanking,
  getAchievements,
} from '@/lib/studyUtils';

import MyApprovalDashboard from '@/components/projeto/MyApprovalDashboard';

import HeroHeader from '@/components/projeto/HeroHeader.jsx';

import RankingBar from '@/components/projeto/RankingBar.jsx';

import PlayerColumn from '@/components/projeto/PlayerColumn.jsx';

import StudyForm from '@/components/projeto/StudyForm.jsx';

import ActivityFeed from '@/components/projeto/ActivityFeed.jsx';

import { Loader2 } from 'lucide-react';

import { supabase } from '@/lib/supabase';

export default function Home() {
  const [activeView, setActiveView] =
    useState('group');

  const queryClient =
    useQueryClient();

  // =====================
  // FETCH GERAL
  // =====================

  const {
    data,
    isLoading,
  } = useQuery({

    queryKey: ['dashboardData'],

    queryFn: async () => {

      // =====================
      // STUDY ENTRIES
      // =====================

      const {
        data: entries,
        error: entriesError,
      } = await supabase
        .from('study_entries')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (entriesError) {
        throw entriesError;
      }

      // =====================
      // PENALTIES
      // =====================

      const {
        data: penalties,
        error: penaltiesError,
      } = await supabase
        .from('penalties')
        .select('*');

      if (penaltiesError) {
        throw penaltiesError;
      }

      // =====================
      // FREE DAYS
      // =====================

      const {
        data: freeDays,
        error: freeDaysError,
      } = await supabase
        .from('free_days')
        .select('*');

      if (freeDaysError) {
        throw freeDaysError;
      }

      const {
        data: topics,
      } = await supabase
        .from('topics')

      const {
        data: reviews,
      } = await supabase
        .from('review_tasks')
        .select(`
          *,
          topics(name)
        `);

      const {
        data: mockExams,
      } = await supabase
        .from('mock_exams')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      return {
        entries:
          entries || [],

        penalties:
          penalties || [],

        freeDays:
          freeDays || [],
        topics:
          topics || [],

        reviews:
          reviews || [],

        mockExams:
          mockExams || [],
      };
    },
  });

  // =====================
  // DADOS
  // =====================

  const entries =
    data?.entries || [];

  const penalties =
    data?.penalties || [];

  const freeDays =
    data?.freeDays || [];

  const topics =
    data?.topics || [];

  const reviews =
    data?.reviews || [];

  const mockExams =
    data?.mockExams || [];

  // =====================
  // RANKING
  // =====================

  const ranking =
    getRanking(
      entries,
      penalties,
      freeDays
    );

  // =====================
  // TOTAL MULTAS
  // =====================

  const totalFines =
    ranking.reduce(
      (sum, player) =>
        sum +
        (player.fines || 0),
      0
    );

  // =====================
  // REFRESH
  // =====================

  const handleRefresh =
    () => {

      queryClient.invalidateQueries({
        queryKey: ['dashboardData'],
      });
    };

  // =====================
  // LOADING
  // =====================

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <Loader2 className="w-8 h-8 animate-spin text-primary" />

      </div>
    );
  }

  // =====================
  // UI
  // =====================
  console.log('RANKING:', ranking);

  const completedTopics =
  topics.filter(
    topic => topic.completed
  ).length;

  const editalProgress =
    topics.length > 0
      ? Math.round(
          (completedTopics /
            topics.length) * 100
        )
      : 0;
  return (

  <div className="min-h-screen bg-background">

    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {/* TOGGLE */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => setActiveView('group')}
          className={`px-5 py-2 rounded-2xl transition-all font-semibold ${
            activeView === 'group'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg'
              : 'bg-slate-900 border border-white/10 text-slate-400'
          }`}
        >
          🔥 Grupo
        </button>

        <button
          onClick={() => setActiveView('approval')}
          className={`px-5 py-2 rounded-2xl transition-all font-semibold ${
            activeView === 'approval'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
              : 'bg-slate-900 border border-white/10 text-slate-400'
          }`}
        >
          📚 Minha Aprovação
        </button>

      </div>

      {/* ========================= */}
      {/* VIEW: GRUPO */}
      {/* ========================= */}

      {activeView === 'group' && (

        <>

          {/* HERO */}
          <HeroHeader
            ranking={ranking}
            totalFines={totalFines}
          />

          {/* RANKING */}
          <RankingBar
            ranking={ranking}
          />

          {/* PLAYERS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {ranking.map(
              (player, i) => (

                <PlayerColumn
                  key={player.name}

                  player={player}

                  achievements={
                    getAchievements(player)
                  }

                  entries={entries}

                  penalties={penalties}

                  freeDays={freeDays}

                  rankPosition={i}

                  delay={
                    0.25 + i * 0.1
                  }
                />

              )
            )}

          </div>

          {/* FORM */}
          <StudyForm
            onSuccess={handleRefresh}
          />

          {/* FEED */}
          <ActivityFeed
            entries={entries}
          />

        </>

      )}

      {/* ========================= */}
      {/* VIEW: MINHA APROVAÇÃO */}
      {/* ========================= */}

      {activeView === 'approval' && (

        <>

          {/* HERO NOVO */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30 p-8">

            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,#06b6d4,transparent_40%)]" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-4">
                  📚 CENTRAL ESTRATÉGICA
                </div>

                <h1 className="text-4xl font-black text-white leading-tight">
                  Sua aprovação
                  <span className="block text-cyan-400">
                    está em construção.
                  </span>
                </h1>

                <p className="mt-4 text-slate-400 max-w-2xl">
                  Controle revisões, edital, simulados e evolução da preparação em um único lugar.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-4 min-w-[280px]">

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-slate-400">
                    Edital
                  </div>

                  <div className="text-3xl font-black text-cyan-400 mt-2">
                    {editalProgress}%
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-slate-400">
                    Revisões
                  </div>

                  <div className="text-3xl font-black text-yellow-400 mt-2">
                    {
                      reviews.filter(
                        r => !r.completed
                      ).length
                    }
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-slate-400">
                    Simulados
                  </div>

                  <div className="text-3xl font-black text-purple-400 mt-2">
                    {mockExams.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-slate-400">
                    Questões
                  </div>

                  <div className="text-3xl font-black text-green-400 mt-2">
                    {
                      entries.reduce(
                        (sum, e) =>
                          sum + (e.questions || 0),
                        0
                      )
                    }
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* DASHBOARD */}
          <MyApprovalDashboard
            subjects={topics}
            reviews={
              reviews?.map(r => ({
                ...r,
                topic_name:
                  r.topics?.name,
              })) || []
            }
            mockExams={mockExams}
          />

        </>

      )}

    </div>

  </div>

  );
}
