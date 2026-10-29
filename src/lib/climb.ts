// HR Central's climb: the seven stages a candidate rises through, from joining
// to being hired, with no forms to fill or profiles to build by hand. Each has
// a one-line description.

export type ClimbStage = { id: string; label: string; line: string }

export const climb: ClimbStage[] = [
  { id: 'onboarding', label: 'Onboarding', line: 'Candidates join in moments, with no forms to fill or profiles to build by hand.' },
  { id: 'skills', label: 'Skill Assessment', line: 'Skills are evaluated from Beginner to Expert, with AI upskilling before a re-test.' },
  { id: 'passport', label: 'Talent Passport', line: 'One verified profile of skills, levels and background checks, shared with employers.' },
  { id: 'sourcing', label: 'Job Sourcing', line: 'Employers publish roles and source the right candidates for them.' },
  { id: 'matching', label: 'Talent Matching', line: 'Passports are matched to the role, and the shortlist is built.' },
  { id: 'interview', label: 'Proctored Interview', line: 'Interview rounds with proctoring, integrity checks and structured feedback.' },
  { id: 'hiring', label: 'Hiring', line: 'The hiring team makes the final decision, and the offer goes out.' },
]
