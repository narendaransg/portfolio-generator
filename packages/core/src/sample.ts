import { PortfolioData } from './schema.js';

export const SAMPLE_PORTFOLIO: PortfolioData = {
  meta: {
    githubUsername: 'alex-builder',
    repoName: 'alex-builder.github.io',
    theme: 'bento',
    accentColor: '',
    fontChoice: 'default',
    stack: 'static-html',
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  identity: {
    fullName: 'Alex Sharma',
    headline: 'Electronics & Systems Engineer | RTL Design & Embedded Systems',
    location: 'Chennai, India',
  },
  about: {
    bio: 'I enjoy building reliable hardware-software systems from first principles—from digital logic and bus protocols to clean developer tooling.',
    lookingFor: 'Open to Graduate Research Opportunities and Hardware/Systems Engineering roles.',
  },
  education: [
    {
      degree: 'B.E. in Electronics and Communication Engineering',
      institution: 'Anna University Affiliated Engineering College',
      period: '2023 – 2027',
      highlights: 'Focus on Digital IC Design, Computer Architecture, and Embedded Systems.',
    },
  ],
  experience: [
    {
      role: 'Undergraduate Hardware Research Intern',
      organization: 'Open Silicon Lab',
      period: 'May 2026 – Jul 2026',
      bullets: [
        'Designed and verified parameterized FIFO and bus arbiter modules in SystemVerilog.',
        'Automated regression runs and timing checks using shell scripts and open-source EDA tools.',
      ],
    },
  ],
  projects: [
    {
      title: 'Custom AXI4 DMA Controller',
      summary: 'High-throughput memory-to-memory DMA engine built from scratch in SystemVerilog.',
      techStack: ['SystemVerilog', 'UVM', 'Git', 'Linux'],
      impact: 'Achieved zero-wait-state burst transfers with self-checking randomized testbenches.',
      repoUrl: 'https://github.com/alex-builder/axi4-dma',
    },
    {
      title: '8-Bit Breadboard Microcomputer',
      summary: 'Discrete logic CPU with custom ALU, control unit, and instruction set.',
      techStack: ['Digital Logic', 'Circuit Simulation', 'Assembly'],
      impact: 'Executed Fibonacci and sorting programs on simulated and physical breadboard hardware.',
      repoUrl: 'https://github.com/alex-builder/8bit-cpu',
    },
  ],
  achievements: [
    {
      title: 'National RTL Design Hackathon Finalist',
      issuer: 'ChipThink Hardware Challenge',
      year: '2026',
    },
    {
      title: 'NPTEL Elite + Silver — Digital IC Design',
      issuer: 'IIT Madras / NPTEL',
      year: '2025',
    },
  ],
  skills: [
    { category: 'Core Engineering', items: ['Digital Logic', 'SystemVerilog', 'Computer Architecture', 'RTL Verification'] },
    { category: 'Tools & Workflow', items: ['Linux / WSL', 'Git & GitHub', 'Python', 'Bash / Zsh'] },
  ],
  links: {
    email: 'alex.sharma@example.com',
    github: 'https://github.com/alex-builder',
    linkedin: 'https://www.linkedin.com/in/alex-builder',
  },
  sectionsEnabled: {
    education: true,
    experience: true,
    projects: true,
    achievements: true,
    skills: true,
  },
};
