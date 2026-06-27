import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ChevronRight, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Lock, 
  Plus, 
  Trash2, 
  FileCheck, 
  FolderLock, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Settings, 
  Home as HomeIcon, 
  LogOut, 
  Copy, 
  Database,
  ArrowRight,
  Sparkle,
  BookOpen,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  Star,
  Timer
} from 'lucide-react';
import { TriviaQuestion, writeValue, readValue } from '../utils/indexedDB';
import { DEFAULT_TRIVIA_QUESTIONS } from '../utils/defaultQuestions';

// Sound FX Synthesizer using Web Audio API
const playSound = (type: 'correct' | 'wrong' | 'fanfare' | 'click' | 'badge', isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99]; // C5 -> E5 -> G5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } else if (type === 'wrong') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'badge') {
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.15);
      });
    } else if (type === 'fanfare') {
      const chords = [
        [261.63, 329.63, 392.00, 523.25], 
        [349.23, 440.00, 523.25, 698.46]
      ];
      chords.forEach((frequencies, chordIdx) => {
        frequencies.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + chordIdx * 0.35);
          gain.gain.setValueAtTime(0.06, ctx.currentTime + chordIdx * 0.35);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + chordIdx * 0.35 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + chordIdx * 0.35);
          osc.stop(ctx.currentTime + chordIdx * 0.35 + 0.5);
        });
      });
    }
  } catch (error) {
    console.debug('Audio context error:', error);
  }
};

interface AttemptSummary {
  question: TriviaQuestion;
  selectedOption: number | null;
  isCorrect: boolean;
}

export default function BibleTrivia() {
  // DB & State Loading
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [totalXP, setTotalXP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Loaded Category Filter & Age Group States
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'4-8' | '9-13' | '14-18' | 'Adults' | null>(null);

  // Active quiz playing states
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [gameQuestions, setGameQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Interactive Detailed Post-Round Results View state
  const [showResults, setShowResults] = useState(false);
  const [resultsSummary, setResultsSummary] = useState<{
    score: number;
    correctCount: number;
    totalCount: number;
    ageGroup: string;
    category: string;
    attempts: AttemptSummary[];
    xpGained: number;
    isHighScore: boolean;
    timeSpent: number;
  } | null>(null);

  // Admin states
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState('');

  // New question form state
  const [newCat, setNewCat] = useState('Life of Jesus');
  const [newAgeGroup, setNewAgeGroup] = useState<'4-8' | '9-13' | '14-18' | 'Adults'>('4-8');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newExplanationText, setNewExplanationText] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Bulk tools state
  const [bulkImportText, setBulkImportText] = useState('');
  const [importNotice, setImportNotice] = useState('');

  // Load persistence states from IndexedDB on initial mount
  useEffect(() => {
    const fetchIndexedDBData = async () => {
      try {
        const savedQs = await readValue<TriviaQuestion[]>('ksf_trivia_questions_v2', []);
        if (savedQs && savedQs.length > 0) {
          setQuestions(savedQs);
        } else {
          // Store default set of interactive age-bracketed questions
          await writeValue('ksf_trivia_questions_v2', DEFAULT_TRIVIA_QUESTIONS);
          setQuestions(DEFAULT_TRIVIA_QUESTIONS);
        }

        const savedHighs = await readValue<Record<string, number>>('ksf_trivia_highscores', {});
        setHighScores(savedHighs);

        const savedXP = await readValue<number>('ksf_trivia_xp', 0);
        setTotalXP(savedXP);
      } catch (err) {
        console.error('Error fetching persistent records from IndexedDB:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIndexedDBData();
  }, []);

  // Timer Effect that counts elapsed seconds during active gameplay
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  // Update questions helper
  const handleUpdateQuestions = async (newQs: TriviaQuestion[]) => {
    setQuestions(newQs);
    await writeValue('ksf_trivia_questions_v2', newQs);
  };

  // Update highscores helper
  const handleUpdateScores = async (newScores: Record<string, number>) => {
    setHighScores(newScores);
    await writeValue('ksf_trivia_highscores', newScores);
  };

  // Update global XP counter
  const handleUpdateXP = async (newXP: number) => {
    setTotalXP(newXP);
    await writeValue('ksf_trivia_xp', newXP);
  };

  // Filter categories available dynamically based on selected ageGroup
  const getCategoriesForAge = () => {
    if (!selectedAgeGroup) return ['All'];
    const filteredQuestions = questions.filter(q => q.ageGroup === selectedAgeGroup);
    const unique = Array.from(new Set(filteredQuestions.map(q => q.category)));
    return ['All', ...unique];
  };

  const activeCategories = getCategoriesForAge();

  // Handle Game Play Starter
  const startQuiz = (category: string) => {
    if (!selectedAgeGroup) return;
    playSound('click', isMuted);
    setActiveCategory(category);
    
    // Filter questions by age group and category
    const agePool = questions.filter(q => q.ageGroup === selectedAgeGroup);
    const pool = category === 'All' 
      ? [...agePool]
      : agePool.filter(q => q.category === category);
    
    if (pool.length === 0) {
      alert("No questions configured for this selection yet! Add some in the Admin settings console.");
      return;
    }
    
    // Shuffle pool robustly using Fisher-Yates and select max 5 questions for rapid, fun gameplay bites
    const shuffledPool = [...pool];
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }

    // Clone the selected questions and randomize their options dynamically while preserving the correct answer index
    const finalizedQuestions = shuffledPool.slice(0, 5).map(q => {
      const options = [...q.options];
      const correctText = options[q.correctAnswer];
      
      // Shuffle options using Fisher-Yates
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      
      const newCorrectAnswerIndex = options.indexOf(correctText);
      return {
        ...q,
        options,
        correctAnswer: newCorrectAnswerIndex !== -1 ? newCorrectAnswerIndex : q.correctAnswer
      };
    });
    
    // Setup initial running states
    setGameQuestions(finalizedQuestions);
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setStreak(0);
    setMaxStreak(0);
    setCurrentScore(0);
    setElapsedTime(0);
    setShowExplanation(false);
    setShowResults(false);
    setResultsSummary(null);
    setIsPlaying(true);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerLocked) return;
    setSelectedOption(index);
    playSound('click', isMuted);
  };

  // Track attempts for final post-round results screen
  const [roundAttempts, setRoundAttempts] = useState<AttemptSummary[]>([]);

  useEffect(() => {
    if (isPlaying && currentIdx === 0) {
      setRoundAttempts([]);
    }
  }, [isPlaying, currentIdx]);

  const submitAnswer = () => {
    if (selectedOption === null || isAnswerLocked) return;
    
    setIsAnswerLocked(true);
    const activeQ = gameQuestions[currentIdx];
    const isCorrect = selectedOption === activeQ.correctAnswer;

    // Record attempt
    setRoundAttempts(prev => [
      ...prev,
      {
        question: activeQ,
        selectedOption: selectedOption,
        isCorrect: isCorrect
      }
    ]);

    if (isCorrect) {
      playSound('correct', isMuted);
      setStreak(prev => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setCurrentScore(prev => prev + 20); // 20 XP per correct response
    } else {
      playSound('wrong', isMuted);
      setStreak(0);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    playSound('click', isMuted);
    
    if (currentIdx >= gameQuestions.length - 1) {
      finishRound();
    } else {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerLocked(false);
      setShowExplanation(false);
    }
  };

  const finishRound = async () => {
    playSound('fanfare', isMuted);
    
    const key = `${selectedAgeGroup}:${activeCategory}`;
    const oldTopScore = highScores[key] || 0;
    const isNewHighScore = currentScore > oldTopScore;
    
    // Calculate new highscores Record
    if (isNewHighScore) {
      const nextHighScores = {
        ...highScores,
        [key]: currentScore
      };
      await handleUpdateScores(nextHighScores);
    }

    // Award XP globally
    const nextXP = totalXP + currentScore;
    await handleUpdateXP(nextXP);

    // Compute attempts fraction
    const correctCount = roundAttempts.filter(a => a.isCorrect).length + (selectedOption === gameQuestions[currentIdx].correctAnswer ? 1 : 0);
    
    // Insert final question attempt into summary safely
    const finalActiveQ = gameQuestions[currentIdx];
    const finalIsCorrect = selectedOption === finalActiveQ.correctAnswer;
    const finalRoundAttempts = [
      ...roundAttempts,
      {
        question: finalActiveQ,
        selectedOption: selectedOption,
        isCorrect: finalIsCorrect
      }
    ];

    // Compile Results summary data
    setResultsSummary({
      score: currentScore,
      correctCount: correctCount,
      totalCount: gameQuestions.length,
      ageGroup: selectedAgeGroup || 'General',
      category: activeCategory,
      attempts: finalRoundAttempts,
      xpGained: currentScore,
      isHighScore: isNewHighScore,
      timeSpent: elapsedTime
    });

    setIsPlaying(false);
    setShowResults(true);
    
    // Reset states
    setSelectedOption(null);
    setIsAnswerLocked(false);
    setShowExplanation(false);
  };

  const exitQuiz = () => {
    playSound('click', isMuted);
    setIsPlaying(false);
    setShowResults(false);
  };

  // Admin operations
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === 'admin123') {
      setIsAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminError('Invalid passcode! Please use default: admin123');
      setIsAdminAuthenticated(false);
    }
  };

  const createQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newOptions.some(opt => !opt.trim())) {
      setAdminError('Please key in all options and question prompt.');
      return;
    }

    const q: TriviaQuestion = {
      id: 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      category: newCat.trim(),
      ageGroup: newAgeGroup,
      question: newQuestionText.trim(),
      options: newOptions.map(o => o.trim()),
      correctAnswer: newCorrectIdx,
      explanation: newExplanationText.trim() || 'A rich, scriptural truth to cherish.'
    };

    const nextQs = [q, ...questions];
    await handleUpdateQuestions(nextQs);

    // Reset fields
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewExplanationText('');
    setFormSuccess('Biblical question loaded live to Arena database! 📖⛪');
    playSound('badge', isMuted);
    setTimeout(() => setFormSuccess(''), 4000);
  };

  const deleteQuestion = async (id: string) => {
    const nextQs = questions.filter(q => q.id !== id);
    await handleUpdateQuestions(nextQs);
    playSound('wrong', isMuted);
  };

  const resetToDefaultTrivia = async () => {
    if (window.confirm('Revert all Arena questions back to Sunday school defaults? Your custom ones will be archived.')) {
      await handleUpdateQuestions(DEFAULT_TRIVIA_QUESTIONS);
      playSound('badge', isMuted);
    }
  };

  const resetHighScores = async () => {
    if (window.confirm('Wipe out all stored high scores and overall user XP accumulated so far?')) {
      await handleUpdateScores({});
      await handleUpdateXP(0);
      playSound('wrong', isMuted);
    }
  };

  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(bulkImportText);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question) {
        const formatted = parsed.map((item: any, idx: number) => ({
          id: 'imported-' + idx + '-' + Date.now(),
          category: item.category || 'Sunday School',
          ageGroup: item.ageGroup || 'General',
          question: item.question,
          options: item.options || ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: typeof item.correctAnswer === 'number' ? item.correctAnswer : 0,
          explanation: item.explanation || 'Teaching tip scriptural lesson'
        }));
        await handleUpdateQuestions([...formatted, ...questions]);
        setImportNotice(`Loaded ${formatted.length} scripture entries into high-performance IndexedDB! ✨`);
        setBulkImportText('');
        playSound('badge', isMuted);
        setTimeout(() => setImportNotice(''), 4000);
      } else {
        setAdminError('Failed structures. Input must represent an array of biblical trivia objects.');
      }
    } catch (err: any) {
      setAdminError('JSON Parse error: ' + err.message);
    }
  };

  // Calculated achievements based on global IndexedDB XP
  const getBadges = () => {
    const arr = [];
    if (totalXP >= 50) {
      arr.push({ label: 'Bible Apprentice 🌟', desc: 'Reached 50 cumulative Bible XP.' });
    }
    if (totalXP >= 200) {
      arr.push({ label: 'Word Seeker 🕊️', desc: 'Accumulated 200 high-score XP. Growing robustly!' });
    }
    if (totalXP >= 500) {
      arr.push({ label: 'Covenant Scholar 💎', desc: 'Passed 500 Scripture XP score! Outstanding wisdom!' });
    }
    if (Object.keys(highScores).length >= 3) {
      arr.push({ label: 'Sword of Spirit ⚔️', desc: 'Conquered high scores on 3 distinct bible study brackets!' });
    }
    return arr;
  };

  const unlockedBadges = getBadges();

  return (
    <div className="min-h-screen bg-ksf-gray-bg pt-24 pb-16">
      {/* Background visual shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-bold-red/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-blue/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Dynamic header navigation banner */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-ksf-white p-5 rounded-3xl border border-black/[0.04] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-blue/5 flex items-center justify-center text-primary-blue">
              <Sparkles size={24} className="animate-pulse text-sky-blue" />
            </div>
            <div>
              <span className="font-accent font-black text-[10px] tracking-wider uppercase text-sky-blue">
                CHURCH SUNDAY SCHOOL
              </span>
              <h1 className="font-headlines font-black text-2xl text-primary-blue leading-none mt-0.5">
                Bible Trivia Arena
              </h1>
            </div>
          </div>

          {/* Current Score XP tracker */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#FAF9F5] hover:bg-amber-50 px-4 py-2.5 rounded-2xl border border-yellow-100 flex items-center gap-2.5 shadow-sm transition-colors duration-300">
              <Award className="text-yellow-600 fill-yellow-600/10" size={20} />
              <div>
                <p className="text-[9px] font-accent font-black text-amber-800 uppercase tracking-widest leading-none">
                  Total Score
                </p>
                <p className="font-accent font-semibold text-base text-[#0D3875] leading-none mt-1">
                  {totalXP} <span className="text-xs font-normal text-sky-blue">XP</span>
                </p>
              </div>
            </div>

            {/* Sound Level Muter */}
            <button
              onClick={() => {
                const n = !isMuted;
                setIsMuted(n);
                playSound('click', n);
              }}
              className="w-10 h-10 bg-ksf-white border border-black/[0.08] hover:bg-ksf-gray-bg rounded-xl flex items-center justify-center text-ksf-dark-text/70 transition-colors"
              title={isMuted ? 'Turn Sound On' : 'Turn Sound Off'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Admin toggle console triggers */}
            <button
              onClick={() => {
                playSound('click', isMuted);
                setIsAdminPanelOpen(true);
              }}
              className="bg-primary-blue/[0.06] hover:bg-primary-blue text-primary-blue hover:text-ksf-white p-3.5 rounded-xl font-accent font-bold text-[10px] tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5"
            >
              <Settings size={14} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-ksf-white/60 rounded-[2.5rem] border border-black/[0.05] shadow-lg backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue mb-4"></div>
            <p className="font-accent font-bold text-xs text-primary-blue uppercase tracking-wider animate-pulse">
              Syncing IndexedDB Scripture Dataset...
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* 1. QUIZ ARENA SYSTEM */}
            {isPlaying ? (
              <motion.div
                key="active-quiz"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-ksf-white rounded-3xl border border-black/[0.04] overflow-hidden shadow-xl">
                  
                  {/* Category and Index Bar */}
                  <div className="bg-[#0D3875] px-6 py-4 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-blue/20 text-white text-[10px] font-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        🧒 {selectedAgeGroup} Years
                      </span>
                      <span className="text-white/60 text-xs">|</span>
                      <span className="text-sky-200 text-xs font-semibold">{activeCategory}</span>
                    </div>
                    <button 
                      onClick={exitQuiz}
                      className="text-white/70 hover:text-white text-[10px] font-accent font-bold tracking-widest uppercase flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <LogOut size={12} />
                      <span>Quit</span>
                    </button>
                  </div>

                  {/* Horizontal progress indicators */}
                  <div className="w-full bg-ksf-gray-bg h-1.5">
                    <div 
                      className="bg-bold-red h-full transition-all duration-300 ease-out"
                      style={{ width: `${((currentIdx + 1) / gameQuestions.length) * 100}%` }}
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* Progress details */}
                    <div className="flex justify-between items-center text-xs text-ksf-dark-text/45 font-bold uppercase tracking-wider mb-4">
                      <span>Question {currentIdx + 1} of {gameQuestions.length}</span>
                      <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-mono text-xs font-semibold animate-pulse shadow-xs">
                        <Timer size={13} className="text-yellow-600" />
                        <span>{elapsedTime}s</span>
                      </div>
                      <span className="text-[#CC1B1B] font-mono">+{currentScore} XP Potential</span>
                    </div>

                    <h2 className="font-headlines font-black text-xl sm:text-2xl text-primary-blue leading-snug tracking-tight mb-8">
                      {gameQuestions[currentIdx]?.question}
                    </h2>

                    {/* Options list */}
                    <div className="space-y-3 mb-6">
                      {gameQuestions[currentIdx]?.options.map((optionText, i) => {
                        let style = "border-black/[0.06] bg-ksf-white hover:bg-ksf-gray-bg/50 text-ksf-dark-text";
                        
                        if (selectedOption === i) {
                          style = "border-sky-blue bg-sky-blue/5 text-sky-blue ring-1 ring-sky-blue";
                        }

                        if (isAnswerLocked) {
                          if (i === gameQuestions[currentIdx].correctAnswer) {
                            style = "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold";
                          } else if (selectedOption === i) {
                            style = "border-red-600 bg-red-50 text-red-900 line-through";
                          } else {
                            style = "border-black/[0.04] bg-ksf-gray-bg/30 text-ksf-dark-text/40 opacity-70";
                          }
                        }

                        return (
                          <button
                            key={i}
                            disabled={isAnswerLocked}
                            onClick={() => handleSelectOption(i)}
                            className={`w-full text-left p-4.5 rounded-xl border flex items-center justify-between transition-all duration-200 text-sm sm:text-base cursor-pointer ${style}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                selectedOption === i ? 'bg-sky-blue text-white' : 'bg-ksf-gray-bg text-ksf-dark-text/50'
                              }`}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span>{optionText}</span>
                            </span>

                            {isAnswerLocked && i === gameQuestions[currentIdx].correctAnswer && (
                              <span className="text-emerald-700 font-accent font-black text-[9px] uppercase tracking-wider bg-emerald-100/60 px-2 py-1 rounded">
                                Correct Answer ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Animated Explanation bar after locking */}
                    <AnimatePresence>
                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-yellow-50/50 rounded-xl border border-yellow-200/50 p-4 mb-6"
                        >
                          <div className="flex gap-2 text-xs text-yellow-800">
                            <span className="text-lg leading-none">📖</span>
                            <div>
                              <p className="font-accent font-black uppercase tracking-wider mb-1 text-yellow-900 text-[10px]">
                                Scripture Truth Spotlight
                              </p>
                              <p className="font-body text-yellow-900/80 leading-relaxed">
                                {gameQuestions[currentIdx]?.explanation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Footer buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-black/[0.04]">
                      <div className="flex items-center gap-1">
                        {streak > 1 && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-accent font-bold tracking-wider px-3 py-1 rounded-full uppercase animate-bounce">
                            🔥 {streak} Streak
                          </span>
                        )}
                      </div>

                      {!isAnswerLocked ? (
                        <button
                          onClick={submitAnswer}
                          disabled={selectedOption === null}
                          className={`px-6 py-2.5 rounded-xl font-accent font-bold text-[10px] tracking-wider uppercase transition-all flex items-center gap-1.5 select-none ${
                            selectedOption !== null 
                              ? 'bg-bold-red text-white hover:bg-bold-red/90 transform scale-[1.02] active:scale-[0.98] shadow-md shadow-bold-red/10 cursor-pointer' 
                              : 'bg-ksf-gray-bg text-ksf-dark-text/30 cursor-not-allowed'
                          }`}
                        >
                          <span>Lock Choice</span>
                          <FileCheck size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={nextQuestion}
                          className="px-6 py-2.5 bg-[#0D3875] text-white hover:bg-sky-blue rounded-xl font-accent font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 transition-all transform scale-[1.02] cursor-pointer"
                        >
                          <span>
                            {currentIdx >= gameQuestions.length - 1 ? 'Analyze Results' : 'Continue'}
                          </span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : showResults && resultsSummary ? (
              
              // 2. GORGEOUS DETAILED RESULTS BREAKDOWN AFTER TRIVIAS
              <motion.div
                key="results-screen"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                {/* Main celebratory result card */}
                <div className="bg-ksf-white border border-black/[0.05] rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
                  
                  {/* Success gradient shine */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 via-sky-400 to-amber-500" />
                  
                  <div className="text-center space-y-4">
                    <div className="inline-flex w-20 h-20 bg-yellow-50 border border-yellow-100 rounded-3xl items-center justify-center text-yellow-600 shadow-inner animate-pulse">
                      <Trophy size={44} className="fill-yellow-600/10" />
                    </div>

                    <div className="space-y-1">
                      <p className="font-accent font-black tracking-widest text-[#0D3875] uppercase text-xs">
                        MODULE COMPLETED SUCCESS
                      </p>
                      <h2 className="font-headlines font-black text-3xl sm:text-4xl text-primary-blue">
                        {resultsSummary.score === 100 ? '👑 Holy Scripture Champion!' : '🌟 Wonderful Bible Study Session!'}
                      </h2>
                    </div>

                    {/* Level Rating Text feedback based on score */}
                    <div className="bg-ksf-gray-bg p-3 rounded-2xl max-w-md mx-auto border border-black/[0.02]">
                      <p className="font-body text-xs text-ksf-dark-text/80 leading-relaxed font-semibold">
                        {resultsSummary.score === 100 
                          ? "Fabulous! You got every question correct! You possess the wisdom of a true scriptural leader! 🎓🕊️" 
                          : resultsSummary.score >= 80 
                          ? "Amazing! You achieved a superb score. True dedication to studying Sunday school records! ⭐" 
                          : resultsSummary.score >= 60 
                          ? "Nicely done! You possess very robust Scripture basics. Keep exploring to push towards 100%!" 
                          : "Great attempt! Understanding the Bible is a lifelong exploration. Replay to upgrade your score!"}
                      </p>
                    </div>

                    {/* Circular metrics row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
                      <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-center">
                        <span className="block font-mono text-xl sm:text-2xl font-black text-emerald-800">
                          {resultsSummary.correctCount}/{resultsSummary.totalCount}
                        </span>
                        <span className="text-[9px] font-accent font-bold text-emerald-700 uppercase tracking-wide block">
                          Accuracy ({Math.round((resultsSummary.correctCount / resultsSummary.totalCount) * 100)}%)
                        </span>
                      </div>
                      <div className="bg-sky-50 border border-sky-100 p-3 rounded-xl text-center">
                        <span className="block font-mono text-xl sm:text-2xl font-black text-sky-800">
                          +{resultsSummary.xpGained}
                        </span>
                        <span className="text-[9px] font-accent font-bold text-sky-700 uppercase tracking-wide block">
                          XP Earned
                        </span>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-center">
                        <span className="block font-mono text-xl sm:text-2xl font-black text-amber-800">
                          {resultsSummary.timeSpent}s
                        </span>
                        <span className="text-[9px] font-accent font-bold text-amber-700 uppercase tracking-wide block">
                          Time taken (avg: {Math.round((resultsSummary.timeSpent / resultsSummary.totalCount) * 10) / 10}s/q)
                        </span>
                      </div>
                      <div className="bg-pink-50 border border-pink-100 p-3 rounded-xl text-center flex flex-col justify-center items-center">
                        {resultsSummary.isHighScore ? (
                          <>
                            <span className="block text-sm font-black text-[#CC1B1B] animate-pulse">👑 NEW TOP</span>
                            <span className="text-[9px] font-accent font-bold text-[#CC1B1B] uppercase tracking-wide leading-none mt-1">
                              Highscore
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="block font-mono text-base font-black text-[#0D3875]">
                              {highScores[`${selectedAgeGroup}:${activeCategory}`] || 100} XP
                            </span>
                            <span className="text-[9px] font-accent font-bold text-ksf-dark-text/50 uppercase tracking-wide leading-none mt-1">
                              Record High
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* IN-DEPTH VERIFIED REVIEW LIST */}
                  <div className="mt-10 border-t border-black/[0.04] pt-8 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="text-primary-blue animate-bounce" size={20} />
                      <h3 className="font-headlines font-black text-lg text-primary-blue uppercase tracking-tight">
                        Self-Study Corrections & Scripture Citations
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {resultsSummary.attempts.map((attempt, index) => (
                        <div 
                          key={index} 
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            attempt.isCorrect 
                              ? 'border-emerald-500/10 bg-emerald-50/[0.15]' 
                              : 'border-red-500/10 bg-red-50/[0.15]'
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            {attempt.isCorrect ? (
                              <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                            ) : (
                              <XCircle className="text-red-600 shrink-0 mt-0.5" size={16} />
                            )}
                            <div className="space-y-2 select-all">
                              <p className="font-headlines font-bold text-sm text-primary-blue">
                                {index + 1}. {attempt.question.question}
                              </p>
                              
                              {/* Option values with indicator */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                                {attempt.question.options.map((optionText, optIdx) => {
                                  let pillStyle = "bg-ksf-white border-black/[0.04] text-ksf-dark-text/70";
                                  
                                  if (optIdx === attempt.question.correctAnswer) {
                                    pillStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
                                  } else if (optIdx === attempt.selectedOption && !attempt.isCorrect) {
                                    pillStyle = "bg-red-50 border-red-300 text-red-900 line-through";
                                  }

                                  return (
                                    <div key={optIdx} className={`p-2 rounded-lg border text-[11px] ${pillStyle}`}>
                                      <span className="font-bold font-mono mr-1.5">{String.fromCharCode(65 + optIdx)})</span>
                                      {optionText}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Scriptural basis */}
                              <p className="text-[11px] text-ksf-dark-text/75 bg-ksf-white border border-black/5 p-2 rounded-xl mt-2 leading-relaxed">
                                <span className="font-accent font-black text-[#1A52A8] text-[9px] uppercase tracking-wider block mb-0.5">
                                  Biblical context lesson:
                                </span>
                                {attempt.question.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Round Exit Actions */}
                  <div className="mt-8 pt-6 border-t border-black/[0.04] flex flex-wrap gap-2.5 justify-center">
                    <button
                      onClick={() => startQuiz(resultsSummary.category)}
                      className="px-6 py-3 bg-bold-red text-ksf-white hover:bg-bold-red/90 rounded-xl font-accent font-bold text-[10px] tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-bold-red/10"
                    >
                      <RotateCcw size={12} />
                      <span>Play Again</span>
                    </button>
                    <button
                      onClick={() => {
                        playSound('click', isMuted);
                        setShowResults(false);
                        setResultsSummary(null);
                      }}
                      className="px-6 py-3 bg-[#0D3875] text-ksf-white hover:bg-sky-blue rounded-xl font-accent font-bold text-[10px] tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bookmark size={12} />
                      <span>Choose other category</span>
                    </button>
                    <button
                      onClick={() => {
                        playSound('click', isMuted);
                        setSelectedAgeGroup(null);
                        setShowResults(false);
                      }}
                      className="px-6 py-3 bg-ksf-gray-bg border border-black/[0.06] text-ksf-dark-text hover:bg-black/5 rounded-xl font-accent font-bold text-[10px] tracking-wider uppercase transition-colors"
                    >
                      🧸 Choose different Age Group
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : !selectedAgeGroup ? (
              
              // 3. SELECTION SCREEN FOR AGE GROUPS
              <motion.div
                key="age-selector"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* Intro Hero with Beautiful Branding */}
                <div className="p-6 sm:p-10 bg-gradient-to-br from-[#0D3875] to-[#1a4a8c] rounded-3xl text-white shadow-lg relative overflow-hidden">
                  
                  {/* Subtle graphics */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC1B1B]/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sky-blue/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="max-w-2xl relative z-10 space-y-3">
                    <div className="bg-[#CC1B1B] text-white text-[9px] font-accent font-black px-3.5 py-1 rounded-full uppercase tracking-[2px] inline-flex items-center gap-1.5">
                      <Sparkle size={10} className="fill-white" />
                      <span>SCRIPTURE EDUCATION CORNER</span>
                    </div>
                    <h2 className="font-headlines font-black text-2xl sm:text-4xl text-white tracking-tight pt-1 leading-none uppercase">
                      Select Your Age Bracket Arena
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-white/80 leading-relaxed">
                      Grow in faith, wisdom, and fellowship by selection of custom biblical questionnaires! Select your corresponding bracket to download calibrated scripture questions in durable IndexedDB memory.
                    </p>
                  </div>
                </div>

                {/* Age group selective Grid */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="text-sky-blue" size={20} />
                    <h3 className="font-headlines font-black text-xl text-primary-blue uppercase tracking-tight">
                      Available Scripture Age Levels
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { 
                        id: '4-8', 
                        title: 'Little Lambs 🧸', 
                        subtitle: '4-8 Years', 
                        desc: 'Simple stories including baby Jesus, Noah\'s ark, and heroic Moses with bright visual clues.',
                        color: 'border-yellow-200 bg-yellow-50/20 hover:bg-yellow-50/50 hover:shadow-yellow-100',
                        badge: 'Beginner'
                      },
                      { 
                        id: '9-13', 
                        title: 'Word Seekers 🗺️', 
                        subtitle: '9-13 Years', 
                        desc: 'Key miraculous lessons, Old Testament adventures, and teachings of Jesus made beautifully interactive.',
                        color: 'border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/50 hover:shadow-emerald-100',
                        badge: 'Explorer'
                      },
                      { 
                        id: '14-18', 
                        title: 'Scripture Challengers 🔥', 
                        subtitle: '14-18 Years', 
                        desc: 'Spiritual armor lessons, Old Testament prophecies, letters of Apostle Paul, and deep character studies.',
                        color: 'border-sky-200 bg-sky-50/20 hover:bg-sky-50/50 hover:shadow-sky-100',
                        badge: 'Challenger'
                      },
                      { 
                        id: 'Adults', 
                        title: 'Theologians 📖', 
                        subtitle: 'Adults (18+)', 
                        desc: 'Theological doctrines, original historical judges, complex timeline metrics, and epistolary insights.',
                        color: 'border-purple-200 bg-purple-50/20 hover:bg-purple-50/50 hover:shadow-purple-100',
                        badge: 'Theologian'
                      }
                    ].map((group) => {
                      const count = questions.filter(q => q.ageGroup === group.id).length;
                      
                      return (
                        <div
                          key={group.id}
                          onClick={() => {
                            playSound('click', isMuted);
                            setSelectedAgeGroup(group.id as any);
                          }}
                          className={`rounded-2xl border-2 p-5 cursor-pointer flex flex-col justify-between h-[230px] transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${group.color}`}
                        >
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-accent font-bold uppercase tracking-wider text-[#1A52A8] bg-white border border-black/5 px-2 py-0.5 rounded-full">
                                {group.badge}
                              </span>
                              <span className="text-xs font-bold text-ksf-dark-text/40">{count} Entry Qs</span>
                            </div>
                            <h4 className="font-headlines font-black text-lg text-primary-blue mt-1">
                              {group.title}
                            </h4>
                            <p className="text-xs text-ksf-dark-text/70 leading-relaxed line-clamp-3">
                              {group.desc}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-black/[0.04] flex items-center justify-between">
                            <span className="font-accent font-bold text-[10px] text-ksf-dark-text/60">{group.subtitle}</span>
                            <span className="text-xs text-[#0D3875] font-black flex items-center gap-1">
                              Enter <ChevronRight size={14} className="text-bold-red" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ACHIEVEMENTS AND UNLOCKED BADGES FOOTER PANEL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  
                  {/* High Scores summary */}
                  <div className="bg-ksf-white border border-black/[0.04] p-6 rounded-3xl shadow-sm flex flex-col justify-between h-[270px]">
                    <div>
                      <h4 className="font-headlines font-black text-base text-primary-blue mb-1 flex items-center gap-2">
                        <Trophy className="text-yellow-600 fill-yellow-600/10" size={16} />
                        Your High Scores
                      </h4>
                      <p className="text-[11px] text-ksf-dark-text/50 leading-tight">
                        Beat individual brackets list to post records.
                      </p>
                    </div>

                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto mt-3 pr-1">
                      {Object.keys(highScores).length > 0 ? (
                        Object.entries(highScores).map(([key, score]) => {
                          const [age, cat] = key.split(':');
                          return (
                            <div key={key} className="flex justify-between items-center text-[11px] bg-ksf-gray-bg/60 p-2 rounded-xl border border-black/5">
                              <span className="font-semibold text-primary-blue truncate max-w-[80%]">
                                🧒 {age}y | {cat}
                              </span>
                              <span className="text-bold-red font-bold shrink-0">{score} XP</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-10 text-xs text-ksf-dark-text/30">
                          No score stats posted. Start playing!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges and achievements */}
                  <div className="md:col-span-2 bg-ksf-white border border-black/[0.04] p-6 rounded-3xl shadow-sm flex flex-col justify-between h-[270px]">
                    <div>
                      <h4 className="font-headlines font-black text-base text-primary-blue mb-1 flex items-center gap-2">
                        <Award className="text-bold-red" size={16} />
                        Scholar Badges Achievements ({unlockedBadges.length})
                      </h4>
                      <p className="text-[11px] text-ksf-dark-text/50 leading-tight">
                        Earn special status by compiling global arena point systems.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[170px] overflow-y-auto mt-3 pr-1">
                      {unlockedBadges.length > 0 ? (
                        unlockedBadges.map((badge, idx) => (
                          <div key={idx} className="bg-ksf-gray-bg/60 p-2.5 rounded-xl border border-black/5 flex items-start gap-2 text-[11px]">
                            <span className="text-base select-none">🏅</span>
                            <div>
                              <p className="font-headlines font-bold text-xs text-primary-blue leading-none">
                                {badge.label}
                              </p>
                              <p className="text-[10px] text-ksf-dark-text/50 font-body leading-tight mt-1">
                                {badge.desc}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-12 text-xs text-ksf-dark-text/30">
                          Accumulate at least 50 overall XP points to unlock your initial disciple badge!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              
              // 4. CATEGORY SELECTOR FOR CHOSEN AGE GROUP
              <motion.div
                key="category-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Back button and label */}
                <div className="flex justify-between items-center bg-ksf-white p-3.5 px-5 rounded-2xl border border-black/[0.04] shadow-sm">
                  <button
                    onClick={() => {
                      playSound('click', isMuted);
                      setSelectedAgeGroup(null);
                    }}
                    className="text-xs text-[#0D3875] font-accent font-bold hover:text-bold-red flex items-center gap-1 cursor-pointer"
                  >
                    ← Back to choosing Age Level
                  </button>
                  <p className="font-accent font-black text-[10px] uppercase text-sky-blue tracking-wide">
                    🧒 Selected group: {selectedAgeGroup} Years
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'All', icon: '🌍', color: 'border-primary-blue bg-primary-blue/[0.01]', text: 'Random selection from all topics in your age group.' },
                    { name: 'Life of Jesus', icon: '🌟', color: 'border-amber-500 bg-amber-500/[0.01]', text: 'Birth, childhood, miraculous parables, and teachings.' },
                    { name: 'Old Testament', icon: '📜', color: 'border-sky-blue bg-sky-blue/[0.01]', text: 'Genesis creation, Exodus, Mount Sinai, prophets, and major events.' },
                    { name: 'New Testament', icon: '🕊️', color: 'border-emerald-500 bg-emerald-500/[0.01]', text: 'Acts of Apostles, Paul\'s letters, and core doctrines.' },
                    { name: 'Bible Heroes', icon: '🦁', color: 'border-purple-500 bg-purple-500/[0.01]', text: 'David, Samson, Daniel, Gideon, and courageous champions.' }
                  ].map((cat) => {
                    const filteredQs = questions.filter(q => q.ageGroup === selectedAgeGroup);
                    const count = cat.name === 'All'
                      ? filteredQs.length
                      : filteredQs.filter(q => q.category === cat.name).length;

                    const scoreKey = `${selectedAgeGroup}:${cat.name}`;
                    const scoreVal = highScores[scoreKey] || 0;

                    return (
                      <div
                        key={cat.name}
                        className={`rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 h-[230px] ${cat.color}`}
                      >
                        <div>
                          <span className="text-3xl block mb-2">{cat.icon}</span>
                          <h4 className="font-headlines font-black text-base text-primary-blue mb-1">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-ksf-dark-text/70 line-clamp-3 leading-snug">
                            {cat.text}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-black/[0.04]">
                          <div className="flex items-center justify-between mb-3 text-[10px]">
                            <span className="font-bold text-ksf-dark-text/40">{count} Questions available</span>
                            {scoreVal > 0 && (
                              <span className="text-[9px] font-accent font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                High {scoreVal} XP
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => startQuiz(cat.name)}
                            disabled={count === 0}
                            className={`w-full py-2 rounded-xl font-accent font-bold text-[9px] tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              count > 0 
                                ? 'bg-primary-blue hover:bg-bold-red text-white' 
                                : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                            }`}
                          >
                            <span>{count > 0 ? 'Start session' : 'Comes soon'}</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}

        {/* ======================================= */}
        {/* WEBPAGE ADMIN CUSTOM CONSOLE MODAL       */}
        {/* ======================================= */}
        <AnimatePresence>
          {isAdminPanelOpen && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              
              {/* Overlay backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAdminPanelOpen(false)}
                className="absolute inset-0 bg-ksf-dark-text/80 backdrop-blur-sm"
              />

              {/* Console Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="relative bg-ksf-white border border-black/5 w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl z-20 flex flex-col p-5 sm:p-8"
              >
                {/* Header info */}
                <div className="flex justify-between items-center pb-4 border-b border-black/[0.06] mb-6">
                  <div className="flex items-center gap-2">
                    <FolderLock className="text-bold-red" size={20} />
                    <h3 className="font-headlines font-black text-xl text-primary-blue uppercase tracking-tight">
                      Admin Settings Portal
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      playSound('click', isMuted);
                      setIsAdminPanelOpen(false);
                    }}
                    className="px-3.5 py-1.5 bg-ksf-gray-bg hover:bg-bold-red/10 hover:text-bold-red font-accent font-black text-[9px] tracking-wider uppercase rounded-lg transition-all"
                  >
                    Close panel
                  </button>
                </div>

                {!isAdminAuthenticated ? (
                  /* PASSWORD AUTH */
                  <form onSubmit={handleAdminVerify} className="max-w-md mx-auto py-10 text-center space-y-4">
                    <Lock className="mx-auto text-primary-blue/30 mb-2" size={40} />
                    <h4 className="font-headlines font-black text-lg text-primary-blue">
                      Access Authorized Credentials
                    </h4>
                    <p className="text-xs text-ksf-dark-text/60 font-body">
                      Please enter default school passcode: <code className="bg-ksf-gray-bg px-2 py-0.5 rounded font-mono text-bold-red font-bold">admin123</code>.
                    </p>

                    <div className="space-y-3">
                      <input 
                        type="password"
                        placeholder="Passcode string"
                        value={adminPasscode}
                        onChange={(e) => setAdminPasscode(e.target.value)}
                        className="w-full h-11 bg-ksf-gray-bg rounded-xl px-4 text-xs font-semibold text-primary-blue text-center focus:ring-1 focus:ring-primary-blue outline-none border border-black/5"
                        required
                        autoFocus
                      />
                      {adminError && (
                        <p className="text-red-600 text-xs font-bold">{adminError}</p>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-[#0D3875] hover:bg-bold-red text-white h-11 rounded-xl font-accent font-bold text-[10px] tracking-widest uppercase transition-all"
                      >
                        Unlock Database Controls
                      </button>
                    </div>
                  </form>
                ) : (
                  /* LOGGED ACTIONS */
                  <div className="space-y-8 text-xs">
                    
                    {/* Welcome Banner */}
                    <div className="flex flex-col sm:flex-row justify-between bg-emerald-50/80 p-4 rounded-xl border border-emerald-100 gap-3">
                      <div>
                        <h4 className="text-emerald-900 font-headlines font-bold text-sm flex items-center gap-1.5">
                          <span>✓ Live Database Access Authorized</span>
                        </h4>
                        <p className="text-[10px] text-emerald-800 leading-relaxed mt-0.5 max-w-xl">
                          Your mutations execute directly inside local browser IndexedDB storage and survive cache deletion.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 self-center shrink-0">
                        <button
                          onClick={resetToDefaultTrivia}
                          className="bg-white hover:bg-amber-600 hover:text-white text-amber-600 border border-amber-500/30 px-3 py-1.5 rounded-lg text-[9px] font-accent font-bold uppercase transition-colors"
                        >
                          Restore Defaults
                        </button>
                        <button
                          onClick={resetHighScores}
                          className="bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg text-[9px] font-accent font-bold uppercase transition-colors"
                        >
                          Clear Scores & XP
                        </button>
                        <button
                          onClick={() => setIsAdminAuthenticated(false)}
                          className="bg-white hover:bg-ksf-dark-text hover:text-white text-ksf-dark-text border border-black/10 px-3 py-1.5 rounded-lg text-[9px] font-accent font-bold uppercase transition-colors"
                        >
                          Lock Out
                        </button>
                      </div>
                    </div>

                    {/* NEW QUESTION CREATOR FORM */}
                    <div className="bg-ksf-gray-bg/40 p-4 sm:p-6 rounded-2xl border border-black/[0.04]">
                      <h4 className="font-headlines font-black text-base text-primary-blue mb-4 flex items-center gap-1.5 uppercase">
                        <Plus className="text-sky-blue" size={16} />
                        Add New Calibration Question
                      </h4>

                      <form onSubmit={createQuestion} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-accent font-bold text-ksf-dark-text/60 uppercase block mb-1">
                              Age Bracket Group
                            </label>
                            <select
                              value={newAgeGroup}
                              onChange={(e) => setNewAgeGroup(e.target.value as any)}
                              className="w-full bg-ksf-white border border-black/10 rounded-xl px-3 h-10 font-medium text-xs focus:ring-1 focus:ring-primary-blue"
                            >
                              <option value="4-8">4-8 Years old</option>
                              <option value="9-13">9-13 Years old</option>
                              <option value="14-18">14-18 Years old</option>
                              <option value="Adults">Adults (18+)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-accent font-bold text-ksf-dark-text/60 uppercase block mb-1">
                              Category Label
                            </label>
                            <select
                              value={newCat}
                              onChange={(e) => setNewCat(e.target.value)}
                              className="w-full bg-ksf-white border border-black/10 rounded-xl px-3 h-10 font-medium text-xs focus:ring-1 focus:ring-primary-blue"
                            >
                              <option value="Life of Jesus">Life of Jesus</option>
                              <option value="Old Testament">Old Testament</option>
                              <option value="New Testament">New Testament</option>
                              <option value="Bible Heroes">Bible Heroes</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-accent font-bold text-ksf-dark-text/60 uppercase block mb-1">
                              Scriptural Context Spotlight
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., 1 Kings 4 records David..."
                              value={newExplanationText}
                              onChange={(e) => setNewExplanationText(e.target.value)}
                              className="w-full bg-ksf-white border border-black/10 rounded-xl px-3 h-10 font-medium text-xs focus:ring-1 focus:ring-primary-blue"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-accent font-bold text-ksf-dark-text/60 uppercase block mb-1">
                            Scripture Question Prompt
                          </label>
                          <textarea
                            placeholder="What name did Samuel give to the stone of help?"
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            rows={2}
                            className="w-full bg-ksf-white border border-black/10 rounded-xl p-3 font-medium text-xs focus:ring-1 focus:ring-primary-blue"
                            required
                          />
                        </div>

                        {/* Four options input */}
                        <div>
                          <label className="text-[10px] font-accent font-bold text-ksf-dark-text/60 uppercase block mb-1">
                            Four Answer Choice Labels
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {newOptions.map((v, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                <span className="text-[10px] font-bold font-mono text-[#0D3875] shrink-0 bg-ksf-white border border-black/5 w-6 h-6 rounded-lg flex items-center justify-center">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <input
                                  type="text"
                                  placeholder={`Choice ${String.fromCharCode(65 + i)}`}
                                  value={v}
                                  onChange={(e) => {
                                    const next = [...newOptions];
                                    next[i] = e.target.value;
                                    setNewOptions(next);
                                  }}
                                  className="w-full bg-ksf-white border border-black/10 rounded-xl px-3 h-10 font-semibold text-xs focus:ring-1 focus:ring-primary-blue"
                                  required
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Correct Selector */}
                        <div>
                          <label className="text-[10px] font-accent font-bold text-ksf-dark-text/60 uppercase block mb-1">
                            Select Correct Key Index
                          </label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3].map((idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setNewCorrectIdx(idx)}
                                className={`flex-grow h-9 rounded-xl font-accent font-bold text-[10px] border transition-all ${
                                  newCorrectIdx === idx 
                                    ? 'bg-[#CC1B1B] text-white border-[#CC1B1B] shadow' 
                                    : 'bg-ksf-white text-ksf-dark-text/50 border-black/10 hover:bg-ksf-gray-bg'
                                }`}
                              >
                                Choice {String.fromCharCode(65 + idx)} {newCorrectIdx === idx ? '✓' : ''}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Submit */}
                        <div className="pt-2 border-t border-black/[0.04] flex justify-between items-center">
                          {formSuccess && (
                            <p className="text-emerald-700 text-[10px] font-bold">{formSuccess}</p>
                          )}
                          <button
                            type="submit"
                            className="bg-primary-blue hover:bg-bold-red text-white px-5 py-2.5 rounded-xl font-accent font-bold text-[9px] tracking-wider uppercase transition-colors shadow-sm ml-auto"
                          >
                            Save Question Entry
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* BULK IMPORT EXPORT TOOLS */}
                    <div className="bg-ksf-gray-bg/40 p-4 sm:p-6 rounded-2xl border border-black/[0.04] space-y-3">
                      <h4 className="font-headlines font-black text-base text-primary-blue flex items-center gap-1.5 uppercase">
                        <Database className="text-sky-blue" size={16} />
                        Bulk JSON Operations & Backups
                      </h4>
                      <p className="text-[10px] text-ksf-dark-text/50 leading-relaxed">
                        Copy the compiled questions array payload representing the entire Sunday school database, or paste custom packs. Make sure custom additions match the: <code className="font-mono text-[9px] text-[#CC1B1B]">{"{question, options:[], correctAnswer, category, ageGroup: '4-8'|'9-13'|'14-18'|'Adults', explanation}"}</code> schema.
                      </p>

                      <textarea
                        value={bulkImportText}
                        onChange={(e) => setBulkImportText(e.target.value)}
                        placeholder="Paste JSON bulk package here..."
                        rows={3}
                        className="w-full bg-ksf-white border border-black/10 rounded-xl p-3 font-mono text-[10px] text-[#0D3875]"
                      />

                      <div className="flex gap-2 justify-end">
                        {importNotice && (
                          <p className="text-emerald-700 text-[10px] font-bold self-center mr-auto">{importNotice}</p>
                        )}
                        <button
                          type="button"
                          onClick={handleBulkImport}
                          disabled={!bulkImportText.trim()}
                          className="bg-primary-blue hover:bg-bold-red text-white px-4 py-2 rounded-lg font-accent font-bold text-[9px] uppercase tracking-wider transition-colors disabled:opacity-40"
                        >
                          Execute Import
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBulkImportText(JSON.stringify(questions, null, 2));
                            setImportNotice('IndexedDB database copied! Clipboard ready.');
                            playSound('badge', isMuted);
                            setTimeout(() => setImportNotice(''), 4000);
                          }}
                          className="bg-white border border-black/10 hover:bg-ksf-gray-bg text-ksf-dark-text px-4 py-2 rounded-lg font-accent font-bold text-[9px] uppercase tracking-wider transition-colors"
                        >
                          Backup System questions
                        </button>
                      </div>
                    </div>

                    {/* QUESTIONS GRID FOR DELETIONS */}
                    <div className="space-y-3">
                      <h4 className="font-headlines font-bold text-sm text-[#0D3875] uppercase">
                        Current System Database Questions ({questions.length})
                      </h4>

                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {questions.map((q, i) => (
                          <div key={q.id} className="bg-ksf-white border border-black/5 p-3 rounded-xl flex justify-between items-center text-[11px]">
                            <div className="max-w-[85%] space-y-0.5">
                              <span className="bg-sky-blue/10 text-sky-blue font-accent font-bold text-[8px] px-2 py-0.5 rounded-md uppercase mr-1">
                                🧒 {q.ageGroup}y
                              </span>
                              <span className="bg-amber-100 text-amber-800 font-accent font-bold text-[8px] px-2 py-0.5 rounded-md uppercase">
                                {q.category}
                              </span>
                              <p className="font-bold text-[#0D3875] pt-0.5">
                                {i + 1}. {q.question}
                              </p>
                              <p className="text-[10px] text-ksf-dark-text/50">
                                Answer: {q.options[q.correctAnswer]} | {q.explanation}
                              </p>
                            </div>

                            <button
                              onClick={() => deleteQuestion(q.id)}
                              className="text-red-500 hover:text-red-700 w-8 h-8 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                              title="Delete Question Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
