import { BuilderRole } from '../types';

// Curated list of title pools mapped by role and stack keywords
const ROLE_TITLE_MAP: Record<BuilderRole, string[]> = {
  'Developer': [
    'THE SHIPPER',
    'THE CODE ARCHITECT',
    'THE SYSTEM BUILDER',
    'THE LOGIC CRAFTSMAN',
    'THE MAIN THREAD'
  ],
  'Full Stack': [
    'THE FULL-STACK BUILDER',
    'THE END-TO-END SHIPPER',
    'THE MONOLITH MASTER',
    'THE LAYER HACKER',
    'THE POLYGLOT BUILDER'
  ],
  'Backend': [
    'THE SYSTEM BUILDER',
    'THE PROTOCOL MAKER',
    'THE INFRA ARCHITECT',
    'THE KERNEL HACKER',
    'THE DB WHISPERER'
  ],
  'Frontend': [
    'THE PIXEL HACKER',
    'THE INTERFACE CRAFTSMAN',
    'THE UI ARCHITECT',
    'THE VIEW COMPOSER',
    'THE LAYOUT SHIPPER'
  ],
  'AI / ML': [
    'THE MACHINE WHISPERER',
    'THE NEURAL ARCHITECT',
    'THE AGENT SHIPPER',
    'THE TENSOR HACKER',
    'THE LATENT EXPLORER'
  ],
  'Designer': [
    'THE VISUAL HACKER',
    'THE DESIGN CRAFTSMAN',
    'THE TYPE ARCHITECT',
    'THE FORM & FUNCTION',
    'THE CANVAS SHIPPER'
  ],
  'Founder': [
    'THE IDEA SHIPPER',
    'THE ZERO-TO-ONE BUILDER',
    'THE VENTURE MAKER',
    'THE PRODUCT CATALYST',
    'THE VISION SHIPPER'
  ],
  'Student': [
    'THE NEXT BUILDER',
    'THE WILD CARD',
    'THE ALPHA HACKER',
    'THE CONTINUOUS LEARNER',
    'THE FRESH SHIPPER'
  ],
  'Engineer': [
    'THE SYSTEM MAKER',
    'THE CORE ARCHITECT',
    'THE SCALE ENGINE',
    'THE PR SHIPPER',
    'THE INFRA BUILDER'
  ],
  'Builder': [
    'THE THING MAKER',
    'THE PROTOTYPE CRAFTSMAN',
    'THE GOA HACKER',
    'THE SHIPPED IT MAKER',
    'THE SERIAL BUILDER'
  ],
  'Security': [
    'THE ZERO-DAY HACKER',
    'THE VAULT GUARD',
    'THE CIPHER ARCHITECT',
    'THE PEN-TESTER',
    'THE AUDIT MASTER'
  ],
  'Product': [
    'THE SPEC ARCHITECT',
    'THE FLOW SHIPPER',
    'THE ROADMAP MAKER',
    'THE FEATURE CATALYST',
    'THE PRODUCT BUILDER'
  ]
};

const STACK_KEYWORDS_TITLES: { keywords: string[]; titles: string[] }[] = [
  {
    keywords: ['AI', 'LLM', 'GEMINI', 'GPT', 'NEURAL', 'PYTHON', 'PYTORCH', 'TRANSFORMER', 'AGENT', 'RAG'],
    titles: ['THE MACHINE WHISPERER', 'THE AGENT ARCHITECT', 'THE LATENT SHIPPER', 'THE NEURAL HACKER']
  },
  {
    keywords: ['RUST', 'CPP', 'C++', 'GO', 'GOLANG', 'SYSTEMS', 'ASSEMBLY', 'WASM'],
    titles: ['THE KERNEL HACKER', 'THE MEMORY SAFE SHIPPER', 'THE LOW-LEVEL ARCHITECT', 'THE BINARY BUILDER']
  },
  {
    keywords: ['SOLANA', 'WEB3', 'CRYPTO', 'ETH', 'ETHEREUM', 'BLOCKCHAIN', 'SMART CONTRACT', 'EVM'],
    titles: ['THE PROTOCOL ARCHITECT', 'THE ON-CHAIN BUILDER', 'THE CIPHER HACKER', 'THE BLOCK SHIPPER']
  },
  {
    keywords: ['REACT', 'NEXT', 'VITE', 'TAILWIND', 'CSS', 'TYPESCRIPT', 'JS', 'JAVASCRIPT', 'VUE', 'SVELTE'],
    titles: ['THE PIXEL HACKER', 'THE INTERFACE SHIPPER', 'THE DOM MASTER', 'THE COMPONENT BUILDER']
  },
  {
    keywords: ['FIGMA', 'UI', 'UX', 'DESIGN', '3D', 'ANIMATION', 'MOTION', 'CANVAS', 'SPLINE'],
    titles: ['THE VISUAL HACKER', 'THE VECTOR ARCHITECT', 'THE MOTION SHIPPER', 'THE CANVAS CRAFTSMAN']
  }
];

const CURATED_FALLBACK_TITLES = [
  'THE SHIPPER',
  'THE GOA BUILDER',
  'THE SYSTEM MAKER',
  'THE THING MAKER',
  'THE PIXEL HACKER',
  'THE IDEA SHIPPER',
  'THE NEXT BUILDER',
  'THE CODE ARCHITECT',
  'THE CONTINUOUS SHIPPER'
];

/**
 * Deterministically get or re-roll a fun Builder Title based on role and stack text
 */
export function generateBuilderTitle(role: BuilderRole, stackText: string, variantIndex = 0): string {
  const cleanStack = (stackText || '').toUpperCase();
  
  // 1. Check stack keyword matches
  const keywordMatch = STACK_KEYWORDS_TITLES.find(item =>
    item.keywords.some(kw => cleanStack.includes(kw))
  );

  let candidatePool: string[] = [];

  if (keywordMatch) {
    candidatePool = [...keywordMatch.titles];
  }

  // 2. Add role titles
  const rolePool = ROLE_TITLE_MAP[role] || CURATED_FALLBACK_TITLES;
  candidatePool = [...candidatePool, ...rolePool];

  // De-duplicate
  const uniquePool = Array.from(new Set(candidatePool));

  // Cycle through based on variantIndex
  const title = uniquePool[Math.abs(variantIndex) % uniquePool.length];
  return title || 'THE SHIPPER';
}

/**
 * Generates catchy italicized taglines/quotes like in the official passport card
 * e.g. "Neural Network Hacker & Prompt Sorcerer"
 */
export function generateTagline(role: BuilderRole, stackText: string, variantIndex = 0): string {
  const cleanStack = (stackText || '').toUpperCase();

  const QUOTE_POOLS: Record<string, string[]> = {
    'AI / ML': [
      '"Neural Network Hacker & Prompt Sorcerer"',
      '"Latent Space Explorer & Model Fine-Tuner"',
      '"Agentic Workflow Craftsperson & Tensor Architect"',
      '"Deep Learning Alchemist & Data Whisperer"'
    ],
    'Developer': [
      '"Code Architect & Production Shipper"',
      '"Full-Stack System Craftsman & Bug Slayer"',
      '"Main Thread Weaver & Logic Architect"',
      '"Continuous Integration & System Builder"'
    ],
    'Backend': [
      '"Distributed Systems Architect & Database Whisperer"',
      '"Low-Latency Hacker & High-Scale Engineer"',
      '"Kernel Level Builder & Protocol Crafter"'
    ],
    'Frontend': [
      '"Pixel Perfectionist & UI Interaction Architect"',
      '"DOM Weaver & Canvas Visual Crafter"',
      '"Responsive Layout Engine & Component Master"'
    ],
    'Founder': [
      '"Zero-to-One Builder & Product Catalyst"',
      '"Visionary Shipper & Market Maker"',
      '"Venture Hacker & Rapid Prototyper"'
    ],
    'Designer': [
      '"Visual Identity Hacker & Aesthetic Craftsman"',
      '"Type & Vector Sorcerer & UI Architect"'
    ]
  };

  const pool = QUOTE_POOLS[role] || [
    '"Continuous Shipper & Goa Hacker House Builder"',
    '"System Builder & Code Craftsman"',
    '"Ideas into Production & Fast Prototype Maker"'
  ];

  return pool[Math.abs(variantIndex) % pool.length];
}

/**
 * Generate a unique-looking card serial number e.g. "HH26-4E90D7AC"
 */
export function generateCardNumber(seed?: string): string {
  const chars = '0123456789ABCDEF';
  let hex = '';
  for (let i = 0; i < 8; i++) {
    hex += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `HH26-${hex}`;
}
