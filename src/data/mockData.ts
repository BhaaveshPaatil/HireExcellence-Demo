import type {
  CodingProblem,
  Course,
  FeedSuggestion,
  InterviewQuestion,
  Job,
  Person,
  Post,
} from '../lib/types'

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString()

export const currentUser: Person & {
  email: string
  location: string
  about: string
  experience: { role: string; company: string; period: string; description: string }[]
  education: { school: string; degree: string; period: string; description: string }[]
  skills: string[]
  achievements: { label: string; value: string }[]
  stats: { connections: number; followers: number; following: number }
  bannerColor: string
} = {
  name: 'Emily Carter',
  email: 'emily@hirex.dev',
  headline: 'Final-year CS Student · Aspiring Full-Stack Engineer',
  initials: 'EC',
  avatarColor: 'bg-indigo-500',
  location: 'San Francisco, CA',
  about:
    'Computer Science senior passionate about building accessible, delightful web products. Solving DSA problems daily, contributing to open source, and hunting for my first full-time role as a software engineer.',
  experience: [
    {
      role: 'Software Engineering Intern',
      company: 'Nimbus Labs',
      period: 'Jun 2025 – Aug 2025',
      description:
        'Built a React + Tailwind design system used by 4 product teams; cut page-load time by 38% by shipping code-splitting and image optimizations.',
    },
    {
      role: 'Backend Engineering Intern',
      company: 'Craftly',
      period: 'May 2024 – Jul 2024',
      description:
        'Designed REST endpoints and PostgreSQL models powering 50k+ monthly active users; added caching that reduced p95 latency by 42%.',
    },
    {
      role: 'Teaching Assistant — Data Structures',
      company: 'University of California',
      period: 'Jan 2024 – May 2024',
      description:
        'Led weekly recitations for 120+ students; authored 15+ practice problem sets on graphs and dynamic programming.',
    },
  ],
  education: [
    {
      school: 'University of California',
      degree: 'B.S. Computer Science',
      period: '2022 – 2026',
      description: 'GPA 3.9/4.0 · Dean’s List · ACM Programming Club Lead',
    },
  ],
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'Tailwind CSS',
    'PostgreSQL',
    'Python',
    'Data Structures',
    'Algorithms',
    'System Design',
    'Git',
    'AWS',
    'GraphQL',
  ],
  achievements: [
    { label: 'Solved', value: '312' },
    { label: 'Contests', value: '24' },
    { label: 'Repo stars', value: '1.2k' },
  ],
  stats: { connections: 486, followers: 1204, following: 198 },
  bannerColor: 'from-indigo-600 via-violet-600 to-fuchsia-500',
}

export const feedPeople: Record<string, Person> = {
  aarav: { name: 'Aarav Sharma', headline: 'SWE @ Google · ex-Codeforces', initials: 'AS', avatarColor: 'bg-sky-500' },
  priya: { name: 'Priya Patel', headline: 'Founding Engineer @ Scribble', initials: 'PP', avatarColor: 'bg-rose-500' },
  rohan: { name: 'Rohan Mehta', headline: 'SWE Intern @ Stripe', initials: 'RM', avatarColor: 'bg-emerald-500' },
  sneha: { name: 'Sneha Iyer', headline: 'MS CS @ Stanford', initials: 'SI', avatarColor: 'bg-violet-500' },
  aditya: { name: 'Aditya Verma', headline: 'SDE-I @ Amazon · Content creator', initials: 'AV', avatarColor: 'bg-amber-500' },
  sofia: { name: 'Sofia Reyes', headline: 'Recruiter @ GrowthBee', initials: 'SR', avatarColor: 'bg-teal-500' },
}

export const initialPosts: Post[] = [
  {
    id: 'p1',
    author: feedPeople.aarav,
    time: daysAgo(0),
    content:
      'Landing your first tech internship is 20% skills and 80% narrative. Here is what actually worked for me:\n\n1. One tailored resume bullet per job, not a PDF you mass-send.\n2. Build 2 polished projects that solve real pain points.\n3. Practice 25-minute mock interviews weekly with peers.\n\nConsistency beats intensity. What is your biggest blocker right now?',
    likes: 1284,
    shares: 342,
    comments: [
      {
        id: 'c1',
        author: feedPeople.priya,
        text: 'Point 2 is underrated. Projects with real users write your resume for you.',
        time: '2h ago',
        likes: 44,
      },
      {
        id: 'c2',
        author: feedPeople.rohan,
        text: 'Mock interviews are THE difference maker. Echo this 100%.',
        time: '1h ago',
        likes: 17,
      },
    ],
  },
  {
    id: 'p2',
    author: feedPeople.priya,
    time: hoursAgo(6),
    content:
      'Thread: How to write resumes that pass both ATS filters and human recruiters.\n\n1. Mirror the job description keywords — but only the ones you can back up.\n2. Lead every bullet with an action verb + metric. “Optimized SQL queries (29% faster)” not “responsible for SQL.”\n3. One column. No images. PDF export.\n\nSave this for your next application 📌',
    likes: 972,
    shares: 401,
    comments: [
      {
        id: 'c3',
        author: feedPeople.sneha,
        text: 'The metric rule changed my application results completely.',
        time: '3h ago',
        likes: 29,
      },
    ],
  },
  {
    id: 'p3',
    author: feedPeople.rohan,
    time: daysAgo(1),
    content:
      'After 3 rejected internships → 4 offers. My interview prep checklist:\n\n• Solve 2 medium problems daily, focus on patterns (sliding window, two pointers)\n• Whiteboard 1 system design question a week\n• Record yourself answering “Tell me about yourself” until it sounds natural\n\nYour skills are ready. Your delivery just needs reps.',
    likes: 763,
    shares: 210,
    comments: [],
  },
  {
    id: 'p4',
    author: feedPeople.sneha,
    time: daysAgo(2),
    content:
      'Grad school or job? Ask yourself one question: what do I want my day-to-day to look like in 3 years — building products or producing research? Both are amazing paths. There is no wrong answer, only a mismatched one. Happy to answer questions about the MS application process!',
    likes: 524,
    shares: 120,
    comments: [
      {
        id: 'c5',
        author: feedPeople.aditya,
        text: 'Perfect framing. I chose industry and I could not be happier.',
        time: '1d ago',
        likes: 11,
      },
    ],
  },
  {
    id: 'p5',
    author: feedPeople.aditya,
    time: daysAgo(3),
    content:
      'What I wish I knew before my first software job:\n\n1. 30% of your value is shipping code. 70% is making others successful with your code.\n2. Read code that scares you — it unlocks your next level.\n3. Ask “why” five times before proposing a better “how.”\n\nRetweet for a fellow new grad 💙',
    likes: 1501,
    shares: 512,
    comments: [
      {
        id: 'c6',
        author: feedPeople.aarav,
        text: 'Number 3 is strangely deep. Stealing this.',
        time: '2d ago',
        likes: 38,
      },
    ],
  },
]

export const suggestedConnections: FeedSuggestion[] = [
  { name: 'David Kim', headline: 'SWE @ LinkedIn', initials: 'DK', avatarColor: 'bg-cyan-500' },
  { name: 'Maya Chen', headline: 'Frontend Engineer @ Vercel', initials: 'MC', avatarColor: 'bg-fuchsia-500' },
  { name: 'Noah Williams', headline: 'ML Engineer @ Scale', initials: 'NW', avatarColor: 'bg-orange-500' },
  { name: 'Isabella Rossi', headline: 'Product Designer @ Figma', initials: 'IR', avatarColor: 'bg-lime-500' },
]

export const trendingTopics = [
  { tag: '#NewGrad2026', posts: '12.4k' },
  { tag: '#InterviewTips', posts: '8.1k' },
  { tag: '#OpenAI', posts: '6.7k' },
  { tag: '#RemoteFirst', posts: '5.2k' },
  { tag: '#SystemDesign', posts: '4.9k' },
]

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'Software Engineer Intern',
    company: 'Google',
    location: 'Mountain View, CA · Hybrid',
    type: 'Internship',
    salary: '$45/hr',
    posted: '2 days ago',
    applicants: 1284,
    tags: ['Python', 'C++', 'Algorithms', 'Distributed Systems'],
    logoColor: 'bg-sky-600',
    about:
      'Google builds products and platforms for billions of users and is looking for curious, self-driven interns to push what is possible.',
    description:
      'As a Software Engineering Intern, you will work on a core product or platform team. You will design, implement, and ship high-quality code while collaborating with experienced engineers and product managers. Interns own projects end-to-end and present to leadership at the end of the program.',
    responsibilities: [
      'Design and implement new features, end to end, across the stack',
      'Collaborate with product managers and engineers on scope, design, and tradeoffs',
      'Write clean, tested, and maintainable code with code reviews',
      'Participate in engineering on-call and support production systems',
      'Present project outcomes to engineering leadership',
    ],
    requirements: [
      'Currently pursuing a BS/MS in Computer Science or related field',
      'Strong with data structures, algorithms, and at least one language (C++, Java, Python)',
      'Interest in building scalable, elegant products',
      'Graduation date within 12 months of internship end',
    ],
    benefits: ['Competitive compensation', 'Housing stipend', '21 days PTO', 'Relocation support', 'Mentorship program'],
    recruiter: feedPeople.aarav,
  },
  {
    id: 'j2',
    title: 'Frontend Engineer — New Grad',
    company: 'Nimbus Labs',
    location: 'Remote · US',
    type: 'Full-time',
    salary: '$135k–$165k',
    posted: '5 hours ago',
    applicants: 412,
    tags: ['React', 'TypeScript', 'Tailwind', 'Web Performance'],
    logoColor: 'bg-indigo-600',
    about:
      'Nimbus helps 40k developers ship faster dashboards. We obsess over performance and developer experience.',
    description:
      'You will join the web platform team building our core product. Work daily in React + TypeScript, contribute to our design system, and own features from design review to production monitoring. Fast-paced, high ownership, remote-first.',
    responsibilities: [
      'Build accessible, performant UI for a data-dense product',
      'Contribute components to the shared design system',
      'Own performance budgets and bundle-size targets',
      'Pair with designers to refine UX details',
    ],
    requirements: [
      'Graduating 2026 with a CS-related degree or bootcamp + strong portfolio',
      'Comfortable with modern React patterns and TypeScript',
      'Familiarity with CSS architecture and responsive design',
      'Portfolio of projects you are genuinely proud of',
    ],
    benefits: ['Competitive equity', 'Health/dental/vision', 'L&D stipend $2k', 'Home-office budget'],
    recruiter: feedPeople.sofia,
  },
  {
    id: 'j3',
    title: 'Data Analyst Intern',
    company: 'Craftly',
    location: 'Bangalore, IN · On-site',
    type: 'Internship',
    salary: '₹40k/mo',
    posted: '1 day ago',
    applicants: 356,
    tags: ['SQL', 'Python', 'Pandas', 'Tableau'],
    logoColor: 'bg-rose-600',
    about:
      'Craftly is the design collaboration tool used by 2M+ creators. Our analytics team turns raw events into product decisions.',
    description:
      'Work with our data team to instrument product events, build dashboards, and run experiments. You will learn the full analytics stack: warehouses, transformations, and BI tooling.',
    responsibilities: [
      'Write and optimize SQL for dashboards and ad-hoc analyses',
      'Build data models with dbt and maintain documentation',
      'Partner with PMs to define and analyze A/B experiments',
      'Automate recurring reports and alerting',
    ],
    requirements: [
      'Penultimate or final-year student in a quantitative field',
      'Strong SQL and basic Python (pandas) skills',
      'Curiosity about product metrics and experiments',
      'Nice to have: experience with dbt or Looker',
    ],
    benefits: ['Stipend + performance bonus', 'Flexible hours', 'Free lunch', 'Sponsorship for analytics certs'],
    recruiter: feedPeople.sneha,
  },
  {
    id: 'j4',
    title: 'Full Stack Developer — Fresher',
    company: 'Paymatrix',
    location: 'Pune, IN · On-site',
    type: 'Full-time',
    salary: '₹10–₹12 LPA',
    posted: '3 days ago',
    applicants: 893,
    tags: ['Node.js', 'React', 'MongoDB', 'REST'],
    logoColor: 'bg-emerald-600',
    about:
      'Paymatrix modernizes invoicing for 100k+ SMBs in India. We are hiring fresh graduates to grow into senior engineers.',
    description:
      'Join a pod owning a slice of our payments platform. You will ship features across React frontends and Node.js services, with strong mentorship and a clear growth ladder.',
    responsibilities: [
      'Develop and maintain features across the stack',
      'Write REST APIs and integrate third-party services',
      'Write unit tests and participate in code reviews',
      'Respond to production issues with the on-call team',
    ],
    requirements: [
      '2025/2026 graduate in CS/IT or equivalent',
      'Working knowledge of JavaScript and a frontend framework',
      'Basic understanding of databases and REST APIs',
      'Ability to explain tradeoffs behind design choices',
    ],
    benefits: ['ESOPs available', 'Health insurance for family', 'Learning budget', 'Annual hackathons'],
    recruiter: feedPeople.priya,
  },
  {
    id: 'j5',
    title: 'ML Research Intern',
    company: 'Apollo AI',
    location: 'Remote · Global',
    type: 'Internship',
    salary: '$30/hr',
    posted: '6 hours ago',
    applicants: 271,
    tags: ['PyTorch', 'NLP', 'Transformers', 'Evaluation'],
    logoColor: 'bg-violet-600',
    about:
      'Apollo researches open, explainable language models. We value rigor, transparency, and collaboration across time zones.',
    description:
      'You will contribute to an open-source research project: building benchmarks, analyzing model behavior, and implementing training experiments on our GPU cluster alongside researchers.',
    responsibilities: [
      'Implement and evaluate models using PyTorch',
      'Design evaluations and analyze failure modes',
      'Write reproducible experiment pipelines',
      'Document and share findings in public artifacts',
    ],
    requirements: [
      'Comfortable with Python and PyTorch fundamentals',
      'Coursework or projects in ML/NLP',
      'Strong communication and scientific curiosity',
      'Experience with Git and reproducible experiments',
    ],
    benefits: ['Fully remote', 'Compute credits for experiments', 'Optional mentorship hours'],
    recruiter: feedPeople.sneha,
  },
  {
    id: 'j6',
    title: 'Product Design Intern',
    company: 'Fenwick',
    location: 'New York, NY · Hybrid',
    type: 'Internship',
    salary: '$26/hr',
    posted: '4 days ago',
    applicants: 198,
    tags: ['Figma', 'Design Systems', 'UX Research', 'Prototyping'],
    logoColor: 'bg-amber-600',
    about:
      'Fenwick designs B2B analytics software used by finance teams at 2k+ companies worldwide.',
    description:
      'Partner with product designers to ship features end-to-end: from user research and wireframes to polished, accessible design specs and handoff to engineering.',
    responsibilities: [
      'Create user flows, wireframes, and high-fidelity prototypes',
      'Run usability sessions and synthesize findings',
      'Maintain Figma libraries and contribute to the design system',
      'Present design rationale in critique',
    ],
    requirements: [
      'Portfolio demonstrating product design thinking',
      'Proficiency with Figma',
      'Basic familiarity with HTML/CSS (a plus)',
      'Strong written communication',
    ],
    benefits: ['Housing aid', 'Design conference tickets', 'Daily team lunches'],
    recruiter: feedPeople.sofia,
  },
  {
    id: 'j7',
    title: 'Backend Engineer — New Grad',
    company: 'Stackline',
    location: 'Seattle, WA · On-site',
    type: 'Full-time',
    salary: '$125k–$150k',
    posted: '1 week ago',
    applicants: 620,
    tags: ['Go', 'PostgreSQL', 'Kafka', 'gRPC'],
    logoColor: 'bg-cyan-600',
    about:
      'Stackline processes 9B events/day for retail analytics. We hire for potential, not pedigree.',
    description:
      'Join the ingestion team building high-throughput pipelines. You will learn distributed systems fundamentals while shipping real features with heavy mentorship.',
    responsibilities: [
      'Build and optimize data pipelines in Go',
      'Design event schemas and interfaces with Kafka',
      'Investigate performance bottlenecks end-to-end',
      'Write integration tests and contribute to design docs',
    ],
    requirements: [
      'New grad (2026) with strong CS fundamentals',
      'Comfortable in at least one systems language',
      'Understanding of concurrency and distributed ideas',
      'Curiosity and ability to ask great questions',
    ],
    benefits: ['Sign-on bonus', '401k match', 'Unlimited PTO', 'Transit pass'],
    recruiter: feedPeople.aditya,
  },
  {
    id: 'j8',
    title: 'DevRel Intern',
    company: 'Docsly',
    location: 'Remote · EMEA',
    type: 'Internship',
    salary: '€1,800/mo',
    posted: '2 days ago',
    applicants: 145,
    tags: ['Writing', 'APIs', 'Community', 'TypeScript'],
    logoColor: 'bg-teal-600',
    about:
      'Docsly is a dev-first API documentation platform beloved by 30k+ teams. We are built by engineers who love good docs.',
    description:
      'You will create tutorials, live-coding videos, and community programs that make developers successful — and feed insights back into the product roadmap.',
    responsibilities: [
      'Write and maintain API tutorials and quickstarts',
      'Create short-form video guides and code walkthroughs',
      'Support the community Discord and triage feedback',
      'Collaborate with eng on developer experience improvements',
    ],
    requirements: [
      'Comfortable with TypeScript or another mainstream language',
      'Excellent written English and attention to detail',
      'An existing tech blog, video, or social presence is a bonus',
      'Empathy for developers learning new tools',
    ],
    benefits: ['Remote-first', 'Publication budget', 'Conference allowance'],
    recruiter: feedPeople.sofia,
  },
]

export const problems: CodingProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    acceptance: 48.2,
    companies: ['Google', 'Amazon', 'Meta', 'Bloomberg'],
    frequency: 92,
    likes: 41203,
    description:
      'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.\n\nReturn the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    starterCode:
      '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n * Logically implement a function `solution(nums, target)`.\n */\nfunction solution(nums, target) {\n  // your code here\n}',
    solutionSignature: 'function solution(nums, target) {}',
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[1, 5, 9, 10], 10], expected: [2, 3] },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    acceptance: 40.1,
    companies: ['Amazon', 'Google', 'Microsoft', 'Apple'],
    frequency: 88,
    likes: 22140,
    description:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nA string is valid if open brackets are closed by the same type of bracket, in the correct order; and every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([)]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only `()[]{}`.'],
    starterCode:
      '/**\n * @param {string} s\n * @return {boolean}\n * Implement `solution(s)` to return a boolean.\n */\nfunction solution(s) {\n  // your code here\n}',
    solutionSignature: 'function solution(s) {}',
    testCases: [
      { args: ['()'], expected: true },
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: [''], expected: true },
    ],
  },
  {
    id: 'best-time-buy-sell',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Sliding Window',
    acceptance: 52.3,
    companies: ['Amazon', 'Apple', 'Microsoft', 'Facebook'],
    frequency: 76,
    likes: 18777,
    description:
      'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize profit by choosing a single day to buy one stock and choosing a different day in the future to sell it. Return the maximum profit you can achieve, or `0` if no profit is possible.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (1), sell on day 5 (6), profit = 5' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable trade' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode:
      '/**\n * @param {number[]} prices\n * @return {number}\n * Implement `solution(prices)`.\n */\nfunction solution(prices) {\n  // your code here\n}',
    solutionSignature: 'function solution(prices) {}',
    testCases: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[1]], expected: 0 },
      { args: [[2, 4, 1]], expected: 2 },
    ],
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    acceptance: 49.4,
    companies: ['Amazon', 'Google', 'Apple', 'Microsoft'],
    frequency: 84,
    likes: 32105,
    description:
      'Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum 6' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode:
      '/**\n * @param {number[]} nums\n * @return {number}\n * Implement `solution(nums)`.\n */\nfunction solution(nums) {\n  // your code here\n}',
    solutionSignature: 'function solution(nums) {}',
    testCases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1, -2]], expected: -1 },
    ],
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    acceptance: 52.1,
    companies: ['Amazon', 'Google', 'Uber', 'Adobe'],
    frequency: 71,
    likes: 14206,
    description:
      'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode:
      '/**\n * @param {number} n\n * @return {number}\n * Implement `solution(n)`.\n */\nfunction solution(n) {\n  // your code here\n}',
    solutionSignature: 'function solution(n) {}',
    testCases: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [4], expected: 5 },
      { args: [44], expected: 1134903170 },
    ],
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    acceptance: 43.5,
    companies: ['Google', 'Amazon', 'Meta', 'Salesforce'],
    frequency: 68,
    likes: 18842,
    description:
      'Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap, so merge into [1,6]' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] touch and merge' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start <= end <= 10^4'],
    starterCode:
      '/**\n * @param {number[][]} intervals\n * @return {number[][]}\n * Implement `solution(intervals)`.\n */\nfunction solution(intervals) {\n  // your code here\n}',
    solutionSignature: 'function solution(intervals) {}',
    testCases: [
      {
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]],
      },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]] },
    ],
  },
]

export const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'q1',
    prompt:
      "Tell me about yourself and walk me through a project you're most proud of. What problem did it solve, and what was your specific contribution?",
    hint: 'Structure it as: current context → relevant project → impact with numbers → why it excites you.',
    skill: 'Communication',
    type: 'behavioral',
    idealPoints: 100,
  },
  {
    id: 'q2',
    prompt:
      'Given an array of integers, write the logic to find the two numbers that sum to a target value. Talk through your approach and its time/space complexity.',
    hint: 'Mention the brute-force O(n²), then optimize to O(n) with a hash map.',
    skill: 'Data Structures',
    type: 'coding',
    idealPoints: 100,
  },
  {
    id: 'q3',
    prompt:
      'Which of the following data structures gives O(1) average-time lookup of elements by key?',
    options: ['Linked List', 'Hash Map', 'Binary Search Tree', 'Array'],
    correctIndex: 1,
    skill: 'Data Structures',
    type: 'mcq',
    idealPoints: 100,
  },
  {
    id: 'q4',
    prompt:
      'Tell me about a time you had a conflict with a teammate or disagreeing stakeholder. How did you handle it, and what was the outcome?',
    hint: 'Use the STAR method: Situation, Task, Action, Result.',
    skill: 'Collaboration',
    type: 'behavioral',
    idealPoints: 100,
  },
  {
    id: 'q5',
    prompt:
      'If you were to design a URL-shortening service like bit.ly, walk me through how you would structure it. What data would you store, and how would you handle billions of redirects?',
    hint: 'Cover: short-code generation, storage (DB + cache), redirect flow, rate limits, availability.',
    skill: 'System Design',
    type: 'system',
    idealPoints: 100,
  },
  {
    id: 'q6',
    prompt:
      'Describe a challenging bug you debugged. How did you isolate the root cause, and what did you learn that you now apply to every codebase?',
    hint: 'Emphasize process: reproduce → form hypotheses → bisect → verify fix → add regression test.',
    skill: 'Troubleshooting',
    type: 'behavioral',
    idealPoints: 100,
  },
]

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'DSA Patterns Bootcamp',
    tagline: 'Master the 15 patterns that crack 90% of coding interviews',
    description:
      'Stop grinding random problems and start recognizing patterns. This course teaches the 15 foundational patterns — sliding window, two pointers, monotonic stacks, dynamic programming on grids, graph traversals, and more — with visual explanations, annotated code, and spaced-repetition drills.',
    category: 'Interview Prep',
    level: 'Intermediate',
    duration: '18h 30m',
    lessonsCount: 48,
    rating: 4.9,
    students: 48213,
    updatedAt: 'Sep 2026',
    color: 'from-indigo-500 via-violet-500 to-purple-500',
    topics: ['Arrays & Hashing', 'Sliding Window', 'Two Pointers', 'Stacks & Queues', 'Binary Search', 'DP', 'Graphs', 'Heaps'],
    instructor: { name: 'Aarav Sharma', headline: 'SWE @ Google', initials: 'AS', avatarColor: 'bg-sky-500' },
    lessons: [
      { id: 'l1', title: 'Welcome & How to Use Patterns Effectively', duration: '8m', type: 'video', isFree: true },
      { id: 'l2', title: 'Frequency Map Pattern — Two Sum Deep Dive', duration: '22m', type: 'video', isFree: true },
      { id: 'l3', title: 'Sliding Window: Fixed vs Variable Windows', duration: '31m', type: 'video', isFree: false },
      { id: 'l4', title: 'Pattern 1 Drill: 10 Array Problems', duration: '45m', type: 'exercise', isFree: false },
      { id: 'l5', title: 'Two Pointers on Sorted Arrays', duration: '28m', type: 'video', isFree: false },
      { id: 'l6', title: 'The Monotonic Stack Cheat Sheet', duration: '24m', type: 'article', isFree: false },
      { id: 'l7', title: 'Binary Search on the Answer', duration: '35m', type: 'video', isFree: false },
      { id: 'l8', title: 'DP on Strings: LCS & Edit Distance', duration: '42m', type: 'video', isFree: false },
      { id: 'l9', title: 'Graph Traversals: BFS/DFS on Grids', duration: '33m', type: 'video', isFree: false },
      { id: 'l10', title: 'Pattern Quiz #1 (20 questions)', duration: '20m', type: 'quiz', isFree: false },
    ],
  },
  {
    id: 'c2',
    title: 'System Design Interview Prep',
    tagline: 'Design scalable systems with confidence — from whiteboard to interview',
    description:
      'A practical, blueprint-driven approach to system design interviews. Learn how to gather requirements, estimate scale, pick the right building blocks, and communicate tradeoffs. Includes 12 end-to-end design walkthroughs with diagrams and databases options.',
    category: 'Interview Prep',
    level: 'Advanced',
    duration: '12h 15m',
    lessonsCount: 32,
    rating: 4.8,
    students: 31209,
    updatedAt: 'Aug 2026',
    color: 'from-sky-500 via-cyan-500 to-teal-400',
    topics: ['Load Balancers', 'Caching', 'Message Queues', 'Databases', 'CDNs', 'Rate Limiting', 'Microservices'],
    instructor: { name: 'Rohan Mehta', headline: 'SWE Intern @ Stripe', initials: 'RM', avatarColor: 'bg-emerald-500' },
    lessons: [
      { id: 's1', title: 'The 4-Step System Design Framework', duration: '18m', type: 'video', isFree: true },
      { id: 's2', title: 'Capacity Estimation 101', duration: '25m', type: 'video', isFree: true },
      { id: 's3', title: 'Databases: SQL vs NoSQL Deep Dive', duration: '29m', type: 'video', isFree: false },
      { id: 's4', title: 'Caching Strategies That Actually Matter', duration: '21m', type: 'video', isFree: false },
      { id: 's5', title: 'Design: URL Shortener (walkthrough)', duration: '38m', type: 'video', isFree: false },
      { id: 's6', title: 'Design: Twitter Feed & Notifications', duration: '44m', type: 'video', isFree: false },
      { id: 's7', title: 'Message Queues and Event-Driven Design', duration: '27m', type: 'article', isFree: false },
      { id: 's8', title: 'Design: Rate Limiter', duration: '30m', type: 'video', isFree: false },
      { id: 's9', title: 'Design: Distributed Cache', duration: '26m', type: 'video', isFree: false },
      { id: 's10', title: 'Final: 12-Question Mock Design Clinic', duration: '55m', type: 'quiz', isFree: false },
    ],
  },
  {
    id: 'c3',
    title: 'Resume & LinkedIn Optimization',
    tagline: 'Turn your profile into a recruiter magnet in 7 days',
    description:
      'A tactical, no-fluff course on getting interviews. Rewrite your resume with the metric-driven STAR framework, optimize your LinkedIn profile for recruiter search, craft a compelling "About" story, and learn the outreach scripts that get replies.',
    category: 'Career',
    level: 'Beginner',
    duration: '4h 40m',
    lessonsCount: 18,
    rating: 4.7,
    students: 51982,
    updatedAt: 'Jul 2026',
    color: 'from-rose-500 via-pink-500 to-fuchsia-500',
    topics: ['ATS Keywords', 'Resume Bullets', 'LinkedIn SEO', 'Outreach', 'Portfolios'],
    instructor: { name: 'Sofia Reyes', headline: 'Recruiter @ GrowthBee', initials: 'SR', avatarColor: 'bg-teal-500' },
    lessons: [
      { id: 'r1', title: 'Why Recruiters Dismiss Your Resume in 7 Seconds', duration: '12m', type: 'video', isFree: true },
      { id: 'r2', title: 'The Metric-Driven Bullet Formula', duration: '19m', type: 'video', isFree: true },
      { id: 'r3', title: 'Passing ATS: Keyword Mapping Worked Example', duration: '15m', type: 'exercise', isFree: false },
      { id: 'r4', title: 'LinkedIn Headline & About Section Rebuild', duration: '24m', type: 'video', isFree: false },
      { id: 'r5', title: 'Project Descriptions That Prove Impact', duration: '18m', type: 'article', isFree: false },
      { id: 'r6', title: 'Outreach Templates That Get Replies', duration: '16m', type: 'video', isFree: false },
    ],
  },
  {
    id: 'c4',
    title: 'Behavioral Interview Mastery',
    tagline: 'Answer "Tell me about yourself" like you practiced it for weeks',
    description:
      'Practice the STAR method with 40 scenario banks, learn how to frame weaknesses honestly but positively, and compress your story into a memorable 2-minute arc. Includes peer-reviewed answer templates for every common question.',
    category: 'Interview Prep',
    level: 'Beginner',
    duration: '5h 20m',
    lessonsCount: 22,
    rating: 4.8,
    students: 27640,
    updatedAt: 'Jun 2026',
    color: 'from-amber-500 via-orange-500 to-rose-500',
    topics: ['STAR Method', 'Storytelling', 'Leadership', 'Conflict', 'Career Gaps'],
    instructor: { name: 'Priya Patel', headline: 'Founding Engineer @ Scribble', initials: 'PP', avatarColor: 'bg-rose-500' },
    lessons: [
      { id: 'b1', title: 'The 2-Minute Story Arc', duration: '14m', type: 'video', isFree: true },
      { id: 'b2', title: 'STAR Method with Real Examples', duration: '21m', type: 'video', isFree: true },
      { id: 'b3', title: 'Strength & Weakness Framing', duration: '17m', type: 'video', isFree: false },
      { id: 'b4', title: 'Conflict & Disagreement Scenarios', duration: '23m', type: 'video', isFree: false },
      { id: 'b5', title: '40-Question Practice Bank', duration: '90m', type: 'exercise', isFree: false },
    ],
  },
  {
    id: 'c5',
    title: 'Advanced React & Performance',
    tagline: 'Ship fast, accessible React apps and ace the frontend round',
    description:
      'Go from comfortable to elite with React. Master memoization, concurrent rendering, forms, data fetching patterns, and debugging. Every module has a hands-on lab and a performance profiling session.',
    category: 'Engineering',
    level: 'Intermediate',
    duration: '9h 10m',
    lessonsCount: 30,
    rating: 4.9,
    students: 20110,
    updatedAt: 'Sep 2026',
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    topics: ['React Hooks', 'Memoization', 'Rendering', 'Forms', 'Testing', 'Bundle Size'],
    instructor: { name: 'Maya Chen', headline: 'Frontend Engineer @ Vercel', initials: 'MC', avatarColor: 'bg-fuchsia-500' },
    lessons: [
      { id: 'x1', title: 'How React Renders: A Mental Model', duration: '20m', type: 'video', isFree: true },
      { id: 'x2', title: 'useMemo, useCallback & When NOT to Use Them', duration: '26m', type: 'video', isFree: false },
      { id: 'x3', title: 'React 19: Actions, Forms & Server Components', duration: '33m', type: 'video', isFree: false },
      { id: 'x4', title: 'Data Fetching with TanStack Query', duration: '29m', type: 'video', isFree: false },
      { id: 'x5', title: 'Profiling with React DevTools', duration: '18m', type: 'exercise', isFree: false },
      { id: 'x6', title: 'Accessibility Audits for React Apps', duration: '24m', type: 'article', isFree: false },
    ],
  },
  {
    id: 'c6',
    title: 'SQL for Data Interviews',
    tagline: 'From SELECT to window functions — write SQL recruiters love',
    description:
      'A structured path to interview-level SQL: joins, aggregations, subqueries, CTEs, and window functions. Includes 60 graded exercises and realistic analytics interview questions with data-driven walkthroughs.',
    category: 'Engineering',
    level: 'Beginner',
    duration: '6h 50m',
    lessonsCount: 26,
    rating: 4.8,
    students: 34204,
    updatedAt: 'May 2026',
    color: 'from-violet-500 via-purple-500 to-indigo-500',
    topics: ['SELECT', 'Joins', 'Aggregation', 'CTEs', 'Window Functions', 'Indexing'],
    instructor: { name: 'Sneha Iyer', headline: 'MS CS @ Stanford', initials: 'SI', avatarColor: 'bg-violet-500' },
    lessons: [
      { id: 'q1l', title: 'SQL Mental Model: Tables & Sets', duration: '15m', type: 'video', isFree: true },
      { id: 'q2l', title: 'Joins Visualized (INNER, LEFT, FULL)', duration: '28m', type: 'video', isFree: false },
      { id: 'q3l', title: 'Aggregation & GROUP BY Pitfalls', duration: '24m', type: 'video', isFree: false },
      { id: 'q4l', title: 'CTEs and the Classic Funnel Query', duration: '22m', type: 'video', isFree: false },
      { id: 'q5l', title: 'Window Functions: RANK, LAG, Running Totals', duration: '35m', type: 'video', isFree: false },
      { id: 'q6l', title: '60-Question SQL Drill', duration: '120m', type: 'exercise', isFree: false },
    ],
  },
]

export const interviewRoles = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer', 'Data Analyst', 'SDE Intern']
export const interviewLevels = ['Intern', 'New Grad', 'Junior', 'Mid-level']