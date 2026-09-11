import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Brain,
  Code,
  Binary,
  Layers,
  Cpu,
  BookOpen,
  Target,
  Clock,
  Zap,
  Rocket
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Programming', 'AI & Machine Learning']);
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [learningGoal, setLearningGoal] = useState<string>('Skill Development');
  const [dailyGoal, setDailyGoal] = useState<number>(30);
  const [generationProgress, setGenerationProgress] = useState(0);

  const interestOptions = [
    { name: 'Mathematics', icon: Binary },
    { name: 'Programming', icon: Code },
    { name: 'Science', icon: Sparkles },
    { name: 'Data Science', icon: Layers },
    { name: 'AI & Machine Learning', icon: Cpu },
    { name: 'Aptitude', icon: Brain },
    { name: 'English', icon: BookOpen },
    { name: 'Computer Science', icon: Target },
  ];

  const skillOptions = [
    { level: 'Beginner', desc: 'New to programming or looking to rebuild foundations from scratch.' },
    { level: 'Intermediate', desc: 'Familiar with core syntax, looking to conquer algorithms and OOP.' },
    { level: 'Advanced', desc: 'Experienced builder seeking competitive optimization and advanced AI.' }
  ];

  const goalOptions = [
    'Exam Preparation',
    'Skill Development',
    'Career Preparation',
    'Competitive Learning',
    'Personal Growth'
  ];

  const timeOptions = [10, 20, 30, 45, 60];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // Simulated AI generation step 6
  useEffect(() => {
    if (step === 6) {
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              updateUser({
                interests: selectedInterests,
                skillLevel,
                learningGoal,
                dailyGoalMinutes: dailyGoal
              });
              navigate('/dashboard');
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-[#f2f9f5] text-slate-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base text-slate-900">GameLearn<span className="text-emerald-600">.AI</span></span>
        </div>

        {step < 6 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-600">Step {step} of 5</span>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Multi-Step Content */}
      <div className="max-w-2xl w-full mx-auto my-auto py-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-electric-500 flex items-center justify-center text-white shadow-glow-indigo mb-6 animate-float">
                <Rocket className="w-10 h-10" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Welcome to GameLearn AI, {user?.name || 'Adventurer'}!
              </h1>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-3">
                We're about to calibrate an intelligent, adaptive curriculum designed specifically for your ambitions and learning rhythm.
              </p>
              <button
                onClick={() => setStep(2)}
                className="mt-8 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm shadow-glow-indigo transition-all active:scale-95 inline-flex items-center gap-2"
              >
                <span>Let's Begin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Learning Interests */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black">What do you want to master?</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Select one or more topics to populate your world map.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interestOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedInterests.includes(item.name);
                  return (
                    <button
                      key={item.name}
                      onClick={() => toggleInterest(item.name)}
                      className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 text-indigo-400 shadow-glow-indigo'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-bold">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedInterests.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-glow-indigo inline-flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Current Skill Level */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black">What's your current experience level?</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Our AI adaptive engine will start calibrated to this baseline.</p>
              </div>

              <div className="space-y-3">
                {skillOptions.map((opt) => (
                  <div
                    key={opt.level}
                    onClick={() => setSkillLevel(opt.level as any)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      skillLevel === opt.level
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-glow-indigo'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{opt.level}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                    {skillLevel === opt.level && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo inline-flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Learning Goal */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black">What is your primary goal?</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">We'll prioritize recommendations toward this objective.</p>
              </div>

              <div className="space-y-3">
                {goalOptions.map((goal) => (
                  <div
                    key={goal}
                    onClick={() => setLearningGoal(goal)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      learningGoal === goal
                        ? 'bg-indigo-600/15 border-indigo-500 shadow-glow-indigo'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm font-bold">{goal}</span>
                    {learningGoal === goal && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo inline-flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Daily Commitment */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-black">Daily Learning Commitment</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Small daily habits build invincible momentum.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {timeOptions.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setDailyGoal(mins)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      dailyGoal === mins
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-glow-indigo'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1.5 text-slate-400" />
                    <span className="text-lg font-black block text-white">{mins}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Minutes / day</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-electric-500 text-white font-extrabold text-xs shadow-glow-indigo inline-flex items-center gap-1.5"
                >
                  <span>Build My Adventure</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: AI Building Learning Path Animation */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-cyan-500/20 border-b-cyan-400 animate-spin" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                AI is Building Your Learning Adventure...
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-2">
                Calibrating difficulty nodes, structuring world branches, and tuning spaced repetition algorithms for {user?.name || 'Kishore Kumar'}.
              </p>

              <div className="mt-8 max-w-xs mx-auto">
                <div className="flex justify-between text-xs font-bold text-indigo-400 mb-1.5">
                  <span>Synthesizing Curriculum</span>
                  <span>{generationProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-slate-500">
        GameLearn AI Cognitive Engine v2.4 • Hackathon Certified
      </div>
    </div>
  );
};
