import { useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Check, AlertCircle, Sparkles, Brain, Wrench, Users, Compass,
} from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { QUESTIONS, SECTIONS } from '@/assessment/questions';
import { scoreAssessment, answeredCount } from '@/assessment/scoring';
import { ProgressBar } from '@/components/Charts';
import type { AnswerMap, AssessmentQuestion } from '@/types';

const ICONS: Record<string, typeof Sparkles> = { Sparkles, Brain, Wrench, Users, Compass };

export function AssessmentPage() {
  const { session, setAssessmentAnswers, submitAssessment, navigate } = useApp();
  const [answers, setAnswers] = useState<AnswerMap>(session.assessment.answers);
  const [idx, setIdx] = useState(0);
  const [reviewing, setReviewing] = useState(false);

  const total = QUESTIONS.length;
  const question = QUESTIONS[idx];
  const section = SECTIONS.find((s) => s.key === question.section)!;
  const SectionIcon = ICONS[section.icon] ?? Sparkles;
  const progress = ((idx + 1) / total) * 100;

  const setAnswer = (value: string | string[] | number) => {
    setAnswers((a) => ({ ...a, [question.id]: value }));
  };

  const isAnswered = (q: AssessmentQuestion) => {
    const a = answers[q.id];
    if (a === undefined || a === null) return false;
    if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
    return String(a) !== '';
  };

  const canAdvance = isAnswered(question);

  const next = () => {
    if (idx < total - 1) setIdx(idx + 1);
    else setReviewing(true);
  };
  const back = () => {
    if (reviewing) setReviewing(false);
    else if (idx > 0) setIdx(idx - 1);
    else navigate('onboarding');
  };

  const finish = () => {
    const scores = scoreAssessment(answers);
    setAssessmentAnswers(answers);
    submitAssessment(scores);
    navigate('report');
  };

  const sectionProgress = useMemo(() => {
    return SECTIONS.map((s) => {
      const qs = QUESTIONS.filter((q) => q.section === s.key);
      const done = qs.filter(isAnswered).length;
      return { ...s, done, total: qs.length };
    });
  }, [answers]);

  // Review screen
  if (reviewing) {
    const unanswered = QUESTIONS.filter((q) => !isAnswered(q));
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 animate-fade-in">
        <h2 className="font-display text-2xl font-bold text-white">Review your answers</h2>
        <p className="mt-2 text-sm text-slate-400">
          You answered {answeredCount(answers)} of {total} questions. {unanswered.length > 0 ? `${unanswered.length} are unanswered.` : 'All questions are answered.'}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {sectionProgress.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <div key={s.key} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                    <Icon className="h-4 w-4 text-accent-teal" /> {s.shortLabel}
                  </span>
                  <span className="text-xs text-slate-500">{s.done}/{s.total}</span>
                </div>
                <ProgressBar className="mt-2" value={(s.done / s.total) * 100} />
              </div>
            );
          })}
        </div>

        <div className="mt-6 max-h-72 space-y-2 overflow-y-auto pr-2">
          {QUESTIONS.map((q, i) => {
            const a = answers[q.id];
            const text = Array.isArray(a) ? a.join(', ') : a;
            const ok = isAnswered(q);
            return (
              <button
                key={q.id}
                onClick={() => { setIdx(i); setReviewing(false); }}
                className="flex w-full items-start gap-3 rounded-xl border border-white/8 bg-ink-850/60 px-4 py-3 text-left transition hover:border-white/20"
              >
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs ${ok ? 'bg-accent-teal/15 text-accent-teal' : 'bg-amber-400/15 text-amber-300'}`}>
                  {ok ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-slate-300">Q{i + 1}. {q.text}</span>
                  <span className="block truncate text-xs text-slate-500">{ok ? text : 'Not answered'}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button onClick={back} className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Back to questions
          </button>
          <button onClick={finish} className="btn-primary">
            Submit & view results <Check className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 animate-fade-in">
      {/* Section indicator */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {SECTIONS.map((s, i) => {
          const active = s.key === section.key;
          const secDone = sectionProgress[i].done === sectionProgress[i].total;
          const Icon = ICONS[s.icon] ?? Sparkles;
          return (
            <span
              key={s.key}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'border-accent-teal/40 bg-accent-teal/10 text-accent-teal'
                  : secDone
                    ? 'border-white/10 bg-white/5 text-slate-300'
                    : 'border-white/8 bg-transparent text-slate-600'
              }`}
            >
              <Icon className="h-3 w-3" /> {s.shortLabel}
            </span>
          );
        })}
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><SectionIcon className="h-4 w-4 text-accent-teal" /> {section.label}</span>
        <span>Question {idx + 1} of {total}</span>
      </div>
      <ProgressBar value={progress} />

      <div className="mt-8 card p-7 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{section.description}</p>
        <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
          {question.text}
        </h2>

        <div className="mt-6">
          {question.type === 'single' && <SingleChoice question={question} value={answers[question.id]} onChange={setAnswer} />}
          {question.type === 'rating' && <RatingChoice question={question} value={answers[question.id]} onChange={setAnswer} />}
          {question.type === 'multi' && (
            <MultiChoice question={question} value={answers[question.id]} onChange={setAnswer} />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={back} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-xs text-slate-600">Progress is saved automatically</span>
        <button onClick={next} disabled={!canAdvance} className="btn-primary">
          {idx === total - 1 ? 'Review answers' : 'Next'} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SingleChoice({
  question, value, onChange,
}: { question: AssessmentQuestion; value: string | string[] | number | undefined; onChange: (v: string) => void }) {
  const selected = typeof value === 'string' ? value : '';
  return (
    <div className="grid gap-2.5">
      {question.options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
            selected === o.id
              ? 'border-accent-teal/50 bg-accent-teal/10 text-white'
              : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:bg-white/8'
          }`}
        >
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${selected === o.id ? 'border-accent-teal bg-accent-teal' : 'border-white/20'}`}>
            {selected === o.id && <span className="h-2 w-2 rounded-full bg-ink-950" />}
          </span>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MultiChoice({
  question, value, onChange,
}: { question: AssessmentQuestion; value: string | string[] | number | undefined; onChange: (v: string[]) => void }) {
  const selected = Array.isArray(value) ? value : [];
  const limit = question.multiLimit ?? 3;

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else if (selected.length < limit) {
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <p className="mb-3 text-xs text-slate-500">Select up to {limit}. ({selected.length}/{limit} selected)</p>
      <div className="grid gap-2.5">
        {question.options.map((o) => {
          const on = selected.includes(o.id);
          const disabled = !on && selected.length >= limit;
          return (
            <button
              key={o.id}
              onClick={() => toggle(o.id)}
              disabled={disabled}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                on ? 'border-accent-teal/50 bg-accent-teal/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
              } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition ${on ? 'border-accent-teal bg-accent-teal text-ink-950' : 'border-white/20'}`}>
                {on && <Check className="h-3 w-3" />}
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RatingChoice({
  question, value, onChange,
}: { question: AssessmentQuestion; value: string | string[] | number | undefined; onChange: (v: number) => void }) {
  const selected = typeof value === 'number' ? value : typeof value === 'string' && value !== '' ? parseInt(value, 10) : 0;
  return (
    <div className="grid gap-2.5">
      {question.options.map((o, i) => {
        const rating = i + 1;
        const on = selected === rating;
        return (
          <button
            key={o.id}
            onClick={() => onChange(rating)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition ${
              on ? 'border-accent-teal/50 bg-accent-teal/10 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
            }`}
          >
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className={`h-2 w-2 rounded-full ${j < rating ? 'bg-accent-teal' : 'bg-white/15'}`} />
              ))}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
