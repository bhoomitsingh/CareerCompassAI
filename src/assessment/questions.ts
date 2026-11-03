import type { AssessmentQuestion, SectionMeta, SkillLevel } from '@/types';

export const SECTIONS: SectionMeta[] = [
  {
    key: 'interests',
    label: 'Section A · Interests',
    shortLabel: 'Interests',
    description: 'What kinds of work you genuinely enjoy.',
    icon: 'Sparkles',
  },
  {
    key: 'aptitude',
    label: 'Section B · Aptitude',
    shortLabel: 'Aptitude',
    description: 'How you reason with numbers, words and logic.',
    icon: 'Brain',
  },
  {
    key: 'skills',
    label: 'Section C · Skills',
    shortLabel: 'Skills',
    description: 'Your competency in specific tools and techniques.',
    icon: 'Wrench',
  },
  {
    key: 'personality',
    label: 'Section D · Work Style',
    shortLabel: 'Work Style',
    description: 'How you prefer to work, lead and collaborate.',
    icon: 'Users',
  },
  {
    key: 'preferences',
    label: 'Section E · Preferences',
    shortLabel: 'Preferences',
    description: 'Your career lifestyle priorities and learning willingness.',
    icon: 'Compass',
  },
];

const SKILL_OPTIONS = [
  { id: 'advanced', label: 'Advanced', traits: {} },
  { id: 'intermediate', label: 'Intermediate', traits: {} },
  { id: 'beginner', label: 'Beginner', traits: {} },
  { id: 'none', label: 'No knowledge', traits: {} },
  { id: 'na', label: 'Not applicable / Unsure', traits: {} },
];

function skillQuestion(
  id: string,
  skillKey: string,
  group: 'finance' | 'technology' | 'business',
  text: string,
): AssessmentQuestion {
  return {
    id,
    section: 'skills',
    type: 'skill',
    text,
    skillKey,
    skillGroup: group,
    options: SKILL_OPTIONS,
  };
}

export const QUESTIONS: AssessmentQuestion[] = [
  // ===== SECTION A: INTERESTS =====
  {
    id: 'int_1',
    section: 'interests',
    type: 'single',
    text: 'Which activity pulls you in the most?',
    options: [
      { id: 'a', label: 'Building financial models or analysing markets', traits: { finance: 2, analytics: 1 } },
      { id: 'b', label: 'Designing campaigns or telling brand stories', traits: { marketing: 2 } },
      { id: 'c', label: 'Writing code or building software products', traits: { technology: 2, analytics: 1 } },
      { id: 'd', label: 'Helping people grow or resolving team conflicts', traits: { people: 2, publicPolicy: 1 } },
      { id: 'e', label: 'Studying how policy affects society', traits: { publicPolicy: 2, economics: 1 } },
      { id: 'f', label: 'Running a venture or leading a new initiative', traits: { management: 2, consulting: 1 } },
    ],
  },
  {
    id: 'int_2',
    section: 'interests',
    type: 'single',
    text: 'When you read the news, which section do you open first?',
    options: [
      { id: 'a', label: 'Markets, business and the economy', traits: { finance: 2, economics: 1 } },
      { id: 'b', label: 'Technology and startups', traits: { technology: 2, analytics: 1 } },
      { id: 'c', label: 'Politics, policy and society', traits: { publicPolicy: 2, economics: 1 } },
      { id: 'd', label: 'Brands, advertising and media', traits: { marketing: 2 } },
      { id: 'e', label: 'Careers, leadership and management', traits: { management: 2, consulting: 1 } },
      { id: 'f', label: 'Data, research and analysis', traits: { analytics: 2, research: 1 } },
    ],
  },
  {
    id: 'int_3',
    section: 'interests',
    type: 'multi',
    text: 'Pick the activities you would happily spend a Saturday doing (select up to 3).',
    multiLimit: 3,
    options: [
      { id: 'a', label: 'Analysing stock or market trends', traits: { finance: 1 } },
      { id: 'b', label: 'Sketching a product idea or wireframe', traits: { technology: 1, marketing: 1 } },
      { id: 'c', label: 'Reading a research paper on an economic issue', traits: { economics: 1, research: 1 } },
      { id: 'd', label: 'Organising a community or college event', traits: { people: 1, management: 1 } },
      { id: 'e', label: 'Writing a blog or social campaign', traits: { marketing: 1 } },
      { id: 'f', label: 'Tutoring or mentoring a junior student', traits: { people: 1, publicPolicy: 1 } },
      { id: 'g', label: 'Solving a coding or data challenge', traits: { technology: 1, analytics: 1 } },
      { id: 'h', label: 'Debating a policy or social issue', traits: { publicPolicy: 1, consulting: 1 } },
    ],
  },
  {
    id: 'int_4',
    section: 'interests',
    type: 'rating',
    text: 'I find problems with numbers and spreadsheets genuinely engaging.',
    ratingTraits: ['finance', 'analytics', 'economics'],
    options: [
      { id: '1', label: 'Strongly disagree', traits: {} },
      { id: '2', label: 'Disagree', traits: {} },
      { id: '3', label: 'Neutral', traits: {} },
      { id: '4', label: 'Agree', traits: {} },
      { id: '5', label: 'Strongly agree', traits: {} },
    ],
  },
  {
    id: 'int_5',
    section: 'interests',
    type: 'rating',
    text: 'I enjoy persuading and influencing others to see my point of view.',
    ratingTraits: ['marketing', 'consulting', 'management'],
    options: [
      { id: '1', label: 'Strongly disagree', traits: {} },
      { id: '2', label: 'Disagree', traits: {} },
      { id: '3', label: 'Neutral', traits: {} },
      { id: '4', label: 'Agree', traits: {} },
      { id: '5', label: 'Strongly agree', traits: {} },
    ],
  },
  {
    id: 'int_6',
    section: 'interests',
    type: 'single',
    text: 'Which impact sounds most meaningful to you?',
    options: [
      { id: 'a', label: 'Helping an organisation grow its revenue', traits: { finance: 2, management: 1 } },
      { id: 'b', label: 'Building a product that thousands use', traits: { technology: 2 } },
      { id: 'c', label: 'Shaping a public policy that helps people', traits: { publicPolicy: 2, economics: 1 } },
      { id: 'd', label: 'Creating a campaign that changes perceptions', traits: { marketing: 2 } },
      { id: 'e', label: 'Solving a complex operations problem', traits: { consulting: 2, analytics: 1 } },
      { id: 'f', label: 'Mentoring teams to perform better', traits: { people: 2, management: 1 } },
    ],
  },

  // ===== SECTION B: APTITUDE =====
  {
    id: 'apt_1',
    section: 'aptitude',
    type: 'single',
    text: 'A shop sells 3 pens for ₹60. What is the cost of 7 pens?',
    options: [
      { id: 'a', label: '₹140', traits: { numerical: 2 } },
      { id: 'b', label: '₹120', traits: {} },
      { id: 'c', label: '₹150', traits: {} },
      { id: 'd', label: '₹210', traits: {} },
    ],
  },
  {
    id: 'apt_2',
    section: 'aptitude',
    type: 'single',
    text: 'If all "Blorks" are "Fleems" and some "Fleems" are "Glorps", which must be true?',
    options: [
      { id: 'a', label: 'All Blorks are Glorps', traits: {} },
      { id: 'b', label: 'Some Blorks may be Glorps', traits: { logical: 2 } },
      { id: 'c', label: 'No Blorks are Glorps', traits: {} },
      { id: 'd', label: 'All Glorps are Blorks', traits: {} },
    ],
  },
  {
    id: 'apt_3',
    section: 'aptitude',
    type: 'single',
    text: 'Choose the word most similar in meaning to "DILIGENT".',
    options: [
      { id: 'a', label: 'Lazy', traits: {} },
      { id: 'b', label: 'Careful and hardworking', traits: { verbal: 2 } },
      { id: 'c', label: 'Quick', traits: {} },
      { id: 'd', label: 'Rude', traits: {} },
    ],
  },
  {
    id: 'apt_4',
    section: 'aptitude',
    type: 'single',
    text: 'A series: 2, 6, 12, 20, 30, ? — what comes next?',
    options: [
      { id: 'a', label: '40', traits: {} },
      { id: 'b', label: '42', traits: { analytical: 2 } },
      { id: 'c', label: '36', traits: {} },
      { id: 'd', label: '44', traits: {} },
    ],
  },
  {
    id: 'apt_5',
    section: 'aptitude',
    type: 'single',
    text: 'A train travels 360 km in 4 hours. How far will it travel in 90 minutes at the same speed?',
    options: [
      { id: 'a', label: '120 km', traits: {} },
      { id: 'b', label: '135 km', traits: { numerical: 2 } },
      { id: 'c', label: '150 km', traits: {} },
      { id: 'd', label: '90 km', traits: {} },
    ],
  },
  {
    id: 'apt_6',
    section: 'aptitude',
    type: 'single',
    text: 'Which argument is logically valid?',
    options: [
      { id: 'a', label: 'If it rains, the ground is wet. The ground is wet, so it rained.', traits: {} },
      { id: 'b', label: 'If it rains, the ground is wet. It rained, so the ground is wet.', traits: { logical: 2 } },
      { id: 'c', label: 'If it rains, the ground is wet. It did not rain, so the ground is not wet.', traits: {} },
      { id: 'd', label: 'The ground is wet only if it rained. The ground is dry, so it rained.', traits: {} },
    ],
  },
  {
    id: 'apt_7',
    section: 'aptitude',
    type: 'rating',
    text: 'How confident are you interpreting charts, graphs and tables quickly?',
    ratingTraits: ['numerical', 'analytical'],
    options: [
      { id: '1', label: 'Not confident', traits: {} },
      { id: '2', label: 'Slightly', traits: {} },
      { id: '3', label: 'Moderately', traits: {} },
      { id: '4', label: 'Confident', traits: {} },
      { id: '5', label: 'Very confident', traits: {} },
    ],
  },

  // ===== SECTION C: SKILLS (20 specific competency questions) =====
  // Finance group
  skillQuestion('skl_fin_modelling', 'financialModelling', 'finance', 'What is your level in financial modelling (building DCF, LBO, 3-statement models)?'),
  skillQuestion('skl_fin_statement', 'financialStatementAnalysis', 'finance', 'What is your level in financial statement analysis (reading balance sheets, P&L, cash flows)?'),
  skillQuestion('skl_accounting', 'accounting', 'finance', 'What is your level in accounting (journal entries, trial balance, GAAP/IND-AS basics)?'),
  skillQuestion('skl_valuation', 'valuation', 'finance', 'What is your level in valuation techniques (DCF, comparables, multiples)?'),
  skillQuestion('skl_excel', 'excel', 'finance', 'What is your level in Excel (formulas, pivot tables, VLOOKUP, dashboards)?'),
  skillQuestion('skl_powerpoint', 'powerpoint', 'finance', 'What is your level in PowerPoint (building decks, slide design, data presentation)?'),
  // Technology & Analytics group
  skillQuestion('skl_python', 'python', 'technology', 'What is your level in Python (pandas, data manipulation, scripting)?'),
  skillQuestion('skl_sql', 'sql', 'technology', 'What is your level in SQL (joins, subqueries, window functions)?'),
  skillQuestion('skl_programming', 'programmingFundamentals', 'technology', 'What is your level in programming fundamentals (loops, conditionals, data structures)?'),
  skillQuestion('skl_statistics', 'statistics', 'technology', 'What is your level in statistics (descriptive stats, hypothesis testing, regression)?'),
  skillQuestion('skl_data_viz', 'dataVisualisation', 'technology', 'What is your level in data visualisation (choosing charts, storytelling with data)?'),
  skillQuestion('skl_powerbi', 'powerBI', 'technology', 'What is your level in Power BI (DAX, dashboards, data modelling)?'),
  skillQuestion('skl_tableau', 'tableau', 'technology', 'What is your level in Tableau (calculated fields, dashboards, stories)?'),
  // Business group
  skillQuestion('skl_strategy', 'businessStrategy', 'business', 'What is your level in business strategy (frameworks, competitive analysis, positioning)?'),
  skillQuestion('skl_market_research', 'marketResearch', 'business', 'What is your level in market research (surveys, competitor analysis, market sizing)?'),
  skillQuestion('skl_problem_solving', 'problemSolving', 'business', 'What is your level in structured problem solving (MECE, frameworks, root-cause analysis)?'),
  skillQuestion('skl_communication', 'communication', 'business', 'What is your level in written and verbal communication (emails, reports, articulation)?'),
  skillQuestion('skl_presentation', 'presentation', 'business', 'What is your level in presentation skills (public speaking, slide delivery, Q&A)?'),
  skillQuestion('skl_project_mgmt', 'projectManagement', 'business', 'What is your level in project management (planning, tracking, stakeholder coordination)?'),
  skillQuestion('skl_sales', 'salesNegotiation', 'business', 'What is your level in sales and negotiation (persuasion, deal structuring, closing)?'),

  // ===== SECTION D: PERSONALITY & WORK STYLE =====
  {
    id: 'per_1',
    section: 'personality',
    type: 'single',
    text: 'In a team project, I prefer to:',
    options: [
      { id: 'a', label: 'Lead and coordinate the group', traits: { leadership: 2 } },
      { id: 'b', label: 'Contribute as a specialist', traits: { autonomy: 1, structure: 1 } },
      { id: 'c', label: 'Keep everyone aligned and motivated', traits: { teamwork: 2 } },
      { id: 'd', label: 'Work independently on a clear deliverable', traits: { autonomy: 2 } },
    ],
  },
  {
    id: 'per_2',
    section: 'personality',
    type: 'single',
    text: 'I do my best work when:',
    options: [
      { id: 'a', label: 'There is a clear plan and defined milestones', traits: { structure: 2 } },
      { id: 'b', label: 'I have freedom to explore and experiment', traits: { creativity: 2, autonomy: 1 } },
      { id: 'c', label: 'I am collaborating with smart people', traits: { teamwork: 2 } },
      { id: 'd', label: 'There is a high-stakes challenge to win', traits: { risk: 2, leadership: 1 } },
    ],
  },
  {
    id: 'per_3',
    section: 'personality',
    type: 'rating',
    text: 'I am comfortable taking calculated risks rather than playing it safe.',
    ratingTraits: ['risk'],
    options: [
      { id: '1', label: 'Avoid risk', traits: {} },
      { id: '2', label: 'Cautious', traits: {} },
      { id: '3', label: 'Balanced', traits: {} },
      { id: '4', label: 'Comfortable', traits: {} },
      { id: '5', label: 'Seek risk', traits: {} },
    ],
  },
  {
    id: 'per_4',
    section: 'personality',
    type: 'rating',
    text: 'I enjoy coming up with new ideas more than executing a given plan.',
    ratingTraits: ['creativity'],
    options: [
      { id: '1', label: 'Prefer execution', traits: {} },
      { id: '2', label: 'Lean execution', traits: {} },
      { id: '3', label: 'Both', traits: {} },
      { id: '4', label: 'Lean ideas', traits: {} },
      { id: '5', label: 'Prefer ideas', traits: {} },
    ],
  },
  {
    id: 'per_5',
    section: 'personality',
    type: 'rating',
    text: 'I like leading a group and being accountable for the outcome.',
    ratingTraits: ['leadership'],
    options: [
      { id: '1', label: 'Not for me', traits: {} },
      { id: '2', label: 'Rarely', traits: {} },
      { id: '3', label: 'Sometimes', traits: {} },
      { id: '4', label: 'Often', traits: {} },
      { id: '5', label: 'Always', traits: {} },
    ],
  },
  {
    id: 'per_6',
    section: 'personality',
    type: 'single',
    text: 'When facing ambiguity, I tend to:',
    options: [
      { id: 'a', label: 'Create a structure and decide quickly', traits: { leadership: 1, structure: 1, risk: 1 } },
      { id: 'b', label: 'Research deeply before deciding', traits: { analytical: 1, structure: 1 } },
      { id: 'c', label: 'Discuss with others to decide', traits: { teamwork: 1 } },
      { id: 'd', label: 'Wait until things become clearer', traits: {} },
    ],
  },

  // ===== SECTION E: CAREER PREFERENCES =====
  {
    id: 'pref_1',
    section: 'preferences',
    type: 'single',
    text: 'What matters most to you in your first job?',
    options: [
      { id: 'a', label: 'High starting salary', traits: { income: 2 } },
      { id: 'b', label: 'Learning and growth', traits: { growth: 2 } },
      { id: 'c', label: 'Work-life balance', traits: { balance: 2 } },
      { id: 'd', label: 'Job stability', traits: { stability: 2 } },
      { id: 'e', label: 'Social impact', traits: { impact: 2 } },
    ],
  },
  {
    id: 'pref_2',
    section: 'preferences',
    type: 'rating',
    text: 'I am willing to work long or demanding hours for higher pay and faster growth.',
    ratingTraits: ['income', 'growth'],
    options: [
      { id: '1', label: 'Not willing', traits: {} },
      { id: '2', label: 'Slightly', traits: {} },
      { id: '3', label: 'Neutral', traits: {} },
      { id: '4', label: 'Willing', traits: {} },
      { id: '5', label: 'Very willing', traits: {} },
    ],
  },
  {
    id: 'pref_3',
    section: 'preferences',
    type: 'single',
    text: 'Preferred work location?',
    options: [
      { id: 'a', label: 'Metro city in India', traits: { metro: 2 } },
      { id: 'b', label: 'Tier-2 / hometown city', traits: { hometown: 2 } },
      { id: 'c', label: 'Abroad / open to relocating overseas', traits: { relocate: 2 } },
      { id: 'd', label: 'Remote / work from anywhere', traits: { remote: 2 } },
    ],
  },
  {
    id: 'pref_4',
    section: 'preferences',
    type: 'single',
    text: 'Are you open to further studies (masters, MBA, certifications)?',
    options: [
      { id: 'a', label: 'Yes, planning to study soon', traits: { furtherStudy: 2 } },
      { id: 'b', label: 'Maybe later, after some work experience', traits: { furtherStudy: 1, workFirst: 1 } },
      { id: 'c', label: 'No, I want to start working', traits: { workFirst: 2 } },
    ],
  },
  {
    id: 'pref_5',
    section: 'preferences',
    type: 'rating',
    text: 'How willing are you to relocate for the right opportunity?',
    ratingTraits: ['relocate'],
    options: [
      { id: '1', label: 'Not willing', traits: {} },
      { id: '2', label: 'Reluctant', traits: {} },
      { id: '3', label: 'Open', traits: {} },
      { id: '4', label: 'Willing', traits: {} },
      { id: '5', label: 'Very willing', traits: {} },
    ],
  },
  {
    id: 'pref_6',
    section: 'preferences',
    type: 'rating',
    text: 'Job stability matters more to me than a high-risk high-reward path.',
    ratingTraits: ['stability'],
    options: [
      { id: '1', label: 'Strongly disagree', traits: {} },
      { id: '2', label: 'Disagree', traits: {} },
      { id: '3', label: 'Neutral', traits: {} },
      { id: '4', label: 'Agree', traits: {} },
      { id: '5', label: 'Strongly agree', traits: {} },
    ],
  },

  // ===== LEARNING WILLINGNESS =====
  {
    id: 'lw_1',
    section: 'preferences',
    type: 'single',
    text: 'Are you willing to learn coding (Python, SQL, etc.) for a career that requires it?',
    options: [
      { id: 'yes', label: 'Yes, I am willing to learn coding', traits: {} },
      { id: 'maybe', label: 'Maybe — depends on the career', traits: {} },
      { id: 'no', label: 'No, I am not interested in learning coding', traits: {} },
    ],
  },
  {
    id: 'lw_2',
    section: 'preferences',
    type: 'single',
    text: 'Are you willing to learn financial modelling for a career that requires it?',
    options: [
      { id: 'yes', label: 'Yes, I am willing to learn financial modelling', traits: {} },
      { id: 'maybe', label: 'Maybe — depends on the career', traits: {} },
      { id: 'no', label: 'No, I am not interested in learning financial modelling', traits: {} },
    ],
  },
  {
    id: 'lw_3',
    section: 'preferences',
    type: 'single',
    text: 'Are you willing to pursue professional certifications (CFA, PMP, Google, etc.)?',
    options: [
      { id: 'yes', label: 'Yes, I am willing to pursue certifications', traits: {} },
      { id: 'maybe', label: 'Maybe — depends on the certification', traits: {} },
      { id: 'no', label: 'No, I am not interested in certifications', traits: {} },
    ],
  },
  {
    id: 'lw_4',
    section: 'preferences',
    type: 'single',
    text: 'Are you willing to undertake further education (masters, MBA, diploma)?',
    options: [
      { id: 'yes', label: 'Yes, I am willing to study further', traits: {} },
      { id: 'maybe', label: 'Maybe — after some work experience', traits: {} },
      { id: 'no', label: 'No, I want to start working now', traits: {} },
    ],
  },
  {
    id: 'lw_5',
    section: 'preferences',
    type: 'single',
    text: 'How much time can you invest in acquiring new skills before starting your job search?',
    options: [
      { id: 'less-1', label: 'Less than 1 month', traits: {} },
      { id: '1-3', label: '1–3 months', traits: {} },
      { id: '3-6', label: '3–6 months', traits: {} },
      { id: '6+', label: '6 months or more', traits: {} },
    ],
  },
  {
    id: 'lw_6',
    section: 'preferences',
    type: 'single',
    text: 'Do you want a career you can enter with your current skill set, or are you open to building new skills first?',
    options: [
      { id: 'immediate', label: 'I want to enter with my current skills', traits: {} },
      { id: 'open', label: 'I am open to building new skills first', traits: {} },
    ],
  },
];

export const SKILL_LEVELS: SkillLevel[] = ['advanced', 'intermediate', 'beginner', 'none', 'na'];
