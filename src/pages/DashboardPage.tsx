import {
  Sparkles, Brain, ClipboardList, Bookmark, GitCompare, MessageSquare, TrendingUp, ArrowRight, Compass, RotateCcw,
} from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { rankCareers, matchAllCareers } from '@/career-engine/matching';
import { getCareer } from '@/career-data/careers';
import { buildRoadmap, roadmapProgress } from '@/roadmap/builder';
import { Badge, EmptyState, MatchScoreRing, SectionHeading } from '@/components/UI';
import { ProgressBar, RadialBar } from '@/components/Charts';

export function DashboardPage() {
  const { session, navigate, toggleCompare, resetAll } = useApp();
  const matches = session.assessment.completed ? rankCareers(session.assessment.scores, 5) : [];
  const allMatches = session.assessment.completed ? matchAllCareers(session.assessment.scores) : [];
  const saved = session.savedCareers.map((id) => getCareer(id)).filter(Boolean);
  const savedMatches = saved.map((c) => allMatches.find((m) => m.career.id === c!.id) ?? null);
  const topMatch = matches[0];
  const roadmapMilestones = topMatch ? buildRoadmap(topMatch) : [];
  const rp = roadmapProgress(roadmapMilestones, session.roadmapProgress);

  const assessAvg = (() => {
    const s = session.assessment.scores;
    const all = [...Object.values(s.interests), ...Object.values(s.aptitude), ...Object.values(s.skills), ...Object.values(s.personality), ...Object.values(s.preferences)];
    return all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;
  })();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="section-eyebrow">Dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
            Welcome back{session.profile.fullName ? `, ${session.profile.fullName.split(' ')[0]}` : ''}.
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {session.assessment.completed ? 'Your career profile is ready. Keep building your roadmap.' : 'Complete your assessment to unlock personalised matches.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetAll} className="btn-ghost !text-xs">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Status row */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Assessment status */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <ClipboardList className="h-5 w-5 text-accent-teal" />
            {session.assessment.completed ? <Badge variant="teal">Complete</Badge> : <Badge variant="warning">Pending</Badge>}
          </div>
          <h3 className="mt-3 font-display text-sm font-semibold text-white">Assessment</h3>
          <p className="mt-1 text-xs text-slate-400">
            {session.assessment.completed ? `Submitted ${new Date(session.assessment.submittedAt!).toLocaleDateString()}` : 'Take the 5-section assessment.'}
          </p>
          {!session.assessment.completed && (
            <button onClick={() => navigate('assessment')} className="btn-primary mt-4 w-full !py-2 !text-xs">
              Continue assessment <ArrowRight className="h-3 w-3" />
            </button>
          )}
          {session.assessment.completed && (
            <button onClick={() => navigate('report')} className="btn-ghost mt-4 w-full !text-xs">View report</button>
          )}
        </div>

        {/* Profile summary */}
        <div className="card flex flex-col items-center p-6">
          <RadialBar label="Profile" value={assessAvg} caption="avg across sections" />
        </div>

        {/* AI consultation */}
        <div className="card p-6">
          <MessageSquare className="h-5 w-5 text-accent-teal" />
          <h3 className="mt-3 font-display text-sm font-semibold text-white">AI consultant</h3>
          <p className="mt-1 text-xs text-slate-400">Ask why a career fits, compare paths, or plan your next move.</p>
          <button onClick={() => navigate('consultant')} className="btn-primary mt-4 w-full !py-2 !text-xs">
            Continue consultation <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Roadmap progress */}
        <div className="card p-6">
          <TrendingUp className="h-5 w-5 text-accent-teal" />
          <h3 className="mt-3 font-display text-sm font-semibold text-white">Roadmap</h3>
          {topMatch ? (
            <>
              <p className="mt-1 text-xs text-slate-400">{topMatch.career.title} · {rp}% complete</p>
              <ProgressBar className="mt-3" value={rp} />
              <button onClick={() => navigate('roadmap', topMatch.career.id)} className="btn-ghost mt-4 w-full !text-xs">Open roadmap</button>
            </>
          ) : (
            <p className="mt-1 text-xs text-slate-400">Complete the assessment to generate your roadmap.</p>
          )}
        </div>
      </div>

      {/* Top matches */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Your top career matches</h2>
          <button onClick={() => navigate('matches')} className="btn-ghost !text-xs">View all <ArrowRight className="h-3 w-3" /></button>
        </div>
        {matches.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No matches yet" description="Complete the assessment to see your top career matches." action={<button onClick={() => navigate('assessment')} className="btn-primary">Take assessment</button>} icon={<Compass className="h-6 w-6" />} />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {matches.map((m, i) => (
              <button key={m.career.id} onClick={() => navigate('career-profile', m.career.id)} className="card card-hover p-5 text-left">
                <div className="flex items-start justify-between">
                  <Badge variant="teal">#{i + 1}</Badge>
                  <MatchScoreRing score={m.matchScore} size={44} />
                </div>
                <h4 className="mt-3 font-display text-sm font-bold text-white">{m.career.title}</h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{m.career.shortDescription}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Saved careers & comparison */}
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-accent-teal" />
            <h2 className="font-display text-lg font-bold text-white">Saved careers</h2>
          </div>
          {saved.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="No saved careers" description="Bookmark careers from the explore page to keep them here." action={<button onClick={() => navigate('matches')} className="btn-secondary !py-2 !text-xs">Explore careers</button>} icon={<Bookmark className="h-6 w-6" />} />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {savedMatches.map((m, i) => m && (
                <button key={m.career.id} onClick={() => navigate('career-profile', m.career.id)} className="card flex w-full items-center justify-between p-4 text-left hover:border-white/20">
                  <div>
                    <p className="text-sm font-semibold text-white">{m.career.title}</p>
                    <p className="text-xs text-slate-500">{m.career.category}</p>
                  </div>
                  <MatchScoreRing score={m.matchScore} size={40} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-accent-teal" />
            <h2 className="font-display text-lg font-bold text-white">Career comparison</h2>
          </div>
          {session.compareList.length < 2 ? (
            <div className="mt-4">
              <EmptyState title="Compare careers" description="Add two or more careers to compare them side by side." action={<button onClick={() => navigate('matches')} className="btn-secondary !py-2 !text-xs">Add careers</button>} icon={<GitCompare className="h-6 w-6" />} />
            </div>
          ) : (
            <div className="mt-4">
              <div className="card p-5">
                <div className="flex flex-wrap gap-2">
                  {session.compareList.map((id) => {
                    const c = getCareer(id);
                    return c ? <Badge key={id} variant="teal">{c.title}</Badge> : null;
                  })}
                </div>
                <button onClick={() => navigate('compare')} className="btn-primary mt-4 w-full !py-2 !text-xs">
                  Compare {session.compareList.length} careers <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
