import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculatePoints, PARTICIPANTS } from '@/lib/studyUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, Loader2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const SUBJECTS = [
  'Língua Portuguesa',
  'Raciocínio Lógico',
  'Informática',
  'Atualidades',
  'Lei Orgânica do DF',
  'Realidade do DF',
  'Ética no Serviço Público',

  'Direito Constitucional',
  'Direito Administrativo',
  'Administração Pública',

  'Administração Geral',
  'Administração Financeira',
  'Administração de Recursos Humanos',
  'Administração de Materiais',
  'Gestão de Pessoas',
  'Gestão de Projetos',
  'Gestão da Qualidade',
  'Planejamento Estratégico',

  'Arquivologia',
  'Redação Oficial',

  'AFO',
  'Orçamento Público',

  'Licitações',
  'Contratos Administrativos',
  'Lei 14.133',

  'Assistência Social',
  'Legislação da Assistência Social',

  'Políticas Públicas',
  'Serviço Social',
  'Seguridade Social',

  'Noções de Administração',
  'Noções de Direito',
];

export default function StudyForm({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [participant, setParticipant] = useState('');
  const [questions, setQuestions] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { toast } = useToast();

  const q = parseInt(questions) || 0;
  const correct =
  parseInt(correctAnswers) || 0;

  const a =
    q > 0
      ? Math.round(
          (correct / q) * 100
        )
      : 0;
  const previewPoints = q > 0 && a > 0 ? calculatePoints(q, a) : null;

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!participant || !questions || !correctAnswers || !subject) {
    toast({
      title: '⚠️ Preencha todos os campos',
      variant: 'destructive'
    });
    return;
  }

  if (
    q < 1 ||
    correct < 0 ||
    correct > q
  ) {
    toast({
      title: '⚠️ Valores inválidos',
      variant: 'destructive'
    });
    return;
  }

  setLoading(true);

  try {
    const fileExt =
      file.name.split('.').pop();

    const fileName =
      `${participant}-${Date.now()}.${fileExt}`;

    const filePath =
      `proofs/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from('study-proofs')
        .upload(
          filePath,
          file
        );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from('study-proofs')
      .getPublicUrl(filePath);

    const imageUrl =
      publicUrlData.publicUrl;

    // CALCULAR PONTOS
    const points = calculatePoints(q, a);

    // INSERT NO BANCO
    const { data, error } = await supabase
      .from('study_entries')
      .insert([
        {
          participant,
          questions: q,
          accuracy: a,
          subject,
          points,
          image_url: imageUrl
        }
      ])
      .select();

      // =====================================
      // VERIFICAR FREE DAY SEMANAL
      // =====================================

      const start = new Date();
      start.setDate(
        start.getDate() - start.getDay() + 1
      );

      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      // TOTAL SEMANAL
      const { data: weeklyEntries } =
        await supabase
          .from('study_entries')
          .select('questions')
          .eq('participant', participant)
          .gte(
            'created_at',
            start.toISOString()
          )
          .lte(
            'created_at',
            end.toISOString()
          );

      const totalWeekQuestions =
        (weeklyEntries || []).reduce(
          (sum, e) =>
            sum + (e.questions || 0),
          0
        );

      // META BATIDA
      if (totalWeekQuestions >= 350) {

        // VERIFICAR SE JÁ GANHOU NESSA SEMANA
        const { data: existingFreeDay } =
          await supabase
            .from('free_days')
            .select('id')
            .eq(
              'participant',
              participant
            )
            .gte(
              'earned_date',
              start
                .toISOString()
                .split('T')[0]
            )
            .limit(1)
            .maybeSingle();

        // NÃO EXISTE -> CRIA
        if (!existingFreeDay) {

          await supabase
            .from('free_days')
            .insert([
              {
                participant,
                used: false,
                earned_date:
                  new Date()
                    .toISOString()
                    .split('T')[0],
              },
            ]);

          toast({
            title:
              '🎁 Dia Livre Conquistado!',
            description:
              `${participant} ganhou um dia livre por bater a meta semanal.`,
          });
        }
      }
    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive'
      });

      console.error(error);

      setLoading(false);
      return;
    }

    toast({
      title: `🚀 +${points} pontos para ${participant}!`,
      description: `${q} questões em ${subject} com ${a}% de acertos`
    });

    // RESET FORM
    setParticipant('');
    setQuestions('');
    setCorrectAnswers('');
    setSubject('');
    setFile(null);
    setPreview(null);

    onSuccess?.();

    setOpen(false);

  } catch (err) {
    console.error(err);

    toast({
      title: 'Erro inesperado',
      description: err.message,
      variant: 'destructive'
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-3xl border border-border bg-card overflow-hidden"
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-muted/20 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-space font-bold text-lg">Registrar Estudo</h3>
            <p className="text-xs text-muted-foreground">Registre seu progresso e ganhe pontos</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {previewPoints !== null && open && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
              +{previewPoints} pts preview
            </span>
          )}
          {open ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-border/50 pt-5">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Participante</Label>
                  <Select value={participant} onValueChange={setParticipant}>
                    <SelectTrigger className="bg-muted/40 border-border/60">
                      <SelectValue placeholder="Quem estudou?" />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTICIPANTS.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Questões</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 50"
                    value={questions}
                    onChange={e => setQuestions(e.target.value)}
                    min={1}
                    className="bg-muted/40 border-border/60"
                  />
                </div>

               <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Acertos
                  </Label>

                  <Input
                    type="number"
                    placeholder="Ex: 42"
                    value={correctAnswers}
                    onChange={e =>
                      setCorrectAnswers(
                        e.target.value
                      )
                    }
                    min={0}
                    max={q || undefined}
                    className="bg-muted/40 border-border/60"
                  />

                  {q > 0 && correct > q && (
                    <p className="text-xs text-red-400">
                      Acertos não podem ser maiores que o total de questões
                    </p>
                  )}
                  {q > 0 && correct >= 0 && (
                    <div className="text-xs text-primary font-semibold">
                      Precisão calculada: {a}%
                    </div>
                  )}
                </div>
                

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Matéria</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger className="bg-muted/40 border-border/60">
                      <SelectValue placeholder="Matéria estudada" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Print (opcional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={e => setFile(e.target.files[0])}
                    className="cursor-pointer bg-muted/40 border-border/60"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white font-bold h-10 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Rocket className="w-4 h-4 mr-2" />
                    )}
                    {loading ? 'Registrando...' : 'Registrar Estudo'}
                  </Button>
                </div>
              </form>

              {/* Points preview */}
              {previewPoints !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2"
                >
                  <span className="text-lg">✨</span>
                  <span className="text-sm font-semibold text-primary">
                    Você vai ganhar <strong>+{previewPoints} pontos</strong> com esse registro!
                  </span>
                </motion.div>
              )}

              <div className="mt-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  <strong>Pontuação:</strong> 30-49q=1pt · 50-79q=2pt · 80-119q=3pt · 120+q=5pt &nbsp;|&nbsp;
                  <strong>Bônus:</strong> 70%=+1 · 80%=+2 · 90%=+3 &nbsp;|&nbsp;
                  <strong>Penalidade:</strong> &lt;50%=-1pt
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}