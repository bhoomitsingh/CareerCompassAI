import type { UserSession } from '@/types';

const STORAGE_KEY = 'career_compass_session_v1';

export const emptySession: UserSession = {
  onboarded: false,
  profile: {
    fullName: '',
    ageRange: '',
    city: '',
    educationLevel: '',
    degree: '',
    specialisation: '',
    collegeYear: '',
    graduationYear: '',
    academicBackground: '',
    workExperience: '',
    careerGoals: '',
  },
  assessment: {
    completed: false,
    submittedAt: null,
    answers: {},
    scores: {
      interests: {},
      aptitude: {},
      skills: {},
      personality: {},
      preferences: {},
    },
  },
  savedCareers: [],
  roadmapProgress: {},
  compareList: [],
};

export function loadSession(): UserSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(emptySession);
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    return {
      ...structuredClone(emptySession),
      ...parsed,
      profile: { ...emptySession.profile, ...(parsed.profile ?? {}) },
      assessment: {
        ...emptySession.assessment,
        ...(parsed.assessment ?? {}),
        scores: {
          ...emptySession.assessment.scores,
          ...(parsed.assessment?.scores ?? {}),
        },
      },
    };
  } catch {
    return structuredClone(emptySession);
  }
}

export function saveSession(session: UserSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore quota errors
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
