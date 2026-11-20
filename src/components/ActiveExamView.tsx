import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eraser,
  Flag,
  Lightbulb,
  Lock,
  Send,
  X,
} from 'lucide-react';
import { QUESTION_MAP, SECTIONS, getSectionInfo } from '../data/examData';
import { QUESTION_HINTS } from '../data/questionHints';
import { SECTION_FORMULAS } from '../data/sectionFormulas';
import {
  SWAHILI_CORE_INSTRUCTIONS,
  SWAHILI_EXAM_CHECKLIST,
} from '../data/swahiliInstructions';
import { ExamAttemptState, OptionKey, SectionId, ViewMode } from '../types/exam';
import { formatDuration } from '../utils/storage';

interface ActiveExamViewProps {
  attempt: ExamAttemptState;
  showSubmitModal: boolean;
  isSyncingCloud: boolean;
  onCloseSubmitModal: () => void;
  onOpenSubmitModal: () => void;
  onSelectAnswer: (questionId: number, option: OptionKey) => void;
  onClearAnswer: (questionId: number) => void;
  onToggleFlag: (questionId: number) => void;
  onRevealHint: (questionId: number) => void;
  onNavigateIndex: (index: number) => void;
  onConfirmSubmit: () => void;
}

const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({
  attempt,
  showSubmitModal,
  isSyncingCloud,
  onCloseSubmitModal,
  onOpenSubmitModal,
  onSelectAnswer,
  onClearAnswer,
  onToggleFlag,
  onRevealHint,
  onNavigateIndex,
  onConfirmSubmit,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [gridFilter, setGridFilter] = useState<'all' | 'unanswered' | 'flagged'>('all');
  const [bookletPage, setBookletPage] = useState<number>(0);
  const [openHintIds, setOpenHintIds] = useState<Record<number, boolean>>({});
  const [showFormulasDrawer, setShowFormulasDrawer] = useState<boolean>(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [formulaTab, setFormulaTab] = useState<SectionId>('A');
  const [dismissed35MinSessionId, setDismissed35MinSessionId] = useState<string | null>(null);
  const [dismissedBannerSessionId, setDismissedBannerSessionId] = useState<string | null>(null);

  const questionIds = attempt.config.questionIds;
  const total = questionIds.length;
  const safeIndex = Math.min(Math.max(0, attempt.currentIndex), total - 1);
  const currentQuestionId = questionIds[safeIndex];
  const currentQuestion = QUESTION_MAP[currentQuestionId];
  const currentSection = getSectionInfo(currentQuestion.section);

  const answeredCount = Object.keys(attempt.answers).length;
  const unansweredCount = total - answeredCount;
  const flaggedSet = useMemo(() => new Set(attempt.flagged), [attempt.flagged]);
  const progressPercent = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  const THIRTY_FIVE_MINUTES_SECONDS = 35 * 60;
  const isTimed = attempt.config.durationSeconds > 0;
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - attempt.startedAt) / 1000));
  const isUnder35Min = isTimed && attempt.remainingSeconds < THIRTY_FIVE_MINUTES_SECONDS;
  const isUnder5Min = isTimed && attempt.remainingSeconds <= 300 && attempt.remainingSeconds > 60;
  const isCriticalTime = isTimed && attempt.remainingSeconds <= 60;
  const show35MinModal =
    isTimed &&
    attempt.config.durationSeconds > THIRTY_FIVE_MINUTES_SECONDS &&
    attempt.remainingSeconds < THIRTY_FIVE_MINUTES_SECONDS &&
    attempt.remainingSeconds > 0 &&
    dismissed35MinSessionId !== attempt.sessionId &&
    !showSubmitModal &&
    !showFormulasDrawer &&
    !showInstructionsModal;

  const paceSecondsPerUnanswered =
    isTimed && unansweredCount > 0
      ? Math.max(1, Math.floor(attempt.remainingSeconds / unansweredCount))
      : null;

  const firstUnansweredIndex = useMemo(() => {
    return questionIds.findIndex((id) => !attempt.answers[id]);
  }, [questionIds, attempt.answers]);

  const PAGE_SIZE = 15;
  const totalBookletPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    setBookletPage(Math.floor(safeIndex / PAGE_SIZE));
  }, [safeIndex]);

  const handleToggleHint = (qId: number) => {
    const nextOpen = !openHintIds[qId];
    setOpenHintIds((prev) => ({ ...prev, [qId]: nextOpen }));
    if (nextOpen) {
      onRevealHint(qId);
    }
  };

  const handleOpenFormulasForCurrentSection = () => {
    setFormulaTab(currentQuestion.section);
    setShowFormulasDrawer(true);
  };

  // Keyboard shortcuts in Single Question mode
  useEffect(() => {
    if (showSubmitModal || showFormulasDrawer || showInstructionsModal || show35MinModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (viewMode !== 'single') return;

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') {
        e.preventDefault();
        onSelectAnswer(currentQuestionId, 'A');
      } else if (key === 'B' || key === '2') {
        e.preventDefault();
        onSelectAnswer(currentQuestionId, 'B');
      } else if (key === 'C' || key === '3') {
        e.preventDefault();
        onSelectAnswer(currentQuestionId, 'C');
      } else if (key === 'D' || key === '4') {
        e.preventDefault();
        onSelectAnswer(currentQuestionId, 'D');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (safeIndex < total - 1) onNavigateIndex(safeIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (safeIndex > 0) onNavigateIndex(safeIndex - 1);
      } else if (key === 'F') {
        e.preventDefault();
        onToggleFlag(currentQuestionId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    viewMode,
    showSubmitModal,
    showFormulasDrawer,
    showInstructionsModal,
    show35MinModal,
    currentQuestionId,
    safeIndex,
    total,
    onSelectAnswer,
    onNavigateIndex,
    onToggleFlag,
  ]);

  const filteredGridIndices = useMemo(() => {
    return questionIds
      .map((qId, idx) => ({ qId, idx }))
      .filter(({ qId }) => {
        if (gridFilter === 'unanswered') return !attempt.answers[qId];
        if (gridFilter === 'flagged') return flaggedSet.has(qId);
        return true;
      });
  }, [questionIds, gridFilter, attempt.answers, flaggedSet]);

  const bookletStart = bookletPage * PAGE_SIZE;
  const bookletSlice = questionIds.slice(bookletStart, bookletStart + PAGE_SIZE);

  const availableSections = useMemo(() => {
    return SECTIONS.map((sec) => {
      const firstIdx = questionIds.findIndex((id) => QUESTION_MAP[id]?.section === sec.id);
      return { sec, firstIdx };
    }).filter((item) => item.firstIdx !== -1);
  }, [questionIds]);

  const currentHint = QUESTION_HINTS[currentQuestionId];
  const isCurrentHintOpen = Boolean(openHintIds[currentQuestionId]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Paper Header Strip */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-sm font-medium text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Lock className="w-4 h-4" aria-hidden="true" />
              Answers Locked Until Submission
            </span>
            <span aria-hidden="true">·</span>
            <span>{attempt.config.title}</span>
            {isSyncingCloud && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">Saving progress...</span>
              </>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Section {currentSection.id}: {currentSection.code} — {currentSection.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setShowInstructionsModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            Maelekezo
          </button>

          <button
            type="button"
            onClick={handleOpenFormulasForCurrentSection}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-emerald-900 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Calculator className="w-4 h-4" aria-hidden="true" />
            Section Formulas
          </button>

          {/* View Mode Segmented Switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Single Question
            </button>
            <button
              type="button"
              onClick={() => setViewMode('booklet')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'booklet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Booklet Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Visual Time Pace Warning Banner when under 35 minutes */}
      {isUnder35Min && dismissedBannerSessionId !== attempt.sessionId && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-6 rounded-xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isCriticalTime
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-start sm:items-center gap-3 text-sm sm:text-base">
            <AlertTriangle
              className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 ${
                isCriticalTime ? 'text-rose-700' : 'text-amber-700'
              }`}
              aria-hidden="true"
            />
            <div>
              <span className="font-semibold">
                {isCriticalTime
                  ? 'Final Minute Warning:'
                  : isUnder5Min
                    ? 'Under 5 Minutes Remaining:'
                    : 'Pace Alert (Under 35 Minutes Left):'}
              </span>{' '}
              <span className="font-mono font-bold tabular-nums">
                {formatDuration(attempt.remainingSeconds)}
              </span>{' '}
              remaining
              {unansweredCount > 0 && paceSecondsPerUnanswered !== null ? (
                <span>
                  {' '}
                  · {unansweredCount} unanswered (~{formatDuration(paceSecondsPerUnanswered)} per question)
                </span>
              ) : (
                <span> · All questions answered; review any flagged items before submitting.</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {firstUnansweredIndex !== -1 && (
              <button
                type="button"
                onClick={() => onNavigateIndex(firstUnansweredIndex)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                  isCriticalTime
                    ? 'bg-rose-700 border-rose-700 text-white hover:bg-rose-800'
                    : 'bg-amber-900 border-amber-900 text-white hover:bg-amber-950'
                }`}
              >
                Next Unanswered
              </button>
            )}
            {!isCriticalTime && (
              <button
                type="button"
                onClick={() => setDismissedBannerSessionId(attempt.sessionId)}
                aria-label="Dismiss top pace warning banner"
                className="p-1.5 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Two-Zone Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Question Stage */}
        <div className="lg:col-span-8 space-y-6">
          {viewMode === 'single' ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xs">
              {/* Question Top Metadata + Hint & Flag Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="text-sm sm:text-base font-medium text-slate-600 tabular-nums">
                  Question <span className="font-mono font-bold text-slate-900">{safeIndex + 1}</span> of{' '}
                  <span className="font-mono">{total}</span>
                  {attempt.config.shuffleQuestions && (
                    <>
                      <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
                      <span className="font-mono text-slate-500">Paper Q{currentQuestion.id}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentHint && (
                    <button
                      type="button"
                      onClick={() => handleToggleHint(currentQuestionId)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isCurrentHintOpen
                          ? 'bg-teal-50 border-teal-300 text-teal-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" aria-hidden="true" />
                      {isCurrentHintOpen ? 'Hide Hint' : 'Clinical Hint'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onToggleFlag(currentQuestionId)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      flaggedSet.has(currentQuestionId)
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Flag className="w-4 h-4" aria-hidden="true" />
                    {flaggedSet.has(currentQuestionId) ? 'Flagged' : 'Flag'}
                  </button>
                </div>
              </div>

              {/* Question Stem (Larger, crisp readable typography) */}
              <div className="text-lg sm:text-xl font-medium text-slate-900 leading-relaxed max-w-[70ch]">
                {currentQuestion.question}
              </div>

              {/* Clinical Hint Box (Conceptual clue only—no direct answer!) */}
              {isCurrentHintOpen && currentHint && (
                <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4 sm:p-5 text-base text-teal-950 leading-relaxed flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold">Clinical Hint: </span>
                    {currentHint}
                  </div>
                </div>
              )}

              {/* Options A-D (Zero direct answer feedback!) */}
              <div className="space-y-3.5" role="radiogroup" aria-label={`Options for question ${safeIndex + 1}`}>
                {OPTION_KEYS.map((key) => {
                  const isSelected = attempt.answers[currentQuestionId] === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => onSelectAnswer(currentQuestionId, key)}
                      className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-colors flex items-start gap-4 cursor-pointer min-h-[58px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-sm font-bold shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {key}
                      </span>
                      <span className="text-base sm:text-[17px] leading-relaxed flex-1 pt-0.5">
                        {currentQuestion.options[key]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Controls */}
              <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onNavigateIndex(Math.max(0, safeIndex - 1))}
                    disabled={safeIndex === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm sm:text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    Previous
                  </button>

                  {attempt.answers[currentQuestionId] && (
                    <button
                      type="button"
                      onClick={() => onClearAnswer(currentQuestionId)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm sm:text-base font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Eraser className="w-4 h-4" aria-hidden="true" />
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sm text-slate-400">
                    Keys: A–D · F flag · Arrows
                  </span>
                  {safeIndex < total - 1 ? (
                    <button
                      type="button"
                      onClick={() => onNavigateIndex(safeIndex + 1)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      Next Question
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenSubmitModal}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      Finish & Submit Paper
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Booklet Sheet Mode */
            <div className="space-y-5">
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm sm:text-base font-medium text-slate-700 tabular-nums">
                  Showing questions {bookletStart + 1}–{Math.min(bookletStart + PAGE_SIZE, total)} of {total}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={bookletPage === 0}
                    onClick={() => setBookletPage((p) => Math.max(0, p - 1))}
                    className="px-3.5 py-1.5 text-sm font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    Prev Page
                  </button>
                  <span className="text-sm font-mono text-slate-600 tabular-nums">
                    {bookletPage + 1} / {totalBookletPages}
                  </span>
                  <button
                    type="button"
                    disabled={bookletPage >= totalBookletPages - 1}
                    onClick={() => setBookletPage((p) => Math.min(totalBookletPages - 1, p + 1))}
                    className="px-3.5 py-1.5 text-sm font-semibold border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    Next Page
                  </button>
                </div>
              </div>

              {bookletSlice.map((qId, offset) => {
                const idx = bookletStart + offset;
                const q = QUESTION_MAP[qId];
                const sec = getSectionInfo(q.section);
                const selected = attempt.answers[qId];
                const isFlagged = flaggedSet.has(qId);
                const hintText = QUESTION_HINTS[qId];
                const isHintOpen = Boolean(openHintIds[qId]);

                return (
                  <div
                    key={qId}
                    className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-sm font-medium text-slate-500 tabular-nums">
                        Question {idx + 1} · Section {sec.id} ({sec.code})
                        {attempt.config.shuffleQuestions && ` · Paper Q${q.id}`}
                      </div>
                      <div className="flex items-center gap-2">
                        {hintText && (
                          <button
                            type="button"
                            onClick={() => handleToggleHint(qId)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border cursor-pointer ${
                              isHintOpen
                                ? 'bg-teal-50 border-teal-300 text-teal-900'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                            {isHintOpen ? 'Hide Hint' : 'Hint'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onToggleFlag(qId)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border cursor-pointer ${
                            isFlagged
                              ? 'bg-amber-50 border-amber-300 text-amber-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                          {isFlagged ? 'Flagged' : 'Flag'}
                        </button>
                      </div>
                    </div>

                    <div className="text-lg font-medium text-slate-900 leading-relaxed">
                      {q.question}
                    </div>

                    {isHintOpen && hintText && (
                      <div className="bg-teal-50/70 border border-teal-200 rounded-lg p-3.5 text-sm sm:text-base text-teal-950 leading-relaxed">
                        <span className="font-semibold">Clinical Hint: </span>
                        {hintText}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-2.5">
                      {OPTION_KEYS.map((key) => {
                        const isPicked = selected === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              onSelectAnswer(qId, key);
                              onNavigateIndex(idx);
                            }}
                            className={`w-full text-left px-4 py-3.5 rounded-xl border text-base transition-colors flex items-start gap-3 cursor-pointer ${
                              isPicked
                                ? 'bg-slate-900 border-slate-900 text-white'
                                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 border mt-0.5 ${
                                isPicked
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                  : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {key}
                            </span>
                            <span className="leading-relaxed">{q.options[key]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Zone: Sticky Timer, Progress & OMR Navigator */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
          {/* Timer & Progress Card */}
          <div
            className={`border rounded-2xl p-5 space-y-5 shadow-xs transition-colors ${
              isCriticalTime
                ? 'bg-rose-50/40 border-rose-300'
                : isUnder35Min
                  ? 'bg-amber-50/35 border-amber-300'
                  : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-500">
                  {isTimed ? 'Time Remaining' : 'Elapsed Time'}
                </div>
                <div
                  className={`font-mono text-3xl font-bold tabular-nums mt-0.5 ${
                    isCriticalTime
                      ? 'text-rose-700'
                      : isUnder35Min
                        ? 'text-amber-700'
                        : 'text-slate-900'
                  }`}
                >
                  {isTimed
                    ? formatDuration(attempt.remainingSeconds)
                    : formatDuration(elapsedSeconds)}
                </div>
              </div>
              <Clock
                className={`w-6 h-6 ${
                  isCriticalTime
                    ? 'text-rose-600'
                    : isUnder35Min
                      ? 'text-amber-600'
                      : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
            </div>

            {isCriticalTime ? (
              <div className="text-sm font-medium text-rose-900 bg-rose-50 border border-rose-200 rounded-lg px-3.5 py-2.5 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Less than 1 minute remaining. Paper will auto-submit at 00:00.</span>
              </div>
            ) : isUnder35Min ? (
              <div className="text-sm font-medium text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {isUnder5Min
                    ? 'Less than 5 minutes left — finalize remaining answers.'
                    : 'Under 35 minutes left — monitor your pacing.'}
                  {paceSecondsPerUnanswered !== null &&
                    ` Aim for ~${formatDuration(paceSecondsPerUnanswered)} per unanswered item.`}
                </span>
              </div>
            ) : null}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-medium text-slate-600 tabular-nums">
                <span>
                  Answered: <strong className="text-slate-900">{answeredCount}</strong> / {total}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-700 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 tabular-nums pt-1">
                <span>Unanswered: {unansweredCount}</span>
                <span>Flagged: {attempt.flagged.length}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSubmitModal}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              Submit & Grade Paper
            </button>
          </div>

          {/* Section Jump (if multiple sections) */}
          {availableSections.length > 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-sm font-semibold text-slate-800">Jump to Section</div>
              <div className="grid grid-cols-3 gap-2">
                {availableSections.map(({ sec, firstIdx }) => {
                  const isCurrentSec = currentQuestion.section === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => onNavigateIndex(firstIdx)}
                      className={`px-2.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer truncate ${
                        isCurrentSec
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={`Section ${sec.id}: ${sec.title}`}
                    >
                      Sec {sec.id} · {sec.code.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* OMR Navigator Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-800">Question Sheet</div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['all', 'unanswered', 'flagged'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setGridFilter(tab)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors cursor-pointer ${
                      gridFilter === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {filteredGridIndices.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No {gridFilter} questions in this paper.
              </div>
            ) : (
              <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-6 gap-1.5 max-h-72 overflow-y-auto pr-1">
                {filteredGridIndices.map(({ qId, idx }) => {
                  const isCurrent = idx === safeIndex;
                  const isAnswered = Boolean(attempt.answers[qId]);
                  const isFlagged = flaggedSet.has(qId);

                  return (
                    <button
                      key={qId}
                      type="button"
                      onClick={() => onNavigateIndex(idx)}
                      aria-label={`Question ${idx + 1}${isAnswered ? ', answered' : ', unanswered'}${
                        isFlagged ? ', flagged' : ''
                      }`}
                      className={`relative h-10 rounded-md font-mono text-xs sm:text-sm font-semibold tabular-nums border transition-colors cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-emerald-700 ring-offset-1 border-emerald-800 bg-emerald-50 text-emerald-950'
                          : isAnswered
                            ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {idx + 1}
                      {isFlagged && (
                        <span
                          className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-500"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-900 inline-block" /> Answered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-slate-300 bg-white inline-block" /> Unanswered
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Flagged
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* Section Formulas Reference Modal */}
      {showFormulasDrawer && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="formulas-modal-title"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 id="formulas-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  Section Formulas & Clinical Rules
                </h2>
                <p className="text-sm text-slate-500">
                  Reference calculations and nursing frameworks (answers remain locked).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowFormulasDrawer(false)}
                aria-label="Close formulas reference"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5">
              {SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setFormulaTab(sec.id)}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    formulaTab === sec.id
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sec {sec.id} · {sec.code}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {SECTION_FORMULAS[formulaTab].map((item) => (
                <div
                  key={item.title}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2.5"
                >
                  <div className="text-base sm:text-lg font-bold text-slate-900">{item.title}</div>
                  <div className="bg-white border border-emerald-200 rounded-lg px-4 py-2.5 font-mono text-sm sm:text-base font-semibold text-emerald-950">
                    {item.formula}
                  </div>
                  <div className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.whenToApply}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-modal-title"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 shrink-0">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 id="submit-modal-title" className="font-serif text-2xl font-bold text-slate-900">
                  Submit Paper for Marking?
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Once submitted, your answers are finalized and the official TNMC answer key and clinical rationales will unlock.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {answeredCount}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">Answered</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {unansweredCount}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">Unanswered</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-amber-700 tabular-nums">
                  {attempt.flagged.length}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">Flagged</div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-sm font-medium text-rose-700">
                Warning: {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'} will be marked incorrect.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseSubmitModal}
                className="px-4 py-2.5 text-sm sm:text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Return to Paper
              </button>
              <button
                type="button"
                onClick={onConfirmSubmit}
                className="px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 35-Minute Remaining Pacing Alert Modal */}
      {show35MinModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pace-warning-modal-title"
        >
          <div className="bg-white border border-amber-300 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 shrink-0">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2
                  id="pace-warning-modal-title"
                  className="font-serif text-2xl font-bold text-slate-900"
                >
                  Under 35 Minutes Remaining
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Your remaining exam time has fallen below 35 minutes. Check your pace below to complete all items before automatic submission.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-center">
              <div className="text-sm font-semibold text-amber-800">
                Remaining Time
              </div>
              <div className="font-mono text-3xl font-bold text-amber-900 tabular-nums mt-1">
                {formatDuration(attempt.remainingSeconds)}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {answeredCount}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">Answered</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-amber-800 tabular-nums">
                  {unansweredCount}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">Unanswered</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {paceSecondsPerUnanswered !== null
                    ? `${formatDuration(paceSecondsPerUnanswered)}`
                    : 'Done'}
                </div>
                <div className="text-xs sm:text-sm text-slate-500">
                  {paceSecondsPerUnanswered !== null ? 'Target / Q' : 'Reviewing'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              {firstUnansweredIndex !== -1 && (
                <button
                  type="button"
                  onClick={() => {
                    setDismissed35MinSessionId(attempt.sessionId);
                    onNavigateIndex(firstUnansweredIndex);
                  }}
                  className="px-4 py-2.5 text-sm sm:text-base font-medium text-amber-950 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Jump to Unanswered
                </button>
              )}
              <button
                type="button"
                onClick={() => setDismissed35MinSessionId(attempt.sessionId)}
                className="px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                Continue Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maelekezo Muhimu (Kiswahili) Modal */}
      {showInstructionsModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="swahili-instructions-modal-title"
        >
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2
                  id="swahili-instructions-modal-title"
                  className="font-serif text-xl sm:text-2xl font-bold text-slate-900"
                >
                  Maelekezo Muhimu kwa Mtahiniwa
                </h2>
                <p className="text-sm text-slate-500">
                  Mwongozo kamili wa matumizi ya mtihani wa JIPIME TNMCLE kwa lugha ya Kiswahili.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                aria-label="Funga maelekezo"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SWAHILI_CORE_INSTRUCTIONS.map((item) => (
                  <div
                    key={item.number}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2"
                  >
                    <div className="text-sm font-mono font-bold text-emerald-800">
                      {item.number}.
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2.5">
                <div className="text-base font-bold text-emerald-950">
                  Mambo ya Kuzingatia Kabla ya Kuwasilisha
                </div>
                <ul className="space-y-2 text-sm text-emerald-950">
                  {SWAHILI_EXAM_CHECKLIST.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="px-5 py-2.5 text-sm sm:text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Nimeelewa, Endelea na Mtihani
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
