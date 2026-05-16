import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  const participants = [
    "Eduardo",
    "Isabela",
    "Luiza",
  ];

  const yesterday = new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const dateStr =
    yesterday
      .toISOString()
      .split("T")[0];

  for (const participant of participants) {

    // =========================
    // VERIFICAR ESTUDO
    // =========================

    const { data: study } =
      await supabase
        .from("study_entries")
        .select("id")
        .eq(
          "participant",
          participant
        )
        .gte(
          "created_at",
          `${dateStr}T00:00:00`
        )
        .lte(
          "created_at",
          `${dateStr}T23:59:59`
        )
        .limit(1);

    const studied =
      study &&
      study.length > 0;

    // =========================
    // VERIFICAR FREE DAY
    // =========================

    const { data: freeDay } =
      await supabase
        .from("free_days")
        .select("id")
        .eq(
          "participant",
          participant
        )
        .eq("used", true)
        .eq(
          "used_date",
          dateStr
        )
        .limit(1);

    const usedFreeDay =
      freeDay &&
      freeDay.length > 0;

    // =========================
    // MULTA
    // =========================

    if (
      !studied &&
      !usedFreeDay
    ) {

      await supabase
        .from("penalties")
        .insert([
          {
            participant,
            amount: 5,
            reason:
              "Não estudou no dia",
            penalty_date:
              dateStr,
          },
        ]);

      console.log(
        `${participant} multado`
      );

    } else {

      console.log(
        `${participant} protegido`
      );

    }
  }

  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      headers: {
        "Content-Type":
          "application/json",
      },
    }
  );
});