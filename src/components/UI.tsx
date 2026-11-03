import { type ReactNode } from 'react';
import { Check } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="section-eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-400">{subtitle}</p>}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'teal' | 'blue' | 'warning';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const styles: Record<string, string> = {
    default: 'border-white/10 bg-white/5 text-slate-300',
    teal: 'border-accent-teal/30 bg-accent-teal/10 text-accent-teal',
    blue: 'border-accent-blue/30 bg-accent-blue/10 text-accent-blue',
    warning: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${styles[variant]}`}>{children}</span>;
}

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-slate-400">{icon}</div>}
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface CheckListProps {
  items: string[];
  variant?: 'check' | 'arrow';
}

export function CheckList({ items, variant = 'check' }: CheckListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
          {variant === 'check' ? (
            <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent-teal/15 text-accent-teal">
              <Check className="h-3 w-3" />
            </span>
          ) : (
            <span className="mt-0.5 text-accent-teal">→</span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function MatchScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 75 ? '#2DD4BF' : score >= 55 ? '#38BDF8' : '#5B6B8F';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-sm font-bold text-white">{score}</span>
      </div>
    </div>
  );
}
