// Every word on the page, carried over from the Design A site. Components read from here.

export const site = {
  contactEmail: 'info@supplychainz.in',
  hrCentralUrl: 'https://hrcentral.in',
  privacyUrl: '#privacy',
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
    label: 'Corporate Intelligence',
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
  primary: 'Start an engineering conversation',
  secondary: 'Meet the agents',
  core: 'Applied AI',
  figureLabel:
    'Applied AI at the centre of three intelligence branches: Corporate Intelligence, Engineering Intelligence, and Medical Intelligence (planned).',
}

/** The three intelligence pillars, as drawn in the hero and listed in the menu. */
export const pillars = [
  {
    name: 'Corporate Intelligence',
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
  tag: '01 · Domain engine · Engineering Intelligence',
  title: 'From design automation to autonomous engineering.',
  lede: 'An AI engineering agent capable of understanding an engineering problem, developing a solution, and translating that solution into a production-ready design.',
  target: 'Target: Automotive Engineering • Active POC',
  stagesLabel: 'Engineering evolution stages',
  stages: [
    {
      tab: 'Execute',
      eyebrow: 'Capability: Execute',
      title: 'Digital Design Agent',
      chip: 'Active POC',
      copy: 'Executes design activities based on engineering instructions and requirements.',
      cadMode: 'SYS.ENG_CAD // AUTONOMOUS_ASSEMBLY',
    },
    {
      tab: 'Augment',
      eyebrow: 'Capability: Augment',
      title: 'Engineering Knowledge Layer',
      chip: 'In Development',
      copy: 'Progressively incorporates engineering standards, methodologies, simulation knowledge, modelling principles, validation rules and governance.',
      cadMode: 'SYS.ENG_CAD // KNOWLEDGE_LAYER',
    },
    {
      tab: 'Design',
      eyebrow: 'Capability: Design',
      title: 'Autonomous Engineering',
      chip: 'Strategic North Star',
      copy: 'Understands an engineering problem, develops and proposes a solution, then creates the design after approval.',
      cadMode: 'SYS.ENG_CAD // AUTONOMOUS_ENGINEERING',
    },
  ],
  cad: {
    totalNodes: 14820,
    nodesLabel: 'Nodes',
    status: {
      assembled: 'ASSEMBLY VALIDATED // TOLERANCE: ±0.02mm',
      exploding: 'EXPLODED VIEW // STRUCTURAL ANALYSIS',
      exploded: 'DECONSTRUCTED // 50 MODULES SEPARATED',
      reassembling: 'AUTONOMOUS REASSEMBLY // PRECISION LOCK',
    },
    label: 'An autonomous CAD assembly of a car, exploding into its parts and reassembling.',
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
  tag: '02 · AI-native talent platform · Corporate Intelligence',
  title: 'One AI-native platform for the entire talent lifecycle.',
  lede: 'A highly customizable, intuitive and agentic AI platform serving both sides of the talent ecosystem.',
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
      'A deeply customizable, AI-agentic platform that adapts to the individual, the employer and the workflow — rather than forcing them into a rigid HR system.',
    cta: 'Visit hrcentral.in',
  },
}

export const architecture = {
  id: 'operating-architecture',
  tag: 'The opportunity',
  title: 'Two beachheads. One AI-native model.',
  lede: 'An enterprise solution in engineering design and a platform-scale opportunity in talent — built on the same agentic AI thesis.',
  beachheads: [
    {
      tag: 'Engineering AI',
      title: 'Engineering & Design Automation',
      body: 'Deep vertical enterprise solution automating complex CAD, physics & structural workflows.',
      accent: 'signal',
      rows: [
        ['Domain', 'Engineering & Design'],
        ['Starting point', 'Design Automation'],
        ['AI role', 'Execute → Learn → Design'],
        ['Commercial posture', 'Active POC // Enterprise'],
        ['North star', 'Autonomous Engineering'],
      ],
    },
    {
      tag: 'HR Central',
      title: 'AI-Native Talent Platform',
      body: 'Horizontal platform-scale opportunity covering the entire talent continuum from Campus to Retire.',
      accent: 'amber',
      rows: [
        ['Domain', 'Talent & HR'],
        ['Starting point', 'Talent Lifecycle'],
        ['AI role', 'Assist → Assess → Orchestrate'],
        ['Commercial posture', 'Active R&D // Platform'],
        ['North star', 'AI-Native Talent Ecosystem'],
      ],
    },
  ] as const,
  thesis: {
    tag: 'Shared agentic thesis',
    body: 'Both beachheads share the same underlying operating model: systematically replacing manual routine tasks with autonomous agent loops — from continuous feedback to verified enterprise outputs.',
  },
  model: {
    tag: 'The operating model',
    title: 'The 4-Phase Shared Operating Model',
    lede: 'How we apply agentic AI to complex enterprise domains — moving systematically from raw human expertise to full autonomy.',
    steps: [
      { title: 'Domain Expertise', body: 'Contextual immersion into engineering physics, CAD rules, and talent lifecycles.' },
      { title: 'AI Agent Workflows', body: 'Deploying specialized agentic architectures tuned for deterministic multi-step task execution.' },
      { title: 'Knowledge & Governance', body: 'Encoding institutional standards, simulation physics, FEA rules, and validation governance.' },
      { title: 'Autonomous Scaling', body: 'Progressing from instruction execution to augmented validation, proactive design, and enterprise scale.' },
    ],
  },
}

export const closing = {
  title: 'AI systems that don’t just answer questions.',
  body: 'They understand domains, execute workflows and progressively take on real work.',
  primary: 'Start an engineering conversation',
  secondary: 'Visit hrcentral.in',
}

export const contact = {
  id: 'lets-talk',
  title: 'Let’s talk.',
  lede: 'Tell us what you’re working on. A senior member of our team will get back to you.',
  fields: {
    name: 'Your name',
    namePlaceholder: 'Your name',
    nameError: 'Please enter your name',
    email: 'Work email',
    emailPlaceholder: 'name@company.com',
    emailError: 'Please enter a valid work email',
    company: 'Company',
    companyPlaceholder: 'Your company',
    companyError: 'Please enter your company',
    role: 'Your role',
    rolePlaceholder: 'e.g. VP Supply Chain',
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
  consent: 'I agree that SupplyChainz may use these details to reply to me. See our',
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
  brand: 'Applied AI // SupplyChainz',
  note: 'CONFIDENTIAL • Applied AI Division',
  links: [
    { href: '#digital-design-agent', label: 'Digital Design Agent' },
    { href: '#hr-central', label: 'HR Central' },
    { href: '#operating-architecture', label: 'Architecture' },
    { href: '#lets-talk', label: 'Inquiries' },
  ],
}
