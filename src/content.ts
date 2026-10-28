// Every word on the page, carried over from the Design A site. Components read from here.

export const site = {
  contactEmail: 'info@supplychainz.in',
  mainSiteUrl: 'https://www.supplychainz.in',
  hrCentralUrl: 'https://hrcentral.in',
  /** no privacy page exists yet; set its address here and the form links to it */
  privacyUrl: '',
}

/** Where every "let's talk" button goes: the contact form near the end of the page. */
export const contactHref = '#lets-talk'

/** The nav: one menu per intelligence area, each opening onto its products. Medical has none yet. */
export const nav: { label: string; color: string; items: { href: string; label: string; note: string; status: string }[] }[] = [
  {
    label: 'Engineering Intelligence',
    color: '#34bde8',
    items: [{ href: '#digital-design-agent', label: 'Digital Design Agent', note: 'Autonomous engineering & CAD automation', status: 'Active' }],
  },
  {
    label: 'Enterprise Intelligence',
    color: '#f5b134',
    items: [{ href: '#hr-central', label: 'HR Central', note: 'AI-native talent lifecycle platform', status: 'Active' }],
  },
  { label: 'Medical Intelligence', color: '#14a17e', items: [] },
]

export const hero = {
  id: 'hero',
  tag: 'Applied AI // Agentic architecture',
  title: ['AI that does', 'the work.'],
  lede: 'Most AI answers questions. Ours learns a domain, takes on its workflows, and progressively does more of the real work.',
  core: 'Applied AI',
  figureLabel:
    'Applied AI at the centre of three intelligence branches: Enterprise Intelligence, Engineering Intelligence, and Medical Intelligence (planned).',
}

/** The three intelligence pillars, as drawn in the hero and listed in the menu. */
export const pillars = [
  {
    name: 'Enterprise Intelligence',
    focus: 'Enterprise • Talent Mesh',
    product: 'HR Central',
    note: 'AI-native talent lifecycle platform',
    status: 'Active',
    href: '#hr-central',
    color: '#f5b134',
  },
  {
    name: 'Engineering Intelligence',
    focus: 'CAD • FEA Physics',
    product: 'Digital Design Agent',
    note: 'Autonomous engineering & CAD automation',
    status: 'Active',
    href: '#digital-design-agent',
    color: '#34bde8',
  },
  {
    name: 'Medical Intelligence',
    focus: 'Clinical & Diagnostic AI',
    product: 'Clinical & Health AI',
    note: 'Domain intelligence pipeline in development',
    status: 'Planned',
    href: null,
    color: '#14a17e',
  },
] as const

export const engineering = {
  id: 'digital-design-agent',
  name: 'Digital Design Agent',
  title: 'From design automation to autonomous engineering.',
  lede: 'An AI agent that takes an engineering problem all the way to a production-ready design.',
  stagesLabel: 'Engineering evolution stages',
  stages: [
    {
      tab: 'Execute',
      title: 'Digital Design Agent',
      copy: 'Carries out design work from your engineering instructions.',
      cadMode: 'SYS.ENG_CAD // AUTONOMOUS_ASSEMBLY',
    },
    {
      tab: 'Augment',
      title: 'Engineering Knowledge Layer',
      copy: 'Learns your standards, simulation rules and governance.',
      cadMode: 'SYS.ENG_CAD // KNOWLEDGE_LAYER',
    },
    {
      tab: 'Design',
      title: 'Autonomous Engineering',
      copy: 'Proposes the solution, then designs it once you approve.',
      cadMode: 'SYS.ENG_CAD // AUTONOMOUS_ENGINEERING',
    },
  ],
  cad: {
    partsLabel: 'Parts',
    /** the parts count the console reports: the full bill of materials the drawing stands for */
    parts: 4318,
    status: {
      staged: 'SYS.ENG_CAD // ROBOTIC_ASSEMBLY // PARTS_STAGED',
      assembling: 'SYS.ENG_CAD // ROBOTIC_ASSEMBLY // PRECISION_LOCK',
      assembled: 'SYS.ENG_CAD // ROBOTIC_ASSEMBLY // ASSEMBLY_VALIDATED',
      resetting: 'SYS.ENG_CAD // ROBOTIC_ASSEMBLY // CYCLE_RESET',
    },
    label: 'A robotic assembly line: three robot arms pick scattered car parts, guide them in along laser lines and weld them into a complete car, then the cycle resets.',
  },
}

export type Capability = { title: string; body: string; tags: [string, string]; art: ArtId }
export type ArtId =
  | 'profile'
  | 'upskill'
  | 'assess'
  | 'interview'
  | 'pipeline'
  | 'verify'
  | 'hrms'
  | 'lifecycle'

export const hr = {
  id: 'hr-central',
  name: 'HR Central',
  title: 'One AI-native platform for the entire talent lifecycle.',
  lede: 'One agentic platform for candidates and employers alike.',
  status: 'Platform being developed',
  groups: [
    {
      title: 'Campus → Career',
      caption: 'Candidate Readiness',
      items: [
        {
          title: 'Resume & Profile Builder',
          body: 'AI-assisted profile generation and skills taxonomy mapping for target roles.',
          tags: ['Skills Taxonomy', 'Target Role Matching'],
          art: 'profile',
        },
        {
          title: 'Adaptive Upskilling',
          body: 'Personalized learning roadmaps that adapt dynamically to verified competency gaps.',
          tags: ['Competency Gaps', 'Verified Roadmaps'],
          art: 'upskill',
        },
        {
          title: 'Proctored Assessments',
          body: 'Automated, integrity-verified evaluation pipelines for engineering talent.',
          tags: ['Integrity Verification', 'Engineering Evaluation'],
          art: 'assess',
        },
        {
          title: 'AI Mock Interviews',
          body: 'Role-specific conversational AI agents conducting dynamic candidate practice interviews.',
          tags: ['Role-Specific Practice', 'Conversational Feedback'],
          art: 'interview',
        },
      ] as Capability[],
    },
    {
      title: 'Hire → Retire',
      caption: 'Enterprise Lifecycle',
      items: [
        {
          title: 'Recruitment & Pipeline',
          body: 'High-velocity candidate screening, interview orchestration, and applicant triage.',
          tags: ['Autonomous Triage', 'Interview Orchestration'],
          art: 'pipeline',
        },
        {
          title: 'Automated Verification',
          body: 'Rapid background verification, digital credential validation, and identity compliance.',
          tags: ['Digital Credential Hash', 'Identity Compliance'],
          art: 'verify',
        },
        {
          title: 'Intelligent HRMS',
          body: 'Paperless employee induction, role configuration, and modern core HR workflows.',
          tags: ['Paperless Induction', 'Dynamic Roles'],
          art: 'hrms',
        },
        {
          title: 'Lifecycle & Appraisals',
          body: 'Continuous feedback loops, growth milestones, appraisals, and structured offboarding.',
          tags: ['Real-Time Feedback', 'Growth Milestones'],
          art: 'lifecycle',
        },
      ] as Capability[],
    },
  ],
  differentiator: {
    tag: 'The differentiator',
    quote:
      'A platform that adapts to the person, the employer and the workflow — not a rigid HR system they must adapt to.',
  },
}

export const contact = {
  id: 'lets-talk',
  title: 'Let’s talk.',
  close: 'Close',
  lede: 'Tell us what you’re working on. A senior member of our team will get back to you.',
  fields: {
    name: 'Your name',
    namePlaceholder: 'Your name',
    nameError: 'Please enter your name',
    email: 'Work email',
    emailPlaceholder: 'name@company.com',
    emailError: 'Please enter a valid work email',
    topic: 'What’s it about?',
    message: 'Message',
    messagePlaceholder: 'A few lines on what you’re trying to solve.',
    messageError: 'Please share a few lines on what you’re trying to solve',
  },
  topics: [
    { value: 'Custom AI', label: 'Custom AI' },
    { value: 'Digital Design Agent', label: 'Digital Design Agent (CAD & FEA Automation)' },
    { value: 'HR Central', label: 'HR Central (AI-Native Talent Platform)' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'General Inquiry', label: 'General Inquiry' },
  ],
  consent: 'I agree that SupplyChainz may use these details to reply to me.',
  privacyLead: 'See our',
  privacyLabel: 'Privacy notice',
  submit: 'Send message →',
  invalid: 'Please fill in all required fields.',
  sent: 'Thank you! Your email app has opened with the message ready to send. If it didn’t, write to us at',
  emailTitle: 'Email us directly',
  locationsTitle: 'Where we are',
  locations: ['India', 'Singapore', 'Europe', 'North America'],
  partner: {
    before: 'Working on a Kinaxis or RELEX programme as a partner? Choose',
    strong: '“Partnership”',
    after: 'and we’ll route it to the right team.',
  },
}

export const footer = {
  id: 'inquiries',
  blurb: 'The Applied AI division of SupplyChainz: AI that learns a domain and does its work.',
  note: 'CONFIDENTIAL • Applied AI Division',
  /** the registered company name, as on supplychainz.in */
  company: 'SupplyChainz Infotech Private Limited',
  columns: [
    {
      title: 'Products',
      links: [
        { href: '#digital-design-agent', label: 'Digital Design Agent' },
        { href: '#hr-central', label: 'HR Central' },
        { href: 'https://hrcentral.in', label: 'hrcentral.in', external: true },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '#lets-talk', label: 'Inquiries' },
        { href: 'https://www.supplychainz.in', label: 'supplychainz.in', external: true },
      ],
    },
  ],
  officesTitle: 'Offices',
}
