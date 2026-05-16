import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { createClient }
from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SERVICE_ROLE_KEY")!
  );

  // =========================
  // BUSCAR ENTRIES ANTIGAS
  // =========================

  const limitDate = new Date();

  limitDate.setDate(
    limitDate.getDate() - 15
  );

  const isoDate =
    limitDate.toISOString();

  const { data: entries, error }
    = await supabase
      .from("study_entries")
      .select(`
        id,
        image_url
      `)
      .not(
        "image_url",
        "is",
        null
      )
      .lt(
        "created_at",
        isoDate
      );

  if (error) {
    throw error;
  }

  // =========================
  // REMOVER STORAGE
  // =========================

  for (const entry of entries || []) {

    try {

      const url =
        entry.image_url;

      const path =
        url.split(
          "/study-proofs/"
        )[1];

      if (path) {

        await supabase.storage
          .from("study-proofs")
          .remove([path]);

      }

      // =====================
      // LIMPAR URL
      // =====================

      await supabase
        .from("study_entries")
        .update({
          image_url: null
        })
        .eq("id", entry.id);

      console.log(
        `Imagem removida: ${entry.id}`
      );

    } catch (err) {

      console.error(
        "Erro ao remover:",
        err
      );

    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      removed:
        entries?.length || 0
    }),
    {
      headers: {
        "Content-Type":
          "application/json"
      }
    }
  );
});