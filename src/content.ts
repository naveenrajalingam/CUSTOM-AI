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

/**
 * The nav: one menu per intelligence area, each opening onto its products, the
 * products of each intelligence area. A product without a
 * section on this page yet has no `href` and shows as coming soon.
 */
export const nav: { label: string; color: string; items: { href?: string; label: string; status: string }[] }[] = [
  {
    label: 'Manufacturing Intelligence',
    color: '#34bde8',
    items: [{ href: '#digital-design-agent', label: 'Design & Analysis', status: 'Active' }],
  },
  {
    label: 'Enterprise Intelligence',
    color: '#f5b134',
    items: [
      { href: '#hr-central', label: 'HR Central', status: 'Active' },
      { href: '#training-ld', label: 'Training and L&D', status: 'In development' },
      { href: '#marketing-intelligence', label: 'Marketing Intelligence', status: 'In development' },
    ],
  },
  {
    label: 'Medical Intelligence',
    color: '#14a17e',
    items: [{ label: 'Clinical Suite', status: 'Coming soon' }],
  },
]

export const hero = {
  id: 'hero',
  tag: 'Applied AI',
  title: ['AI that does', 'the work.'],
  lede: 'Building AI that moves beyond assistance — toward autonomous problem solving.',
}

export const engineering = {
  id: 'digital-design-agent',
  name: 'AI Digital Design',
  title: 'Autonomous engineering design, accelerated by AI.',
  lede: 'Engineers focus on design. The AI handles the operations.',
  /** the operations in that line, as the icon row under it (each shown on hover) */
  steps: [
    { name: 'Design', copy: 'Point at the model and describe the change in plain English, or say it out loud.' },
    { name: 'Measure', copy: 'The finished part is measured to confirm it matches what was asked for.' },
    { name: 'Analyse', copy: 'Tests each candidate dimension, even across linked parts, to find the one that really moves.' },
    { name: 'Fix', copy: 'Nothing changes until the engineer approves, and a change that fails is undone automatically.' },
    { name: 'Redesign', copy: 'Reads geometry, loads and constraints, then ranks the design changes that reach the fix.' },
  ],
  // the console's header line, one per stage the console plays through
  stages: [
    {
      cadMode: 'SYS.ENG_CAD // AUTONOMOUS_ASSEMBLY',
    },
    {
      cadMode: 'SYS.ENG_CAD // KNOWLEDGE_LAYER',
    },
    {
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

export const hr = {
  id: 'hr-central',
  name: 'HR Central',
  title: 'One AI-native platform for the entire talent lifecycle.',
  status: 'Platform being developed',
  differentiator: {
    tag: 'The differentiator',
    quote:
      'A platform that adapts to the person, the employer and the workflow — not a rigid HR system they must adapt to.',
  },
}

export const training = {
  id: 'training-ld',
  name: 'Training and L&D',
  title: 'Training for software the web has never seen.',
  status: 'Module being developed',
  overview: 'The Observer Engine watches your teams work in platforms like Kinaxis and turns it into a living knowledge base.',
  console: 'SYS.L&D // OBSERVER_ENGINE',
  /** the observed session the visual plays: each step the engine captures, and where in the window it happens */
  session: {
    app: 'Supply planning workspace',
    /** the console's status, per stage of the icon row */
    modes: ['Observing', 'Capturing', 'Parsing', 'Synthesizing'],
    watching: 'Watching the session',
    kbLabel: 'Knowledge base',
    steps: [
      { kind: 'Workflow', text: 'Open the monthly supply plan' },
      { kind: 'Workflow', text: 'Adjust the demand forecast' },
      { kind: 'Workflow', text: 'Run a what-if scenario' },
      { kind: 'Document', text: 'Parse the S&OP procedure (SOP.pdf)' },
    ],
    lesson: 'Lesson ready: Monthly S&OP walkthrough',
  },
  figureLabel:
    'The Observer Engine watching a planner in a supply planning workspace: each action it sees, and an internal procedure it reads, is captured as a step in a knowledge base, which becomes a ready-made lesson.',
  capabilities: [
    { name: 'Observe', title: 'Learns from real use', copy: 'Watches how experienced users work in the system, with no tutorials needed.' },
    { name: 'Capture', title: 'Workflows, step by step', copy: 'Records each workflow end to end, as the steps your team actually takes.' },
    { name: 'Parse', title: 'Reads your documentation', copy: 'Pulls procedures, guides and internal notes into the same picture.' },
    { name: 'Synthesize', title: 'A living knowledge base', copy: 'Turns it all into lessons that update as your workflows change.' },
  ],
}

export const marketing = {
  id: 'marketing-intelligence',
  name: 'Marketing Intelligence',
  title: 'Market signals, turned into growth strategy.',
  status: 'Module being developed',
  overview: 'The central nervous system for your growth strategy.',
  console: 'SYS.MKT_INTEL // SIGNAL_SYNTHESIS',
  /** the field's status, per stage of the icon row */
  modes: ['Ingesting', 'Analyzing', 'Synthesizing'],
  /** the name over the lens that sorts the signals */
  lensLabel: 'MI ENGINE',
  /** what the lens notices while analyzing, one at a time */
  insights: ['Trend detected', 'Sentiment shifting', 'Competitor move'],
  /** the field's sources; pointing at one shows what it draws on */
  sources: [
    { name: 'Web', examples: ['News & industry media', 'Competitor websites', 'Search trends', 'Reviews & forums'] },
    { name: 'Social platforms', examples: ['LinkedIn', 'X (Twitter)', 'YouTube', 'Reddit & communities'] },
    { name: 'Internal data', examples: ['CRM & sales pipeline', 'Website analytics', 'Campaign results', 'Product usage'] },
  ],
  outputs: ['Market trends', 'Demand forecasts', 'Next best actions'],
  figureLabel:
    'Unordered signals from the web, social platforms and internal data drift in from the left, pass through the intelligence engine, and leave as three ordered streams: market trends, demand forecasts and next best actions.',
  capabilities: [
    {
      name: 'Ingest',
      copy: 'Web, social and internal data arrive continuously in one place, ready to analyse.',
    },
    {
      name: 'Analyze',
      copy: 'AI reads trends, sentiment and competitor moves as they emerge and filters out the noise.',
    },
    {
      name: 'Synthesize',
      copy: 'Predictions and clear recommendations your growth and strategy teams can use straight away.',
    },
  ],
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
    { value: 'Training and L&D', label: 'Training and L&D (Observer Engine)' },
    { value: 'Marketing Intelligence', label: 'Marketing Intelligence' },
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
        { href: '#training-ld', label: 'Training and L&D' },
        { href: '#marketing-intelligence', label: 'Marketing Intelligence' },
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
