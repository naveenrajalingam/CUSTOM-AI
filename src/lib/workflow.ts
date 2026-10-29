import type { LucideIcon } from 'lucide-react'
import { Award, Bot, BriefcaseBusiness, CircleCheckBig, ClipboardCheck, FilePen, IdCard, UserPlus, UserSearch, Video } from 'lucide-react'

// HR Central's "Campus to Company" flow, after the HR-CENTRAL advanced
// workflow. The candidate onboards, builds a resume, is evaluated (with AI
// upskilling until they pass), earns a verified level and may practise with an
// AI interviewer. All of it lands in the Talent Passport, the shared Job
// Profile that joins the candidate's journey to the employer's: the employer
// lists the job, matches and shortlists, runs interview rounds, and a person
// makes the final decision. Each stage has a one-line description, and `ai`
// names the AI that works at that stage.

export type Stage = { id: string; label: string; line: string; icon: LucideIcon; ai?: string }

export const stages: Stage[] = [
  { id: 'onboarding', label: 'Registration', line: 'Candidates sign up as freshers or experienced professionals with their basic details.', icon: UserPlus },
  { id: 'resume', label: 'Profile Creation', line: 'Build a resume with AI or upload one; skills are extracted automatically.', icon: FilePen, ai: 'AI resume builder' },
  { id: 'evaluation', label: 'Skill Assessment', line: 'Skills assessed from Beginner to Expert, with AI upskilling before reassessment.', icon: ClipboardCheck, ai: 'AI upskilling' },
  { id: 'verified', label: 'Skill Certification', line: 'The highest level achieved is certified; background checks run in parallel.', icon: Award },
  { id: 'practice', label: 'Interview Readiness', line: 'An optional agentic AI mock interview to prepare before the real one.', icon: Bot, ai: 'Agentic AI' },
  { id: 'passport', label: 'Talent Passport', line: 'One shared Job Profile: resume, verified skills, BGV status and results.', icon: IdCard },
  { id: 'listing', label: 'Job Requisition', line: 'Employers register their organisation and publish AI-generated job descriptions.', icon: BriefcaseBusiness, ai: 'AI job drafts' },
  { id: 'shortlist', label: 'Talent Matching', line: 'Applicants and sourced profiles are matched to the role, then shortlisted.', icon: UserSearch, ai: 'AI matching' },
  { id: 'interviews', label: 'Interview Process', line: 'L1, L2 and further rounds, with AI assessment, integrity flags and feedback.', icon: Video, ai: 'AI assessment' },
  { id: 'decision', label: 'Hiring Decision', line: 'The hiring team makes the final decision, and the outcome is recorded.', icon: CircleCheckBig },
]
