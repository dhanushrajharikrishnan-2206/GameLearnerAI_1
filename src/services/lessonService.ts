import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockLesson } from '../data/mockData';
import { Lesson } from '../types';
import { aiTutorService } from './aiTutorService';

export const lessonService = {
  getLessonById: async (lessonId: string): Promise<Lesson> => {
    if (USE_MOCK_API) {
      return mockDelay({ ...mockLesson, id: lessonId }, 250);
    }
    try {
      const response = await apiClient.get(`/lessons/${lessonId}`);
      return response.data;
    } catch {
      return mockDelay({ ...mockLesson, id: lessonId }, 200);
    }
  },

  completeLesson: async (lessonId: string): Promise<{ xpEarned: number; nextLessonId?: string }> => {
    if (USE_MOCK_API) {
      return mockDelay({
        xpEarned: 250,
        nextLessonId: mockLesson.nextLessonId
      }, 300);
    }
    try {
      const response = await apiClient.post(`/lessons/${lessonId}/complete`);
      return response.data;
    } catch {
      return mockDelay({
        xpEarned: 250,
        nextLessonId: mockLesson.nextLessonId
      }, 200);
    }
  },

  askAiTutor: async (question: string, context?: string): Promise<{ answer: string; relatedTopic: string }> => {
    if (!aiTutorService.isTechnicalQuery(question)) {
      return {
        answer: "Sorry this is only for Technical Purpose. Please ask questions related to programming and computer science.",
        relatedTopic: "Technical Only"
      };
    }

    const getLocalAnswer = (q: string) => {
      const lower = q.toLowerCase();
      let answer = "In computer science, functions encapsulate reusable logic into modular blocks, taking inputs (parameters) and producing predictable outputs.";
      let relatedTopic = "Functions & Modular Design";

      if (lower.includes('recursion') || lower.includes('base case') || lower.includes('stack overflow')) {
        answer = "A recursive function calls itself to solve smaller subproblems. It MUST have a base case that returns without recursing; otherwise, frames fill the call stack until a 'Maximum call stack size exceeded' or RecursionError occurs!";
        relatedTopic = "Recursion & Call Stacks";
      } else if (lower.includes('binary search') || lower.includes('bsearch')) {
        answer = "Binary search repeatedly divides a sorted collection in half. It compares the target with the middle element and discards the half where the target cannot be, running in O(log n) time.";
        relatedTopic = "Divide-and-Conquer Algorithms";
      } else if (lower.includes('*args') || lower.includes('**kwargs')) {
        answer = "*args collects variable positional arguments into a Tuple, whereas **kwargs collects arbitrary keyword arguments into a Dictionary.";
        relatedTopic = "Python Argument Packing & Unpacking";
      } else if (lower.includes('lambda')) {
        answer = "A lambda function is an anonymous inline function defined with `lambda x: expression`. Best used as short callback predicates for sorted(), filter(), or map().";
        relatedTopic = "Anonymous Functions";
      } else if (lower.includes('closure')) {
        answer = "A closure occurs when a nested inner function remembers and accesses variables from its enclosing outer scope, even after the outer function has finished executing.";
        relatedTopic = "Lexical Scoping & Closures";
      } else if (lower.includes('decorator')) {
        answer = "A decorator is a function that takes another function as an argument, extends or wraps its behavior, and returns a callable function (using the `@decorator` syntax).";
        relatedTopic = "Python Decorators & Metaprogramming";
      } else if (lower.includes('sql') || lower.includes('group by') || lower.includes('having')) {
        answer = "WHERE filters individual rows BEFORE grouping takes place. HAVING filters aggregated groups AFTER GROUP BY has collapsed rows.";
        relatedTopic = "SQL Aggregations";
      } else if (lower.includes('big o') || lower.includes('complexity')) {
        answer = "Big-O notation measures the asymptotic upper bound of algorithm runtime as input size N approaches infinity. O(1) is fastest, O(log n) is logarithmic, O(n) is linear, and O(n²) is quadratic.";
        relatedTopic = "Asymptotic Analysis";
      }

      return { answer, relatedTopic };
    };

    if (USE_MOCK_API) {
      return mockDelay(getLocalAnswer(question), 400);
    }

    try {
      const response = await apiClient.post('/lessons/ai-tutor', { question, context });
      if (response.data && response.data.answer) {
        return response.data;
      }
      return getLocalAnswer(question);
    } catch {
      return mockDelay(getLocalAnswer(question), 300);
    }
  }
};
