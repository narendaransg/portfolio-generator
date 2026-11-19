import React, { useEffect, useMemo, useState } from 'react';
import {
  FontChoice,
  PortfolioData,
  SAMPLE_PORTFOLIO,
  THEME_CATALOG,
  ThemeId,
  buildCustomAiPrompt,
  buildPortfolioZip,
  generateAiCustomizeGuide,
  generateDeployGuide,
  generateLinkedInSyncGuide,
  normalizePortfolioData,
  renderPortfolioHtml,
  validateCustomAiHtml,
} from '@portfolio-gen/core';

const STORAGE_KEY = 'portfolio_generator_state_v2';

const STAGES = [
  { id: 0, label: '1. Identity' },
  { id: 1, label: '2. About' },
  { id: 2, label: '3. Education' },
  { id: 3, label: '4. Experience' },
  { id: 4, label: '5. Projects' },
  { id: 5, label: '6. Achievements' },
  { id: 6, label: '7. Skills' },
  { id: 7, label: '8. Links' },
  { id: 8, label: '9. Theme & AI' },
];

const ACCENT_PRESETS = [
  { label: 'Theme Default', value: '' },
  { label: 'Ocean Blue', value: '#2563eb' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Amber / Copper', value: '#d97706' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Rose', value: '#e11d48' },
];

function createBlankPortfolio(): PortfolioData {
  return normalizePortfolioData({
    meta: {
      githubUsername: '',
      repoName: 'username.github.io',
      theme: 'bento',
      accentColor: '',
      fontChoice: 'default',
      stack: 'static-html',
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    education: [{ degree: '', institution: '', period: '', highlights: '' }],
    experience: [{ role: '', organization: '', period: '', bullets: [''] }],
    projects: [{ title: '', summary: '', techStack: [], impact: '', repoUrl: '', liveUrl: '' }],
    achievements: [],
    skills: [
      { category: 'Core Skills', items: [] },
      { category: 'Tools & Technologies', items: [] },
    ],
  });
}

export function App() {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return normalizePortfolioData(JSON.parse(saved));
    } catch {
      // ignore storage errors
    }
    return structuredClone(SAMPLE_PORTFOLIO);
  });

  const [stage, setStage] = useState<number>(0);
  const [rightTab, setRightTab] = useState<'preview' | 'linkedin' | 'deploy'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [customAiHtml, setCustomAiHtml] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string>('');
  const [importBanner, setImportBanner] = useState<string>('');
  const [linkedinChecks, setLinkedinChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore quota errors
    }
  }, [data]);

  const customValidation = useMemo(() => {
    if (data.meta.theme !== 'custom-ai' || !customAiHtml.trim()) return null;
    return validateCustomAiHtml(customAiHtml, data);
  }, [data, customAiHtml]);

  const previewHtml = useMemo(() => {
    const override =
      data.meta.theme === 'custom-ai' && customAiHtml.trim()
        ? { html: customAiHtml }
        : undefined;
    return renderPortfolioHtml(data, override);
  }, [data, customAiHtml]);

  const copyText = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleDownloadZip = async () => {
    const override =
      data.meta.theme === 'custom-ai' && customAiHtml.trim()
        ? { html: customAiHtml }
        : undefined;
    const bytes = await buildPortfolioZip(data, override);
    const blob = new Blob([bytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-site.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = normalizePortfolioData(JSON.parse(String(reader.result)));
        setData(parsed);
        setImportBanner(`Imported profile for ${parsed.identity.fullName || 'user'}!`);
        setTimeout(() => setImportBanner(''), 3500);
      } catch {
        alert('Invalid portfolio.json file.');
      }
    };
    reader.readAsText(file);
  };

  const handleCustomHtmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCustomAiHtml(String(reader.result || ''));
    reader.readAsText(file);
  };

  const user = data.meta.githubUsername || 'YOUR-USERNAME';
  const liveUrl = `https://${user}.github.io`;
  const topProjects = data.projects.slice(0, 3);
  const launchPostDraft = `Excited to share my new personal portfolio website! 🚀

I put together a clean home for my projects, background, and what I'm currently building:
${
  topProjects.length
    ? topProjects.map((p) => `- ${p.title}: ${p.summary}`).join('\n')
    : '- Highlighted hands-on projects and technical write-ups'
}

Take a look here: ${liveUrl}

Always open to feedback, ideas, and connecting with folks working in similar areas!

#Portfolio #Projects #LearningInPublic #Career`;

  return (
    <div>
      <header className="topbar">
        <h1>
          GitHub.io Portfolio Generator
          <span className="badge">100% Private &middot; Runs in Your Browser</span>
        </h1>

        <div className="toolbar-actions">
          {importBanner && <span className="badge">{importBanner}</span>}
          <button onClick={() => setData(structuredClone(SAMPLE_PORTFOLIO))}>Load Demo Data</button>
          <button onClick={() => setData(createBlankPortfolio())}>Start Blank</button>
          <label className="file-btn">
            Import portfolio.json
            <input type="file" accept=".json" hidden onChange={handleImportJson} />
          </label>
          <button className="primary" onClick={handleDownloadZip}>
            Download portfolio-site.zip
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="editor-pane">
          <nav className="stage-pills" aria-label="Portfolio Builder Steps">
            {STAGES.map((s) => (
              <button
                key={s.id}
                className={stage === s.id ? 'active' : ''}
                onClick={() => setStage(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>

          {/* Stage 0: Identity */}
          {stage === 0 && (
            <div>
              <div className="guide-callout">
                <strong>Your 3-Second Hook:</strong> Visitors and recruiters decide within seconds
                who you are. Keep your headline crisp and match it with LinkedIn.
              </div>
              <div className="field">
                <label>Exact GitHub Username *</label>
                <input
                  type="text"
                  placeholder="e.g., narendaransg"
                  value={data.meta.githubUsername}
                  onChange={(e) => {
                    const u = e.target.value.trim();
                    setData({
                      ...data,
                      meta: {
                        ...data.meta,
                        githubUsername: u,
                        repoName: u ? `${u}.github.io` : 'username.github.io',
                      },
                      links: {
                        ...data.links,
                        github: u ? `https://github.com/${u}` : '',
                      },
                    });
                  }}
                />
                <small>
                  Your live website address will be <strong>https://{user}.github.io</strong>
                </small>
              </div>
              <div className="field">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={data.identity.fullName}
                  onChange={(e) =>
                    setData({ ...data, identity: { ...data.identity, fullName: e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>Headline / Short Role *</label>
                <input
                  type="text"
                  placeholder="e.g., Final-Year ECE Student | RTL Design & Embedded Systems"
                  value={data.identity.headline}
                  onChange={(e) =>
                    setData({ ...data, identity: { ...data.identity, headline: e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>City &amp; Country</label>
                <input
                  type="text"
                  value={data.identity.location}
                  onChange={(e) =>
                    setData({ ...data, identity: { ...data.identity, location: e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>Profile Photo URL (Optional)</label>
                <input
                  type="url"
                  placeholder={`https://github.com/${user}.png`}
                  value={data.identity.avatarUrl || ''}
                  onChange={(e) =>
                    setData({ ...data, identity: { ...data.identity, avatarUrl: e.target.value } })
                  }
                />
                <small>Tip: https://github.com/{user}.png automatically pulls your GitHub avatar.</small>
              </div>
            </div>
          )}

          {/* Stage 1: About */}
          {stage === 1 && (
            <div>
              <div className="guide-callout">
                <strong>Your Story:</strong> Write 2–4 natural sentences about what you build or
                study. Clear human language wins every time.
              </div>
              <div className="field">
                <label>About / Bio *</label>
                <textarea
                  value={data.about.bio}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, bio: e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>What Are You Currently Looking For? (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Open to internships, research collaborations, or full-time roles"
                  value={data.about.lookingFor}
                  onChange={(e) =>
                    setData({ ...data, about: { ...data.about, lookingFor: e.target.value } })
                  }
                />
              </div>
            </div>
          )}

          {/* Stage 2: Education */}
          {stage === 2 && (
            <div>
              <div className="guide-callout">
                <strong>Education &amp; Credentials:</strong> Keep degree names and years aligned
                with your LinkedIn Education section.
              </div>
              {data.education.map((edu, idx) => (
                <div key={idx} className="item-box">
                  <div className="item-header">
                    <span>Education #{idx + 1}</span>
                    <button
                      className="danger"
                      onClick={() =>
                        setData({
                          ...data,
                          education: data.education.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="field">
                    <label>Degree / Program</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, degree: e.target.value };
                        setData({ ...data, education: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, institution: e.target.value };
                        setData({ ...data, education: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Years / Period</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, period: e.target.value };
                        setData({ ...data, education: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Coursework / Highlights (Optional)</label>
                    <input
                      type="text"
                      value={edu.highlights || ''}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx] = { ...edu, highlights: e.target.value };
                        setData({ ...data, education: next });
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setData({
                    ...data,
                    sectionsEnabled: { ...data.sectionsEnabled, education: true },
                    education: [
                      ...data.education,
                      { degree: '', institution: '', period: '', highlights: '' },
                    ],
                  })
                }
              >
                + Add Education Entry
              </button>
            </div>
          )}

          {/* Stage 3: Experience */}
          {stage === 3 && (
            <div>
              <div className="guide-callout">
                <strong>Experience &amp; Roles:</strong> Include internships, lab roles, or club
                leadership. Focus bullets on what you built or improved.
              </div>
              {data.experience.map((exp, idx) => (
                <div key={idx} className="item-box">
                  <div className="item-header">
                    <span>Experience #{idx + 1}</span>
                    <button
                      className="danger"
                      onClick={() =>
                        setData({
                          ...data,
                          experience: data.experience.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="field">
                    <label>Role / Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[idx] = { ...exp, role: e.target.value };
                        setData({ ...data, experience: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Organization / Company</label>
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[idx] = { ...exp, organization: e.target.value };
                        setData({ ...data, experience: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Timeframe</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[idx] = { ...exp, period: e.target.value };
                        setData({ ...data, experience: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Highlights / Bullets (one per line)</label>
                    <textarea
                      value={exp.bullets.join('\n')}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[idx] = {
                          ...exp,
                          bullets: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                        };
                        setData({ ...data, experience: next });
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setData({
                    ...data,
                    sectionsEnabled: { ...data.sectionsEnabled, experience: true },
                    experience: [
                      ...data.experience,
                      { role: '', organization: '', period: '', bullets: [''] },
                    ],
                  })
                }
              >
                + Add Experience Entry
              </button>
            </div>
          )}

          {/* Stage 4: Projects */}
          {stage === 4 && (
            <div>
              <div className="guide-callout">
                <strong>Proof of Work:</strong> Even 2–3 well-explained projects set you apart from
                90% of resumes. Always link the GitHub repo if public!
              </div>
              {data.projects.map((proj, idx) => (
                <div key={idx} className="item-box">
                  <div className="item-header">
                    <span>Project #{idx + 1}</span>
                    <button
                      className="danger"
                      onClick={() =>
                        setData({
                          ...data,
                          projects: data.projects.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="field">
                    <label>Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[idx] = { ...proj, title: e.target.value };
                        setData({ ...data, projects: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>1-Line Summary</label>
                    <textarea
                      value={proj.summary}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[idx] = { ...proj, summary: e.target.value };
                        setData({ ...data, projects: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Outcome / Result</label>
                    <input
                      type="text"
                      value={proj.impact}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[idx] = { ...proj, impact: e.target.value };
                        setData({ ...data, projects: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Tools &amp; Tech (comma-separated)</label>
                    <input
                      type="text"
                      value={proj.techStack.join(', ')}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[idx] = {
                          ...proj,
                          techStack: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setData({ ...data, projects: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>GitHub Repo URL (Optional)</label>
                    <input
                      type="url"
                      value={proj.repoUrl || ''}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[idx] = { ...proj, repoUrl: e.target.value };
                        setData({ ...data, projects: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Live Demo / Write-up URL (Optional)</label>
                    <input
                      type="url"
                      value={proj.liveUrl || ''}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[idx] = { ...proj, liveUrl: e.target.value };
                        setData({ ...data, projects: next });
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setData({
                    ...data,
                    sectionsEnabled: { ...data.sectionsEnabled, projects: true },
                    projects: [
                      ...data.projects,
                      { title: '', summary: '', techStack: [], impact: '', repoUrl: '', liveUrl: '' },
                    ],
                  })
                }
              >
                + Add Project
              </button>
            </div>
          )}

          {/* Stage 5: Certifications & Achievements */}
          {stage === 5 && (
            <div>
              <div className="guide-callout">
                <strong>Certifications &amp; Achievements (Optional):</strong> Add hackathons,
                NPTEL/Coursera certifications, exam ranks, or publications. Leave empty to hide this
                section automatically.
              </div>
              {data.achievements.map((ach, idx) => (
                <div key={idx} className="item-box">
                  <div className="item-header">
                    <span>Achievement #{idx + 1}</span>
                    <button
                      className="danger"
                      onClick={() =>
                        setData({
                          ...data,
                          achievements: data.achievements.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="field">
                    <label>Title / Certificate Name</label>
                    <input
                      type="text"
                      placeholder="e.g., NPTEL Elite + Silver — Digital IC Design"
                      value={ach.title}
                      onChange={(e) => {
                        const next = [...data.achievements];
                        next[idx] = { ...ach, title: e.target.value };
                        setData({ ...data, achievements: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Issuer / Event</label>
                    <input
                      type="text"
                      placeholder="e.g., IIT Madras / NPTEL"
                      value={ach.issuer}
                      onChange={(e) => {
                        const next = [...data.achievements];
                        next[idx] = { ...ach, issuer: e.target.value };
                        setData({ ...data, achievements: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Year</label>
                    <input
                      type="text"
                      placeholder="2026"
                      value={ach.year}
                      onChange={(e) => {
                        const next = [...data.achievements];
                        next[idx] = { ...ach, year: e.target.value };
                        setData({ ...data, achievements: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Verification URL (Optional)</label>
                    <input
                      type="url"
                      value={ach.url || ''}
                      onChange={(e) => {
                        const next = [...data.achievements];
                        next[idx] = { ...ach, url: e.target.value };
                        setData({ ...data, achievements: next });
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setData({
                    ...data,
                    sectionsEnabled: { ...data.sectionsEnabled, achievements: true },
                    achievements: [...data.achievements, { title: '', issuer: '', year: '2026' }],
                  })
                }
              >
                + Add Certification / Achievement
              </button>
            </div>
          )}

          {/* Stage 6: Skills */}
          {stage === 6 && (
            <div>
              <div className="guide-callout">
                <strong>Skills &amp; Tools:</strong> Group your skills cleanly and pin the same top
                skills on your LinkedIn profile.
              </div>
              {data.skills.map((grp, idx) => (
                <div key={idx} className="item-box">
                  <div className="item-header">
                    <span>Skill Group #{idx + 1}</span>
                    <button
                      className="danger"
                      onClick={() =>
                        setData({
                          ...data,
                          skills: data.skills.filter((_, i) => i !== idx),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                  <div className="field">
                    <label>Category Name</label>
                    <input
                      type="text"
                      value={grp.category}
                      onChange={(e) => {
                        const next = [...data.skills];
                        next[idx] = { ...grp, category: e.target.value };
                        setData({ ...data, skills: next });
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={grp.items.join(', ')}
                      onChange={(e) => {
                        const next = [...data.skills];
                        next[idx] = {
                          ...grp,
                          items: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        };
                        setData({ ...data, skills: next });
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setData({
                    ...data,
                    sectionsEnabled: { ...data.sectionsEnabled, skills: true },
                    skills: [...data.skills, { category: 'Additional Skills', items: [] }],
                  })
                }
              >
                + Add Skill Group
              </button>
            </div>
          )}

          {/* Stage 7: Links */}
          {stage === 7 && (
            <div>
              <div className="guide-callout">
                <strong>Privacy Reminder:</strong> Never publish personal phone numbers or home
                addresses on a public site. Email + GitHub + LinkedIn is all recruiters need.
              </div>
              <div className="field">
                <label>Public Contact Email *</label>
                <input
                  type="email"
                  value={data.links.email}
                  onChange={(e) =>
                    setData({ ...data, links: { ...data.links, email: e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>GitHub Profile URL *</label>
                <input
                  type="url"
                  value={data.links.github}
                  onChange={(e) =>
                    setData({ ...data, links: { ...data.links, github: e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>LinkedIn Profile URL *</label>
                <input
                  type="url"
                  value={data.links.linkedin}
                  onChange={(e) =>
                    setData({ ...data, links: { ...data.links, linkedin: e.target.value } })
                  }
                />
              </div>
              <div className="field">
                <label>Resume PDF Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={data.links.resumeUrl || ''}
                  onChange={(e) =>
                    setData({ ...data, links: { ...data.links, resumeUrl: e.target.value } })
                  }
                />
              </div>
            </div>
          )}

          {/* Stage 8: Theme, Colors, Fonts & BYO-AI */}
          {stage === 8 && (
            <div>
              <div className="guide-callout">
                <strong>Customize Look &amp; Feel:</strong> Pick any preset theme, tweak accent
                color &amp; typography, or choose <em>Custom AI Template</em> to build a bespoke
                layout in ChatGPT, Claude, or Gemini!
              </div>

              {THEME_CATALOG.map((theme) => (
                <div
                  key={theme.id}
                  className={`theme-card ${data.meta.theme === theme.id ? 'selected' : ''}`}
                  onClick={() =>
                    setData({ ...data, meta: { ...data.meta, theme: theme.id as ThemeId } })
                  }
                >
                  <h4>{theme.name}</h4>
                  <p>{theme.tagline}</p>
                </div>
              ))}

              {data.meta.theme !== 'custom-ai' && (
                <div className="item-box" style={{ marginTop: '0.85rem' }}>
                  <div className="item-header">
                    <span>Accent Color &amp; Typography Polish</span>
                  </div>
                  <div className="field">
                    <label>Accent Color</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {ACCENT_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          className={(data.meta.accentColor || '') === preset.value ? 'active' : ''}
                          onClick={() =>
                            setData({
                              ...data,
                              meta: { ...data.meta, accentColor: preset.value },
                            })
                          }
                        >
                          {preset.value && (
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                background: preset.value,
                                display: 'inline-block',
                              }}
                            />
                          )}
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Font Style</label>
                    <select
                      value={data.meta.fontChoice || 'default'}
                      onChange={(e) =>
                        setData({
                          ...data,
                          meta: { ...data.meta, fontChoice: e.target.value as FontChoice },
                        })
                      }
                    >
                      <option value="default">Theme Default</option>
                      <option value="sans">Clean Sans-Serif</option>
                      <option value="serif">Classic Editorial Serif</option>
                      <option value="mono">Developer Monospace</option>
                    </select>
                  </div>
                </div>
              )}

              {data.meta.theme === 'custom-ai' && (
                <div className="item-box" style={{ marginTop: '1rem' }}>
                  <div className="item-header">
                    <span>BYO-AI Custom Template Workflow</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', marginTop: 0 }}>
                    1. Copy your personalized prompt below and paste it into ChatGPT, Claude, or
                    Gemini.
                    <br />
                    2. Paste or upload the generated HTML back here to preview &amp; validate!
                  </p>
                  <button
                    className="primary"
                    onClick={() => copyText('ai-prompt', buildCustomAiPrompt(data))}
                  >
                    {copiedKey === 'ai-prompt'
                      ? 'Copied AI Prompt!'
                      : 'Copy Prompt for ChatGPT / Claude / Gemini'}
                  </button>

                  <div className="field" style={{ marginTop: '0.75rem' }}>
                    <label>Upload or Paste AI-Generated index.html</label>
                    <input type="file" accept=".html,.htm" onChange={handleCustomHtmlUpload} />
                  </div>
                  <div className="field">
                    <textarea
                      placeholder="<!DOCTYPE html>..."
                      value={customAiHtml}
                      onChange={(e) => setCustomAiHtml(e.target.value)}
                    />
                  </div>

                  {customValidation &&
                    (customValidation.valid ? (
                      <div className="ok-box">
                        Sanity check passed! All your links, name, and email are intact.
                      </div>
                    ) : (
                      <div className="warn-box">
                        <strong>Check these warnings:</strong>
                        <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem' }}>
                          {customValidation.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <button disabled={stage === 0} onClick={() => setStage((s) => Math.max(0, s - 1))}>
              &larr; Previous
            </button>
            {stage < STAGES.length - 1 ? (
              <button
                className="primary"
                onClick={() => setStage((s) => Math.min(STAGES.length - 1, s + 1))}
              >
                Next Step &rarr;
              </button>
            ) : (
              <button className="primary" onClick={() => setRightTab('linkedin')}>
                Go to LinkedIn Sync &rarr;
              </button>
            )}
          </div>
        </aside>

        {/* Right: Live Preview + LinkedIn Sync + Deploy/Gitingest Guides */}
        <section className="preview-pane">
          <div className="preview-bar">
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                className={rightTab === 'preview' ? 'active' : ''}
                onClick={() => setRightTab('preview')}
              >
                Live Website Preview
              </button>
              <button
                className={rightTab === 'linkedin' ? 'active' : ''}
                onClick={() => setRightTab('linkedin')}
              >
                LinkedIn Sync &amp; Launch (2 Birds, 1 Stone)
              </button>
              <button
                className={rightTab === 'deploy' ? 'active' : ''}
                onClick={() => setRightTab('deploy')}
              >
                Deploy &amp; Gitingest Guide
              </button>
            </div>

            {rightTab === 'preview' && (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className={viewport === 'desktop' ? 'active' : ''}
                  onClick={() => setViewport('desktop')}
                >
                  Desktop
                </button>
                <button
                  className={viewport === 'mobile' ? 'active' : ''}
                  onClick={() => setViewport('mobile')}
                >
                  Mobile (390px)
                </button>
              </div>
            )}
          </div>

          {rightTab === 'preview' && (
            <div className="iframe-wrap">
              <iframe
                title="Live Portfolio Preview"
                sandbox="allow-scripts"
                srcDoc={previewHtml}
                className="preview-frame"
                style={{ width: viewport === 'mobile' ? '390px' : '100%' }}
              />
            </div>
          )}

          {rightTab === 'linkedin' && (
            <div className="drawer-scroll">
              <div className="guide-callout">
                <strong>Two Birds, One Stone:</strong> Keep your LinkedIn profile and{' '}
                <strong>{liveUrl}</strong> 100% aligned, pin your site to <em>Featured</em>, and
                publish your launch post below!
              </div>

              <div className="sync-card">
                <div className="sync-card-head">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!linkedinChecks.headline}
                      onChange={(e) =>
                        setLinkedinChecks({ ...linkedinChecks, headline: e.target.checked })
                      }
                    />{' '}
                    <strong>Step 1: Copy Headline to LinkedIn Top Card</strong>
                  </label>
                  <button onClick={() => copyText('headline', data.identity.headline)}>
                    {copiedKey === 'headline' ? 'Copied!' : 'Copy Headline'}
                  </button>
                </div>
                <pre>{data.identity.headline || '(Fill in your headline in Step 1)'}</pre>
              </div>

              <div className="sync-card">
                <div className="sync-card-head">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!linkedinChecks.about}
                      onChange={(e) =>
                        setLinkedinChecks({ ...linkedinChecks, about: e.target.checked })
                      }
                    />{' '}
                    <strong>Step 2: Copy Bio to LinkedIn "About" Section</strong>
                  </label>
                  <button
                    onClick={() =>
                      copyText(
                        'about',
                        `${data.about.bio}\n\n${
                          data.about.lookingFor ? `Currently: ${data.about.lookingFor}\n\n` : ''
                        }Explore my projects here: ${liveUrl}`
                      )
                    }
                  >
                    {copiedKey === 'about' ? 'Copied!' : 'Copy About'}
                  </button>
                </div>
                <pre>{`${data.about.bio}\n\n${
                  data.about.lookingFor ? `Currently: ${data.about.lookingFor}\n\n` : ''
                }Explore my projects here: ${liveUrl}`}</pre>
              </div>

              <div className="sync-card">
                <div className="sync-card-head">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!linkedinChecks.featured}
                      onChange={(e) =>
                        setLinkedinChecks({ ...linkedinChecks, featured: e.target.checked })
                      }
                    />{' '}
                    <strong>Step 3: Pin {liveUrl} to LinkedIn "Featured"</strong>
                  </label>
                  <button onClick={() => copyText('url', liveUrl)}>
                    {copiedKey === 'url' ? 'Copied URL!' : 'Copy Portfolio URL'}
                  </button>
                </div>
                <p style={{ fontSize: '0.84rem', margin: '0.4rem 0 0', color: '#cbd5e1' }}>
                  On LinkedIn: <strong>Add profile section &rarr; Recommended &rarr; Add featured &rarr; + &rarr; Add a link</strong> &rarr; paste <code>{liveUrl}</code> so visitors see it immediately!
                </p>
              </div>

              <div className="sync-card">
                <div className="sync-card-head">
                  <label>
                    <input
                      type="checkbox"
                      checked={!!linkedinChecks.post}
                      onChange={(e) =>
                        setLinkedinChecks({ ...linkedinChecks, post: e.target.checked })
                      }
                    />{' '}
                    <strong>Step 4: Publish Your LinkedIn Launch Post</strong>
                  </label>
                  <button onClick={() => copyText('post', launchPostDraft)}>
                    {copiedKey === 'post' ? 'Copied Post!' : 'Copy Post Draft'}
                  </button>
                </div>
                <pre>{launchPostDraft}</pre>
              </div>

              <div className="sync-card">
                <div className="sync-card-head">
                  <strong>Full Markdown Checklist (Also inside your ZIP!)</strong>
                  <button onClick={() => copyText('li-md', generateLinkedInSyncGuide(data))}>
                    {copiedKey === 'li-md' ? 'Copied Markdown!' : 'Copy LINKEDIN_SYNC.md'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {rightTab === 'deploy' && (
            <div className="drawer-scroll">
              <div className="sync-card">
                <div className="sync-card-head">
                  <strong>1. Publish to GitHub Pages ({liveUrl})</strong>
                  <button onClick={() => copyText('deploy-md', generateDeployGuide(data))}>
                    {copiedKey === 'deploy-md' ? 'Copied!' : 'Copy DEPLOY_GUIDE.md'}
                  </button>
                </div>
                <pre>{generateDeployGuide(data)}</pre>
              </div>

              <div className="sync-card">
                <div className="sync-card-head">
                  <strong>2. Upgrade Anytime Using Gitingest + Any AI</strong>
                  <button onClick={() => copyText('ai-md', generateAiCustomizeGuide(data))}>
                    {copiedKey === 'ai-md' ? 'Copied!' : 'Copy AI_CUSTOMIZE_GUIDE.md'}
                  </button>
                </div>
                <pre>{generateAiCustomizeGuide(data)}</pre>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
