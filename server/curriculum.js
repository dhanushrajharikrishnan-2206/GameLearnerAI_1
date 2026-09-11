/**
 * GameLearn AI Curriculum & Adaptive Course Data
 * Serves backend REST endpoints for worlds, quizzes, skills, achievements, and recommendations.
 */

export const curriculumSubjects = [
  {
    id: 'subj_py',
    slug: 'python',
    name: 'Programming (Python)',
    description: 'Master core programming constructs, object-oriented design, and algorithmic thinking.',
    icon: 'Code',
    color: '#6366f1',
    masteryPercentage: 84,
    completedLessons: 18,
    totalLessons: 24,
    isAiRecommended: true,
    difficulty: 'Medium',
    tags: ['Core', 'Backend', 'Data Science']
  },
  {
    id: 'subj_algo',
    slug: 'algorithms',
    name: 'Algorithms & Complexity',
    description: 'Conquer graph traversals, dynamic programming, backtracking, and algorithmic optimization.',
    icon: 'Cpu',
    color: '#3b82f6',
    masteryPercentage: 72,
    completedLessons: 12,
    totalLessons: 20,
    isAiRecommended: true,
    difficulty: 'Hard',
    tags: ['Competitive', 'Optimization']
  },
  {
    id: 'subj_ds',
    slug: 'data-structures',
    name: 'Data Structures',
    description: 'Trees, heaps, hash tables, graphs, and memory models made visual and intuitive.',
    icon: 'Layers',
    color: '#06b6d4',
    masteryPercentage: 80,
    completedLessons: 15,
    totalLessons: 18,
    isAiRecommended: false,
    difficulty: 'Medium',
    tags: ['Fundamentals', 'Tech Interviews']
  },
  {
    id: 'subj_ai',
    slug: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Neural networks, prompt engineering, gradient descent, and autonomous agents.',
    icon: 'Sparkles',
    color: '#8b5cf6',
    masteryPercentage: 65,
    completedLessons: 8,
    totalLessons: 16,
    isAiRecommended: true,
    difficulty: 'Hard',
    tags: ['Next-Gen', 'Deep Learning']
  },
  {
    id: 'subj_math',
    slug: 'mathematics',
    name: 'Discrete Math & Logic',
    description: 'Set theory, combinatorics, modular arithmetic, and proof methods for computer science.',
    icon: 'Binary',
    color: '#10b981',
    masteryPercentage: 76,
    completedLessons: 14,
    totalLessons: 20,
    isAiRecommended: false,
    difficulty: 'Medium',
    tags: ['Foundation', 'Math']
  },
  {
    id: 'subj_db',
    slug: 'database',
    name: 'Database Architecture & SQL',
    description: 'Relational indexing, query optimization, NoSQL models, and ACID transactions.',
    icon: 'Database',
    color: '#f59e0b',
    masteryPercentage: 88,
    completedLessons: 14,
    totalLessons: 15,
    isAiRecommended: false,
    difficulty: 'Easy',
    tags: ['Backend', 'Storage']
  },
  {
    id: 'subj_apt',
    slug: 'aptitude',
    name: 'Logical Aptitude & Problem Solving',
    description: 'Pattern recognition, deduction, quantitative aptitude, and speed reasoning tests.',
    icon: 'BrainCircuit',
    color: '#ec4899',
    masteryPercentage: 82,
    completedLessons: 10,
    totalLessons: 12,
    isAiRecommended: false,
    difficulty: 'Easy',
    tags: ['Reasoning', 'Placement']
  },
  {
    id: 'subj_sci',
    slug: 'computer-science',
    name: 'Computer Systems & OS',
    description: 'Concurrency, virtual memory, cache coherence, CPU scheduling, and Unix fundamentals.',
    icon: 'Terminal',
    color: '#14b8a6',
    masteryPercentage: 60,
    completedLessons: 6,
    totalLessons: 14,
    isAiRecommended: false,
    difficulty: 'Medium',
    tags: ['Low-Level', 'Architecture']
  }
];

export const curriculumWorlds = [
  {
    id: 'world_foundations',
    title: 'World 1: Foundations',
    subtitle: 'The Syntax Caverns',
    description: 'Master core primitives, control flow, memory model, and algorithmic conditionals.',
    levelRange: 'Levels 1 - 4',
    order: 1,
    isUnlocked: true,
    nodes: [
      {
        id: 'node_start',
        title: 'Start: Hello World & Types',
        subjectSlug: 'python',
        worldId: 'world_foundations',
        order: 1,
        status: 'mastered',
        estimatedTime: '10 min',
        xpReward: 100,
        difficulty: 'Easy',
        description: 'Set up your mental model, variable bindings, and dynamic typings in Python.',
        lessonId: 'lesson_py_intro',
        quizId: 'quiz_py_intro'
      },
      {
        id: 'node_variables',
        title: 'Variables & Memory Models',
        subjectSlug: 'python',
        worldId: 'world_foundations',
        order: 2,
        status: 'mastered',
        estimatedTime: '15 min',
        xpReward: 120,
        difficulty: 'Easy',
        description: 'Understand pass-by-object-reference, mutable vs immutable bindings.',
        lessonId: 'lesson_py_vars',
        quizId: 'quiz_py_vars'
      },
      {
        id: 'node_conditions',
        title: 'Conditionals & Boolean Logic',
        subjectSlug: 'python',
        worldId: 'world_foundations',
        order: 3,
        status: 'completed',
        estimatedTime: '15 min',
        xpReward: 150,
        difficulty: 'Easy',
        description: 'Short-circuit evaluations, nested branches, and truthy/falsy nuances.',
        lessonId: 'lesson_py_cond',
        quizId: 'quiz_py_cond'
      }
    ]
  },
  {
    id: 'world_intermediate',
    title: 'World 2: Intermediate',
    subtitle: 'The Loop Realm & Functional Groves',
    description: 'Transform procedural routines into modular, reusable, high-performance blocks.',
    levelRange: 'Levels 5 - 8',
    order: 2,
    isUnlocked: true,
    nodes: [
      {
        id: 'node_loops',
        title: 'Loops & Iterators',
        subjectSlug: 'python',
        worldId: 'world_intermediate',
        order: 4,
        status: 'completed',
        estimatedTime: '20 min',
        xpReward: 180,
        difficulty: 'Medium',
        description: 'For-else constructs, zip, enumerate, and iterator protocols.',
        lessonId: 'lesson_py_loops',
        quizId: 'quiz_py_loops'
      },
      {
        id: 'node_functions',
        title: 'Python Fundamentals — Functions',
        subjectSlug: 'python',
        worldId: 'world_intermediate',
        order: 5,
        status: 'current',
        estimatedTime: '25 min',
        xpReward: 250,
        difficulty: 'Medium',
        description: 'First-class citizens, lambda closures, decorators, *args, and **kwargs.',
        lessonId: 'lesson_py_functions',
        quizId: 'quiz_py_functions'
      },
      {
        id: 'node_data_structs',
        title: 'Built-in Data Structures',
        subjectSlug: 'python',
        worldId: 'world_intermediate',
        order: 6,
        status: 'available',
        estimatedTime: '30 min',
        xpReward: 280,
        difficulty: 'Medium',
        description: 'Lists, tuples, sets, dicts, hash collision avoidance, and comprehensions.',
        lessonId: 'lesson_py_structures',
        quizId: 'quiz_py_structures'
      }
    ]
  },
  {
    id: 'world_advanced',
    title: 'World 3: Advanced',
    subtitle: 'The Architectural Summit',
    description: 'Harness metaclasses, generator pipelines, asynchronous concurrency, and clean architecture.',
    levelRange: 'Levels 9 - 13',
    order: 3,
    isUnlocked: true,
    nodes: [
      {
        id: 'node_oop',
        title: 'OOP & Dunder Magic',
        subjectSlug: 'python',
        worldId: 'world_advanced',
        order: 7,
        status: 'available',
        estimatedTime: '35 min',
        xpReward: 350,
        difficulty: 'Hard',
        description: 'Polymorphism, slots, __repr__, operator overloading, and mixin patterns.',
        lessonId: 'lesson_py_oop',
        quizId: 'quiz_py_oop'
      },
      {
        id: 'node_recursion',
        title: 'Call Stack & Recursion',
        subjectSlug: 'python',
        worldId: 'world_advanced',
        order: 8,
        status: 'available',
        estimatedTime: '40 min',
        xpReward: 400,
        difficulty: 'Hard',
        description: 'Divide-and-conquer, tail call optimizations, recursion trees, and memoization.',
        lessonId: 'lesson_py_recursion',
        quizId: 'quiz_py_recursion'
      },
      {
        id: 'node_async',
        title: 'AsyncIO & Concurrency',
        subjectSlug: 'python',
        worldId: 'world_advanced',
        order: 9,
        status: 'locked',
        estimatedTime: '45 min',
        xpReward: 500,
        difficulty: 'Hard',
        description: 'Event loops, coroutines, thread pools, and non-blocking I/O multiplexing.',
        lessonId: 'lesson_py_async',
        quizId: 'quiz_py_async'
      }
    ]
  },
  {
    id: 'world_boss',
    title: 'World 4: Boss Citadel',
    subtitle: 'The Algorithmic Colosseum',
    description: 'Prove your comprehensive mastery in timed code refactoring under simulated interview pressure.',
    levelRange: 'Level 14+',
    order: 4,
    isUnlocked: false,
    nodes: [
      {
        id: 'node_boss_battle',
        title: 'Grand Architect Trial',
        subjectSlug: 'python',
        worldId: 'world_boss',
        order: 10,
        status: 'locked',
        estimatedTime: '60 min',
        xpReward: 1000,
        difficulty: 'Hard',
        description: 'Multi-stage live code optimization, debugging edge-cases, and asymptotic proofs.',
        lessonId: 'lesson_py_boss',
        quizId: 'quiz_py_boss'
      }
    ]
  }
];

export const adaptiveQuizData = {
  id: 'quiz_py_functions',
  title: 'Adaptive Challenge: Functions, Scope & Recursion',
  subject: 'Programming (Python)',
  subjectSlug: 'python',
  estimatedMinutes: 8,
  baseXp: 350,
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      difficulty: 'Medium',
      topic: 'Functions & Default Arguments',
      question: 'What is the output of the following Python snippet?',
      codeLanguage: 'python',
      codeSnippet: `def calc_bonus(xp, bonus=50):
    return xp + bonus

print(calc_bonus(100, 100))`,
      options: ['150', '200', '100', 'TypeError: bonus already defined'],
      correctAnswer: 1,
      explanation: 'When passing 100 as the second argument, it overrides the default argument bonus=50, so 100 + 100 evaluates to 200.',
      hint: 'The provided argument replaces the default parameter value.',
      xpValue: 40
    },
    {
      id: 'q2',
      type: 'code_analysis',
      difficulty: 'Medium',
      topic: 'Variable Arguments (*args)',
      question: 'What data structure is args inside the function def log_stats(*args):?',
      codeLanguage: 'python',
      codeSnippet: `def log_stats(*args):
    # What is type(args)?
    return type(args).__name__`,
      options: ['list', 'tuple', 'dict', 'set'],
      correctAnswer: 1,
      explanation: 'Positional variable arguments captured with the single asterisk * are gathered into an immutable tuple.',
      hint: 'Think about whether Python allows mutating the captured parameter pack directly.',
      xpValue: 45
    },
    {
      id: 'q3',
      type: 'multiple_choice',
      difficulty: 'Hard',
      topic: 'Closures & Scopes (LEGB Rule)',
      question: 'What will this Python closure output when executed?',
      codeLanguage: 'python',
      codeSnippet: `def multiplier(factor):
    def multiply(n):
        return n * factor
    return multiply

double = multiplier(2)
triple = multiplier(3)
print(double(triple(4)))`,
      options: ['12', '24', '18', 'TypeError: closure inaccessible'],
      correctAnswer: 1,
      explanation: 'triple(4) evaluates to 4 * 3 = 12. Then double(12) evaluates to 12 * 2 = 24. Each inner function retains its enclosed factor environment in its __closure__.',
      hint: 'Evaluate the inner function call first, then feed its return value into the outer closure.',
      xpValue: 65
    },
    {
      id: 'q4',
      type: 'code_analysis',
      difficulty: 'Hard',
      topic: 'Recursion Call Stack',
      question: 'Consider this recursive countdown function. What is the exact maximum depth of the call stack for countdown(3)?',
      codeLanguage: 'python',
      codeSnippet: `def countdown(n):
    if n <= 0:
        return "Liftoff!"
    return countdown(n - 1)`,
      options: ['3 stack frames', '4 stack frames', '1 stack frame', 'Infinite loop'],
      correctAnswer: 1,
      explanation: 'Calls are made for n=3, n=2, n=1, and finally the base case n=0. At the moment n=0 is reached, all 4 activation frames exist on the call stack simultaneously.',
      hint: 'Count each invocation starting from n=3 down to the terminating base case n=0.',
      xpValue: 70
    },
    {
      id: 'q5',
      type: 'multiple_choice',
      difficulty: 'Hard',
      topic: 'Higher-Order Functions & Lambda',
      question: 'What does list(map(lambda x: x * 2, filter(lambda x: x % 2 != 0, [1, 2, 3, 4, 5]))) return?',
      codeLanguage: 'python',
      codeSnippet: `numbers = [1, 2, 3, 4, 5]
result = list(map(lambda x: x * 2, filter(lambda x: x % 2 != 0, numbers)))`,
      options: ['[2, 6, 10]', '[2, 4, 6, 8, 10]', '[4, 8]', '[1, 3, 5]'],
      correctAnswer: 0,
      explanation: 'The filter retains only odd numbers: [1, 3, 5]. Then map doubles each remaining value, producing [2, 6, 10].',
      hint: 'The filter runs first on the input list, and only matching elements are passed into the map transformation.',
      xpValue: 75
    }
  ]
};

export const curriculumSkillNodes = [
  {
    id: 'sk_py_basics',
    name: 'Python Primitives',
    category: 'Programming',
    level: 3,
    masteryPercentage: 98,
    xp: 600,
    prerequisites: [],
    isUnlocked: true,
    isMastered: true,
    totalChallenges: 10,
    completedChallenges: 10,
    icon: 'Terminal'
  },
  {
    id: 'sk_py_loops',
    name: 'Iteration & Control',
    category: 'Programming',
    level: 3,
    masteryPercentage: 92,
    xp: 750,
    prerequisites: ['sk_py_basics'],
    isUnlocked: true,
    isMastered: true,
    totalChallenges: 12,
    completedChallenges: 12,
    icon: 'Repeat'
  },
  {
    id: 'sk_py_func',
    name: 'Functions & Closures',
    category: 'Programming',
    level: 2,
    masteryPercentage: 84,
    xp: 850,
    prerequisites: ['sk_py_loops'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 15,
    completedChallenges: 13,
    icon: 'Code'
  },
  {
    id: 'sk_py_oop',
    name: 'OOP & Dunder Magic',
    category: 'Programming',
    level: 1,
    masteryPercentage: 55,
    xp: 400,
    prerequisites: ['sk_py_func'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 12,
    completedChallenges: 6,
    icon: 'Box'
  },
  {
    id: 'sk_ds_arrays',
    name: 'Dynamic Arrays & Strings',
    category: 'Data Structures',
    level: 3,
    masteryPercentage: 95,
    xp: 800,
    prerequisites: [],
    isUnlocked: true,
    isMastered: true,
    totalChallenges: 14,
    completedChallenges: 14,
    icon: 'Layers'
  },
  {
    id: 'sk_ds_linked',
    name: 'Pointers & Linked Lists',
    category: 'Data Structures',
    level: 2,
    masteryPercentage: 82,
    xp: 720,
    prerequisites: ['sk_ds_arrays'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 12,
    completedChallenges: 10,
    icon: 'Layers'
  },
  {
    id: 'sk_ds_stacks',
    name: 'Stacks & Monotonic Queues',
    category: 'Data Structures',
    level: 2,
    masteryPercentage: 80,
    xp: 700,
    prerequisites: ['sk_ds_linked'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 10,
    completedChallenges: 8,
    icon: 'Layers'
  },
  {
    id: 'sk_algo_search',
    name: 'Binary Search & Bounds',
    category: 'Algorithms',
    level: 3,
    masteryPercentage: 96,
    xp: 950,
    prerequisites: ['sk_ds_arrays'],
    isUnlocked: true,
    isMastered: true,
    totalChallenges: 16,
    completedChallenges: 16,
    icon: 'Cpu'
  },
  {
    id: 'sk_algo_recursion',
    name: 'Divide & Conquer Trees',
    category: 'Algorithms',
    level: 2,
    masteryPercentage: 74,
    xp: 820,
    prerequisites: ['sk_py_func'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 14,
    completedChallenges: 9,
    icon: 'RotateCcw'
  },
  {
    id: 'sk_algo_dp',
    name: 'Dynamic Programming (1D/2D)',
    category: 'Algorithms',
    level: 1,
    masteryPercentage: 45,
    xp: 500,
    prerequisites: ['sk_algo_recursion'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 18,
    completedChallenges: 7,
    icon: 'Cpu'
  },
  {
    id: 'sk_ai_search',
    name: 'A* & Heuristic Search',
    category: 'AI & Machine Learning',
    level: 2,
    masteryPercentage: 70,
    xp: 680,
    prerequisites: ['sk_algo_search'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 10,
    completedChallenges: 7,
    icon: 'Sparkles'
  },
  {
    id: 'sk_ai_nn',
    name: 'Perceptrons & Backprop',
    category: 'AI & Machine Learning',
    level: 1,
    masteryPercentage: 35,
    xp: 320,
    prerequisites: ['sk_ai_search'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 12,
    completedChallenges: 4,
    icon: 'Sparkles'
  }
];

export const curriculumAchievements = [
  {
    id: 'ach_first_mission',
    title: 'First Mission',
    description: 'Completed your very first learning quest on GameLearn AI.',
    icon: 'Trophy',
    category: 'learning',
    unlocked: true,
    unlockedAt: 'Jan 15, 2026',
    progress: 1,
    maxProgress: 1,
    rarity: 'Common',
    xpReward: 100
  },
  {
    id: 'ach_7_streak',
    title: '7 Day Streak',
    description: 'Maintained unbroken consistency for 7 consecutive days.',
    icon: 'Flame',
    category: 'streak',
    unlocked: true,
    unlockedAt: 'Jan 22, 2026',
    progress: 7,
    maxProgress: 7,
    rarity: 'Rare',
    xpReward: 250
  },
  {
    id: 'ach_speed_learner',
    title: 'Speed Learner',
    description: 'Answered 5 adaptive questions under 15 seconds each with 100% accuracy.',
    icon: 'Zap',
    category: 'accuracy',
    unlocked: true,
    unlockedAt: 'Feb 02, 2026',
    progress: 5,
    maxProgress: 5,
    rarity: 'Epic',
    xpReward: 400
  },
  {
    id: 'ach_problem_solver',
    title: 'Problem Solver',
    description: 'Solved over 100 coding and algorithmic interactive challenges.',
    icon: 'Brain',
    category: 'mastery',
    unlocked: true,
    unlockedAt: 'Feb 18, 2026',
    progress: 100,
    maxProgress: 100,
    rarity: 'Epic',
    xpReward: 500
  },
  {
    id: 'ach_adaptive_titan',
    title: 'Adaptive Titan',
    description: 'Defeated a dynamically generated Hard-difficulty challenge streak.',
    icon: 'Sparkles',
    category: 'mastery',
    unlocked: true,
    unlockedAt: 'Mar 01, 2026',
    progress: 1,
    maxProgress: 1,
    rarity: 'Legendary',
    xpReward: 600
  },
  {
    id: 'ach_recursion_sage',
    title: 'Recursion Sage',
    description: 'Visualized 20 activation call stacks with zero maximum depth overflows.',
    icon: 'RotateCcw',
    category: 'learning',
    unlocked: false,
    progress: 14,
    maxProgress: 20,
    rarity: 'Epic',
    xpReward: 450
  },
  {
    id: 'ach_algorithm_alchemist',
    title: 'Algorithm Alchemist',
    description: 'Achieve overall platform mastery greater than 75% across all core tracks.',
    icon: 'Cpu',
    category: 'mastery',
    unlocked: true,
    unlockedAt: 'Mar 05, 2026',
    progress: 78,
    maxProgress: 75,
    rarity: 'Legendary',
    xpReward: 800
  },
  {
    id: 'ach_top_rank',
    title: 'Top 10 Worldwide',
    description: 'Climb into the single-digit ranks on the global leaderboard.',
    icon: 'Award',
    category: 'social',
    unlocked: true,
    unlockedAt: 'Mar 08, 2026',
    progress: 4,
    maxProgress: 10,
    rarity: 'Legendary',
    xpReward: 750
  }
];

export const curriculumRecommendations = [
  {
    id: 'rec_recursion',
    topic: 'Practice Recursion & Call Stacks',
    subject: 'Algorithms & Complexity',
    priority: 'High Priority',
    difficulty: 'Medium',
    expectedTime: '15 min',
    rewardXp: 300,
    reason: 'Your recent accuracy in recursion dropped by 12% compared to linear data structures. A targeted medium-difficulty drill will solidify your call-stack intuition.',
    actionUrl: '/quiz/quiz_py_functions',
    icon: 'RotateCcw'
  },
  {
    id: 'rec_dynamic_programming',
    topic: 'Dynamic Programming Patterns',
    subject: 'Algorithms & Complexity',
    priority: 'High Priority',
    difficulty: 'Hard',
    expectedTime: '25 min',
    rewardXp: 450,
    reason: 'You have mastered recursion trees and memoization theory. You are ready to unlock 1D and 2D tabulation techniques.',
    actionUrl: '/learn',
    icon: 'Cpu'
  },
  {
    id: 'rec_sql_joins',
    topic: 'SQL Query Optimization & Subqueries',
    subject: 'Database Architecture & SQL',
    priority: 'Recommended',
    difficulty: 'Medium',
    expectedTime: '20 min',
    rewardXp: 280,
    reason: 'Reinforce your database mastery with advanced JOIN permutations, index analysis, and execution plan profiling.',
    actionUrl: '/learn',
    icon: 'Database'
  },
  {
    id: 'rec_tree_traversals',
    topic: 'Binary Tree In-Order & Post-Order DFS',
    subject: 'Data Structures',
    priority: 'Recommended',
    difficulty: 'Medium',
    expectedTime: '18 min',
    rewardXp: 320,
    reason: 'Excellent array performance! Bridging array manipulation to hierarchical tree node pointers is your optimal next step.',
    actionUrl: '/skill-tree',
    icon: 'Layers'
  },
  {
    id: 'rec_async_paradigms',
    topic: 'Python AsyncIO Event Loop',
    subject: 'Programming (Python)',
    priority: 'Optional',
    difficulty: 'Hard',
    expectedTime: '30 min',
    rewardXp: 500,
    reason: 'Level 14 unlocked! Learn to write production-grade concurrent network clients and task gathers.',
    actionUrl: '/learn',
    icon: 'Code'
  }
];

export const curriculumDiagnostics = {
  strengths: [
    {
      topic: 'Binary Search & Divide/Conquer',
      score: 96,
      trend: '+8% this week',
      summary: 'Exceptional bounds handling, zero off-by-one errors on rotated array lookups.'
    },
    {
      topic: 'Built-in Python Collections',
      score: 94,
      trend: '+5% this week',
      summary: 'Optimal choice of set/dict hash-tables with O(1) amortized access time.'
    },
    {
      topic: 'SQL Filtering & Aggregations',
      score: 90,
      trend: '+12% this week',
      summary: 'Flawless usage of GROUP BY, HAVING, and indexing optimization constraints.'
    }
  ],
  weaknesses: [
    {
      topic: 'Recursive Call Stack Visualization',
      score: 62,
      trend: '-6% this week',
      summary: 'Occasionally miscalculates maximum stack frame depth during multi-branch recursion.',
      recommendation: 'Complete the interactive Call Stack Tracer drill in World 3.'
    },
    {
      topic: '2D Dynamic Programming Tabulation',
      score: 54,
      trend: 'New topic',
      summary: 'Transitions from top-down memoization to bottom-up state tables need reinforcement.',
      recommendation: 'Work through the 5-step grid memoization progression.'
    },
    {
      topic: 'Graph Backtracking Time Complexity',
      score: 68,
      trend: '+2% this week',
      summary: 'Asymptotic analysis of permutation branches with visited pruning.',
      recommendation: 'Explore graph coloring and visited set optimizations.'
    }
  ]
};
