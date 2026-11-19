export type ThemeId =
  | 'minimalist'
  | 'bento'
  | 'terminal'
  | 'editorial'
  | 'split-pane'
  | 'custom-ai';

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

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface PortfolioData {
  meta: {
    githubUsername: string;
    repoName: string; // defaults to "<githubUsername>.github.io"
    theme: ThemeId;
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
    skills: boolean;
  };
}
