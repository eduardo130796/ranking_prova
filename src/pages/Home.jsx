import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRanking, PARTICIPANTS } from '@/lib/studyUtils';
import HeroHeader from '@/components/projeto/HeroHeader.jsx';
import RankingBar from '@/components/projeto/RankingBar.jsx';
import PlayerColumn from '@/components/projeto/PlayerColumn.jsx';
import StudyForm from '@/components/projeto/StudyForm.jsx';
import ActivityFeed from '@/components/projeto/ActivityFeed.jsx';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['studyEntries'],
    queryFn: async () => {
    const { data, error } = await supabase
        .from('study_entries')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error

    return data
    },
  });

  const ranking = getRanking(entries);
  const totalFines = ranking.reduce((sum, p) => sum + (p.fines || 0), 0);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['studyEntries'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <HeroHeader ranking={ranking} totalFines={totalFines} />
        <RankingBar ranking={ranking} />

        {/* 3 Player Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {ranking.map((player, i) => (
            <PlayerColumn
              key={player.name}
              participant={player.name}
              entries={entries}
              rankPosition={i}
              delay={0.25 + i * 0.1}
            />
          ))}
        </div>

        <StudyForm onSuccess={handleRefresh} />
        <ActivityFeed entries={entries} />
      </div>
    </div>
  );
}