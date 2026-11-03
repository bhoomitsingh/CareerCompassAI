import type { AnswerMap, AssessmentQuestion, ProfileScores } from '@/types';
import { QUESTIONS, SECTIONS } from './questions';

const questionById = new Map(QUESTIONS.map((q) => [q.id, q]));

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

/**
 * Compute raw trait totals from answers, then normalise each section to 0..100.
 * Scoring is intentionally transparent and explainable — no hidden psychometrics.
 */
export function scoreAssessment(answers: AnswerMap): ProfileScores {
  const raw: ProfileScores = {
    interests: {},
    aptitude: {},
    skills: {},
    personality: {},
    preferences: {},
  };

  for (const q of QUESTIONS) {
    const ans = answers[q.id];
    if (ans === undefined || ans === null) continue;

    if (q.type === 'single') {
      const option = q.options.find((o) => o.id === ans);
      if (!option) continue;
      for (const [trait, weight] of Object.entries(option.traits)) {
        const bucket = raw[q.section];
        bucket[trait] = (bucket[trait] ?? 0) + weight * 10;
      }
    } else if (q.type === 'multi') {
      const selected = Array.isArray(ans) ? ans : [];
      for (const optId of selected) {
        const option = q.options.find((o) => o.id === optId);
        if (!option) continue;
        for (const [trait, weight] of Object.entries(option.traits)) {
          const bucket = raw[q.section];
          bucket[trait] = (bucket[trait] ?? 0) + weight * 10;
        }
      }
    } else if (q.type === 'rating') {
      const rating = typeof ans === 'number' ? ans : parseInt(String(ans), 10) || 0;
      const traits = q.ratingTraits ?? [];
      for (const trait of traits) {
        const bucket = raw[q.section];
        bucket[trait] = (bucket[trait] ?? 0) + rating * 4;
      }
    }
  }

  // Normalise each section so the max trait becomes 100 (proportional profile).
  const normalised: ProfileScores = {
    interests: {},
    aptitude: {},
    skills: {},
    personality: {},
    preferences: {},
  };

  for (const section of SECTIONS) {
    const bucket = raw[section.key];
    const values = Object.values(bucket);
    const max = values.length ? Math.max(...values) : 0;
    if (max <= 0) continue;
    for (const [trait, val] of Object.entries(bucket)) {
      normalised[section.key][trait] = clamp(Math.round((val / max) * 100));
    }
  }

  return normalised;
}

export function getQuestion(id: string): AssessmentQuestion | undefined {
  return questionById.get(id);
}

export function totalQuestions(): number {
  return QUESTIONS.length;
}

export function sectionQuestionCount(section: string): number {
  return QUESTIONS.filter((q) => q.section === section).length;
}

export function answeredCount(answers: AnswerMap): number {
  return QUESTIONS.filter((q) => {
    const a = answers[q.id];
    if (a === undefined || a === null) return false;
    if (q.type === 'multi') return Array.isArray(a) && a.length > 0;
    if (q.type === 'rating') return a !== '' && a !== undefined;
    return a !== '';
  }).length;
}
