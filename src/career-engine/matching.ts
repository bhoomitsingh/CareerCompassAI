import type { Career, CareerMatch, ProfileScores } from '@/types';
import { CAREERS } from '@/career-data/careers';

/**
 * Transparent weighted matching engine.
 *
 * For each career, we compare the user's normalised profile (0..100) against
 * the career's ideal vector (0..1, scaled to 0..100 for comparison). Each
 * dimension produces a 0..100 similarity, then dimensions are combined using
 * the career's own matchWeights (defaulting to an even split if unspecified).
 */
const DEFAULT_WEIGHTS = {
  interests: 0.25,
  aptitude: 0.25,
  skills: 0.2,
  personality: 0.15,
  preferences: 0.15,
};

function dimensionSimilarity(
  user: Record<string, number>,
  ideal: Record<string, number>,
): number {
  const traits = Object.keys(ideal);
  if (traits.length === 0) return 50;
  let totalDiff = 0;
  let count = 0;
  for (const trait of traits) {
    const u = user[trait] ?? 0;
    const i = (ideal[trait] ?? 0) * 100;
    totalDiff += Math.abs(u - i);
    count++;
  }
  const avgDiff = totalDiff / count; // 0..100
  return Math.max(0, Math.min(100, Math.round(100 - avgDiff)));
}

function topTraits(scores: Record<string, number>, n: number): string[] {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}

function strengthsMatched(career: Career, scores: ProfileScores): string[] {
  const interestTraits = topTraits(scores.interests, 3);
  const matched: string[] = [];
  for (const [trait, ideal] of Object.entries(career.idealInterests)) {
    if (ideal >= 0.7 && interestTraits.includes(trait)) {
      matched.push(humanTrait(trait));
    }
  }
  // also surface strong aptitude alignment
  const aptTraits = topTraits(scores.aptitude, 2);
  for (const [trait, ideal] of Object.entries(career.idealAptitude)) {
    if (ideal >= 0.8 && aptTraits.includes(trait)) {
      matched.push(humanTrait(trait) + ' aptitude');
    }
  }
  return Array.from(new Set(matched)).slice(0, 4);
}

function potentialGaps(career: Career, scores: ProfileScores): string[] {
  const gaps: string[] = [];
  for (const [trait, ideal] of Object.entries(career.idealSkills)) {
    const user = scores.skills[trait] ?? 0;
    if (ideal >= 0.75 && user < 40) {
      gaps.push(`Build ${humanTrait(trait)} skills`);
    }
  }
  for (const [trait, ideal] of Object.entries(career.idealPersonality)) {
    const user = scores.personality[trait] ?? 0;
    if (ideal >= 0.8 && user < 35) {
      gaps.push(`Develop ${humanTrait(trait)}`);
    }
  }
  return gaps.slice(0, 4);
}

const TRAIT_LABELS: Record<string, string> = {
  finance: 'finance',
  analytics: 'analytics',
  economics: 'economics',
  technology: 'technology',
  marketing: 'marketing',
  people: 'people',
  publicPolicy: 'public policy',
  management: 'management',
  consulting: 'consulting',
  research: 'research',
  numerical: 'numerical',
  verbal: 'verbal',
  logical: 'logical',
  analytical: 'analytical',
  technical: 'technical',
  communication: 'communication',
  interpersonal: 'interpersonal',
  academic: 'academic',
  leadership: 'leadership',
  teamwork: 'teamwork',
  autonomy: 'autonomy',
  creativity: 'creativity',
  structure: 'structure',
  risk: 'risk-taking',
  income: 'income focus',
  growth: 'growth focus',
  stability: 'stability',
  balance: 'work-life balance',
  impact: 'social impact',
  relocate: 'relocation openness',
  furtherStudy: 'willingness to study further',
  workFirst: 'preference to work first',
  metro: 'metro preference',
  hometown: 'hometown preference',
  remote: 'remote preference',
};

function humanTrait(trait: string): string {
  return TRAIT_LABELS[trait] ?? trait;
}

export function matchCareer(career: Career, scores: ProfileScores): CareerMatch {
  const weights = { ...DEFAULT_WEIGHTS, ...career.matchWeights };
  const dim = {
    interests: dimensionSimilarity(scores.interests, career.idealInterests),
    aptitude: dimensionSimilarity(scores.aptitude, career.idealAptitude),
    skills: dimensionSimilarity(scores.skills, career.idealSkills),
    personality: dimensionSimilarity(scores.personality, career.idealPersonality),
    preferences: dimensionSimilarity(scores.preferences, career.idealPreferences),
  };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const matchScore = Math.round(
    (dim.interests * weights.interests +
      dim.aptitude * weights.aptitude +
      dim.skills * weights.skills +
      dim.personality * weights.personality +
      dim.preferences * weights.preferences) /
      totalWeight,
  );

  const matched = strengthsMatched(career, scores);
  const gaps = potentialGaps(career, scores);

  const topInterest = topTraits(scores.interests, 1)[0] ?? 'your interests';
  const reasoning =
    `Your strongest interest area is ${humanTrait(topInterest)}, which aligns with the ${career.title} profile. ` +
    `You scored ${dim.interests}% on interests, ${dim.aptitude}% on aptitude and ${dim.skills}% on skills alignment. ` +
    (matched.length
      ? `Your ${matched.join(', ')} stand out as direct strengths.`
      : `Your profile shows moderate alignment across the key dimensions.`) +
    (gaps.length ? ` Watch out for ${gaps.join('; ').toLowerCase()}.` : '');

  return {
    career,
    matchScore,
    breakdown: dim,
    strengthsMatched: matched,
    potentialGaps: gaps,
    reasoning,
  };
}

export function rankCareers(scores: ProfileScores, limit = 5): CareerMatch[] {
  return CAREERS.map((c) => matchCareer(c, scores))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export function matchAllCareers(scores: ProfileScores): CareerMatch[] {
  return CAREERS.map((c) => matchCareer(c, scores)).sort((a, b) => b.matchScore - a.matchScore);
}
