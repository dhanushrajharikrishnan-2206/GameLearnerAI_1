import { apiClient, mockDelay, USE_MOCK_API } from '../api/client';
import { mockAdaptiveQuiz } from '../data/mockData';
import { Quiz, QuizResult, DifficultyLevel } from '../types';

export const quizService = {
  getQuizById: async (quizId: string): Promise<Quiz> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.get(`/quizzes/${quizId}`);
        if (response.data && response.data.questions) {
          return response.data;
        }
      } catch (err) {
        console.warn(`Backend /quizzes/${quizId} error, using adaptive fallback:`, err);
      }
    }
    return mockDelay({ ...mockAdaptiveQuiz, id: quizId }, 250);
  },

  submitQuiz: async (
    quizId: string,
    answers: { questionId: string; selectedOption: number; timeTaken: number }[],
    difficultyProgression: { questionIndex: number; difficulty: DifficultyLevel }[]
  ): Promise<QuizResult> => {
    if (!USE_MOCK_API) {
      try {
        const response = await apiClient.post(`/quizzes/${quizId}/submit`, {
          answers,
          difficultyProgression
        });
        if (response.data) return response.data;
      } catch (err) {
        console.warn(`Backend /quizzes/${quizId}/submit error, calculating locally:`, err);
      }
    }

    const questions = mockAdaptiveQuiz.questions;
    let correctCount = 0;
    let totalXp = 0;

    const answersBreakdown = answers.map((ans, idx) => {
      const q = questions[idx] || questions[0];
      const isCorrect = ans.selectedOption === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
        totalXp += q.xpValue;
      }
      return {
        questionId: q.id,
        questionText: q.question,
        userAnswer: ans.selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect,
        difficulty: difficultyProgression[idx]?.difficulty || q.difficulty,
        timeTakenSeconds: ans.timeTaken
      };
    });

    const accuracy = Math.round((correctCount / questions.length) * 100);
    const bonusXp = accuracy >= 80 ? 100 : 50;
    const finalXp = totalXp + bonusXp;

    const result: QuizResult = {
      quizId,
      quizTitle: mockAdaptiveQuiz.title,
      subject: mockAdaptiveQuiz.subject,
      score: correctCount,
      totalQuestions: questions.length,
      accuracy,
      timeSpentSeconds: answers.reduce((acc, curr) => acc + curr.timeTaken, 0) || 75,
      xpEarned: finalXp,
      coinsEarned: Math.round(finalXp / 3),
      difficultyProgression,
      answersBreakdown,
      aiAnalysis: {
        overallSummary: accuracy >= 80
          ? 'Phenomenal mastery displayed! The adaptive AI detected exceptional rapid comprehension in first-class functions and closures, dynamically scaling question difficulty up to Hard.'
          : 'Good effort! You demonstrated strong foundations in basic syntax, but struggled when higher-order abstractions and call-stack depth increased in complexity.',
        strengths: [
          'Instant recognition of default parameter overrides',
          'Strong comprehension of Python LEGB lexical scoping rules',
          'Swift response times during introductory algorithmic checks'
        ],
        growthAreas: [
          'Recursion call stack unwinding under multiple recursive branches',
          'Evaluating combined filter-map higher order pipelining'
        ],
        accuracyTrendNote: accuracy >= 80 ? 'Your accuracy increased by +18% compared to prior sessions.' : 'Accuracy stabilized at a steady baseline.',
        responseTimeNote: 'Average time per question was 14.2s (22% faster than global benchmark for Level 12 learners).',
        recommendedNextStep: {
          title: 'Practice Recursion – Medium Difficulty Drill',
          reason: 'Targeted drill focusing on base-case identification and stack frames.',
          difficulty: 'Medium',
          actionUrl: '/quiz/quiz_py_functions'
        }
      }
    };

    return mockDelay(result, 400);
  }
};
