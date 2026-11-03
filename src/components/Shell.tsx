import { type ReactNode } from 'react';
import { Compass } from 'lucide-react';
import { useApp } from '@/services/AppContext';
import type { Route } from '@/types';

interface NavLink {
  label: string;
  route: Route;
}

const NAV: NavLink[] = [
  { label: 'How it works', route: 'landing' },
  { label: 'Explore careers', route: 'matches' },
  { label: 'About', route: 'landing' },
];

export function Navbar() {
  const { navigate, route, session } = useApp();

  const go = (r: Route) => {
    navigate(r);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => go('landing')} className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-teal/15 text-accent-teal ring-1 ring-accent-teal/30 transition group-hover:bg-accent-teal/25">
            <Compass className="h-5 w-5" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white">
            CAREER COMPASS <span className="text-accent-teal">AI</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.route)}
              className={`btn-ghost ${route === l.route ? 'text-white' : ''}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session.onboarded ? (
            <button onClick={() => go('dashboard')} className="btn-ghost hidden sm:inline-flex">
              Dashboard
            </button>
          ) : (
            <button onClick={() => go('landing')} className="btn-ghost hidden sm:inline-flex">
              Sign in
            </button>
          )}
          <button onClick={() => go(session.onboarded ? (session.assessment.completed ? 'dashboard' : 'assessment') : 'onboarding')} className="btn-primary !px-4 !py-2 text-xs">
            {session.onboarded ? 'Continue' : 'Get started'}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { navigate } = useApp();
  return (
    <footer className="border-t border-white/8 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-accent-teal" />
              <span className="font-display text-sm font-bold text-white">CAREER COMPASS AI</span>
            </div>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              "Don't just choose a career. Understand why it fits you."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <button onClick={() => navigate('landing')} className="text-left text-slate-400 hover:text-white">How it works</button>
            <button onClick={() => navigate('matches')} className="text-left text-slate-400 hover:text-white">Explore careers</button>
            <button onClick={() => navigate('assessment')} className="text-left text-slate-400 hover:text-white">Assessment</button>
            <button onClick={() => navigate('consultant')} className="text-left text-slate-400 hover:text-white">AI consultant</button>
          </div>
        </div>
        <div className="divider my-8" />
        <p className="text-xs text-slate-600">
          Career Compass AI is a guided prototype. Career data is illustrative demo data — not verified job openings, salaries or employment outcomes. Assessment results are guidance, not a psychological diagnosis.
        </p>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950 bg-radial-faint">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
