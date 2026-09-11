import { ChatMessage, ChatInteractiveAction } from '../types/game.types';

export interface ChatContext {
  currentTopic?: string;
  skillLevel?: string;
  currentStreak?: number;
  mode?: 'tutor' | 'hint' | 'practice' | 'quiz' | 'review' | 'motivation';
  isSocratic?: boolean;
  lastMistake?: {
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  };
}

export type TopicKey = 
  | 'binary_search'
  | 'recursion'
  | 'quicksort'
  | 'sorting'
  | 'arrays'
  | 'stacks_queues'
  | 'linked_lists'
  | 'hash_tables'
  | 'trees_graphs'
  | 'dynamic_programming'
  | 'big_o'
  | 'python'
  | 'javascript'
  | 'sql'
  | 'web_dev'
  | 'debugging';

interface TopicKnowledge {
  title: string;
  category: string;
  keywords: string[];
  explanation: string;
  simpleExplanation: string;
  codeSnippet: string;
  codeLanguage: string;
  hint: string;
  socraticQuestion: string;
  gameId?: string;
  gameLabel?: string;
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    xp: number;
  };
}

const TOPIC_KNOWLEDGE: Record<TopicKey, TopicKnowledge> = {
  binary_search: {
    title: 'Binary Search',
    category: 'Algorithms',
    keywords: ['binary search', 'bsearch', 'binarysearch', 'half search', 'log n search', 'sorted search', 'bisect'],
    explanation: `### Binary Search Explained
Binary Search is an efficient **divide-and-conquer algorithm** for finding a target element within a **sorted array**.
Instead of checking each element one-by-one ($O(n)$ linear search), binary search halves the search space in each step, achieving logarithmic time **$O(\\log n)$**.

* **Prerequisite**: The collection must be sorted.
* **Mechanism**: Compares the target with the midpoint. If target < mid, discard right half; if target > mid, discard left half.
* **Complexity**: Time: **$O(\\log n)$**, Space: **$O(1)$** iterative.`,
    simpleExplanation: `Imagine looking up the word "Python" in a 1,000-page printed dictionary. You don't read page 1, then page 2. You flip open to the middle (page 500: "M"). Since "P" comes after "M", you discard the entire first half and repeat in the second half. That's Binary Search!`,
    codeLanguage: 'python',
    codeSnippet: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid  # Found at index mid
        elif arr[mid] < target:
            low = mid + 1  # Search right half
        else:
            high = mid - 1  # Search left half

    return -1  # Target not found`,
    hint: 'Remember to adjust your pointers using `mid + 1` and `mid - 1` rather than `mid` directly, or you risk an infinite loop when `low == high`.',
    socraticQuestion: '🤔 In Socratic mode: If the input array has 1,024 elements and is sorted, how many comparisons at most will binary search need to either locate the target or prove it is absent?',
    gameId: 'sl-binary-search',
    gameLabel: 'Practice Sort the Logic: Binary Search',
    quizQuestion: {
      question: 'What is the worst-case time complexity of Binary Search on a sorted array of size N?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
      correctIndex: 1,
      explanation: 'Binary Search divides the remaining search interval in half every iteration, resulting in O(log n) comparisons.',
      xp: 30
    }
  },

  recursion: {
    title: 'Recursion & Base Cases',
    category: 'Computer Science',
    keywords: ['recursion', 'recursive', 'base case', 'call stack', 'stack overflow', 'factorial', 'fibonacci', 'recurse'],
    explanation: `### Recursion & The Call Stack
A recursive function is a function that solves a problem by **calling itself** with a smaller subproblem.

Every robust recursive function consists of two parts:
1. **Base Case**: The stopping condition that returns directly without making further recursive calls.
2. **Recursive Step**: The progression step that decomposes the argument toward the base case.

* **Risk**: Missing or unreachable base cases result in a **Stack Overflow** (maximum call stack size exceeded).
* **Memory**: Each function call allocates a new frame on the system Call Stack.`,
    simpleExplanation: `Think of Russian nesting dolls (Matryoshka). You open a doll to find a smaller doll inside. You keep opening until you reach the tiniest solid doll that cannot open. That tiny doll is your base case! Once you reach it, you reassemble the dolls on the way back out.`,
    codeLanguage: 'javascript',
    codeSnippet: `function factorial(n) {
  // 1. Base Case: prevents infinite recursion
  if (n <= 1) {
    return 1;
  }
  // 2. Recursive Step: progresses toward n <= 1
  return n * factorial(n - 1);
}`,
    hint: 'Always verify that every branch in your function eventually converges toward the base condition for all valid inputs.',
    socraticQuestion: '🤔 In Socratic mode: When `factorial(3)` executes, what happens to the call stack frames while `factorial(1)` is returning its value?',
    gameId: 'qc-recursion-base',
    gameLabel: 'Play Quick Choice: Base Case Detection',
    quizQuestion: {
      question: 'What happens when a recursive function fails to reach its base case?',
      options: [
        'The program automatically switches to an iterative while loop',
        'A Stack Overflow / Maximum call stack exceeded error occurs',
        'Memory leaks into the CPU cache permanently',
        'The variable values wrap around to negative numbers'
      ],
      correctIndex: 1,
      explanation: 'Without reaching a base case, recursive calls continually push new frames onto the call stack until all allocated stack memory is exhausted.',
      xp: 35
    }
  },

  quicksort: {
    title: 'Quicksort & Partitioning',
    category: 'Algorithms',
    keywords: ['quicksort', 'quick sort', 'partition', 'pivot', 'divide and conquer'],
    explanation: `### Quicksort Algorithm
Quicksort is an efficient, in-place, divide-and-conquer sorting algorithm.

* **How it works**:
  1. Pick a **pivot** element from the array.
  2. **Partition**: Rearrange elements so that all values smaller than the pivot precede it, and all larger values follow it.
  3. **Recurse**: Apply the same procedure to the sub-arrays on the left and right of the pivot.
* **Time Complexity**:
  - Average: **$O(n \\log n)$**
  - Worst Case: **$O(n^2)$** (when pivot is poorly chosen, e.g. already sorted with first/last element pivot).`,
    simpleExplanation: `Imagine organizing students by height. You pick one student as the "pivot". Everyone shorter stands to their left, everyone taller to their right. Now repeat this for the left group and right group. Soon, the entire line is sorted!`,
    codeLanguage: 'python',
    codeSnippet: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
    hint: 'Choosing a random pivot or median-of-three pivot avoids the O(n²) worst-case on already-sorted data.',
    socraticQuestion: '🤔 In Socratic mode: Why does picking the smallest element as pivot repeatedly cause Quicksort to degrade to O(n²)?',
    gameId: 'mc-complexity',
    gameLabel: 'Test Complexity: Match & Connect',
    quizQuestion: {
      question: 'What is the average time complexity of the Quicksort algorithm?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctIndex: 1,
      explanation: 'On average, partitioning splits the list roughly in half across O(log n) levels with O(n) work per level, totaling O(n log n).',
      xp: 30
    }
  },

  sorting: {
    title: 'Sorting Algorithms',
    category: 'Algorithms',
    keywords: ['sorting', 'bubble sort', 'merge sort', 'insertion sort', 'selection sort', 'tim sort'],
    explanation: `### Sorting Algorithms Overview
Sorting arranges data into ascending or descending sequence.

* **Merge Sort**: Stable, divide-and-conquer, always **$O(n \\log n)$** time, requires $O(n)$ auxiliary space.
* **Quick Sort**: In-place, average **$O(n \\log n)$**, worst case $O(n^2)$.
* **Bubble Sort**: Compares adjacent pairs and swaps them. Simple but slow: **$O(n^2)$**.
* **Stability**: A sorting algorithm is "stable" if it preserves the relative order of records with equal keys.`,
    simpleExplanation: `Sorting is like organizing a messy deck of cards. You can repeatedly swap neighboring cards until no more swaps are needed (Bubble Sort), or divide the deck in half, sort each pile, and merge them in order (Merge Sort).`,
    codeLanguage: 'javascript',
    codeSnippet: `// Bubble Sort: Swapping adjacent elements
function bubbleSort(arr) {
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
  } while (swapped);
  return arr;
}`,
    hint: 'Merge sort guarantees O(n log n) even in the worst case, making it ideal when consistent performance is required.',
    socraticQuestion: '🤔 In Socratic mode: What is the primary trade-off between Merge Sort and Quick Sort in terms of memory usage?',
    gameId: 'mc-complexity',
    gameLabel: 'Play Match & Connect: Complexity',
    quizQuestion: {
      question: 'Which of the following sorting algorithms guarantees O(n log n) time complexity even in the worst-case scenario?',
      options: ['Bubble Sort', 'Quicksort', 'Merge Sort', 'Insertion Sort'],
      correctIndex: 2,
      explanation: 'Merge Sort always divides the array evenly in half and merges linear sub-lists, giving guaranteed O(n log n) performance regardless of initial array order.',
      xp: 25
    }
  },

  arrays: {
    title: 'Arrays & Indexing',
    category: 'Data Structures',
    keywords: ['array', 'arrays', 'indexing', 'list', 'subscript', 'slice', 'off by one'],
    explanation: `### Arrays & Memory Layout
An Array stores elements in **contiguous memory blocks**.

* **Access by Index**: **$O(1)$** constant time, calculated via \`base_address + index * element_size\`.
* **Insertion / Deletion**:
  - At end: **$O(1)$** amortized.
  - At beginning or middle: **$O(n)$** because all subsequent elements must be shifted.
* **Search (Unsorted)**: **$O(n)$** linear scan.`,
    simpleExplanation: `Think of an array as a row of numbered lockers (starting at locker #0). If you know the locker number, you can walk directly to it instantly ($O(1)$). But if you want to insert a new locker in the middle, you have to push all the other lockers to the right ($O(n)$)!`,
    codeLanguage: 'python',
    codeSnippet: `# Array operations in Python
numbers = [10, 20, 30, 40, 50]

# O(1) direct index access
first = numbers[0]    # 10
last = numbers[-1]    # 50

# List comprehension: filter even numbers
evens = [x for x in numbers if x % 20 == 0] # [20, 40]`,
    hint: 'Remember: 0-indexed arrays mean the last valid index is always `length - 1`. Accessing `array[length]` causes an off-by-one bug!',
    socraticQuestion: '🤔 In Socratic mode: Why does inserting an element at index 0 of an array take O(n) time, while appending at the end is O(1)?',
    gameId: 'cb-array-filter',
    gameLabel: 'Play Code Builder: Array Filter',
    quizQuestion: {
      question: 'What is the time complexity to retrieve an element by its numeric index in a standard array?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
      correctIndex: 1,
      explanation: 'Because array elements occupy contiguous memory, the address can be calculated directly in O(1) constant time.',
      xp: 25
    }
  },

  stacks_queues: {
    title: 'Stacks & Queues',
    category: 'Data Structures',
    keywords: ['stack', 'queue', 'lifo', 'fifo', 'push', 'pop', 'enqueue', 'dequeue'],
    explanation: `### Stacks & Queues Comparison
Both are linear data structures with constrained access patterns:

* **Stack (LIFO - Last In, First Out)**:
  - The last element added is the first one removed.
  - Operations: \`push()\` and \`pop()\` in **$O(1)$**.
  - Use cases: Undo/redo operations, browser history back button, function call stack, matching parentheses.

* **Queue (FIFO - First In, First Out)**:
  - The first element added is the first one removed.
  - Operations: \`enqueue()\` and \`dequeue()\` in **$O(1)$**.
  - Use cases: Print job queues, task schedulers, BFS graph traversal.`,
    simpleExplanation: `A **Stack** is a stack of dining plates: you put new plates on top, and you take plates from the top (LIFO). A **Queue** is a line at a movie theater ticket counter: the first person to arrive is the first person served (FIFO)!`,
    codeLanguage: 'javascript',
    codeSnippet: `// Stack (LIFO) implementation
class Stack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}

// Queue (FIFO) implementation
class Queue {
  constructor() { this.items = []; }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.items.shift(); }
}`,
    hint: 'For high performance queues, avoid using basic array `.shift()` because it shifts all elements ($O(n)$); use a linked list or circular buffer instead.',
    socraticQuestion: '🤔 In Socratic mode: Which data structure would you pick to evaluate whether mathematical parentheses like `{[()]}` are properly balanced, and why?',
    gameId: 'mm-data-structures',
    gameLabel: 'Play Memory Match: Data Structures Grid',
    quizQuestion: {
      question: 'Which data structure follows the LIFO (Last In, First Out) principle?',
      options: ['Queue', 'Stack', 'Linked List', 'Priority Queue'],
      correctIndex: 1,
      explanation: 'A Stack strictly enforces LIFO order—the most recently pushed item is always the first one popped.',
      xp: 25
    }
  },

  linked_lists: {
    title: 'Linked Lists',
    category: 'Data Structures',
    keywords: ['linked list', 'node', 'pointer', 'singly linked', 'doubly linked', 'head', 'tail'],
    explanation: `### Linked Lists
A Linked List consists of **nodes**, where each node holds a data value and a pointer (reference) to the next node.

* **Singly Linked**: Each node points to the next node (\`node.next\`).
* **Doubly Linked**: Nodes have pointers to both next (\`next\`) and previous (\`prev\`).
* **Advantages over Array**:
  - Non-contiguous memory allocation.
  - $O(1)$ insertions and deletions given a pointer to the target node (no element shifting).
* **Disadvantages**:
  - No random index access ($O(n)$ traversal required).
  - Extra memory overhead for pointers.`,
    simpleExplanation: `Think of a scavenger hunt! You go to clue 1, and it tells you where clue 2 is hidden. Clue 2 tells you where clue 3 is. You can't jump straight to clue 3 without visiting clues 1 and 2 first!`,
    codeLanguage: 'javascript',
    codeSnippet: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Reversing a linked list in O(n) time, O(1) space
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
    hint: 'Always preserve `curr.next` in a temporary variable before overwriting `curr.next = prev`, otherwise you sever the chain!',
    socraticQuestion: '🤔 In Socratic mode: Why is searching for a value in a linked list always O(n) even if the values are sorted?',
    gameId: 'mm-data-structures',
    gameLabel: 'Practice Data Structures Memory Match',
    quizQuestion: {
      question: 'What is the time complexity to insert a new node at the head of a Singly Linked List?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correctIndex: 2,
      explanation: 'Inserting at head simply updates new_node.next = head and head = new_node, taking O(1) constant time.',
      xp: 25
    }
  },

  hash_tables: {
    title: 'Hash Tables & Hash Maps',
    category: 'Data Structures',
    keywords: ['hash table', 'hash map', 'hashmap', 'hashing', 'dictionary', 'dict', 'key value', 'collision'],
    explanation: `### Hash Tables & Key-Value Lookups
A Hash Table maps keys to values using a **hash function**.

* **Core Idea**: The hash function converts a key (e.g. \`"user_42"\`) into an integer index in an underlying array.
* **Performance**:
  - Insert / Delete / Lookup: Average **$O(1)$** constant time.
  - Worst Case: **$O(n)$** if all keys collide into the same bucket.
* **Collision Resolution**:
  - **Chaining**: Buckets hold linked lists or balanced trees of colliding entries.
  - **Open Addressing**: Probing for the next empty slot (linear probing, quadratic probing).`,
    simpleExplanation: `Think of the index at the back of a textbook. Instead of reading all 500 pages to find "Gravity", you look up the word in the alphabetical index, get the exact page number immediately, and open directly to it!`,
    codeLanguage: 'python',
    codeSnippet: `# Python dictionaries are optimized hash tables
cache = {}

# O(1) Average insertion & lookup
cache["user:101"] = {"name": "Alice", "role": "admin"}

if "user:101" in cache:
    print(cache["user:101"]["name"])  # 'Alice'`,
    hint: 'Good hash functions distribute keys uniformly across all slots to minimize collisions.',
    socraticQuestion: '🤔 In Socratic mode: What happens to the time complexity of a hash map lookup if the hash function maps every single key to index 0?',
    gameId: 'mc-complexity',
    gameLabel: 'Match Complexity: Hash Map vs Binary Search',
    quizQuestion: {
      question: 'What is the average time complexity for key lookup in a well-distributed Hash Table?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'],
      correctIndex: 1,
      explanation: 'Under uniform hashing, computing the hash and accessing the bucket takes O(1) average constant time.',
      xp: 25
    }
  },

  trees_graphs: {
    title: 'Trees & Graphs (BFS / DFS)',
    category: 'Data Structures & Algorithms',
    keywords: ['tree', 'binary tree', 'bst', 'graph', 'bfs', 'dfs', 'breadth first', 'depth first', 'traversal'],
    explanation: `### Trees & Graph Traversals
* **Tree**: A hierarchical, non-cyclic graph with one root node where every node has zero or more children.
* **Binary Search Tree (BST)**: Left subtree elements < parent < right subtree elements. Lookup is average **$O(\\log n)$**.
* **Traversals**:
  - **BFS (Breadth-First Search)**: Explores layer by layer using a **Queue** (FIFO). Ideal for finding the shortest path in unweighted graphs.
  - **DFS (Depth-First Search)**: Explores as deep as possible along each branch before backtracking, using a **Stack** or **Recursion**. Ideal for cycle detection and topological sort.`,
    simpleExplanation: `Imagine exploring a maze. **DFS** picks one path and sprints down it as far as possible until hitting a dead end, then backtracks. **BFS** sends out an expanding circle of scouts in all directions simultaneously, visiting everyone 1 step away, then 2 steps away.`,
    codeLanguage: 'python',
    codeSnippet: `# BFS using a Queue (Layer-by-Layer)
from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        print("Visiting:", node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
    hint: 'Remember: BFS relies on a Queue (FIFO) while DFS relies on a Stack or Call Stack (LIFO).',
    socraticQuestion: '🤔 In Socratic mode: If you need to find the absolute shortest path between two users in a social network, should you use BFS or DFS, and why?',
    gameId: 'mm-data-structures',
    gameLabel: 'Test Data Structures Grid',
    quizQuestion: {
      question: 'Which traversal algorithm guarantees finding the shortest path in an unweighted graph?',
      options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Inorder Traversal', 'Postorder Traversal'],
      correctIndex: 1,
      explanation: 'Because BFS explores nodes in order of their distance from the start node level-by-level, it discovers the shortest path first.',
      xp: 30
    }
  },

  dynamic_programming: {
    title: 'Dynamic Programming & Memoization',
    category: 'Algorithms',
    keywords: ['dynamic programming', 'dp', 'memoization', 'tabulation', 'optimal substructure', 'overlapping subproblems', 'knapsack'],
    explanation: `### Dynamic Programming (DP)
Dynamic Programming solves complex problems by breaking them down into simpler **overlapping subproblems** with **optimal substructure**.

* **Two Core Properties**:
  1. **Overlapping Subproblems**: The same subproblems are computed repeatedly.
  2. **Optimal Substructure**: The optimal solution to the problem contains optimal solutions to subproblems.
* **Approaches**:
  - **Top-Down (Memoization)**: Write recursion and cache results in a hash table or array.
  - **Bottom-Up (Tabulation)**: Build a table iteratively from the smallest base cases up.`,
    simpleExplanation: `Imagine writing "1 + 1 + 1 + 1 + 1 = 5" on a chalkboard. If someone asks you what the total is, you say 5. Now they write "+ 1" at the end. What is the total? You say 6 immediately! Why? Because you remembered the previous 5. You didn't recount from 1. That is Dynamic Programming!`,
    codeLanguage: 'python',
    codeSnippet: `# Fibonacci with Top-Down Memoization: O(n) instead of O(2^n)
memo = {}

def fib(n):
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]`,
    hint: 'Always identify your state variables and transition equation before writing code: `dp[i] = ...`.',
    socraticQuestion: '🤔 In Socratic mode: Naive recursive Fibonacci takes O(2ⁿ) time. Why does adding a memo dictionary drop the time complexity down to O(n)?',
    gameId: 'mc-complexity',
    gameLabel: 'Complexity Duel: Exponential vs Linear',
    quizQuestion: {
      question: 'What two properties must a problem have to be suitable for Dynamic Programming?',
      options: [
        'Sorted inputs and constant space complexity',
        'Overlapping subproblems and optimal substructure',
        'Balanced binary trees and tail-call optimization',
        'Hash collisions and idempotent endpoints'
      ],
      correctIndex: 1,
      explanation: 'DP specifically optimizes problems that calculate identical subproblems repeatedly (overlapping) where subproblem answers compose the global answer (optimal substructure).',
      xp: 35
    }
  },

  big_o: {
    title: 'Big-O Notation & Complexity Analysis',
    category: 'Computer Science Theory',
    keywords: ['big o', 'big-o', 'time complexity', 'space complexity', 'asymptotic', 'o(1)', 'o(n)', 'o(log n)', 'o(n^2)'],
    explanation: `### Big-O Notation Guide
Big-O describes the **upper bound** of an algorithm's execution time or memory as the input size $n$ grows toward infinity.

* **Order of Growth (Fastest to Slowest)**:
  1. **$O(1)$ Constant**: Hash lookup, array indexing.
  2. **$O(\\log n)$ Logarithmic**: Binary search, balanced BST operations.
  3. **$O(n)$ Linear**: Single loop through an array.
  4. **$O(n \\log n)$ Linearithmic**: Merge Sort, Quicksort (average), TimSort.
  5. **$O(n^2)$ Quadratic**: Nested loops, Bubble Sort.
  6. **$O(2^n)$ Exponential**: Exhaustive recursion without memoization.`,
    simpleExplanation: `Big-O doesn't measure seconds on a clock—it measures how workload scales when your input grows! If 10 items take 10ms, how long do 1,000,000 items take?
With $O(1)$, still 10ms!
With $O(n)$, 1,000,000ms.
With $O(n^2)$, your computer might take days!`,
    codeLanguage: 'javascript',
    codeSnippet: `// O(1) Constant Time
const getFirst = (arr) => arr[0];

// O(n) Linear Time
const findMax = (arr) => {
  let max = -Infinity;
  for (const x of arr) if (x > max) max = x;
  return max;
};

// O(n²) Quadratic Time
const printPairs = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
};`,
    hint: 'Drop constants and non-dominant terms! E.g., $3n^2 + 50n + 1000$ simplifies directly to $O(n^2)$.',
    socraticQuestion: '🤔 In Socratic mode: If an algorithm runs in O(n²) time and takes 1 second for 1,000 items, approximately how long will it take for 10,000 items?',
    gameId: 'mc-complexity',
    gameLabel: 'Play Time Complexity Matching Challenge',
    quizQuestion: {
      question: 'Which of the following time complexities scales the most efficiently for large datasets?',
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
      correctIndex: 3,
      explanation: 'O(log n) grows remarkably slowly—even for n = 1,000,000,000, log₂(n) is only about 30 operations.',
      xp: 30
    }
  },

  python: {
    title: 'Python Mastery',
    category: 'Programming Languages',
    keywords: ['python', 'list comprehension', 'decorator', 'generator', 'args', 'kwargs', 'lambda', 'tuple', 'set', 'slicing'],
    explanation: `### Python Core Concepts
Python is an expressive, dynamically-typed language known for clean syntax and powerful standard library features.

* **List Comprehensions**: Concise syntax for generating lists: \`[expr for item in iterable if condition]\`.
* **\`*args\` and \`**kwargs\`**:
  - \`*args\`: Collects positional arguments into a tuple.
  - \`**kwargs\`: Collects keyword arguments into a dictionary.
* **Generators**: Use \`yield\` to produce items lazily on-demand, saving memory ($O(1)$ space vs $O(n)$ list).
* **Decorators**: Functions that wrap other functions to extend behavior without modifying source code.`,
    simpleExplanation: `In Python, instead of writing 5 lines with a loop and append, you write one elegant line! For example: \`[x * 2 for x in numbers if x > 0]\` doubles every positive number in one clean sentence.`,
    codeLanguage: 'python',
    codeSnippet: `# 1. List Comprehension
squares = [x**2 for x in range(10) if x % 2 == 0]

# 2. Variable arguments
def log_event(event_name, *tags, **metadata):
    print(f"Event: {event_name}")
    print(f"Tags: {tags}")        # tuple
    print(f"Meta: {metadata}")    # dict

# 3. Memory-efficient Generator
def count_up_to(limit):
    count = 1
    while count <= limit:
        yield count
        count += 1`,
    hint: 'Use sets for membership checks: `item in my_set` is average O(1), whereas `item in my_list` is O(n)!',
    socraticQuestion: '🤔 In Socratic mode: What is the primary memory advantage of using a generator expression `(x for x in data)` over a list comprehension `[x for x in data]`?',
    gameId: 'cb-array-filter',
    gameLabel: 'Play Code Builder: Python Array Filter',
    quizQuestion: {
      question: 'In Python, what type does *args receive inside a function definition?',
      options: ['List', 'Dictionary', 'Tuple', 'Set'],
      correctIndex: 2,
      explanation: '*args gathers variable positional arguments into an immutable Tuple, whereas **kwargs gathers keyword arguments into a Dictionary.',
      xp: 25
    }
  },

  javascript: {
    title: 'JavaScript & TypeScript',
    category: 'Programming Languages',
    keywords: ['javascript', 'js', 'typescript', 'ts', 'promise', 'async', 'await', 'closure', 'event loop', 'let', 'const', 'var'],
    explanation: `### Modern JavaScript & TypeScript
JavaScript is a single-threaded, non-blocking asynchronous language powered by the **Event Loop**.

* **Scope & Declarations**:
  - \`let\` / \`const\`: Block-scoped, not hoisted to global, Temporal Dead Zone (TDZ).
  - \`var\`: Function-scoped, hoisted.
* **Closures**: An inner function retains access to outer variables even after the outer function has returned.
* **Async / Await**: Syntactic sugar over **Promises**, allowing asynchronous code to read sequentially.
* **Event Loop**: Call Stack -> Web APIs -> Microtask Queue (Promises) -> Macrotask Queue (setTimeout).`,
    simpleExplanation: `JavaScript is like a single chef in a busy kitchen. While soup is simmering on the stove (waiting for a network response), the chef doesn't stand still staring at the pot. They chop vegetables! When the timer dings, they return to finish the soup. That's asynchronous non-blocking I/O!`,
    codeLanguage: 'typescript',
    codeSnippet: `// Closure example
function createCounter(initialValue: number = 0) {
  let count = initialValue;
  return {
    increment: () => ++count,
    getValue: () => count
  };
}

// Async/Await with error handling
async function fetchUser(id: string) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}`,
    hint: 'Remember that microtasks (Promise `.then()` and `await` resumes) always execute before macrotasks (`setTimeout`, `setInterval`).',
    socraticQuestion: '🤔 In Socratic mode: In what order will the numbers log here?\n`console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`',
    gameId: 'dd-off-by-one',
    gameLabel: 'Play Debug Detective: JS Index Fix',
    quizQuestion: {
      question: 'Which of the following executes first when the call stack clears in JavaScript?',
      options: [
        'A task scheduled with setTimeout(..., 0)',
        'A resolved Promise microtask (.then / await)',
        'A requestAnimationFrame callback',
        'A setInterval callback'
      ],
      correctIndex: 1,
      explanation: 'Microtasks (Promises, queueMicrotask) have higher priority and are completely drained before the Event Loop moves to the Macrotask queue (setTimeout).',
      xp: 25
    }
  },

  sql: {
    title: 'SQL & Relational Databases',
    category: 'Databases',
    keywords: ['sql', 'database', 'query', 'select', 'join', 'group by', 'having', 'where', 'sqlite', 'index', 'foreign key'],
    explanation: `### SQL Querying & Relational Architecture
SQL (Structured Query Language) is the standard for relational databases.

* **Clause Order of Execution**:
  1. \`FROM\` & \`JOIN\`
  2. \`WHERE\` (Filters individual rows before grouping)
  3. \`GROUP BY\` (Aggregates rows into buckets)
  4. \`HAVING\` (Filters aggregated groups)
  5. \`SELECT\` (Projects columns & computes formulas)
  6. \`ORDER BY\` (Sorts output)
  7. \`LIMIT / OFFSET\`
* **JOIN Types**:
  - \`INNER JOIN\`: Only matching records from both tables.
  - \`LEFT JOIN\`: All records from left table + matching from right (or NULL).`,
    simpleExplanation: `Think of SQL as filtering students in a school:
**WHERE** filters individual students (e.g. "age > 16").
**GROUP BY** groups students by classroom.
**HAVING** filters the groups themselves (e.g. "classes with more than 20 students").
WHERE cannot filter aggregated group counts; that's why we have HAVING!`,
    codeLanguage: 'sql',
    codeSnippet: `-- Find top departments with more than 5 engineers
SELECT 
  department, 
  COUNT(*) AS total_employees,
  AVG(salary) AS avg_salary
FROM employees
WHERE is_active = 1
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC
LIMIT 5;`,
    hint: 'WHERE filters rows BEFORE aggregation. HAVING filters groups AFTER aggregation. You cannot use `WHERE COUNT(*) > 5`!',
    socraticQuestion: '🤔 In Socratic mode: Why does a database query throw a syntax error if you write `WHERE SUM(price) > 100` instead of `HAVING SUM(price) > 100`?',
    gameId: 'fg-sql-select',
    gameLabel: 'Play Fill the Gap: SQL Aggregations',
    quizQuestion: {
      question: 'Which clause in SQL is specifically used to filter records AFTER grouping has occurred?',
      options: ['WHERE', 'HAVING', 'FILTER BY', 'PARTITION BY'],
      correctIndex: 1,
      explanation: 'HAVING is evaluated after GROUP BY to filter aggregate values, whereas WHERE filters individual rows before grouping.',
      xp: 30
    }
  },

  web_dev: {
    title: 'Web Development & Frontend',
    category: 'Web Fundamentals',
    keywords: ['web', 'html', 'css', 'flexbox', 'grid', 'react', 'hook', 'useeffect', 'usestate', 'http', 'rest', 'api'],
    explanation: `### Web Development Fundamentals
Modern web applications are built on the HTML/CSS/JS foundation with component frameworks like React.

* **CSS Layouts**:
  - **Flexbox**: 1-dimensional layout for rows OR columns (\`display: flex\`).
  - **CSS Grid**: 2-dimensional layout with rows AND columns (\`display: grid\`).
* **React Architecture**:
  - Declarative UI driven by state and props.
  - \`useState\`: Manages component state and triggers re-renders.
  - \`useEffect\`: Handles side-effects (API requests, subscriptions, event listeners).
* **HTTP & REST**:
  - \`GET\`: Idempotent data retrieval.
  - \`POST\`: Creates a resource.
  - \`PUT\` / \`PATCH\`: Updates existing resources.`,
    simpleExplanation: `HTML is the skeleton (content & bones), CSS is the skin and clothing (colors, layout, styling), and JavaScript is the muscles and brain (interactive logic and animations)!`,
    codeLanguage: 'typescript',
    codeSnippet: `import React, { useState, useEffect } from 'react';

export const UserBadge = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Fetches user profile on mount or when userId changes
    fetch(\`/api/user/\${userId}\`)
      .then(res => res.json())
      .then(setData);
  }, [userId]);

  if (!data) return <span>Loading...</span>;
  return <div className="p-3 bg-emerald-50 rounded-xl font-bold">{data.name}</div>;
};`,
    hint: 'Always specify the dependency array in `useEffect`. An empty array `[]` runs only once on mount, whereas omitting it runs on every single render.',
    socraticQuestion: '🤔 In Socratic mode: What causes an infinite re-render loop inside a React functional component using `useEffect`?',
    gameId: 'sr-web-fundamentals',
    gameLabel: 'Play Speed Round: 60s Web Blitz',
    quizQuestion: {
      question: 'Which HTTP status code signifies that a resource was successfully created?',
      options: ['200 OK', '201 Created', '204 No Content', '304 Not Modified'],
      correctIndex: 1,
      explanation: 'HTTP 201 Created indicates that the request succeeded and led to the creation of a new resource.',
      xp: 25
    }
  },

  debugging: {
    title: 'Debugging & Software Pitfalls',
    category: 'Software Engineering',
    keywords: ['debug', 'debugging', 'bug', 'error', 'off by one', 'memory leak', 'null pointer', 'undefined', 'exception'],
    explanation: `### Debugging & Common Software Pitfalls
Systematic debugging isolates the root cause of unexpected behavior through hypothesis testing and inspection.

* **Top 4 Bugs in Modern Software**:
  1. **Off-by-One Errors**: Using \`<= length\` instead of \`< length\` in 0-indexed loops.
  2. **Null / Undefined Reference**: Accessing properties of an uninitialized or missing object (\`cannot read property of undefined\`). Use optional chaining (\`obj?.prop\`).
  3. **State Mutation**: Mutating objects directly instead of creating shallow copies, causing React re-render failures.
  4. **Uncleaned Event Listeners / Timers**: Leaving \`setInterval\` or event listeners active, leading to memory leaks.`,
    simpleExplanation: `Debugging is like being a detective at a crime scene. Don't guess wildly! Form a hypothesis: "I think line 12 is accessing an index that doesn't exist." Print or inspect the value right before line 12 to test your theory.`,
    codeLanguage: 'javascript',
    codeSnippet: `// Buggy loop (Off-by-one):
for (let i = 0; i <= items.length; i++) { // BUG: items[items.length] is undefined!
  console.log(items[i]);
}

// Correct loop:
for (let i = 0; i < items.length; i++) {
  console.log(items[i]);
}

// Or better, modern iterator:
for (const item of items) {
  console.log(item);
}`,
    hint: 'Use optional chaining `?.` and nullish coalescing `??` to defend against unexpected null or undefined values gracefully.',
    socraticQuestion: '🤔 In Socratic mode: If an array has 5 items, what index is accessed when `i = 5`, and what value does JavaScript return for that index?',
    gameId: 'dd-off-by-one',
    gameLabel: 'Play Debug Detective: Off-By-One Mystery',
    quizQuestion: {
      question: 'What is returned in JavaScript when attempting to access an index equal to array.length on a non-empty array?',
      options: ['null', 'undefined', 'Throws an IndexOutOfBoundsException', '0'],
      correctIndex: 1,
      explanation: 'In JavaScript, reading an out-of-bounds index does not throw an exception; it evaluates directly to undefined.',
      xp: 25
    }
  }
};

// Technical multi-word phrases
const TECHNICAL_PHRASES: string[] = [
  'binary search', 'linear search', 'quick sort', 'merge sort', 'bubble sort',
  'insertion sort', 'selection sort', 'base case', 'call stack', 'stack overflow',
  'dynamic programming', 'two pointers', 'sliding window', 'bit manipulation',
  'binary tree', 'linked list', 'doubly linked', 'singly linked', 'priority queue',
  'hash map', 'hash table', 'hash set', 'time complexity', 'space complexity',
  'big o', 'constant time', 'worst case', 'average case', 'best case',
  'data structure', 'data structures', 'for loop', 'while loop', 'do while',
  'event loop', 'null pointer', 'null reference', 'memory leak', 'race condition',
  'unit test', 'clean code', 'design pattern', 'object oriented', 'explain simply',
  'simple terms', 'test me', 'quiz me', 'code example', 'code snippet',
  'inner join', 'left join', 'right join', 'full join', 'group by', 'order by',
  'primary key', 'foreign key', 'why was my answer', 'why is my answer'
];

// Technical single-word tokens (matched as whole words)
const TECHNICAL_WORD_SET = new Set([
  'python', 'javascript', 'typescript', 'java', 'cpp', 'csharp', 'golang', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'bash', 'shell', 'scala',
  'algorithm', 'algorithms', 'bsearch', 'quicksort', 'mergesort', 'recursion',
  'recursive', 'recurse', 'memoization', 'tabulation', 'backtracking', 'graph',
  'tree', 'trees', 'bst', 'avl', 'trie', 'heap', 'traversal', 'bfs', 'dfs',
  'dijkstra', 'array', 'arrays', 'matrix', 'vector', 'stack', 'queue', 'deque',
  'hashmap', 'hashtable', 'dictionary', 'dict', 'tuple', 'node', 'pointer',
  'asymptotic', 'logarithmic', 'quadratic', 'api', 'apis', 'rest', 'restful',
  'http', 'https', 'endpoint', 'server', 'client', 'browser', 'dom', 'react',
  'vue', 'angular', 'svelte', 'vite', 'node', 'express', 'hook', 'hooks',
  'usestate', 'useeffect', 'usememo', 'usecallback', 'props', 'json', 'jwt',
  'database', 'databases', 'db', 'sqlite', 'postgres', 'postgresql', 'mysql',
  'mongodb', 'redis', 'query', 'queries', 'schema', 'crud', 'debug', 'debugging',
  'bug', 'bugs', 'error', 'errors', 'exception', 'code', 'coding', 'program',
  'programming', 'developer', 'software', 'compiler', 'interpreter', 'function',
  'functions', 'method', 'methods', 'class', 'classes', 'object', 'objects',
  'oop', 'inheritance', 'polymorphism', 'encapsulation', 'loop', 'loops',
  'iteration', 'variable', 'variables', 'constant', 'scope', 'closure', 'closures',
  'async', 'await', 'promise', 'promises', 'git', 'github', 'commit', 'branch',
  'quiz', 'hint', 'practice', 'challenge', 'socratic', 'motivation', 'streak',
  'mistake', 'syntax'
]);

// Patterns for non-technical, off-topic requests (weather, movies, sports, food, politics, romance, gossip)
const UNWANTED_PATTERNS: RegExp[] = [
  /\b(weather|temperature|forecast|rain|rainy|sunny|humidity|storm|cloudy)\b/i,
  /\b(movie|movies|cinema|film|actor|actress|hollywood|bollywood|taylor swift|song|songs|sing|music|lyrics|album|batman|superman|marvel|disney)\b/i,
  /\b(football|cricket|soccer|basketball|nba|messi|ronaldo|ipl|fifa|tennis|score|match|olympics)\b/i,
  /\b(politics|president|prime minister|election|government|war|country|capital of|monarch|queen|king)\b/i,
  /\b(recipe|cook|cooking|pizza|burger|pasta|food|dish|restaurant|bake|baking|cake|tea|coffee)\b/i,
  /\b(girlfriend|boyfriend|love you|marry me|date me|flirt|kiss|crush|relationship)\b/i,
  /\b(horoscope|zodiac|astrology|fortune|tarot)\b/i,
  /\b(shoes|clothes|dress|makeup|shopping|buy clothes|crypto price|stock tip)\b/i
];

class AiTutorService {
  private currentTopicKey: TopicKey = 'binary_search';
  private recentMessages: Array<{ role: 'user' | 'ai'; text: string }> = [];

  private initialMessages: ChatMessage[] = [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "👋 Hi! I'm **GameLearn AI**, your personal adaptive tutor.\n\nI can **explain tricky concepts**, provide **real code examples**, test your skills with **interactive quizzes (+XP)**, or launch **gamified challenges**!\n\nWhat would you like to master today? Try asking about **Binary Search**, **Recursion**, **Big-O Complexity**, **Python**, **SQL**, or toggle **Socratic Mode** for guided step-by-step discovery!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'tutor'
    }
  ];

  public getInitialMessages(): ChatMessage[] {
    return [...this.initialMessages];
  }

  public getCurrentTopic(): TopicKey {
    return this.currentTopicKey;
  }

  public setCurrentTopic(topic: TopicKey) {
    this.currentTopicKey = topic;
  }

  // Validate if the input query is technical/educational vs off-topic/unwanted
  public isTechnicalQuery(input: string, context: ChatContext = {}): boolean {
    if (context.lastMistake || context.isSocratic) return true;
    if (context.mode === 'quiz' || context.mode === 'practice') return true;

    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();

    // Check for explicit non-technical categories (weather, sports, movies, cooking, politics, etc.)
    for (const pattern of UNWANTED_PATTERNS) {
      if (pattern.test(lower)) {
        // Allow only if the query explicitly asks to build an application or code related to it
        const hasExplicitCodeIntent = /(in python|in javascript|in react|code|program|api|algorithm|database|function|class|sql)/i.test(lower);
        if (!hasExplicitCodeIntent) {
          return false;
        }
      }
    }

    // Standard friendly greetings
    if (/^(hi|hello|hey|greetings|hola|sup|howdy)$/i.test(trimmed)) {
      return true;
    }

    // Code snippets or programming syntax indicators
    const codePatterns = [
      /\b(def|class|function|const|let|var|import|export|return|console\.log|print|SELECT|FROM|WHERE|INSERT|UPDATE|DELETE)\b/,
      /[{};=><&|!]{2,}/,
      /=>/,
      /\(\s*\)/
    ];
    for (const cp of codePatterns) {
      if (cp.test(input)) return true;
    }

    // Check multi-word technical phrases
    for (const phrase of TECHNICAL_PHRASES) {
      if (lower.includes(phrase)) {
        return true;
      }
    }

    // Topic keywords from TOPIC_KNOWLEDGE
    for (const topicData of Object.values(TOPIC_KNOWLEDGE)) {
      for (const kw of topicData.keywords) {
        if (kw.includes(' ') && lower.includes(kw)) {
          return true;
        }
      }
    }

    // Whole word matching against technical tokens
    const words = lower.split(/[^a-z0-9_#+]+/);
    for (const word of words) {
      if (!word) continue;
      if (TECHNICAL_WORD_SET.has(word)) {
        return true;
      }
      // Also check topic keywords
      for (const topicData of Object.values(TOPIC_KNOWLEDGE)) {
        if (topicData.keywords.includes(word)) {
          return true;
        }
      }
    }

    // If query has no technical words or programming concepts, it is an unwanted message
    return false;
  }

  // Detect which topic the user is inquiring about
  private detectTopic(input: string): TopicKey | null {
    const lower = input.toLowerCase();

    for (const [key, data] of Object.entries(TOPIC_KNOWLEDGE)) {
      for (const kw of data.keywords) {
        if (lower.includes(kw)) {
          return key as TopicKey;
        }
      }
    }

    return null;
  }

  // Generate contextual AI response
  public async respondToMessage(
    userText: string,
    context: ChatContext = {}
  ): Promise<ChatMessage> {
    await new Promise(r => setTimeout(r, 450)); // natural streaming delay feel

    const lower = userText.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ==========================================
    // 0. TECHNICAL DOMAIN GUARDRAIL
    // ==========================================
    // If an unwanted/non-technical message is given, display the required notice
    if (!this.isTechnicalQuery(userText, context)) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Sorry this is only for Technical Purpose**\n\nI am **GameLearn AI**, an adaptive computer science & programming tutor.\n\nPlease ask questions related to:\n* **Programming Languages** (Python, JavaScript, TypeScript, SQL, Java, C++)\n* **Algorithms & Big-O** (Binary Search, Recursion, Sorting, Dynamic Programming)\n* **Data Structures** (Arrays, Stacks, Queues, Hash Tables, Trees, Linked Lists)\n* **Web & Databases** (React, APIs, SQL Queries, Debugging)\n* Or click **"Quiz me (+XP)"** or **"Practice arena"** for interactive challenges!`,
        timestamp,
        mode: 'tutor'
      };
    }

    // Keep history
    this.recentMessages.push({ role: 'user', text: userText });
    if (this.recentMessages.length > 10) this.recentMessages.shift();

    // Check if user is asking about a specific topic
    const detectedTopic = this.detectTopic(lower);
    if (detectedTopic) {
      this.currentTopicKey = detectedTopic;
    }

    const currentKnowledge = TOPIC_KNOWLEDGE[this.currentTopicKey];

    // ==========================================
    // 1. MISTAKE REVIEW ("Ask AI Why" or error analysis)
    // ==========================================
    if (context.lastMistake || lower.includes('why was my answer') || (lower.includes('wrong') && lower.includes('answer'))) {
      if (context.lastMistake) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `🔍 ### Mistake Breakdown & Insight\n\n* **Your Answer**: "${context.lastMistake.userAnswer}"\n* **Correct Answer**: **"${context.lastMistake.correctAnswer}"**\n\n**💡 Why?** ${context.lastMistake.explanation}\n\nDon't worry—making mistakes is how your mental model solidifies! Would you like to practice this concept with an interactive challenge?`,
          timestamp,
          mode: 'review',
          action: currentKnowledge.gameId ? {
            type: 'launch_game',
            gameId: currentKnowledge.gameId,
            label: currentKnowledge.gameLabel || 'Practice This Concept'
          } : undefined
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `🔍 **Common Causes for Bugs & Wrong Answers:**\n\n* **Off-by-one bounds**: Iterating with \`<= length\` instead of \`< length\` in 0-indexed arrays.\n* **Base case missing**: Recursive calls that never stop.\n* **Scope & state mutation**: Mutating variables in-place instead of returning new state.\n\nClick **"Ask AI Why"** on any quiz or challenge card for an instant breakdown of your exact choice!`,
        timestamp,
        mode: 'review'
      };
    }

    // ==========================================
    // 2. SOCRATIC MODE (Probing Inquiry Questions)
    // ==========================================
    if (context.isSocratic) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `${currentKnowledge.socraticQuestion}\n\n*Take a moment to reason through it—reply with your thoughts or the next logical step!*`,
        timestamp,
        isSocratic: true,
        action: {
          type: 'socratic_prompt',
          label: `Reflect on ${currentKnowledge.title}`
        }
      };
    }

    // ==========================================
    // 3. QUIZ ME / TEST ME REQUEST
    // ==========================================
    if (
      lower.includes('quiz') || 
      lower.includes('test me') || 
      lower === 'quiz me' || 
      context.mode === 'quiz'
    ) {
      const q = currentKnowledge.quizQuestion;
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `🎯 ### Knowledge Check: ${currentKnowledge.title}\n\nLet's test your understanding! Select the best answer below to earn **+${q.xp} XP**:`,
        timestamp,
        mode: 'quiz',
        action: {
          type: 'quiz_question',
          quizQuestion: {
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            xp: q.xp
          }
        }
      };
    }

    // ==========================================
    // 4. EXPLAIN SIMPLY / ELI5
    // ==========================================
    if (
      lower.includes('explain simply') || 
      lower.includes('simple terms') || 
      lower.includes('beginner') || 
      lower.includes('eli5')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `💡 ### ${currentKnowledge.title} (In Simple Terms)\n\n${currentKnowledge.simpleExplanation}\n\nWould you like me to show a **code example**, or **quiz you** to lock it in?`,
        timestamp,
        mode: 'tutor',
        action: currentKnowledge.gameId ? {
          type: 'launch_game',
          gameId: currentKnowledge.gameId,
          label: currentKnowledge.gameLabel || `Play ${currentKnowledge.title} Challenge`
        } : undefined
      };
    }

    // ==========================================
    // 5. SHOW AN EXAMPLE / CODE SNIPPET
    // ==========================================
    if (
      lower.includes('example') || 
      lower.includes('code') || 
      lower.includes('snippet') || 
      lower.includes('show me')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `💻 ### Practical Code Example: ${currentKnowledge.title}\n\nHere is a clean, well-commented implementation:\n\n\`\`\`${currentKnowledge.codeLanguage}\n${currentKnowledge.codeSnippet}\n\`\`\`\n\nNotice how each step cleanly isolates state. Ready to test yourself on this?`,
        timestamp,
        mode: 'tutor',
        action: currentKnowledge.gameId ? {
          type: 'launch_game',
          gameId: currentKnowledge.gameId,
          label: currentKnowledge.gameLabel || 'Try Interactive Mini-Game'
        } : undefined
      };
    }

    // ==========================================
    // 6. PRACTICE / CHALLENGE REQUEST
    // ==========================================
    if (
      lower.includes('practice') || 
      lower.includes('challenge') || 
      lower.includes('mini-game') || 
      lower.includes('play') ||
      context.mode === 'practice'
    ) {
      if (currentKnowledge.gameId) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `⚡ I've selected the **${currentKnowledge.gameLabel}** challenge to help you master **${currentKnowledge.title}** through hands-on practice!\n\nClick the button below to launch the arena:`,
          timestamp,
          mode: 'practice',
          action: {
            type: 'launch_game',
            gameId: currentKnowledge.gameId,
            label: currentKnowledge.gameLabel || `Start ${currentKnowledge.title} Arena`
          }
        };
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `⚡ Let's jump into an adventure challenge to test your computer science instincts! Choose an adventure level from your dashboard or click below:`,
        timestamp,
        mode: 'practice',
        action: {
          type: 'launch_game',
          gameId: 'sl-binary-search',
          label: 'Start Binary Search Challenge'
        }
      };
    }

    // ==========================================
    // 7. STRATEGIC HINT MODE
    // ==========================================
    if (context.mode === 'hint' || lower.includes('hint') || lower.includes('clue')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `💡 ### Strategic Hint for ${currentKnowledge.title}\n\n${currentKnowledge.hint}`,
        timestamp,
        mode: 'hint'
      };
    }

    // ==========================================
    // 8. MOTIVATION MODE
    // ==========================================
    if (context.mode === 'motivation' || lower.includes('motivation') || lower.includes('tired') || lower.includes('give up')) {
      const streak = context.currentStreak || 4;
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `🔥 ### Keep Pushing Forward!\n\nYou're currently on a **${streak}-day learning streak** and your cognitive momentum is building fast!\n\n* Remember: Every master programmer once struggled with the same concepts you're tackling today.\n* Every bug you analyze rewires your problem-solving intuition.\n\nTake a sip of water, take a deep breath—you're only one challenge away from your next level-up! 🚀`,
        timestamp,
        mode: 'motivation'
      };
    }

    // ==========================================
    // 9. GREETINGS & CASUAL INTERACTION
    // ==========================================
    if (/^(hi|hello|hey|greetings|hola|sup|howdy)(\s+.*)?$/i.test(lower)) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `👋 Hello there! Ready to level up your programming skills today?\n\nHere are a few high-impact topics we can explore:\n* **Binary Search & Big-O** (Divide & conquer search)\n* **Recursion & Call Stacks** (Base cases and stack frames)\n* **Python Comprehensions & Generators**\n* **SQL Queries & Aggregations** (GROUP BY vs HAVING)\n* **Data Structures** (Stacks, Queues, Hash Tables, Trees)\n\nOr click **"Quiz me"** below to take a fast interactive quiz and earn XP!`,
        timestamp,
        mode: 'tutor'
      };
    }

    // ==========================================
    // 10. DIRECT TOPIC EXPLANATION (When user asks about a detected topic)
    // ==========================================
    if (detectedTopic) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `${currentKnowledge.explanation}\n\n\`\`\`${currentKnowledge.codeLanguage}\n${currentKnowledge.codeSnippet}\n\`\`\`\n\nWould you like me to **explain this in simple terms**, **quiz you**, or **launch a practice challenge**?`,
        timestamp,
        mode: 'tutor',
        action: currentKnowledge.gameId ? {
          type: 'launch_game',
          gameId: currentKnowledge.gameId,
          label: currentKnowledge.gameLabel || `Play ${currentKnowledge.title} Mini-Game`
        } : undefined
      };
    }

    // ==========================================
    // 11. GENERAL HIGH-INTELLIGENCE CS TUTOR FALLBACK
    // ==========================================
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `🤖 That's a great computer science question! In software engineering, clean code and algorithmic efficiency depend on two core principles:\n\n1. **State & Invariants**: What values change over time, and what conditions must always remain true?\n2. **Time & Space Complexity**: How does your solution scale when processing $10$ items vs $1,000,000$ items ($O(1)$ vs $O(n)$ vs $O(n^2)$)?\n\nWould you like me to:\n* **Explain this topic simply for beginners**\n* **Provide a practical code example**\n* **Test you with an interactive quiz (+XP)**\n* **Launch a hands-on mini-game challenge**?`,
      timestamp,
      mode: 'tutor'
    };
  }
}

export const aiTutorService = new AiTutorService();
