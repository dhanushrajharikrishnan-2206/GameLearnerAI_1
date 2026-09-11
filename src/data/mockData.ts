import {
  User,
  Subject,
  AdventureWorld,
  Lesson,
  Quiz,
  Mission,
  Achievement,
  LeaderboardEntry,
  AIRecommendation,
  StrengthsWeaknesses,
  AnalyticsSummary,
  AppNotification,
  SkillNode
} from '../types';

export const mockUser: User = {
  id: 'usr_kishore_01',
  name: 'Kishore Kumar',
  email: 'kishore@gamelearn.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  title: 'Algorithm Alchemist',
  role: 'student',
  level: 12,
  xp: 8420,
  xpToNextLevel: 10000,
  streak: 14,
  longestStreak: 21,
  coins: 1450,
  overallMastery: 78,
  learningTimeMinutes: 2840,
  joinedDate: 'Jan 2026',
  learningGoal: 'Skill Development & Competitive Learning',
  dailyGoalMinutes: 30,
  interests: ['Programming', 'Algorithms', 'AI & Machine Learning', 'Data Science'],
  skillLevel: 'Intermediate'
};

export const mockSubjects: Subject[] = [
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

export const mockAdventureWorlds: AdventureWorld[] = [
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
        status: 'current', // CURRENT NODE PULSATING
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
        estimatedTime: '25 min',
        xpReward: 220,
        difficulty: 'Medium',
        description: 'List comprehensions, dict lookups under O(1), and sets mathematical operations.',
        lessonId: 'lesson_py_datastructs',
        quizId: 'quiz_py_datastructs'
      }
    ]
  },
  {
    id: 'world_advanced',
    title: 'World 3: Advanced',
    subtitle: 'The Tower of Object Oriented Design & Recursion',
    description: 'Enter the recursive depths and design scalable software architectures.',
    levelRange: 'Levels 9 - 13',
    order: 3,
    isUnlocked: true,
    nodes: [
      {
        id: 'node_oop',
        title: 'Object-Oriented Programming',
        subjectSlug: 'python',
        worldId: 'world_advanced',
        order: 7,
        status: 'available',
        estimatedTime: '30 min',
        xpReward: 280,
        difficulty: 'Medium',
        description: 'Encapsulation, inheritance, dunder methods, and polymorphism patterns.',
        lessonId: 'lesson_py_oop',
        quizId: 'quiz_py_oop'
      },
      {
        id: 'node_recursion',
        title: 'Recursive Patterns & Call Stacks',
        subjectSlug: 'python',
        worldId: 'world_advanced',
        order: 8,
        status: 'available',
        estimatedTime: '30 min',
        xpReward: 350,
        difficulty: 'Hard',
        description: 'Base cases, stack overflows, divide-and-conquer, and tree explorations.',
        lessonId: 'lesson_py_recursion',
        quizId: 'quiz_py_recursion'
      }
    ]
  },
  {
    id: 'world_mastery',
    title: 'World 4: Mastery',
    subtitle: 'The Citadel of Dynamic Programming',
    description: 'Solve the hardest computer science challenges using optimal substructure and memoization.',
    levelRange: 'Levels 14 - 20',
    order: 4,
    isUnlocked: false,
    nodes: [
      {
        id: 'node_dp',
        title: 'Dynamic Programming: Memoization & Tabulation',
        subjectSlug: 'python',
        worldId: 'world_mastery',
        order: 9,
        status: 'locked',
        estimatedTime: '45 min',
        xpReward: 500,
        difficulty: 'Hard',
        description: 'Overlapping subproblems, state transitions, and 2D DP matrices.',
        lessonId: 'lesson_py_dp',
        quizId: 'quiz_py_dp'
      }
    ]
  }
];

export const mockLesson: Lesson = {
  id: 'lesson_py_functions',
  title: 'Python Fundamentals — Functions & Scope',
  subject: 'Programming (Python)',
  subjectSlug: 'python',
  worldTitle: 'World 2: Intermediate',
  estimatedMinutes: 20,
  xpReward: 250,
  difficulty: 'Medium',
  overview: 'In Python, functions are first-class citizens. You can pass them as arguments, return them from other functions, and assign them to variables.',
  associatedQuizId: 'quiz_py_functions',
  nextLessonId: 'lesson_py_datastructs',
  prevLessonId: 'lesson_py_loops',
  blocks: [
    {
      id: 'b1',
      type: 'text',
      title: 'First-Class Functions in Python',
      content: 'Unlike in lower-level procedural languages where functions are just memory addresses for instruction jumps, in Python every function is an instance of the `function` object type. This unlocks powerful paradigms like decorators, callbacks, and functional composition.'
    },
    {
      id: 'b2',
      type: 'code',
      title: 'Defining and Passing Functions',
      codeLanguage: 'python',
      codeSnippet: `def apply_bonus(xp: int, multiplier: float = 1.5) -> int:
    """Calculates boosted XP after adaptive multiplier."""
    return int(xp * multiplier)

# Functions can be assigned to variables or passed around!
gamify = apply_bonus
print(gamify(100, 2.0))  # Output: 200`,
      content: 'Notice how the function `apply_bonus` can be aliased directly to `gamify` without calling it immediately. Default argument values are evaluated once when the module loads.'
    },
    {
      id: 'b3',
      type: 'callout',
      calloutType: 'tip',
      title: 'AI Coach Tip: Beware Mutable Default Arguments',
      content: 'Never use mutable collections like `def append_item(item, target_list=[])`. Python creates the default list once, causing subsequent calls to share the exact same list across different invocations! Always use `target_list=None` and initialize inside.'
    },
    {
      id: 'b4',
      type: 'code',
      title: 'Variable Positional and Keyword Arguments (*args, **kwargs)',
      codeLanguage: 'python',
      codeSnippet: `def award_achievements(player_name: str, *badges, **metadata):
    print(f"Player: {player_name}")
    print(f"Badges Unlocked: {', '.join(badges)}")
    for key, value in metadata.items():
        print(f" - {key}: {value}")

award_achievements("Kishore", "Speedster", "7-Day Streak", level=12, streak=14)`,
      content: 'The `*badges` packs arbitrary positional arguments into a tuple, while `**metadata` packs named keyword arguments into a Python dictionary.'
    },
    {
      id: 'b5',
      type: 'checkpoint',
      title: 'Quick Mini-Challenge Checkpoint',
      content: 'Test your understanding before the adaptive quiz.',
      checkpointQuestion: {
        question: 'What is the return type of a Python function that does not contain an explicit `return` statement?',
        options: ['void', 'None', '0', 'undefined'],
        correctIndex: 1,
        explanation: 'In Python, all functions implicitly return the singleton object `None` if execution reaches the end without hitting a return keyword.'
      }
    }
  ]
};

// Adaptive Quiz Dataset with dynamic difficulty progression
export const mockAdaptiveQuiz: Quiz = {
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
      explanation: 'When passing 100 as the second argument, it overrides the default argument `bonus=50`, so 100 + 100 evaluates to 200.',
      hint: 'The provided argument replaces the default parameter value.',
      xpValue: 40
    },
    {
      id: 'q2',
      type: 'code_analysis',
      difficulty: 'Medium',
      topic: 'Variable Arguments (*args)',
      question: 'What data structure is `args` inside the function `def log_stats(*args):`?',
      codeLanguage: 'python',
      codeSnippet: `def log_stats(*args):
    # What is type(args)?
    return type(args).__name__`,
      options: ['list', 'tuple', 'dict', 'set'],
      correctAnswer: 1,
      explanation: 'Positional variable arguments captured with the single asterisk `*` are gathered into an immutable tuple.',
      hint: 'Think about whether Python allows mutating the captured parameter pack directly.',
      xpValue: 45
    },
    {
      id: 'q3',
      type: 'multiple_choice',
      difficulty: 'Hard', // Triggered when learner answers Q1 & Q2 correctly!
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
      explanation: '`triple(4)` evaluates to 4 * 3 = 12. Then `double(12)` evaluates to 12 * 2 = 24. Each inner function retains its enclosed `factor` environment in its `__closure__`.',
      hint: 'Evaluate the inner function call first, then feed its return value into the outer closure.',
      xpValue: 65
    },
    {
      id: 'q4',
      type: 'code_analysis',
      difficulty: 'Hard',
      topic: 'Recursion Call Stack',
      question: 'Consider this recursive countdown function. What is the exact maximum depth of the call stack for `countdown(3)`?',
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
      question: 'What does `list(map(lambda x: x * 2, filter(lambda x: x % 2 != 0, [1, 2, 3, 4, 5])))` return?',
      codeLanguage: 'python',
      codeSnippet: `numbers = [1, 2, 3, 4, 5]
result = list(map(lambda x: x * 2, filter(lambda x: x % 2 != 0, numbers)))`,
      options: ['[2, 6, 10]', '[2, 4, 6, 8, 10]', '[4, 8]', '[1, 3, 5]'],
      correctAnswer: 0,
      explanation: 'The `filter` retains only odd numbers: [1, 3, 5]. Then `map` doubles each remaining value, producing [2, 6, 10].',
      hint: 'The filter runs first on the input list, and only matching elements are passed into the map transformation.',
      xpValue: 75
    }
  ]
};

export const mockMissions: Mission[] = [
  {
    id: 'm1',
    title: 'Complete Python Variables',
    description: 'Finish the memory model and mutability exploration in Foundations.',
    category: 'Daily Quest',
    icon: 'Code',
    currentProgress: 1,
    maxProgress: 1,
    rewardXp: 120,
    rewardCoins: 50,
    isCompleted: true,
    actionUrl: '/learn'
  },
  {
    id: 'm2',
    title: 'Score 80% in Algorithms Quiz',
    description: 'Demonstrate algorithmic precision in the sorting and complexity assessment.',
    category: 'Mastery Mission',
    icon: 'Target',
    currentProgress: 75,
    maxProgress: 80,
    rewardXp: 200,
    rewardCoins: 100,
    isCompleted: false,
    actionUrl: '/quiz/quiz_py_functions'
  },
  {
    id: 'm3',
    title: 'Maintain your 14-day Streak',
    description: 'Log in and solve at least one learning checkpoint today.',
    category: 'Streak Protector',
    icon: 'Flame',
    currentProgress: 14,
    maxProgress: 14,
    rewardXp: 150,
    rewardCoins: 75,
    isCompleted: true,
    actionUrl: '/dashboard'
  },
  {
    id: 'm4',
    title: "Complete Today's AI Challenge",
    description: 'Solve the AI-recommended Recursion practice challenge.',
    category: 'AI Adaptive Quest',
    icon: 'Sparkles',
    currentProgress: 0,
    maxProgress: 1,
    rewardXp: 250,
    rewardCoins: 120,
    isCompleted: false,
    actionUrl: '/quiz/quiz_py_functions'
  }
];

export const mockAchievements: Achievement[] = [
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
    id: 'ach_90_accuracy',
    title: '90% Accuracy',
    description: 'Maintained an overall average accuracy above 90% across 5 consecutive quizzes.',
    icon: 'Target',
    category: 'accuracy',
    unlocked: false,
    progress: 4,
    maxProgress: 5,
    rarity: 'Rare',
    xpReward: 350
  },
  {
    id: 'ach_mastery_badge',
    title: 'Mastery Badge',
    description: 'Achieve 100% mastery in any primary core subject.',
    icon: 'Award',
    category: 'mastery',
    unlocked: false,
    progress: 88,
    maxProgress: 100,
    rarity: 'Legendary',
    xpReward: 1000
  },
  {
    id: 'ach_level_10',
    title: 'Level 10 Achiever',
    description: 'Ascended past novice boundaries to achieve double-digit Level 10.',
    icon: 'Rocket',
    category: 'learning',
    unlocked: true,
    unlockedAt: 'Feb 10, 2026',
    progress: 12,
    maxProgress: 10,
    rarity: 'Rare',
    xpReward: 300
  },
  {
    id: 'ach_top_10',
    title: 'Top 10 Learner',
    description: 'Climbed onto the prestigious Global Leaderboard top 10 rankings.',
    icon: 'Crown',
    category: 'social',
    unlocked: true,
    unlockedAt: 'Feb 26, 2026',
    progress: 4,
    maxProgress: 10,
    rarity: 'Legendary',
    xpReward: 750
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    id: 'lead_1',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    title: 'Grandmaster Architect',
    level: 16,
    xp: 14200,
    streak: 42,
    badgesCount: 18
  },
  {
    rank: 2,
    id: 'lead_2',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    title: 'Neural Vanguard',
    level: 15,
    xp: 12850,
    streak: 30,
    badgesCount: 16
  },
  {
    rank: 3,
    id: 'lead_3',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    title: 'Logic Overlord',
    level: 14,
    xp: 10400,
    streak: 19,
    badgesCount: 14
  },
  {
    rank: 4,
    id: 'usr_kishore_01',
    name: 'Kishore Kumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Algorithm Alchemist',
    level: 12,
    xp: 8420,
    streak: 14,
    badgesCount: 11,
    isCurrentUser: true
  },
  {
    rank: 5,
    id: 'lead_5',
    name: 'Sophia Williams',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    title: 'Data Weaver',
    level: 11,
    xp: 7650,
    streak: 11,
    badgesCount: 9
  },
  {
    rank: 6,
    id: 'lead_6',
    name: 'Dev Patel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Syntax Ronin',
    level: 10,
    xp: 6900,
    streak: 8,
    badgesCount: 8
  }
];

export const mockRecommendations: AIRecommendation[] = [
  {
    id: 'rec_recursion',
    topic: 'Practice Recursion',
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
    id: 'rec_decorators',
    topic: 'Python Decorators & Metaprogramming',
    subject: 'Programming (Python)',
    priority: 'Recommended',
    difficulty: 'Medium',
    expectedTime: '20 min',
    rewardXp: 280,
    reason: 'Leverage your high score in closures to master production-grade caching and authentication decorators.',
    actionUrl: '/lesson/lesson_py_functions',
    icon: 'Code'
  },
  {
    id: 'rec_binary_trees',
    topic: 'Binary Search Tree Balancing',
    subject: 'Data Structures',
    priority: 'Optional',
    difficulty: 'Medium',
    expectedTime: '18 min',
    rewardXp: 220,
    reason: 'Prepare for complex search algorithms by visualizing AVL self-balancing rotations.',
    actionUrl: '/learn',
    icon: 'Layers'
  }
];

export const mockStrengthsWeaknesses: StrengthsWeaknesses = {
  strengths: [
    { topic: 'Control Flow & Loops', score: 94, trend: '+8% this month' },
    { topic: 'Database SQL Queries', score: 91, trend: '+14% this month' },
    { topic: 'Object-Oriented Design', score: 86, trend: '+5% this month' },
    { topic: 'Array & String Manipulation', score: 88, trend: '+3% this month' }
  ],
  weaknesses: [
    {
      topic: 'Recursive Call Stack Depth',
      score: 64,
      trend: '-12% this week',
      recommendation: 'Targeted medium drills on base conditions and unwinding states'
    },
    {
      topic: 'Dynamic Programming Tabulation',
      score: 58,
      trend: 'Needs Practice',
      recommendation: 'Visual 2D matrix state transitions'
    },
    {
      topic: 'Graph BFS/DFS Cycle Detection',
      score: 69,
      trend: '+2% this week',
      recommendation: 'Explore graph coloring and visited set optimizations'
    }
  ]
};

export const mockAnalytics: AnalyticsSummary = {
  totalXp: 8420,
  learningHours: 47.3,
  averageAccuracy: 84.5,
  questionsSolved: 312,
  currentStreak: 14,
  skillsMastered: 8,
  weeklyActivity: [
    { day: 'Mon', date: 'Mar 03', minutes: 45, xp: 320, quizzes: 3, accuracy: 88 },
    { day: 'Tue', date: 'Mar 04', minutes: 30, xp: 210, quizzes: 2, accuracy: 79 },
    { day: 'Wed', date: 'Mar 05', minutes: 60, xp: 480, quizzes: 4, accuracy: 92 },
    { day: 'Thu', date: 'Mar 06', minutes: 35, xp: 260, quizzes: 2, accuracy: 85 },
    { day: 'Fri', date: 'Mar 07', minutes: 50, xp: 390, quizzes: 3, accuracy: 81 },
    { day: 'Sat', date: 'Mar 08', minutes: 80, xp: 620, quizzes: 5, accuracy: 94 },
    { day: 'Sun', date: 'Mar 09', minutes: 40, xp: 310, quizzes: 2, accuracy: 87 }
  ],
  monthlyActivity: [
    { day: 'W1', date: 'Feb 09 - Feb 15', minutes: 280, xp: 1950, quizzes: 16, accuracy: 82 },
    { day: 'W2', date: 'Feb 16 - Feb 22', minutes: 310, xp: 2200, quizzes: 19, accuracy: 86 },
    { day: 'W3', date: 'Feb 23 - Mar 01', minutes: 290, xp: 2050, quizzes: 18, accuracy: 84 },
    { day: 'W4', date: 'Mar 02 - Mar 09', minutes: 340, xp: 2590, quizzes: 21, accuracy: 87 }
  ],
  topicMastery: [
    { topic: 'Python', mastery: 84, benchmark: 70 },
    { topic: 'Data Structs', mastery: 80, benchmark: 65 },
    { topic: 'Algorithms', mastery: 72, benchmark: 60 },
    { topic: 'AI & ML', mastery: 65, benchmark: 55 },
    { topic: 'Math Logic', mastery: 76, benchmark: 68 },
    { topic: 'Databases', mastery: 88, benchmark: 72 }
  ],
  difficultyDistribution: [
    { name: 'Easy', value: 124, color: '#10b981' },
    { name: 'Medium', value: 142, color: '#f59e0b' },
    { name: 'Hard', value: 46, color: '#f43f5e' }
  ]
};

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    title: '🧠 AI Insight Generated',
    message: 'We noticed an opportunity to improve recursion accuracy. A targeted challenge is ready!',
    category: 'challenge',
    timestamp: '10m ago',
    isRead: false,
    actionUrl: '/quiz/quiz_py_functions'
  },
  {
    id: 'notif_2',
    title: '🔥 14-Day Streak Preserved!',
    message: "You're unstoppable! Only 7 more days to unlock the legendary '3-Week Master' badge.",
    category: 'streak',
    timestamp: '2h ago',
    isRead: false,
    actionUrl: '/dashboard'
  },
  {
    id: 'notif_3',
    title: '🏆 Achievement Unlocked',
    message: "Congratulations! You earned the 'Top 10 Learner' badge and 750 bonus XP.",
    category: 'achievement',
    timestamp: '1d ago',
    isRead: true,
    actionUrl: '/achievements'
  },
  {
    id: 'notif_4',
    title: '⚡ Leaderboard Update',
    message: 'You climbed to Rank #4 on the Global Leaderboard, passing Dev Patel.',
    category: 'leaderboard',
    timestamp: '2d ago',
    isRead: true,
    actionUrl: '/leaderboard'
  }
];

export const mockSkillNodes: SkillNode[] = [
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
    completedChallenges: 12,
    icon: 'Code'
  },
  {
    id: 'sk_oop',
    name: 'Object-Oriented Design',
    category: 'Programming',
    level: 2,
    masteryPercentage: 86,
    xp: 900,
    prerequisites: ['sk_py_func'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 14,
    completedChallenges: 11,
    icon: 'Box'
  },
  {
    id: 'sk_ds_linear',
    name: 'Linear Data Structures',
    category: 'Data Structures',
    level: 3,
    masteryPercentage: 88,
    xp: 800,
    prerequisites: ['sk_py_loops'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 12,
    completedChallenges: 10,
    icon: 'Layers'
  },
  {
    id: 'sk_recursion',
    name: 'Recursive Thinking',
    category: 'Algorithms',
    level: 2,
    masteryPercentage: 64,
    xp: 650,
    prerequisites: ['sk_py_func', 'sk_ds_linear'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 16,
    completedChallenges: 8,
    icon: 'RotateCcw'
  },
  {
    id: 'sk_dp',
    name: 'Dynamic Programming',
    category: 'Algorithms',
    level: 1,
    masteryPercentage: 42,
    xp: 400,
    prerequisites: ['sk_recursion'],
    isUnlocked: false,
    isMastered: false,
    totalChallenges: 20,
    completedChallenges: 3,
    icon: 'Cpu'
  },
  {
    id: 'sk_trees',
    name: 'Trees & Graphs',
    category: 'Data Structures',
    level: 2,
    masteryPercentage: 74,
    xp: 700,
    prerequisites: ['sk_ds_linear'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 14,
    completedChallenges: 9,
    icon: 'GitBranch'
  },
  {
    id: 'sk_ai_search',
    name: 'AI Heuristic Search',
    category: 'AI & Machine Learning',
    level: 1,
    masteryPercentage: 60,
    xp: 550,
    prerequisites: ['sk_trees'],
    isUnlocked: true,
    isMastered: false,
    totalChallenges: 10,
    completedChallenges: 5,
    icon: 'Sparkles'
  }
];
