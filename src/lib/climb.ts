// HR Central's two pillars, covering the whole talent and employee lifecycle:
// Campus to Hire (a candidate rises to an offer, upskilling on the way) and
// Hire to Retire (the employee's life in the company).
// Each is a climb of stages, and each stage has a one-line description.

export type ClimbStage = { id: string; label: string; line: string }

export type ClimbPillar = {
  id: string
  label: string
  /** who the pillar is for */
  audience: string
  /** the pillar's square colour, from the palette */
  color: string
  /** a climb that rises to the top, or a cycle that comes back round */
  shape?: 'climb' | 'cycle'
  stages: ClimbStage[]
}

export const pillars: ClimbPillar[] = [
  {
    id: 'campus',
    label: 'Campus to Hire',
    audience: 'For students and job seekers',
    color: '#34bde8',
    stages: [
      {
        id: 'onboarding',
        label: 'Onboarding',
        line: 'Candidates join in moments, with no forms to fill or profiles to build by hand.',
      },
      {
        id: 'upskilling',
        label: 'Upskilling',
        line: 'A personalised learning path builds the skills the target role needs.',
      },
      {
        id: 'skills',
        label: 'Skill Assessment',
        line: 'Skills are evaluated from Beginner to Expert, and the verified level goes on the passport.',
      },
      {
        id: 'passport',
        label: 'Talent Passport',
        line: 'One verified profile of skills, levels and background checks, shared with employers.',
      },
      { id: 'sourcing', label: 'Job Sourcing', line: 'Employers publish roles and source the right candidates for them.' },
      { id: 'matching', label: 'Talent Matching', line: 'Passports are matched to the role, and the shortlist is built.' },
      {
        id: 'interview',
        label: 'Proctored Interview',
        line: 'Interview rounds with proctoring, integrity checks and structured feedback.',
      },
      { id: 'hiring', label: 'Hiring', line: 'The hiring team makes the final decision, and the offer goes out.' },
    ],
  },
  {
    id: 'lifecycle',
    label: 'Hire to Retire',
    audience: 'For corporates and HR agencies',
    color: '#f5b134',
    shape: 'cycle',
    stages: [
      { id: 'recruitment', label: 'Recruitment', line: 'Roles, candidates and pipelines managed in one place.' },
      { id: 'interviews', label: 'Interviews', line: 'Skill assessments and interview rounds run as structured workflows.' },
      { id: 'onboard', label: 'Onboarding', line: 'New hires arrive to their documents, accounts and first-week plan ready.' },
      { id: 'hrms', label: 'Core HR', line: 'Records, leave, attendance and policies in one HRMS.' },
      { id: 'performance', label: 'Performance', line: 'Goals, reviews and development plans, grounded in real skill data.' },
      { id: 'growth', label: 'Growth & Mobility', line: 'Promotions, internal moves and reskilling across the employee’s career.' },
      { id: 'offboarding', label: 'Offboarding', line: 'Clean exits: handovers, access, final settlement and exit insights.' },
    ],
  },
]
