import { ArrowLeft, Bookmark, GitCompare, ArrowRight, Sparkles, Briefcase, TrendingUp, Award, BookOpen } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { getCareer } from '@/career-data/careers';
import { matchCareer } from '@/career-engine/matching';
import { Badge, CheckList, EmptyState, MatchScoreRing } from '@/components/UI';
import { BarList } from '@/components/Charts';

export function CareerProfilePage() {
  const { routeParam, session, navigate, toggleSavedCareer, toggleCompare } = useApp();
  const savedCareers = session.savedCareers;
  const compareList = session.compareList;

  const career = routeParam ? getCareer(routeParam) : undefined;

  if (!career) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="Career not found"
          description="We could not find that career. Browse all careers instead."
          action={<button onClick={() => navigate('matches')} className="btn-primary">Explore careers</button>}
        />
      </div>
    );
  }

  const match = session.assessment.completed ? matchCareer(career, session.assessment.scores) : null;
  const saved = savedCareers.includes(career.id);
  const inCompare = compareList.includes(career.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-fade-in">
      <button onClick={() => navigate('matches')} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to careers
      </button>

      {/* Header */}
      <div className="card p-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="teal">{career.category}</Badge>
              {career.isDemo && <Badge>Demo data</Badge>}
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white">{career.title}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{career.longDescription}</p>
          </div>
          {match && (
            <div className="flex flex-col items-center">
              <MatchScoreRing score={match.matchScore} size={80} />
              <span className="mt-2 text-xs text-slate-500">Match score</span>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => toggleSavedCareer(career.id)} className={saved ? 'btn-primary !py-2 !text-xs' : 'btn-secondary !py-2 !text-xs'}>
            <Bookmark className="h-3.5 w-3.5" /> {saved ? 'Saved' : 'Save career'}
          </button>
          <button onClick={() => toggleCompare(career.id)} className={inCompare ? 'btn-primary !py-2 !text-xs' : 'btn-secondary !py-2 !text-xs'}>
            <GitCompare className="h-3.5 w-3.5" /> {inCompare ? 'In compare' : 'Add to compare'}
          </button>
          <button onClick={() => navigate('roadmap', career.id)} className="btn-secondary !py-2 !text-xs">
            View roadmap <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Match breakdown */}
      {match && (
        <div className="mt-6 card p-7">
          <h2 className="font-display text-lg font-bold text-white">Why it matches you</h2>
          <p className="mt-2 text-sm text-slate-400">{match.reasoning}</p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dimension breakdown</h3>
              <div className="mt-3">
                <BarList
                  items={[
                    { label: 'interests', value: match.breakdown.interests },
                    { label: 'aptitude', value: match.breakdown.aptitude },
                    { label: 'skills', value: match.breakdown.skills },
                    { label: 'work style', value: match.breakdown.personality },
                    { label: 'preferences', value: match.breakdown.preferences },
                  ]}
                />
              </div>
            </div>
            <div className="grid gap-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Relevant strengths</h3>
                <div className="mt-2">
                  {match.strengthsMatched.length ? <CheckList items={match.strengthsMatched} /> : <p className="text-sm text-slate-500">Moderate alignment across dimensions.</p>}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Potential gaps</h3>
                <div className="mt-2">
                  {match.potentialGaps.length ? <CheckList items={match.potentialGaps} variant="arrow" /> : <p className="text-sm text-slate-500">No significant gaps detected.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick facts grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6">
          <Briefcase className="h-5 w-5 text-accent-teal" />
          <h3 className="mt-3 font-display text-sm font-semibold text-white">Entry-level roles</h3>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-400">
            {career.entryRoles.map((r) => <li key={r}>• {r}</li>)}
          </ul>
        </div>
        <div className="card p-6">
          <TrendingUp className="h-5 w-5 text-accent-teal" />
          <h3 className="mt-3 font-display text-sm font-semibold text-white">Salary & growth</h3>
          <p className="mt-2 text-sm text-slate-400">{career.salaryRange}</p>
          <p className="mt-2 text-sm text-slate-400">{career.growthOutlook}</p>
        </div>
        <div className="card p-6">
          <Sparkles className="h-5 w-5 text-accent-teal" />
          <h3 className="mt-3 font-display text-sm font-semibold text-white">Industries</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {career.industries.map((i) => <Badge key={i}>{i}</Badge>)}
          </div>
        </div>
      </div>

      {/* Qualifications & certifications */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-7">
          <Award className="h-5 w-5 text-accent-teal" />
          <h3 className="mt-3 font-display text-lg font-bold text-white">Qualifications</h3>
          <div className="mt-3"><CheckList items={career.qualifications} /></div>
        </div>
        <div className="card p-7">
          <BookOpen className="h-5 w-5 text-accent-teal" />
          <h3 className="mt-3 font-display text-lg font-bold text-white">Certifications</h3>
          <div className="mt-3"><CheckList items={career.certifications} /></div>
        </div>
      </div>

      {/* Strengths & development areas */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card p-7">
          <h3 className="font-display text-lg font-bold text-white">Strengths for this career</h3>
          <div className="mt-3"><CheckList items={career.strengths} /></div>
        </div>
        <div className="card p-7">
          <h3 className="font-display text-lg font-bold text-white">Development areas</h3>
          <div className="mt-3"><CheckList items={career.developmentAreas} variant="arrow" /></div>
        </div>
      </div>

      {/* Roadmap preview */}
      <div className="mt-6 card p-7">
        <h3 className="font-display text-lg font-bold text-white">6-month action plan preview</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {career.roadmap.sixMonthPlan.map((m) => (
            <div key={m.month} className="rounded-xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs font-semibold text-accent-teal">Month {m.month}</p>
              <p className="mt-1 font-display text-sm font-semibold text-white">{m.title}</p>
              <ul className="mt-2 space-y-1 text-xs text-slate-400">
                {m.tasks.map((t) => <li key={t}>• {t}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('roadmap', career.id)} className="btn-primary mt-6">
          Open full roadmap <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-accent-teal/20 bg-accent-teal/5 px-5 py-4">
        <span className="text-sm text-slate-300">Ask the AI consultant about this career</span>
        <button onClick={() => navigate('consultant')} className="btn-primary !py-2 !text-xs">
          Ask AI <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
