import type { CareerMatch, OnboardingProfile, ProfileScores } from '@/types';
import { CAREERS, getCareer } from '@/career-data/careers';
import { matchCareer, rankCareers } from '@/career-engine/matching';

/**
 * Mock AI consultant response service.
 *
 * This produces contextual, rule-based responses using the user's assessment
 * scores, career matches and career database. It is structured so it can be
 * replaced with a secure server-side OpenAI integration later without changing
 * the component layer — see `buildSystemContext()` for the data we would send.
 */

export interface ConsultantContext {
  profile: OnboardingProfile;
  scores: ProfileScores;
  matches: CareerMatch[];
}

export function buildSystemContext(ctx: ConsultantContext): string {
  const top = ctx.matches
    .slice(0, 5)
    .map((m, i) => `${i + 1}. ${m.career.title} (${m.matchScore}%) — ${m.career.category}`)
    .join('\n');
  const interests = Object.entries(ctx.scores.interests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
  return `User profile: ${ctx.profile.fullName || 'Student'}, ${ctx.profile.educationLevel || 'student'}, background ${ctx.profile.academicBackground || 'n/a'}.
Top career matches:
${top}
Interest profile: ${interests}.`;
}

const QUICK_REPLIES = [
  'Why was a career recommended for me?',
  'What are my strengths and gaps?',
  'Compare two career paths',
  'How do I enter the finance industry?',
  'What salary can I expect as a fresher?',
  'Suggest a career outside my top five',
];

export function getQuickReplies(): string[] {
  return [...QUICK_REPLIES];
}

const intentKeywords: { intent: string; words: string[] }[] = [
  { intent: 'why', words: ['why', 'recommend', 'recommended', 'match', 'matched', 'fit'] },
  { intent: 'challenge', words: ['disagree', 'challenge', 'wrong', 'not sure', 'bad', 'unsuitable'] },
  { intent: 'compare', words: ['compare', 'versus', 'vs', 'difference', 'better'] },
  { intent: 'salary', words: ['salary', 'pay', 'earn', 'money', 'compensation', 'income'] },
  { intent: 'qualifications', words: ['qualification', 'eligibility', 'require', 'requirements', 'degree', 'masters', 'mba'] },
  { intent: 'switch', words: ['switch', 'change', 'transition', 'pivot', 'move into'] },
  { intent: 'enter', words: ['enter', 'break into', 'get into', 'start in', 'how do i get'] },
  { intent: 'explore', words: ['explore', 'other', 'not in top', 'outside', 'more options', 'alternatives'] },
  { intent: 'strengths', words: ['strength', 'strengths', 'gap', 'gaps', 'weak', 'develop'] },
];

function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  let best: string | null = null;
  let bestScore = 0;
  for (const { intent, words } of intentKeywords) {
    const score = words.reduce((acc, w) => (lower.includes(w) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best ?? 'general';
}

function findCareerInMessage(message: string): string | null {
  const lower = message.toLowerCase();
  for (const c of CAREERS) {
    if (lower.includes(c.title.toLowerCase())) return c.id;
  }
  // category match
  for (const c of CAREERS) {
    if (lower.includes(c.category.toLowerCase())) return c.id;
  }
  return null;
}

export function generateMockResponse(message: string, ctx: ConsultantContext): string {
  const intent = detectIntent(message);
  const careerId = findCareerInMessage(message);
  const career = careerId ? getCareer(careerId) : null;
  const top = ctx.matches[0];

  switch (intent) {
    case 'why': {
      const target = career ? matchCareer(career, ctx.scores) : top;
      if (!target) return 'Complete the assessment and I can explain why a career fits you.';
      return `Here's why ${target.career.title} is a strong match for you.\n\n${target.reasoning}\n\nBreakdown: Interests ${target.breakdown.interests}%, Aptitude ${target.breakdown.aptitude}%, Skills ${target.breakdown.skills}%, Work style ${target.breakdown.personality}%, Preferences ${target.breakdown.preferences}%.\n\nThis is a transparent weighted score, not a psychometric diagnosis.`;
    }
    case 'challenge': {
      const target = career ? matchCareer(career, ctx.scores) : top;
      if (!target) return 'Tell me which career you disagree with and I will re-examine the fit.';
      return `That is a fair challenge. Let me re-examine ${target.career.title}.\n\nYour match score is ${target.matchScore}%, driven mostly by ${target.breakdown.interests}% interest alignment. If that does not feel right, your interests may have shifted, or you may value something the model undervalues (like impact or stability).\n\nAlternative careers to consider: ${ctx.matches.slice(1, 4).map((m) => m.career.title).join(', ')}. Would you like me to compare one of these?`;
    }
    case 'compare': {
      const ids = ctx.matches.slice(0, 5).map((m) => m.career.id);
      const a = career ?? getCareer(ids[0]);
      const b = getCareer(ids[1]);
      if (!a || !b) return 'Name two careers (e.g. "compare Financial Analyst and Data Analyst") and I will break them down.';
      return `Comparing ${a.title} and ${b.title}.\n\n• Category: ${a.category} vs ${b.category}\n• Salary: ${a.salaryRange} vs ${b.salaryRange}\n• Growth: ${a.growthOutlook}\n• Entry roles: ${a.entryRoles.slice(0, 2).join(', ')} vs ${b.entryRoles.slice(0, 2).join(', ')}\n\nFor you specifically, ${a.title} scores ${matchCareer(a, ctx.scores).matchScore}% and ${b.title} scores ${matchCareer(b, ctx.scores).matchScore}%. Open the Compare page to see a side-by-side breakdown.`;
    }
    case 'salary': {
      const target = career ?? top?.career;
      if (!target) return 'Tell me a career and I will share illustrative fresher salary ranges.';
      return `For ${target.title}, an illustrative fresher range in India is ${target.salaryRange}. This is demo data, not a verified market figure. Growth outlook: ${target.growthOutlook}`;
    }
    case 'qualifications': {
      const target = career ?? top?.career;
      if (!target) return 'Name a career and I will outline the qualifications and certifications.';
      return `To enter ${target.title}, typical qualifications include ${target.qualifications.join(', ')}. Recommended certifications: ${target.certifications.join(', ')}.`;
    }
    case 'switch': {
      const target = career ?? top?.career;
      if (!target) return 'Which career are you thinking of switching into? I can map the skills you already have and the gaps to close.';
      return `Switching into ${target.title}: you'll need to strengthen skills like ${target.roadmap.skillsToDevelop.slice(0, 2).join(', ')}. The roadmap page lays out a 6-month plan with skills, certifications and an internship.`;
    }
    case 'enter': {
      const target = career ?? top?.career;
      if (!target) return 'Tell me the industry or career and I will outline an entry plan.';
      return `To enter ${target.title}: start with ${target.roadmap.qualifications[0]}. Build skills in ${target.roadmap.skillsToDevelop.slice(0, 3).join(', ')}. Apply to entry roles like ${target.entryRoles.slice(0, 2).join(', ')}. Target an internship in months 4–5. See your roadmap for the full 6-month plan.`;
    }
    case 'explore': {
      const others = CAREERS.filter((c) => !ctx.matches.slice(0, 5).some((m) => m.career.id === c.id));
      const next = others
        .map((c) => matchCareer(c, ctx.scores))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
      return `Beyond your top five, you could explore:\n\n${next.map((m, i) => `${i + 1}. ${m.career.title} (${m.matchScore}%) — ${m.career.shortDescription}`).join('\n\n')}`;
    }
    case 'strengths': {
      const strengths = Object.entries(ctx.scores.interests).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
      const skills = Object.entries(ctx.scores.skills).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
      const gaps = Object.entries(ctx.scores.skills).filter(([, v]) => v < 40).map(([k]) => k);
      return `Your top interest areas are ${strengths.join(', ')}. Your strongest skills are ${skills.join(', ')}. Development areas: ${gaps.length ? gaps.join(', ') : 'none significant — your skills are fairly balanced.'}`;
    }
    default:
      return `I am your Career Compass AI consultant. I can explain why a career fits you, compare paths, discuss salaries, qualifications and how to enter an industry.\n\nBased on your assessment, your strongest career match is ${top?.career.title ?? '—'} at ${top?.matchScore ?? 0}%. Ask me anything about it.`;
  }
}

export { rankCareers };
