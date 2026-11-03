import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { OnboardingProfile, UserSession, Route, AnswerMap, ProfileScores } from '@/types';
import { loadSession, saveSession, emptySession } from '@/services/storage';

interface AppContextValue {
  session: UserSession;
  route: Route;
  routeParam: string | null;
  navigate: (route: Route, param?: string | null) => void;
  setProfile: (profile: OnboardingProfile) => void;
  setOnboarded: (done: boolean) => void;
  setAssessmentAnswers: (answers: AnswerMap) => void;
  submitAssessment: (scores: ProfileScores) => void;
  toggleSavedCareer: (id: string) => void;
  toggleCompare: (id: string) => void;
  setRoadmapMilestone: (id: string, done: boolean) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession>(() => loadSession());
  const [route, setRoute] = useState<Route>(() =>
    session.onboarded ? (session.assessment.completed ? 'dashboard' : 'assessment') : 'landing',
  );
  const [routeParam, setRouteParam] = useState<string | null>(null);

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const value = useMemo<AppContextValue>(
    () => ({
      session,
      route,
      routeParam,
      navigate: (r, p = null) => {
        setRoute(r);
        setRouteParam(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      setProfile: (profile) => setSession((s) => ({ ...s, profile })),
      setOnboarded: (done) => setSession((s) => ({ ...s, onboarded: done })),
      setAssessmentAnswers: (answers) =>
        setSession((s) => ({ ...s, assessment: { ...s.assessment, answers } })),
      submitAssessment: (scores) =>
        setSession((s) => ({
          ...s,
          assessment: {
            ...s.assessment,
            completed: true,
            submittedAt: new Date().toISOString(),
            scores,
          },
        })),
      toggleSavedCareer: (id) =>
        setSession((s) => ({
          ...s,
          savedCareers: s.savedCareers.includes(id)
            ? s.savedCareers.filter((c) => c !== id)
            : [...s.savedCareers, id],
        })),
      toggleCompare: (id) =>
        setSession((s) => ({
          ...s,
          compareList: s.compareList.includes(id)
            ? s.compareList.filter((c) => c !== id)
            : s.compareList.length >= 4
              ? s.compareList
              : [...s.compareList, id],
        })),
      setRoadmapMilestone: (id, done) =>
        setSession((s) => ({
          ...s,
          roadmapProgress: { ...s.roadmapProgress, [id]: done },
        })),
      resetAll: () => {
        setSession(structuredClone(emptySession));
        setRoute('landing');
      },
    }),
    [session, route, routeParam],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
