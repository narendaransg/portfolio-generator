export type ThemeId =
  | 'minimalist'
  | 'bento'
  | 'terminal'
  | 'editorial'
  | 'split-pane'
  | 'custom-ai';

export type FontChoice = 'default' | 'sans' | 'serif' | 'mono';

export type OutputStack = 'static-html' | 'astro' | 'react-vite';

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  highlights?: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  summary: string;
  techStack: string[];
  impact: string;
  repoUrl?: string;
  liveUrl?: string;
}

export interface AchievementItem {
  title: string;
  issuer: string;
  year: string;
  url?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface PortfolioData {
  meta: {
    githubUsername: string;
    repoName: string;
    theme: ThemeId;
    accentColor?: string;
    fontChoice?: FontChoice;
    stack: OutputStack;
    lastUpdated: string;
  };
  identity: {
    fullName: string;
    headline: string;
    location: string;
    avatarUrl?: string;
  };
  about: {
    bio: string;
    lookingFor: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  skills: SkillGroup[];
  links: {
    email: string;
    github: string;
    linkedin: string;
    website?: string;
    resumeUrl?: string;
  };
  sectionsEnabled: {
    education: boolean;
    experience: boolean;
    projects: boolean;
    achievements: boolean;
    skills: boolean;
  };
}

/**
 * Safely upgrades any older or partial portfolio.json file so re-importing never breaks.
 */
export function normalizePortfolioData(raw: Partial<PortfolioData>): PortfolioData {
  const user = raw.meta?.githubUsername?.trim() || 'username';
  const achievements = Array.isArray(raw.achievements) ? raw.achievements : [];
  const education = Array.isArray(raw.education) ? raw.education : [];
  const experience = Array.isArray(raw.experience) ? raw.experience : [];
  const projects = Array.isArray(raw.projects) ? raw.projects : [];
  const skills = Array.isArray(raw.skills) ? raw.skills : [];

  return {
    meta: {
      githubUsername: raw.meta?.githubUsername ?? '',
      repoName: raw.meta?.repoName || `${user}.github.io`,
      theme: raw.meta?.theme || 'bento',
      accentColor: raw.meta?.accentColor || '',
      fontChoice: raw.meta?.fontChoice || 'default',
      stack: raw.meta?.stack || 'static-html',
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    identity: {
      fullName: raw.identity?.fullName ?? '',
      headline: raw.identity?.headline ?? '',
      location: raw.identity?.location ?? '',
      avatarUrl: raw.identity?.avatarUrl || '',
    },
    about: {
      bio: raw.about?.bio ?? '',
      lookingFor: raw.about?.lookingFor ?? '',
    },
    education,
    experience,
    projects,
    achievements,
    skills,
    links: {
      email: raw.links?.email ?? '',
      github: raw.links?.github ?? (user !== 'username' ? `https://github.com/${user}` : ''),
      linkedin: raw.links?.linkedin ?? '',
      website: raw.links?.website,
      resumeUrl: raw.links?.resumeUrl,
    },
    sectionsEnabled: {
      education: raw.sectionsEnabled?.education ?? education.length > 0,
      experience: raw.sectionsEnabled?.experience ?? experience.length > 0,
      projects: raw.sectionsEnabled?.projects ?? projects.length > 0,
      achievements: raw.sectionsEnabled?.achievements ?? achievements.length > 0,
      skills: raw.sectionsEnabled?.skills ?? skills.length > 0,
    },
  };
}
