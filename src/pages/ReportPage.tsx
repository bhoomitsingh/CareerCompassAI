import { Sparkles, Brain, Wrench, Users, Compass, ArrowRight, Info } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { SECTIONS } from '@/assessment/questions';
import { BarList, RadarChart, RadialBar } from '@/components/Charts';
import { Badge, SectionHeading, CheckList } from '@/components/UI';

const ICONS: Record<string, typeof Sparkles> = { Sparkles, Brain, Wrench, Users, Compass };

const SECTION_CONTEXT: Record<string, { title: string; meaning: string; color: string }> = {
  interests: {
    title: 'Interest profile',
    meaning:
      'What types of work you are naturally drawn to. Higher bars mean stronger attraction to that area.',
    color: '#2DD4BF',
  },
  aptitude: {
    title: 'Aptitude profile',
    meaning:
      'How strong your reasoning is across numerical, verbal, logical and analytical areas.',
    color: '#38BDF8',
  },
  skills: {
    title: 'Skills profile',
    meaning:
      'Your current self-reported strengths across technical, communication, interpersonal and academic areas.',
    color: '#A78BFA',
  },
  personality: {
    title: 'Work-style profile',
    meaning:
      'How you prefer to work — leadership, teamwork, structure, autonomy, creativity and risk-taking.',
    color: '#F472B6',
  },
  preferences: {
    title: 'Career preferences',
    meaning:
      'The trade-offs you value — income, stability, balance, growth, impact and location.',
    color: '#FBBF24',
  },
};

export function ReportPage() {
  const { session, navigate } = useApp();
  const scores = session.assessment.scores;

  if (!session.assessment.completed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-slate-400">You have not completed the assessment yet.</p>
        <button onClick={() => navigate('assessment')} className="btn-primary mt-6">
          Start the assessment
        </button>
      </div>
    );
  }

  const topInterests = Object.entries(scores.interests).sort((a, b) => b[1] - a[1]).slice(0, 2);
  const topAptitude = Object.entries(scores.aptitude).sort((a, b) => b[1] - a[1]).slice(0, 2);
  const topSkills = Object.entries(scores.skills).sort((a, b) => b[1] - a[1]).slice(0, 2);
  const lowSkills = Object.entries(scores.skills).filter(([, v]) => v < 45).sort((a, b) => a[1] - b[1]).slice(0, 3);
  const topPersonality = Object.entries(scores.personality).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const strengths = [
    ...topInterests.map(([k]) => `Strong interest in ${k}`),
    ...topAptitude.map(([k]) => `Strong ${k} aptitude`),
    ...topSkills.map(([k]) => `Solid ${k} skills`),
  ].slice(0, 5);

  const development = lowSkills.length
    ? lowSkills.map(([k]) => `Build ${k} skills`)
    : ['Broaden your practical project experience'];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 animate-fade-in">
      <SectionHeading
        eyebrow="Your assessment report"
        title={`${session.profile.fullName || 'Your'} career profile`}
        subtitle="A snapshot of who you are across five dimensions. This is career guidance, not a scientifically validated psychological diagnosis."
      />

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-xs text-slate-400">
        <Info className="h-4 w-4 shrink-0 text-sky-400" />
        Scores are normalised within each section so the highest-scoring trait becomes 100. They are comparative, not absolute.
      </div>

      {/* Summary radials */}
      <div className="mt-8 card grid grid-cols-2 gap-6 p-8 sm:grid-cols-3 lg:grid-cols-5">
        {SECTIONS.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          const vals = Object.values(scores[s.key]);
          const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
          const ctx = SECTION_CONTEXT[s.key];
          return (
            <div key={s.key} className="flex flex-col items-center text-center">
              <RadialBar label={s.shortLabel} value={avg} color={ctx.color} caption={<Icon className="h-3 w-3" />} />
            </div>
          );
        })}
      </div>

      {/* Detailed sections */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {SECTIONS.map((s) => {
          const ctx = SECTION_CONTEXT[s.key];
          const entries = Object.entries(scores[s.key]).sort((a, b) => b[1] - a[1]);
          const items = entries.map(([k, v]) => ({ label: k, value: v, color: ctx.color }));
          const radarAxes = entries.slice(0, 6).map(([k, v]) => ({ label: k, value: v }));
          return (
            <div key={s.key} className="card p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white">{ctx.title}</h3>
                <Badge>{s.shortLabel}</Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500">{ctx.meaning}</p>

              {radarAxes.length >= 3 && (
                <div className="mt-4">
                  <RadarChart axes={radarAxes} color={ctx.color} />
                </div>
              )}
              <div className="mt-4">
                <BarList items={items} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths & development */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="card p-7">
          <h3 className="font-display text-lg font-bold text-white">Your strengths</h3>
          <p className="mt-1 text-xs text-slate-500">What to lean into when choosing a career.</p>
          <div className="mt-4">
            <CheckList items={strengths} />
          </div>
        </div>
        <div className="card p-7">
          <h3 className="font-display text-lg font-bold text-white">Development areas</h3>
          <p className="mt-1 text-xs text-slate-500">Skills worth strengthening before you specialise.</p>
          <div className="mt-4">
            <CheckList items={development} variant="arrow" />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent-teal/20 bg-accent-teal/5 p-8 sm:flex-row">
        <div>
          <h3 className="font-display text-xl font-bold text-white">See your career matches</h3>
          <p className="mt-1 text-sm text-slate-400">We ranked 10 careers against your profile with a transparent weighted engine.</p>
        </div>
        <button onClick={() => navigate('matches')} className="btn-primary">
          View career matches <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
