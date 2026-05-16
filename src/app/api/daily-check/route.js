import { NextResponse } from 'next/server';

import {
  subDays,
  format,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from 'date-fns';

import { supabase } from '@/lib/supabase';

const PARTICIPANTS = [
  'Eduardo',
  'Isabela',
  'Luiza',
];

const DAILY_GOAL = 30;
const WEEKLY_GOAL = 250;
const PENALTY_AMOUNT = 5;

export async function GET() {
  try {
    // =========================
    // DATA DE ONTEM
    // =========================

    const yesterday = format(
      subDays(new Date(), 1),
      'yyyy-MM-dd'
    );

    // =========================
    // SEMANA ATUAL
    // =========================

    const currentWeek =
      format(new Date(), 'yyyy-II');

    const weekStart = startOfWeek(
      new Date(),
      {
        weekStartsOn: 1,
      }
    );

    const weekEnd = endOfWeek(
      new Date(),
      {
        weekStartsOn: 1,
      }
    );

    // =========================
    // LOOP PARTICIPANTES
    // =========================

    for (const participant of PARTICIPANTS) {

      // =========================
      // BUSCA ESTUDOS
      // =========================

      const { data: entries, error } =
        await supabase
          .from('study_entries')
          .select('*')
          .eq('participant', participant);

      if (error) {
        console.error(
          'Erro ao buscar estudos:',
          participant,
          error
        );

        continue;
      }

      // =========================
      // META SEMANAL
      // =========================

      const weekEntries =
        entries?.filter(entry => {
          if (!entry.created_at) {
            return false;
          }

          try {
            return isWithinInterval(
              new Date(entry.created_at),
              {
                start: weekStart,
                end: weekEnd,
              }
            );
          } catch {
            return false;
          }
        }) || [];

      const weeklyQuestions =
        weekEntries.reduce(
          (sum, entry) =>
            sum + (entry.questions || 0),
          0
        );

      // =========================
      // VERIFICA FREE DAY SEMANAL
      // =========================

      if (
        weeklyQuestions >= WEEKLY_GOAL
      ) {
        const {
          data: existingReward,
        } = await supabase
          .from('free_days')
          .select('*')
          .eq(
            'participant',
            participant
          )
          .eq(
            'reward_week',
            currentWeek
          )
          .limit(1);

        if (!existingReward?.length) {
          await supabase
            .from('free_days')
            .insert({
              participant,
              reward_week:
                currentWeek,
            });

          console.log(
            `🎁 Free day criado para ${participant}`
          );
        }
      }

      // =========================
      // VERIFICA ESTUDO ONTEM
      // =========================

      const studiedYesterday =
        entries?.some(entry => {
          if (!entry.created_at) {
            return false;
          }

          try {
            return (
              format(
                new Date(
                  entry.created_at
                ),
                'yyyy-MM-dd'
              ) === yesterday
            );
          } catch {
            return false;
          }
        });

      // =========================
      // SE ESTUDOU → OK
      // =========================

      if (studiedYesterday) {
        console.log(
          `✅ ${participant} estudou ontem`
        );

        continue;
      }

      // =========================
      // VERIFICA FREE DAY
      // =========================

      const {
        data: availableFreeDays,
      } = await supabase
        .from('free_days')
        .select('*')
        .eq(
          'participant',
          participant
        )
        .eq('used', false)
        .order('earned_at', {
          ascending: true,
        })
        .limit(1);

      const freeDay =
        availableFreeDays?.[0];

      // =========================
      // CONSOME FREE DAY
      // =========================

      if (freeDay) {

        await supabase
          .from('free_days')
          .update({
            used: true,
            used_date: yesterday,
          })
          .eq('id', freeDay.id);

        console.log(
          `🛌 Free day usado por ${participant}`
        );

        continue;
      }

      // =========================
      // EVITA MULTA DUPLICADA
      // =========================

      const {
        data: existingPenalty,
      } = await supabase
        .from('penalties')
        .select('*')
        .eq(
          'participant',
          participant
        )
        .eq(
          'penalty_date',
          yesterday
        )
        .limit(1);

      if (
        existingPenalty?.length
      ) {
        console.log(
          `⚠️ Multa já existe para ${participant}`
        );

        continue;
      }

      // =========================
      // CRIA MULTA
      // =========================

      await supabase
        .from('penalties')
        .insert({
          participant,

          amount:
            PENALTY_AMOUNT,

          reason:
            'Meta diária não cumprida',

          penalty_date:
            yesterday,
        });

      console.log(
        `💸 Multa aplicada para ${participant}`
      );
    }

    // =========================
    // SUCESSO
    // =========================

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      'Erro no daily-check:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}