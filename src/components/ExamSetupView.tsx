import React, { useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  Cloud,
  Eye,
  FileDown,
  Lightbulb,
  Lock,
  LogIn,
  LogOut,
  Play,
  RotateCcw,
  Shuffle,
  Trash2,
} from 'lucide-react';
import { ALL_QUESTIONS, EXAM_METADATA, SECTIONS } from '../data/examData';
import { SECTION_FORMULAS } from '../data/sectionFormulas';
import {
  SWAHILI_CORE_INSTRUCTIONS,
  SWAHILI_EXAM_CHECKLIST,
} from '../data/swahiliInstructions';
import {
  AttemptHistoryEntry,
  ExamAttemptState,
  ExamSessionConfig,
  GlobalDashboardStats,
  SectionId,
} from '../types/exam';
import { exportHistoryEntryToPdf } from '../utils/pdfExport';
import { formatDuration, shuffleArray } from '../utils/storage';
import { StudentDashboardSection } from './StudentDashboardSection';

interface ExamSetupViewProps {
  user: User | null;
  authLoading: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  savedAttempt: ExamAttemptState | null;
  history: AttemptHistoryEntry[];
  globalStats: GlobalDashboardStats;
  isLoadingStats: boolean;
  onStartExam: (config: ExamSessionConfig) => void;
  onResumeAttempt: () => void;
  onDiscardAttempt: () => void;
  onReviewHistoryEntry: (entry: AttemptHistoryEntry) => void;
  onRetryIncorrectFromHistory: (entry: AttemptHistoryEntry) => void;
  onClearHistory: () => void;
}

export const ExamSetupView: React.FC<ExamSetupViewProps> = ({
  user,
  authLoading,
  onSignIn,
  onSignOut,
  savedAttempt,
  history,
  globalStats,
  isLoadingStats,
  onStartExam,
  onResumeAttempt,
  onDiscardAttempt,
  onReviewHistoryEntry,
  onRetryIncorrectFromHistory,
  onClearHistory,
}) => {
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ]);
  const [customCount, setCustomCount] = useState<number>(30);
  const [customShuffle, setCustomShuffle] = useState<boolean>(true);
  const [customMinutesPerQuestion, setCustomMinutesPerQuestion] = useState<number>(1);
  const [passThreshold, setPassThreshold] = useState<number>(50);
  const [activeFormulaSection, setActiveFormulaSection] = useState<SectionId>('A');

  const availablePool = useMemo(() => {
    return ALL_QUESTIONS.filter((q) => selectedSections.includes(q.section));
  }, [selectedSections]);

  const effectiveCustomCount = Math.min(customCount, availablePool.length);

  const toggleSection = (id: SectionId) => {
    setSelectedSections((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleStartFullPaper = (shuffled: boolean) => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    onStartExam({
      mode: 'full',
      title: 'Full Licensure Paper (RN005-2015)',
      questionIds: shuffled ? shuffleArray(ids) : ids,
      durationSeconds: EXAM_METADATA.recommendedFullDurationMinutes * 60,
      shuffleQuestions: shuffled,
      passThresholdPercent: passThreshold,
    });
  };

  const handleStartSection = (sectionId: SectionId) => {
    const sec = SECTIONS.find((s) => s.id === sectionId)!;
    const sectionQuestions = ALL_QUESTIONS.filter((q) => q.section === sectionId);
    const durationMinutes = Math.max(10, sectionQuestions.length);
    onStartExam({
      mode: 'section',
      sectionId,
      title: `Section ${sec.id}: ${sec.code} — ${sec.title}`,
      questionIds: sectionQuestions.map((q) => q.id),
      durationSeconds: durationMinutes * 60,
      shuffleQuestions: false,
      passThresholdPercent: passThreshold,
    });
  };

  const handleStartCustom = () => {
    if (effectiveCustomCount === 0) return;
    const ordered = customShuffle ? shuffleArray(availablePool) : availablePool;
    const picked = ordered.slice(0, effectiveCustomCount).map((q) => q.id);
    const totalMinutes =
      customMinutesPerQuestion === 0
        ? 0
        : Math.max(10, Math.round(picked.length * customMinutesPerQuestion));

    onStartExam({
      mode: 'custom',
      title: `Custom Practice Paper (${picked.length} Questions)`,
      questionIds: picked,
      durationSeconds: totalMinutes * 60,
      shuffleQuestions: customShuffle,
      passThresholdPercent: passThreshold,
    });
  };

  const savedAnsweredCount = savedAttempt ? Object.keys(savedAttempt.answers).length : 0;
  const activeFormulaList = SECTION_FORMULAS[activeFormulaSection];
  const activeFormulaSecInfo = SECTIONS.find((s) => s.id === activeFormulaSection)!;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Authoritative Examination Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-10 border border-emerald-800/80 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="text-sm font-medium text-emerald-200 tracking-wide">
            {EXAM_METADATA.council} · Paper {EXAM_METADATA.paperCode}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            JIPIME TNMCLE PREPARATION TO DECEMBER
          </h1>
          <p className="text-emerald-100/95 text-base sm:text-lg leading-relaxed">
            {EXAM_METADATA.examTitle} — Complete all {EXAM_METADATA.totalQuestions} multiple-choice questions across
            six clinical nursing modules. Direct answers stay strictly locked until submission; clinical hints and
            section formulas are available to guide your reasoning.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-emerald-800/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm sm:text-base">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-300 shrink-0 mt-1" aria-hidden="true" />
            <div>
              <div className="font-semibold text-white">Answers Locked</div>
              <div className="text-emerald-100/80 text-sm mt-0.5 leading-relaxed">
                No instant answer spoilers—challenge yourself before marking unlocks.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-emerald-300 shrink-0 mt-1" aria-hidden="true" />
            <div>
              <div className="font-semibold text-white">Hints & Formulas</div>
              <div className="text-emerald-100/80 text-sm mt-0.5 leading-relaxed">
                Conceptual clinical hints and section formulas ready when you need a clue.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-300 shrink-0 mt-1" aria-hidden="true" />
            <div>
              <div className="font-semibold text-white">Auto-Save & Timer</div>
              <div className="text-emerald-100/80 text-sm mt-0.5 leading-relaxed">
                Leave and come back anytime to resume right where you stopped.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-emerald-300 shrink-0 mt-1" aria-hidden="true" />
            <div>
              <div className="font-semibold text-white">Full Rationales</div>
              <div className="text-emerald-100/80 text-sm mt-0.5 leading-relaxed">
                Automatic grading and TNMC clinical rationales immediately after submission.
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Sync & Student Account Strip */}
        <div className="mt-8 pt-5 border-t border-emerald-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm sm:text-base text-emerald-100">
            <Cloud className="w-5 h-5 text-emerald-300 shrink-0" aria-hidden="true" />
            {authLoading ? (
              <span>Checking student account session...</span>
            ) : user ? (
              <span>
                Signed in as <strong className="text-white">{user.displayName || user.email}</strong> — your unfinished
                papers and completed records sync automatically to the cloud.
              </span>
            ) : (
              <span>
                Sign in with Google to save your exam records across devices and appear on the live student cohort dashboard.
              </span>
            )}
          </div>

          <div className="shrink-0">
            {user ? (
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-950 bg-emerald-100 rounded-lg hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                disabled={authLoading}
                onClick={onSignIn}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-950 bg-white rounded-lg hover:bg-emerald-50 disabled:opacity-60 transition-colors whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Resume Saved In-Progress Paper Banner */}
      {savedAttempt && savedAttempt.status === 'in-progress' && (
        <section
          aria-label="Saved exam session"
          className="bg-amber-50/90 border border-amber-300 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="space-y-1.5">
            <div className="text-sm font-semibold text-amber-900">
              Saved In-Progress Paper Ready to Continue
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              {savedAttempt.config.title}
            </h2>
            <div className="text-base text-slate-700 tabular-nums flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span>
                {savedAnsweredCount} of {savedAttempt.config.questionIds.length} answered
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {savedAttempt.config.durationSeconds > 0
                  ? `${formatDuration(savedAttempt.remainingSeconds)} remaining`
                  : 'Untimed paper'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onDiscardAttempt}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={onResumeAttempt}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Continue Paper
            </button>
          </div>
        </section>
      )}

      {/* Live Student Participation Dashboard */}
      <StudentDashboardSection stats={globalStats} isLoadingStats={isLoadingStats} />

      {/* Maelekezo Muhimu kwa Mtahiniwa (Kiswahili) */}
      <section
        id="maelekezo-muhimu"
        className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Maelekezo Muhimu kwa Mtahiniwa
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Soma miongozo hii muhimu kwa makini kabla ya kuanza mtihani wako wa maandalizi ya TNMCLE.
            </p>
          </div>
          <div className="text-sm font-semibold text-emerald-800 shrink-0">
            Mwongozo Rasmi wa Mtumiaji · Kiswahili
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SWAHILI_CORE_INSTRUCTIONS.map((item) => (
            <div
              key={item.number}
              className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-2.5"
            >
              <div className="text-sm font-mono font-bold text-emerald-800 tabular-nums">
                {item.number}.
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-emerald-950">
            Mambo ya Kuzingatia Kabla ya Kuwasilisha Karatasi Yako
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm sm:text-base text-emerald-950">
            {SWAHILI_EXAM_CHECKLIST.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Primary Paper Modes */}
      <section id="paper-modes" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Standard Examination Papers
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Select the complete licensure simulation or a timed randomized mock paper.
            </p>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <span className="text-slate-700 font-semibold">Pass Mark:</span>
            <div className="inline-flex items-center p-1 bg-white rounded-lg border border-slate-200">
              {[50, 60].map((mark) => (
                <button
                  key={mark}
                  type="button"
                  onClick={() => setPassThreshold(mark)}
                  className={`px-3.5 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                    passThreshold === mark
                      ? 'bg-emerald-800 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mark}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Full Paper */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-emerald-800 tabular-nums">
                Full Licensure Simulation · 189 Questions · 180 Mins
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Complete RN005-2015 Paper
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                All six TNMC sections in authentic order (Q1–Q189) with a 3-hour countdown timer and automatic grading.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => handleStartFullPaper(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                Start Full Paper
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleStartFullPaper(true)}
                title="Start all 189 questions in randomized order"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                Shuffled
              </button>
            </div>
          </div>

          {/* 50-Question Mock */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-500 tabular-nums">
                Mixed Mock Paper · 50 Questions · 50 Mins
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                50-Question Timed Sprint
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                A balanced random draw of 50 clinical questions across all six nursing specialties under strict exam conditions.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onStartExam({
                  mode: 'custom',
                  title: '50-Question Mixed Mock Paper',
                  questionIds: shuffleArray(ALL_QUESTIONS.map((q) => q.id)).slice(0, 50),
                  durationSeconds: 50 * 60,
                  shuffleQuestions: true,
                  passThresholdPercent: passThreshold,
                })
              }
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              Start 50-Q Paper
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* 25-Question Quick Challenge */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-500 tabular-nums">
                Quick Challenge · 25 Questions · 25 Mins
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                25-Question Rapid Assessment
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Focused high-intensity assessment for daily revision. Answers stay locked until all 25 questions are submitted.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onStartExam({
                  mode: 'custom',
                  title: '25-Question Rapid Assessment',
                  questionIds: shuffleArray(ALL_QUESTIONS.map((q) => q.id)).slice(0, 25),
                  durationSeconds: 25 * 60,
                  shuffleQuestions: true,
                  passThresholdPercent: passThreshold,
                })
              }
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              Start 25-Q Paper
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Six TNMC Section Papers */}
      <section id="sections-grid" className="space-y-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Examination Papers by Section
          </h2>
          <p className="text-base text-slate-600 mt-1">
            Focus on an individual TNMC nursing module. One minute allocated per question.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map((sec) => {
            const count = sec.questionRange[1] - sec.questionRange[0] + 1;
            const mins = Math.max(10, count);
            return (
              <div
                key={sec.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-2.5">
                  <div className="text-sm font-medium text-slate-500 tabular-nums">
                    Section {sec.id} · {sec.code} · {count} Questions · {mins} Mins
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{sec.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{sec.description}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href="#formulas-guide"
                    onClick={() => setActiveFormulaSection(sec.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" aria-hidden="true" />
                    Formulas
                  </a>
                  <button
                    type="button"
                    onClick={() => handleStartSection(sec.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Start Section {sec.id}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section Formulas & Clinical Frameworks Guide */}
      <section id="formulas-guide" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Section Formulas & Clinical Frameworks
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Key calculations, epidemiological rules, and nursing frameworks applicable across Sections A–F. Also accessible anytime inside an active exam.
            </p>
          </div>
          <div className="text-sm font-medium text-emerald-800 shrink-0">
            {activeFormulaSecInfo.code} · {activeFormulaSecInfo.title}
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-xl w-fit">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveFormulaSection(sec.id)}
              className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeFormulaSection === sec.id
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sec {sec.id}: {sec.code}
            </button>
          ))}
        </div>

        {/* Formula Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeFormulaList.map((item) => (
            <div
              key={item.title}
              className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-3"
            >
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <div className="bg-white border border-emerald-200 rounded-lg px-4 py-3 font-mono text-sm sm:text-base font-semibold text-emerald-950 leading-relaxed">
                {item.formula}
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {item.whenToApply}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Paper Builder */}
      <section id="custom-drill" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Custom Paper Builder
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Combine specific sections, set question count and pacing, and launch an automatic locked paper.
            </p>
          </div>
          <div className="text-sm font-mono text-slate-600 tabular-nums">
            Pool: {availablePool.length} questions
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-sm font-semibold text-slate-800">Include Sections</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTIONS.map((sec) => {
                const checked = selectedSections.includes(sec.id);
                const count = sec.questionRange[1] - sec.questionRange[0] + 1;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className={`flex items-center justify-between p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      checked
                        ? 'bg-emerald-50/70 border-emerald-300 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-base font-semibold truncate">
                        {sec.id}. {sec.title}
                      </div>
                      <div className="text-sm text-slate-500 tabular-nums">
                        {sec.code} · {count} Qs
                      </div>
                    </div>
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 ${
                        checked ? 'text-emerald-700' : 'text-slate-300'
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-800">Number of Questions</div>
              <div className="grid grid-cols-5 gap-2">
                {[10, 20, 30, 50, 189].map((num) => {
                  const label = num === 189 ? 'All' : String(num);
                  const active = customCount === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCustomCount(num)}
                      className={`py-2.5 text-sm font-semibold rounded-lg border transition-colors cursor-pointer tabular-nums ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-800">Timer Pacing</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '1 min / Q', value: 1 },
                  { label: '1.5 min / Q', value: 1.5 },
                  { label: 'Untimed', value: 0 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setCustomMinutesPerQuestion(opt.value)}
                    className={`py-2.5 px-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      customMinutesPerQuestion === opt.value
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 text-base font-medium text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={customShuffle}
                  onChange={(e) => setCustomShuffle(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                />
                Randomize question order
              </label>
            </div>

            <button
              type="button"
              onClick={handleStartCustom}
              disabled={effectiveCustomCount === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Generate & Start Paper ({effectiveCustomCount} Qs)
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Attempt History */}
      <section id="attempt-history" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Your Saved Paper History
            </h2>
            <p className="text-base text-slate-600 mt-1">
              {user
                ? 'Synced with your Google student account across sessions and devices.'
                : 'Saved locally in this browser. Sign in with Google above to sync across devices.'}
            </p>
          </div>
          {history.length > 0 && !user && (
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-rose-700 border border-slate-200 rounded-lg bg-white hover:bg-rose-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Clear Local History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-base text-slate-500">
            No completed papers recorded yet. Start any paper above to record your first official attempt.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-4">Paper</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Score</th>
                    <th className="py-3.5 px-4 text-right">Accuracy</th>
                    <th className="py-3.5 px-4 text-right">Time Used</th>
                    <th className="py-3.5 px-4">Outcome</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((entry) => (
                    <tr key={entry.sessionId} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {entry.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 tabular-nums whitespace-nowrap">
                        {new Date(entry.submittedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800">
                        {entry.correctCount}/{entry.totalQuestions}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                        {entry.scorePercent}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                        {formatDuration(entry.timeSpentSeconds)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-semibold ${
                            entry.passed ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {entry.passed ? 'Passed' : 'Needs Review'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-4">
                          {entry.questionIds && entry.answers && (
                            <>
                              <button
                                type="button"
                                onClick={() => onReviewHistoryEntry(entry)}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-slate-950 hover:underline cursor-pointer"
                              >
                                <Eye className="w-4 h-4" aria-hidden="true" />
                                Review
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  exportHistoryEntryToPdf(entry, {
                                    scope: entry.incorrectIds.length > 0 ? 'missed' : 'all',
                                    candidateName: user?.displayName || user?.email || undefined,
                                  })
                                }
                                title="Download score & missed questions with rationales as PDF"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-900 hover:underline cursor-pointer"
                              >
                                <FileDown className="w-4 h-4" aria-hidden="true" />
                                PDF
                              </button>
                            </>
                          )}
                          {entry.incorrectIds.length > 0 ? (
                            <button
                              type="button"
                              onClick={() => onRetryIncorrectFromHistory(entry)}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                            >
                              <RotateCcw className="w-4 h-4" aria-hidden="true" />
                              Retry {entry.incorrectIds.length} Missed
                            </button>
                          ) : (
                            <span className="text-sm text-emerald-700 font-medium">100% Mastered</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};
