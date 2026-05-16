import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import {
  getRanking,
  getAchievements,
} from '@/lib/studyUtils';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 space-y-12">


        {/* ========================= */}
        {/* VIEW: GRUPO */}
        {/* ========================= */}
        {activeView === 'group' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <HeroHeader
              ranking={ranking}
              totalFines={totalFines}
            />

            <RankingBar
              ranking={ranking}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {ranking.map((player, i) => (
                <PlayerColumn
                  key={player.name}
                  player={player}
                  achievements={getAchievements(player)}
                  entries={entries}
                  penalties={penalties}
                  freeDays={freeDays}
                  rankPosition={i}
                  delay={0.25 + i * 0.1}
                />
              ))}
            </div>

            <StudyForm onSuccess={handleRefresh} />
            <ActivityFeed entries={entries} />
          </motion.div>
        )}
      </div>
    </div>

  );
}
