import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, GraduationCap, User } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import { ProgressBar } from '@/components/Charts';
import type { OnboardingProfile } from '@/types';

interface OnboardingStep {
  key: keyof OnboardingProfile;
  label: string;
  type?: 'select' | 'textarea';
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const STEPS: OnboardingStep[] = [
  { key: 'fullName', label: 'Full name', placeholder: 'e.g. Aarav Sharma', required: true },
  { key: 'ageRange', label: 'Age range', type: 'select', required: true, options: ['18–20', '21–23', '24–26', '27+'] },
  { key: 'city', label: 'City', placeholder: 'e.g. Pune', required: false },
  { key: 'educationLevel', label: 'Current education level', type: 'select', required: true, options: ['In college (UG)', 'Final year', 'Recent graduate', 'Postgraduate'] },
  { key: 'degree', label: 'Degree', placeholder: 'e.g. B.Com', required: true },
  { key: 'specialisation', label: 'Specialisation', placeholder: 'e.g. Accounting & Finance', required: false },
  { key: 'collegeYear', label: 'College year', type: 'select', required: false, options: ['1st year', '2nd year', '3rd year', '4th year', 'Completed'] },
  { key: 'graduationYear', label: 'Graduation year', type: 'select', required: true, options: ['2024', '2025', '2026', '2027', '2028'] },
  { key: 'academicBackground', label: 'Academic background', type: 'select', required: true, options: ['Commerce', 'Arts / Humanities', 'Science', 'Engineering', 'Management', 'Other'] },
  { key: 'workExperience', label: 'Existing work experience', type: 'textarea', required: false, placeholder: 'Internships, projects, part-time work…' },
  { key: 'careerGoals', label: 'Career goals', type: 'textarea', required: false, placeholder: 'What do you want from your career?' },
];

export function OnboardingPage() {
  const { session, setProfile, setOnboarded, navigate } = useApp();
  const [profile, setLocal] = useState<OnboardingProfile>(session.profile);
  const [step, setStep] = useState(0);

  const total = STEPS.length;
  const current = STEPS[step];
  const value = profile[current.key as keyof OnboardingProfile];

  const update = (v: string) => setLocal((p) => ({ ...p, [current.key]: v }));
  const canAdvance = !current.required || String(value).trim() !== '';

  const next = () => {
    if (step < total - 1) setStep(step + 1);
    else finish();
  };
  const back = () => (step > 0 ? setStep(step - 1) : navigate('landing'));

  const finish = () => {
    setProfile(profile);
    setOnboarded(true);
    navigate('assessment');
  };

  const skip = () => {
    if (current.required) return;
    next();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-accent-teal" /> Onboarding</span>
          <span>Step {step + 1} of {total}</span>
        </div>
        <ProgressBar className="mt-3" value={((step + 1) / total) * 100} />
      </div>

      <div className="card p-8">
        <div className="mb-6">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-teal/12 text-accent-teal ring-1 ring-accent-teal/25">
            <User className="h-5 w-5" />
          </span>
        </div>
        <label className="label" htmlFor={current.key}>{current.label}{current.required ? ' *' : ' (optional)'}</label>

        {current.type === 'select' && current.options ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {current.options.map((opt: string) => (
              <button
                key={opt}
                onClick={() => update(opt)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  value === opt
                    ? 'border-accent-teal/50 bg-accent-teal/10 text-white'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/25'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : current.type === 'textarea' ? (
          <textarea
            id={current.key}
            rows={4}
            value={value}
            placeholder={current.placeholder}
            onChange={(e) => update(e.target.value)}
            className="input resize-none"
          />
        ) : (
          <input
            id={current.key}
            value={value}
            placeholder={current.placeholder}
            onChange={(e) => update(e.target.value)}
            className="input"
            autoFocus
          />
        )}

        <div className="mt-8 flex items-center justify-between">
          <button onClick={back} className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex gap-2">
            {!current.required && (
              <button onClick={skip} className="btn-ghost">
                Skip
              </button>
            )}
            <button onClick={next} disabled={!canAdvance} className="btn-primary">
              {step === total - 1 ? (
                <>Start assessment <Check className="h-4 w-4" /></>
              ) : (
                <>Continue <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        Your information is stored locally in your browser for this demo. No data leaves your device.
      </p>
    </div>
  );
}
