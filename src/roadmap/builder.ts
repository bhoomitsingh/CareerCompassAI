import type { CareerMatch, RoadmapMilestone } from '@/types';

/**
 * Builds a trackable roadmap from a career match's data.
 * Milestones are flat-listed with stable IDs so progress can persist.
 */
export function buildRoadmap(match: CareerMatch): RoadmapMilestone[] {
  const { career } = match;
  const milestones: RoadmapMilestone[] = [];

  const push = (
    category: RoadmapMilestone['category'],
    title: string,
    description: string,
    target: string,
  ) => {
    milestones.push({
      id: `${career.id}-${milestones.length + 1}`,
      title,
      category,
      target,
      description,
      done: false,
    });
  };

  career.roadmap.skillsToDevelop.forEach((s, i) =>
    push('skill', s, `Core skill required for ${career.title}.`, i < 2 ? 'Month 1–2' : 'Month 3'),
  );
  career.roadmap.qualifications.forEach((q) =>
    push('qualification', q, 'Foundation qualification to strengthen eligibility.', 'Month 1–3'),
  );
  career.roadmap.certifications.forEach((c) =>
    push('certification', c, 'A recognised certification that signals commitment.', 'Month 2–4'),
  );
  career.roadmap.projects.forEach((p) =>
    push('project', p, 'Build a portfolio piece you can show in interviews.', 'Month 2–5'),
  );
  career.roadmap.internships.forEach((i) =>
    push('internship', i, 'Hands-on experience that strengthens your profile.', 'Month 4–5'),
  );

  career.roadmap.sixMonthPlan.forEach((m) => {
    m.tasks.forEach((t) =>
      push('action', t, `Part of ${m.title} (Month ${m.month}).`, `Month ${m.month}`),
    );
  });

  return milestones;
}

export function roadmapProgress(milestones: RoadmapMilestone[], done: Record<string, boolean>): number {
  if (!milestones.length) return 0;
  const completed = milestones.filter((m) => done[m.id]).length;
  return Math.round((completed / milestones.length) * 100);
}
