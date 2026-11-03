// Core domain types for Career Compass AI

export type Route =
  | 'landing'
  | 'onboarding'
  | 'assessment'
  | 'report'
  | 'matches'
  | 'career-profile'
  | 'compare'
  | 'consultant'
  | 'roadmap'
  | 'dashboard';

// ----- Onboarding -----
export interface OnboardingProfile {
  fullName: string;
  ageRange: string;
  city: string;
  educationLevel: string;
  degree: string;
  specialisation: string;
  collegeYear: string;
  graduationYear: string;
  academicBackground: string;
  workExperience: string;
  careerGoals: string;
}

export const emptyOnboarding: OnboardingProfile = {
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
};

// ----- Assessment -----
export type QuestionType = 'single' | 'multi' | 'rating' | 'skill';

export interface AssessmentQuestion {
  id: string;
  section: AssessmentSection;
  text: string;
  type: QuestionType;
  options: { id: string; label: string; traits: Record<string, number> }[];
  ratingTraits?: string[];
  multiLimit?: number;
  // skill question: which skill key this maps to
  skillKey?: string;
  skillGroup?: SkillGroup;
}

export type AssessmentSection = 'interests' | 'aptitude' | 'skills' | 'personality' | 'preferences';

export interface SectionMeta {
  key: AssessmentSection;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
}

export type AnswerMap = Record<string, string | string[] | number>;
// questionId -> optionId | optionId[] | rating(1-5) | skillLevel

export interface AssessmentResult {
  completed: boolean;
  submittedAt: string | null;
  answers: AnswerMap;
  scores: ProfileScores;
  skillProfile: SkillProfile;
  learningWillingness: LearningWillingness;
}

export interface ProfileScores {
  interests: Record<string, number>;
  aptitude: Record<string, number>;
  skills: Record<string, number>;
  personality: Record<string, number>;
  preferences: Record<string, number>;
}

// ----- Skill profile -----
export type SkillLevel = 'advanced' | 'intermediate' | 'beginner' | 'none' | 'na';

export const SKILL_LEVEL_VALUES: Record<SkillLevel, number> = {
  advanced: 100,
  intermediate: 67,
  beginner: 33,
  none: 0,
  na: 0,
};

export type SkillGroup = 'finance' | 'technology' | 'business';

export interface SkillProfile {
  // Finance
  financialModelling: SkillLevel;
  financialStatementAnalysis: SkillLevel;
  accounting: SkillLevel;
  valuation: SkillLevel;
  excel: SkillLevel;
  powerpoint: SkillLevel;
  // Technology & Analytics
  python: SkillLevel;
  sql: SkillLevel;
  programmingFundamentals: SkillLevel;
  statistics: SkillLevel;
  dataVisualisation: SkillLevel;
  powerBI: SkillLevel;
  tableau: SkillLevel;
  // Business
  businessStrategy: SkillLevel;
  marketResearch: SkillLevel;
  problemSolving: SkillLevel;
  communication: SkillLevel;
  presentation: SkillLevel;
  projectManagement: SkillLevel;
  salesNegotiation: SkillLevel;
}

export const SKILL_KEYS: { key: keyof SkillProfile; label: string; group: SkillGroup }[] = [
  // Finance
  { key: 'financialModelling', label: 'Financial modelling', group: 'finance' },
  { key: 'financialStatementAnalysis', label: 'Financial statement analysis', group: 'finance' },
  { key: 'accounting', label: 'Accounting', group: 'finance' },
  { key: 'valuation', label: 'Valuation', group: 'finance' },
  { key: 'excel', label: 'Excel', group: 'finance' },
  { key: 'powerpoint', label: 'PowerPoint', group: 'finance' },
  // Technology & Analytics
  { key: 'python', label: 'Python', group: 'technology' },
  { key: 'sql', label: 'SQL', group: 'technology' },
  { key: 'programmingFundamentals', label: 'Programming fundamentals', group: 'technology' },
  { key: 'statistics', label: 'Statistics', group: 'technology' },
  { key: 'dataVisualisation', label: 'Data visualisation', group: 'technology' },
  { key: 'powerBI', label: 'Power BI', group: 'technology' },
  { key: 'tableau', label: 'Tableau', group: 'technology' },
  // Business
  { key: 'businessStrategy', label: 'Business strategy', group: 'business' },
  { key: 'marketResearch', label: 'Market research', group: 'business' },
  { key: 'problemSolving', label: 'Problem solving', group: 'business' },
  { key: 'communication', label: 'Communication', group: 'business' },
  { key: 'presentation', label: 'Presentation', group: 'business' },
  { key: 'projectManagement', label: 'Project management', group: 'business' },
  { key: 'salesNegotiation', label: 'Sales and negotiation', group: 'business' },
];

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  beginner: 'Beginner',
  none: 'No knowledge',
  na: 'Not applicable / Unsure',
};

export const emptySkillProfile: SkillProfile = {
  financialModelling: 'na',
  financialStatementAnalysis: 'na',
  accounting: 'na',
  valuation: 'na',
  excel: 'na',
  powerpoint: 'na',
  python: 'na',
  sql: 'na',
  programmingFundamentals: 'na',
  statistics: 'na',
  dataVisualisation: 'na',
  powerBI: 'na',
  tableau: 'na',
  businessStrategy: 'na',
  marketResearch: 'na',
  problemSolving: 'na',
  communication: 'na',
  presentation: 'na',
  projectManagement: 'na',
  salesNegotiation: 'na',
};

// ----- Learning willingness -----
export interface LearningWillingness {
  willingToLearnCoding: WillingnessLevel;
  willingToLearnFinancialModelling: WillingnessLevel;
  willingToPursueCertifications: WillingnessLevel;
  willingToUndertakeFurtherEducation: WillingnessLevel;
  timeInvestment: string; // e.g. "1-3 months", "3-6 months", "6+ months"
  wantsImmediateEntry: boolean; // wants a career enterable with current skills
}

export type WillingnessLevel = 'yes' | 'maybe' | 'no';

export const WILLINGNESS_VALUES: Record<WillingnessLevel, number> = {
  yes: 100,
  maybe: 50,
  no: 0,
};

export const emptyLearningWillingness: LearningWillingness = {
  willingToLearnCoding: 'maybe',
  willingToLearnFinancialModelling: 'maybe',
  willingToPursueCertifications: 'maybe',
  willingToUndertakeFurtherEducation: 'maybe',
  timeInvestment: '3-6 months',
  wantsImmediateEntry: false,
};

// ----- Career -----
export interface Career {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  // ideal profile vectors (0..1) for matching
  idealInterests: Record<string, number>;
  idealAptitude: Record<string, number>;
  idealPersonality: Record<string, number>;
  idealPreferences: Record<string, number>;
  matchWeights: Partial<MatchDimensionWeights>;
  // NEW: structured skill requirements
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
  minimumEducation: string;
  entryRequirements: string;
  importantTools: string[];
  workActivities: string[];
  potentialSkillGaps: string[];
  // legacy fields still used by existing UI
  idealSkills: Record<string, number>;
  strengths: string[];
  developmentAreas: string[];
  entryRoles: string[];
  salaryRange: string;
  growthOutlook: string;
  industries: string[];
  qualifications: string[];
  certifications: string[];
  roadmap: CareerRoadmapData;
  isDemo?: boolean;
}

export interface SkillRequirement {
  skill: keyof SkillProfile;
  // minimum level needed for immediate job readiness
  minLevel: SkillLevel;
  // is this an essential/hard requirement or preferred?
  essential: boolean;
}

export type MatchDimensionWeights = {
  interests: number;
  skills: number;
  aptitude: number;
  personality: number;
  preferences: number;
};

export interface CareerRoadmapData {
  skillsToDevelop: string[];
  qualifications: string[];
  certifications: string[];
  internships: string[];
  entryRoles: string[];
  projects: string[];
  resources: { title: string; provider: string; type: string }[];
  sixMonthPlan: { month: number; title: string; tasks: string[] }[];
}

export type FitClassification = 'strong' | 'potential' | 'low';

export interface CareerMatch {
  career: Career;
  matchScore: number;
  classification: FitClassification;
  breakdown: {
    interests: number;
    aptitude: number;
    skills: number;
    personality: number;
    preferences: number;
  };
  skillCompatibility: number; // 0..100
  strengthsMatched: string[];
  missingEssentialSkills: string[];
  missingPreferredSkills: string[];
  improvementSkills: string[];
  canPursueImmediately: boolean;
  preparationRequirements: string;
  reasoning: string;
  // legacy compat
  potentialGaps: string[];
}

// ----- AI Consultant -----
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ----- Roadmap -----
export interface RoadmapMilestone {
  id: string;
  title: string;
  category: 'skill' | 'qualification' | 'certification' | 'internship' | 'project' | 'action';
  target: string;
  description: string;
  done: boolean;
}

// ----- User session -----
export interface UserSession {
  onboarded: boolean;
  profile: OnboardingProfile;
  assessment: AssessmentResult;
  savedCareers: string[];
  roadmapProgress: Record<string, boolean>;
  compareList: string[];
}
