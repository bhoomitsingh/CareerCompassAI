import { useState } from 'react';
import { ArrowLeft, X, GitCompare, Plus } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { CAREERS, getCareer } from '@/career-data/careers';
import { matchCareer } from '@/career-engine/matching';
import { Badge, EmptyState, MatchScoreRing } from '@/components/UI';
import { BarList } from '@/components/Charts';
import type { Career } from '@/types';

export function ComparePage() {
  const { session, navigate, toggleCompare } = useApp();
  const compareList = session.compareList;
  const [pickerOpen, setPickerOpen] = useState(false);

  const careers: Career[] = compareList
    .map((id: string) => getCareer(id))
    .filter((c): c is Career => Boolean(c));
  const matches = careers.map((c) =>
    session.assessment.completed ? matchCareer(c, session.assessment.scores) : null,
  );

  const available = CAREERS.filter((c) => !compareList.includes(c.id));

  if (compareList.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <EmptyState
          title="No careers selected for comparison"
          description="Add careers from the Explore page to compare them side by side — match scores, salaries, entry roles and more."
          action={<button onClick={() => navigate('matches')} className="btn-primary">Explore careers</button>}
          icon={<GitCompare className="h-6 w-6" />}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 animate-fade-in">
      <button onClick={() => navigate('matches')} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to careers
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">Compare careers</h1>
          <p className="mt-2 text-sm text-slate-400">Side-by-side comparison across {compareList.length} career{compareList.length > 1 ? 's' : ''}.</p>
        </div>
        {compareList.length < 4 && (
          <button onClick={() => setPickerOpen(true)} className="btn-secondary !py-2 !text-xs">
            <Plus className="h-3.5 w-3.5" /> Add career
          </button>
        )}
      </div>

      {/* Comparison grid */}
      <div className="mt-8 overflow-x-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareList.length}, minmax(260px, 1fr))` }}>
          {careers.map((career, i) => {
            const match = matches[i];
            return (
              <div key={career.id} className="card flex flex-col p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge variant="teal">{career.category}</Badge>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">{career.title}</h3>
                  </div>
                  {match && <MatchScoreRing score={match.matchScore} size={48} />}
                </div>
                <p className="mt-2 text-sm text-slate-400 line-clamp-3">{career.shortDescription}</p>

                <div className="mt-4 divider" />

                <Row label="Match score" value={match ? `${match.matchScore}%` : '—'} />
                <Row label="Salary (fresher)" value={career.salaryRange} />
                <Row label="Growth outlook" value={career.growthOutlook} />

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Entry roles</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-400">
                    {career.entryRoles.map((r) => <li key={r}>• {r}</li>)}
                  </ul>
                </div>

                {match && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dimension breakdown</p>
                    <div className="mt-2">
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
                )}

                <div className="mt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Qualifications</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-400">
                    {career.qualifications.slice(0, 3).map((q) => <li key={q}>• {q}</li>)}
                  </ul>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate('career-profile', career.id)} className="btn-ghost !py-1.5 !text-xs">View profile</button>
                  <button onClick={() => toggleCompare(career.id)} className="btn-ghost !py-1.5 !text-xs text-rose-300 hover:text-rose-200">
                    <X className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Picker modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm" onClick={() => setPickerOpen(false)}>
          <div className="card w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">Add a career to compare</h3>
              <button onClick={() => setPickerOpen(false)} className="btn-ghost !p-1.5"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
              {available.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { toggleCompare(c.id); setPickerOpen(false); }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3 text-left transition hover:border-accent-teal/30"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{c.title}</p>
                    <p className="text-xs text-slate-500">{c.category}</p>
                  </div>
                  <Plus className="h-4 w-4 text-accent-teal" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-xs font-medium text-slate-200">{value}</span>
    </div>
  );
}
