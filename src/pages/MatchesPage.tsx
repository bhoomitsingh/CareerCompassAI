import { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, GitCompare, AlertCircle, Info } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { matchAllCareers } from '@/career-engine/matching';
import { CAREERS } from '@/career-data/careers';
import { Badge, EmptyState, MatchScoreRing, SectionHeading } from '@/components/UI';
import { BarList } from '@/components/Charts';

export function MatchesPage() {
  const { session, navigate, toggleSavedCareer, toggleCompare } = useApp();
  const savedCareers = session.savedCareers;
  const compareList = session.compareList;
  const [filter, setFilter] = useState<string>('all');

  const matches = useMemo(() => {
    if (session.assessment.completed) return matchAllCareers(session.assessment.scores);
    // No assessment — show careers by demo order with neutral scores
    return CAREERS.map((c) => ({
      career: c,
      matchScore: 0,
      breakdown: { interests: 0, aptitude: 0, skills: 0, personality: 0, preferences: 0 },
      strengthsMatched: [],
      potentialGaps: [],
      reasoning: 'Complete the assessment to see your personalised match score.',
    }));
  }, [session.assessment]);

  const categories = ['all', ...Array.from(new Set(CAREERS.map((c) => c.category)))];
  const filtered = filter === 'all' ? matches : matches.filter((m) => m.career.category === filter);

  const topFive = matches.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 animate-fade-in">
      <SectionHeading
        eyebrow="Career matches"
        title="Your top career recommendations"
        subtitle={
          session.assessment.completed
            ? 'Ranked by a transparent weighted engine across interests, aptitude, skills, work style and preferences.'
            : 'Complete the assessment to unlock personalised match scores.'
        }
      />

      {!session.assessment.completed && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs text-amber-200/80">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" />
          These are illustrative demo careers. Take the assessment to get real match scores based on your profile.
          <button onClick={() => navigate('assessment')} className="ml-auto font-semibold text-amber-300 underline">Take assessment</button>
        </div>
      )}

      {/* Top 5 highlight */}
      {session.assessment.completed && (
        <div className="mt-10">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500">Your top 5</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topFive.map((m, i) => (
              <button
                key={m.career.id}
                onClick={() => navigate('career-profile', m.career.id)}
                className="card card-hover group relative p-6 text-left"
              >
                <div className="flex items-start justify-between">
                  <Badge variant="teal">#{i + 1}</Badge>
                  <MatchScoreRing score={m.matchScore} />
                </div>
                <h4 className="mt-4 font-display text-lg font-bold text-white">{m.career.title}</h4>
                <p className="mt-1 text-sm text-slate-400 line-clamp-2">{m.career.shortDescription}</p>
                <div className="mt-4">
                  <BarList
                    items={[
                      { label: 'interests', value: m.breakdown.interests },
                      { label: 'aptitude', value: m.breakdown.aptitude },
                      { label: 'skills', value: m.breakdown.skills },
                    ]}
                  />
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent-teal">
                  View profile <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All careers with filter */}
      <div className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-500">All careers ({filtered.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  filter === c ? 'border-accent-teal/40 bg-accent-teal/10 text-accent-teal' : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => {
            const saved = savedCareers.includes(m.career.id);
            const inCompare = compareList.includes(m.career.id);
            return (
              <div key={m.career.id} className="card card-hover flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-base font-bold text-white">{m.career.title}</h4>
                      {m.career.isDemo && <Badge>Demo</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{m.career.category}</p>
                  </div>
                  {session.assessment.completed && <MatchScoreRing score={m.matchScore} />}
                </div>

                <p className="mt-3 flex-1 text-sm text-slate-400 line-clamp-3">{m.career.shortDescription}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button onClick={() => navigate('career-profile', m.career.id)} className="btn-ghost !py-1.5 !text-xs">
                    View profile <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => toggleSavedCareer(m.career.id)}
                    className={`btn-ghost !py-1.5 !text-xs ${saved ? 'text-accent-teal' : ''}`}
                  >
                    <Bookmark className="h-3 w-3" /> {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={() => toggleCompare(m.career.id)}
                    className={`btn-ghost !py-1.5 !text-xs ${inCompare ? 'text-accent-teal' : ''}`}
                  >
                    <GitCompare className="h-3 w-3" /> Compare
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {compareList.length >= 2 && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-accent-teal/20 bg-accent-teal/5 px-5 py-4">
            <span className="text-sm text-slate-300">
              {compareList.length} career{compareList.length > 1 ? 's' : ''} selected for comparison
            </span>
            <button onClick={() => navigate('compare')} className="btn-primary !py-2 !text-xs">
              Compare now <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-10 flex items-start gap-2 text-xs text-slate-500">
        <Info className="h-4 w-4 shrink-0" />
        Career data shown here is illustrative demo data — not verified job openings, salary statistics or employment outcomes.
      </div>
    </div>
  );
}
