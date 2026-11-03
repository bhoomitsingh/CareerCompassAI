import { useMemo } from 'react';
import { ArrowLeft, Check, Circle, Target, Flag, BookOpen, Award, Briefcase, FolderGit2, ListChecks } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { getCareer, CAREERS } from '@/career-data/careers';
import { matchCareer } from '@/career-engine/matching';
import { buildRoadmap, roadmapProgress } from '@/roadmap/builder';
import { ProgressBar } from '@/components/Charts';
import { Badge, EmptyState } from '@/components/UI';
import type { RoadmapMilestone } from '@/types';

const CATEGORY_ICONS: Record<string, typeof Target> = {
  skill: Target,
  qualification: BookOpen,
  certification: Award,
  internship: Briefcase,
  project: FolderGit2,
  action: ListChecks,
};

export function RoadmapPage() {
  const { routeParam, session, navigate, setRoadmapMilestone } = useApp();

  // If no career param, use the user's top match (or first career)
  const careerId = routeParam
    ?? (session.assessment.completed ? matchCareer(CAREERS[0], session.assessment.scores).career.id : CAREERS[0].id);
  const career = getCareer(careerId);

  const match = session.assessment.completed ? matchCareer(career!, session.assessment.scores) : null;
  const milestones = useMemo(() => (career ? buildRoadmap(match ?? { career, matchScore: 0, breakdown: { interests: 0, aptitude: 0, skills: 0, personality: 0, preferences: 0 }, strengthsMatched: [], potentialGaps: [], reasoning: '' }) : []), [career, match]);
  const progress = roadmapProgress(milestones, session.roadmapProgress);

  if (!career) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState title="Roadmap unavailable" description="Select a career to view its roadmap." action={<button onClick={() => navigate('matches')} className="btn-primary">Explore careers</button>} />
      </div>
    );
  }

  // Group milestones by month target
  const grouped = useMemo(() => {
    const groups: Record<string, RoadmapMilestone[]> = {};
    for (const m of milestones) {
      const key = m.target;
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    }
    return groups;
  }, [milestones]);

  const monthKeys = Object.keys(grouped);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 animate-fade-in">
      <button onClick={() => navigate('matches')} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to careers
      </button>

      {/* Header */}
      <div className="card p-8">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="teal">{career.category}</Badge>
            <h1 className="mt-3 font-display text-2xl font-bold text-white">{career.title} roadmap</h1>
            <p className="mt-2 text-sm text-slate-400">Your personalised 6-month action plan. Check off milestones as you complete them.</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-accent-teal">{progress}%</p>
            <p className="text-xs text-slate-500">complete</p>
          </div>
        </div>
        <ProgressBar className="mt-4" value={progress} />
      </div>

      {/* Resources */}
      <div className="mt-6 card p-7">
        <h2 className="font-display text-lg font-bold text-white">Suggested learning resources</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {career.roadmap.resources.map((r) => (
            <div key={r.title} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/5 p-4">
              <BookOpen className="h-4 w-4 shrink-0 text-accent-teal" />
              <div>
                <p className="text-sm font-semibold text-white">{r.title}</p>
                <p className="text-xs text-slate-500">{r.provider} · {r.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones by month */}
      <div className="mt-6">
        <h2 className="font-display text-lg font-bold text-white">Action plan</h2>
        <div className="mt-4 space-y-6">
          {monthKeys.map((key) => (
            <div key={key}>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-accent-teal" />
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">{key}</h3>
              </div>
              <div className="mt-3 space-y-2">
                {grouped[key].map((m) => {
                  const done = !!session.roadmapProgress[m.id];
                  const Icon = CATEGORY_ICONS[m.category] ?? Target;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setRoadmapMilestone(m.id, !done)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                        done ? 'border-accent-teal/30 bg-accent-teal/8' : 'border-white/8 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${done ? 'border-accent-teal bg-accent-teal text-ink-950' : 'border-white/25'}`}>
                        {done ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2 opacity-0" />}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-3.5 w-3.5 ${done ? 'text-accent-teal' : 'text-slate-500'}`} />
                          <p className={`text-sm font-medium ${done ? 'text-slate-400 line-through' : 'text-white'}`}>{m.title}</p>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-accent-teal/20 bg-accent-teal/5 px-5 py-4">
        <span className="text-sm text-slate-300">Want guidance on where to start?</span>
        <button onClick={() => navigate('consultant')} className="btn-primary !py-2 !text-xs">
          Ask the AI consultant
        </button>
      </div>
    </div>
  );
}
