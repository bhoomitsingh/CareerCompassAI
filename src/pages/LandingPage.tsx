import {
  Sparkles,
  Brain,
  Wrench,
  Users,
  Compass,
  ArrowRight,
  LineChart,
  Lightbulb,
  Megaphone,
  Cpu,
  BarChart3,
  TrendingUp,
  Briefcase,
  Landmark,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { SectionHeading, Badge } from '@/components/UI';
import { CAREER_CATEGORIES } from '@/career-data/careers';

const SECTION_ICONS: Record<string, typeof Sparkles> = {
  Sparkles, Brain, Wrench, Users, Compass,
};

const CATEGORY_ICONS: Record<string, typeof LineChart> = {
  LineChart, Lightbulb, Megaphone, Cpu, BarChart3, TrendingUp, Briefcase, Landmark,
};

const STAGES = [
  {
    icon: Sparkles,
    title: 'Understand yourself',
    desc: 'A structured, five-section assessment maps your interests, aptitude, skills, work style and preferences.',
  },
  {
    icon: Compass,
    title: 'Discover your career matches',
    desc: 'A transparent weighted engine matches you to careers — and explains exactly why each one fits.',
  },
  {
    icon: TrendingUp,
    title: 'Build your roadmap',
    desc: 'A personalised 6-month action plan with skills, certifications, projects and internship targets.',
  },
];

export function LandingPage() {
  const { navigate } = useApp();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="teal">
              <Star className="h-3 w-3" /> Structured career intelligence
            </Badge>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
              Your future deserves more than a guess.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Discover career paths that align with your interests, strengths and ambitions. Get
              personalised guidance backed by structured assessments.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate('onboarding')} className="btn-primary w-full sm:w-auto">
                Discover my career <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => navigate('matches')} className="btn-secondary w-full sm:w-auto">
                Explore career paths
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Built for Indian undergraduate students and fresh graduates.
            </p>
          </div>

          {/* Floating stat band */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { v: '5', l: 'Assessment sections' },
              { v: '10+', l: 'Demo careers' },
              { v: '6-mo', l: 'Action plan' },
              { v: 'AI', l: 'Career consultant' },
            ].map((s) => (
              <div key={s.l} className="card px-4 py-5 text-center">
                <p className="font-display text-2xl font-bold text-accent-teal">{s.v}</p>
                <p className="mt-1 text-xs text-slate-400">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="How it works"
          title="Three stages to clarity"
          subtitle="A guided journey from self-discovery to a concrete action plan — not a chatbot guessing your future."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="card card-hover relative p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-teal/12 text-accent-teal ring-1 ring-accent-teal/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-semibold text-slate-500">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assessment sections */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionHeading
          eyebrow="The assessment"
          title="Five dimensions, one complete picture"
          subtitle="Each section measures something different — together they form your career profile."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Sparkles, t: 'Interests', d: 'What work you enjoy' },
            { icon: Brain, t: 'Aptitude', d: 'How you reason' },
            { icon: Wrench, t: 'Skills', d: 'What you bring' },
            { icon: Users, t: 'Work style', d: 'How you work' },
            { icon: Compass, t: 'Preferences', d: 'What you value' },
          ].map((x) => {
            const Icon = x.icon;
            return (
              <div key={x.t} className="card p-5">
                <Icon className="h-5 w-5 text-accent-teal" />
                <p className="mt-3 font-display text-sm font-semibold text-white">{x.t}</p>
                <p className="mt-1 text-xs text-slate-500">{x.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Career categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="Explore careers"
          title="Careers across the Indian landscape"
          subtitle="From finance to public policy — explore career paths with real descriptions, salaries, entry roles and roadmaps."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAREER_CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.icon] ?? LineChart;
            return (
              <button
                key={c.key}
                onClick={() => navigate('matches')}
                className="card card-hover group p-6 text-left"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition group-hover:bg-accent-teal/12 group-hover:text-accent-teal">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-white">{c.key}</h3>
                <p className="mt-1 text-sm text-slate-400">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent-teal opacity-0 transition group-hover:opacity-100">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Trust / disclaimer band */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="card grid gap-6 p-8 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, t: 'Transparent scoring', d: 'Every match score is computed with explainable weights — not a black box.' },
            { icon: Brain, t: 'Not a diagnosis', d: 'Results are career guidance, not a scientifically validated psychological assessment.' },
            { icon: Star, t: 'Guided, not random', d: 'Structured questions, a real matching engine and a 6-month action plan.' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.t} className="flex gap-3">
                <Icon className="h-5 w-5 shrink-0 text-accent-teal" />
                <div>
                  <p className="font-display text-sm font-semibold text-white">{f.t}</p>
                  <p className="mt-1 text-sm text-slate-400">{f.d}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="card relative overflow-hidden p-10 text-center sm:p-16">
          <div className="bg-radial-faint absolute inset-0" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Don't just choose a career. <span className="text-accent-teal">Understand why it fits you.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Start with a 10-minute structured assessment and get your personalised career matches, AI consultation and roadmap.
            </p>
            <button onClick={() => navigate('onboarding')} className="btn-primary mt-8">
              Discover my career <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
