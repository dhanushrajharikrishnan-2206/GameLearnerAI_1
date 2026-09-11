import { 
  AnyGameChallenge, 
  AdventureSession, 
  GameResult,
  QuickChoiceChallenge,
  MatchConnectChallenge,
  SortLogicChallenge,
  CodeBuilderChallenge,
  DebugDetectiveChallenge,
  MemoryMatchChallenge,
  FillGapChallenge,
  SpeedRoundChallenge,
  BossBattleChallenge
} from '../types/game.types';

// Mock catalog of interactive challenges across topics
export const MOCK_CHALLENGES: Record<string, AnyGameChallenge> = {
  // 1. Quick Choice
  'qc-recursion-base': {
    id: 'qc-recursion-base',
    type: 'quick_choice',
    title: 'Base Case Detection',
    topic: 'Recursion',
    difficulty: 'Easy',
    xpReward: 35,
    hint: 'Think about what stops an infinite loop or stack overflow.',
    explanation: 'Without a base case, recursive functions will continue to call themselves until the call stack exceeds its limit (Stack Overflow).',
    question: 'What is the primary purpose of a "base case" in recursive algorithms?',
    codeSnippet: `function factorial(n) {
  if (n <= 1) return 1; // <-- What is this?
  return n * factorial(n - 1);
}`,
    codeLanguage: 'javascript',
    options: [
      'To allocate additional heap memory for the call stack',
      'To terminate recursion and prevent an infinite call stack',
      'To invert the direction of the binary tree traversal',
      'To convert recursion into an iterative while loop automatically'
    ],
    correctAnswerIndex: 1
  } as QuickChoiceChallenge,

  // 2. Match & Connect
  'mc-complexity': {
    id: 'mc-complexity',
    type: 'match_connect',
    title: 'Time Complexity Matching',
    topic: 'Algorithms',
    difficulty: 'Medium',
    xpReward: 50,
    hint: 'Binary search halves the search space each step; nested loops usually multiply.',
    explanation: 'Binary Search runs in logarithmic time O(log n), Hash Map access is average O(1), and Merge Sort runs in O(n log n).',
    instruction: 'Match each algorithm or data structure operation with its average time complexity:',
    pairs: [
      { id: '1', left: 'Hash Map Lookup', right: 'O(1) Constant' },
      { id: '2', left: 'Binary Search', right: 'O(log n) Logarithmic' },
      { id: '3', left: 'Merge Sort', right: 'O(n log n) Linearithmic' },
      { id: '4', left: 'Bubble Sort', right: 'O(n²) Quadratic' }
    ]
  } as MatchConnectChallenge,

  // 3. Sort the Logic
  'sl-binary-search': {
    id: 'sl-binary-search',
    type: 'sort_logic',
    title: 'Binary Search Sequence',
    topic: 'Algorithms',
    difficulty: 'Medium',
    xpReward: 60,
    hint: 'First initialize pointers, then check the midpoint, and narrow the boundaries.',
    explanation: 'Binary search starts by calculating the midpoint between low and high pointers. If target is found, return; otherwise, adjust low or high to half the search window.',
    instruction: 'Arrange the steps of the Binary Search algorithm in proper execution order:',
    steps: [
      { id: 'step-1', label: 'Initialize pointers: low = 0, high = array.length - 1', order: 1 },
      { id: 'step-2', label: 'Compute mid index: mid = Math.floor((low + high) / 2)', order: 2 },
      { id: 'step-3', label: 'Compare target with array[mid]', order: 3 },
      { id: 'step-4', label: 'If array[mid] < target, set low = mid + 1; else set high = mid - 1', order: 4 },
      { id: 'step-5', label: 'Repeat until low exceeds high or target is located', order: 5 }
    ]
  } as SortLogicChallenge,

  // 4. Code Builder
  'cb-array-filter': {
    id: 'cb-array-filter',
    type: 'code_builder',
    title: 'Even Numbers Filter Assembly',
    topic: 'Python',
    difficulty: 'Easy',
    xpReward: 55,
    hint: 'Use a list comprehension or for-loop with the modulo operator % to check divisibility by 2.',
    explanation: 'A python list comprehension `[x for x in nums if x % 2 == 0]` concisely selects all elements divisible by 2.',
    instruction: 'Assemble the Python list comprehension to filter even numbers from a list:',
    template: 'evens = [ ___ for ___ in numbers if ___ % 2 == 0 ]',
    expectedOutput: '[2, 4, 6, 8, 10]',
    availableTokens: [
      { id: 't1', code: 'x', correctSlot: 0 },
      { id: 't2', code: 'x', correctSlot: 1 },
      { id: 't3', code: 'x', correctSlot: 2 }
    ]
  } as CodeBuilderChallenge,

  // 5. Debug Detective
  'dd-off-by-one': {
    id: 'dd-off-by-one',
    type: 'debug_detective',
    title: 'The Index Out of Bounds Mystery',
    topic: 'JavaScript',
    difficulty: 'Easy',
    xpReward: 65,
    hint: 'Array indexing starts at 0, so the last valid index is array.length - 1.',
    explanation: 'Using `i <= array.length` attempts to read an index beyond the end of the array, returning undefined or throwing an IndexOutOfBounds error.',
    instruction: 'Click on the line containing the bug in this array iteration function:',
    bugDescription: 'This function throws an IndexOutOfBounds error when accessing the last element.',
    codeLines: [
      { lineNumber: 1, code: 'function printAllItems(items) {', isBug: false },
      { lineNumber: 2, code: '  for (let i = 0; i <= items.length; i++) {', isBug: true, bugExplanation: 'Off-by-one error: using <= instead of < reaches beyond the last index.' },
      { lineNumber: 3, code: '    console.log("Item:", items[i]);', isBug: false },
      { lineNumber: 4, code: '  }', isBug: false },
      { lineNumber: 5, code: '}', isBug: false }
    ],
    fixOptions: [
      'Change "i <= items.length" to "i < items.length"',
      'Change "let i = 0" to "let i = 1"',
      'Change "items[i]" to "items[i - 1]"',
      'Change "i++" to "i += 2"'
    ],
    correctFixIndex: 0
  } as DebugDetectiveChallenge,

  // 6. Memory Match
  'mm-data-structures': {
    id: 'mm-data-structures',
    type: 'memory_match',
    title: 'Data Structures Memory Grid',
    topic: 'Computer Science',
    difficulty: 'Easy',
    xpReward: 50,
    hint: 'Remember which pairs correspond to LIFO, FIFO, and hierarchical nodes.',
    explanation: 'Stack uses LIFO (Last In First Out), Queue uses FIFO (First In First Out), and Tree uses Hierarchical Parent-Child nodes.',
    instruction: 'Flip the cards to match data structures with their fundamental principles:',
    cards: [
      { id: 'c1', matchId: 'stack', content: 'Stack', type: 'concept' },
      { id: 'c2', matchId: 'stack', content: 'LIFO (Last In, First Out)', type: 'definition' },
      { id: 'c3', matchId: 'queue', content: 'Queue', type: 'concept' },
      { id: 'c4', matchId: 'queue', content: 'FIFO (First In, First Out)', type: 'definition' },
      { id: 'c5', matchId: 'tree', content: 'Binary Tree', type: 'concept' },
      { id: 'c6', matchId: 'tree', content: 'Hierarchical Parent-Child Nodes', type: 'definition' }
    ]
  } as MemoryMatchChallenge,

  // 7. Fill the Gap
  'fg-sql-select': {
    id: 'fg-sql-select',
    type: 'fill_gap',
    title: 'SQL Aggregation Gap',
    topic: 'Databases',
    difficulty: 'Medium',
    xpReward: 45,
    hint: 'To filter grouped records, use HAVING instead of WHERE.',
    explanation: 'The HAVING clause filters groups after the GROUP BY clause has executed, whereas WHERE filters individual rows before grouping.',
    instruction: 'Complete the SQL query to find departments with more than 5 engineers:',
    codeSnippet: 'SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 5;',
    gaps: [
      {
        id: 'g1',
        textBefore: 'SELECT department, COUNT(*) FROM employees ',
        correctAnswer: 'GROUP BY',
        options: ['ORDER BY', 'GROUP BY', 'PARTITION BY', 'INDEX BY'],
        textAfter: ' department '
      },
      {
        id: 'g2',
        textBefore: '',
        correctAnswer: 'HAVING',
        options: ['WHERE', 'HAVING', 'FILTER', 'WHILE'],
        textAfter: ' COUNT(*) > 5;'
      }
    ]
  } as FillGapChallenge,

  // 8. Speed Round
  'sr-web-fundamentals': {
    id: 'sr-web-fundamentals',
    type: 'speed_round',
    title: '60-Second Web Blitz',
    topic: 'Web Fundamentals',
    difficulty: 'Easy',
    xpReward: 80,
    durationSeconds: 45,
    hint: 'Answer as fast as possible to build your combo multiplier!',
    explanation: 'Quick reflexes and solid recall are key to mastering core developer concepts.',
    items: [
      {
        id: 'sr-1',
        question: 'Which HTTP method is idempotent and used to retrieve resources?',
        options: ['POST', 'GET', 'PATCH', 'CONNECT'],
        correctAnswerIndex: 1,
        xp: 15
      },
      {
        id: 'sr-2',
        question: 'Which CSS property creates a flexbox container?',
        options: ['float: flex', 'display: flex', 'layout: flexbox', 'position: flex'],
        correctAnswerIndex: 1,
        xp: 15
      },
      {
        id: 'sr-3',
        question: 'What is the default port for HTTPS traffic?',
        options: ['80', '8080', '443', '3000'],
        correctAnswerIndex: 2,
        xp: 20
      },
      {
        id: 'sr-4',
        question: 'In React, which hook manages state in functional components?',
        options: ['useEffect', 'useState', 'useRef', 'useContext'],
        correctAnswerIndex: 1,
        xp: 15
      }
    ]
  } as SpeedRoundChallenge,

  // 9. Boss Battle: Recursion Beast
  'boss-recursion-beast': {
    id: 'boss-recursion-beast',
    type: 'boss_battle',
    title: 'The Recursion Beast',
    topic: 'Recursion & Call Stacks',
    difficulty: 'Hard',
    xpReward: 250,
    bossName: '⚔️ RECURSION BEAST',
    bossTitle: 'Devourer of Call Stacks & Infinite Loops',
    bossAvatar: '🐉',
    bossMaxHp: 100,
    hint: 'Remember the call stack unwinds in reverse order (LIFO) once the base condition returns.',
    explanation: 'Mastering recursion requires understanding call stack frames, base cases, and return value accumulation.',
    phases: [
      {
        question: 'Phase 1: The Beast charges! What causes a "Maximum call stack size exceeded" error in recursion?',
        options: [
          'The function executes more than 60 frames per second',
          'A recursive call occurs without ever hitting a reachable base case',
          'The return variable is declared with const instead of let',
          'The browser engine disables JIT compiler optimizations'
        ],
        correctIndex: 1,
        damage: 25,
        difficulty: 'Easy',
        explanation: 'If the base case is unreachable or missing, the recursive function pushes endless frames onto the call stack until memory is exhausted.'
      },
      {
        question: 'Phase 2: The Beast casts Stack Mirror! What is the return value of mystery(3)?',
        codeSnippet: `function mystery(n) {
  if (n <= 1) return 1;
  return n + mystery(n - 1);
}`,
        options: ['6', '3', '7', '1'],
        correctIndex: 0,
        damage: 35,
        difficulty: 'Medium',
        explanation: 'mystery(3) = 3 + mystery(2) -> 3 + (2 + mystery(1)) -> 3 + 2 + 1 = 6.'
      },
      {
        question: 'Phase 3: Final Strike! In tail-call optimization (TCO), what must be true about the recursive call?',
        options: [
          'It must be wrapped inside a try-catch block',
          'The recursive call must be the absolute last action in the calling function, with no pending operations',
          'It must return a Promise or async iterator',
          'It must allocate a new thread in the web worker pool'
        ],
        correctIndex: 1,
        damage: 40,
        difficulty: 'Hard',
        explanation: 'Tail-call optimization allows the compiler to reuse the current stack frame if no further computations remain after the recursive call returns.'
      }
    ]
  } as BossBattleChallenge
};

class GameService {
  // Fetch a challenge by ID
  public async getChallengeById(id: string): Promise<AnyGameChallenge | null> {
    await new Promise(r => setTimeout(r, 200));
    return MOCK_CHALLENGES[id] || null;
  }

  // Get all challenges
  public async getAllChallenges(): Promise<AnyGameChallenge[]> {
    await new Promise(r => setTimeout(r, 200));
    return Object.values(MOCK_CHALLENGES);
  }

  // Generate dynamic 5-Minute Adventure Session
  public async createAdventureSession(
    topic: string = 'Recursion & Algorithms',
    userAccuracy: number = 75
  ): Promise<AdventureSession> {
    await new Promise(r => setTimeout(r, 300));

    // Adaptively order challenges based on learner profile
    const challenges: AnyGameChallenge[] = [
      MOCK_CHALLENGES['qc-recursion-base'],
      MOCK_CHALLENGES['mc-complexity'],
      MOCK_CHALLENGES['cb-array-filter'],
      MOCK_CHALLENGES['dd-off-by-one'],
    ];

    const boss = MOCK_CHALLENGES['boss-recursion-beast'] as BossBattleChallenge;

    return {
      sessionId: `session-${Date.now()}`,
      title: '5-Minute Adaptive Adventure',
      topic,
      totalChallenges: challenges.length + 1, // challenges + boss
      challenges,
      totalExpectedXp: 450,
      bossChallenge: boss
    };
  }

  // Save game result and record telemetry
  public async recordGameAttempt(result: GameResult): Promise<{
    success: boolean;
    leveledUp: boolean;
    newTotalXp: number;
  }> {
    await new Promise(r => setTimeout(r, 150));
    return {
      success: true,
      leveledUp: result.xpEarned >= 200,
      newTotalXp: 1850 + result.xpEarned
    };
  }
}

export const gameService = new GameService();
