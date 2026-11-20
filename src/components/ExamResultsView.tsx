import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileDown,
  Flag,
  Lightbulb,
  MinusCircle,
  RotateCcw,
  Search,
  XCircle,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { QUESTION_MAP, SECTIONS, getSectionInfo } from '../data/examData';
import { ExamAttemptState, OptionKey, SectionId } from '../types/exam';
import { PdfExportScope, exportExamResultsToPdf } from '../utils/pdfExport';
import { formatDuration } from '../utils/storage';

interface ExamResultsViewProps {
  attempt: ExamAttemptState;
  candidateName?: string;
  onBackHome: () => void;
  onRetakeSame: () => void;
  onRetakeIncorrect: (incorrectIds: number[]) => void;
}

type ReviewFilter = 'all' | 'incorrect' | 'unanswered' | 'flagged' | 'correct';
const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

interface SectionChartDatum {
  id: SectionId;
  axisLabel: string;
  title: string;
  code: string;
  accuracy: number;
  correct: number;
  missed: number;
  answered: number;
  total: number;
  passedSection: boolean;
}

interface SectionTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: SectionChartDatum }>;
}

const SectionChartTooltip: React.FC<SectionTooltipProps> = ({ active, payload }) => {
  const datum = active && payload && payload.length > 0 ? payload[0]?.payload : undefined;
  if (!datum) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-lg text-sm space-y-1.5 max-w-xs">
      <div className="font-semibold text-slate-900">
        Section {datum.id}: {datum.title}
      </div>
      <div className="text-xs text-slate-500">{datum.code}</div>
      <div className="pt-1.5 border-t border-slate-100 grid grid-cols-2 gap-x-4 gap-y-1 tabular-nums">
        <span className="text-slate-600">Accuracy:</span>
        <span
          className={`font-mono font-bold text-right ${
            datum.passedSection ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {datum.accuracy}%
        </span>
        <span className="text-slate-600">Correct:</span>
        <span className="font-mono font-semibold text-slate-900 text-right">
          {datum.correct} / {datum.total}
        </span>
        <span className="text-slate-600">Missed / Skipped:</span>
        <span className="font-mono font-semibold text-slate-900 text-right">
          {datum.missed}
        </span>
      </div>
      <div className="text-xs text-slate-500 pt-1">
        {datum.passedSection ? 'Status: At or above pass mark' : 'Status: Needs targeted revision'}
      </div>
    </div>
  );
};

export const ExamResultsView: React.FC<ExamResultsViewProps> = ({
  attempt,
  candidateName,
  onBackHome,
  onRetakeSame,
  onRetakeIncorrect,
}) => {
  const [filter, setFilter] = useState<ReviewFilter>('incorrect');
  const [sectionFilter, setSectionFilter] = useState<SectionId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [exportedScope, setExportedScope] = useState<PdfExportScope | null>(null);

  const handleExportPdf = (scope: PdfExportScope) => {
    exportExamResultsToPdf(attempt, { scope, candidateName });
    setExportedScope(scope);
    window.setTimeout(() => {
      setExportedScope((curr) => (curr === scope ? null : curr));
    }, 2500);
  };

  const flaggedSet = useMemo(() => new Set(attempt.flagged), [attempt.flagged]);
  const hintsSet = useMemo(() => new Set(attempt.hintsViewed ?? []), [attempt.hintsViewed]);

  const evaluated = useMemo(() => {
    return attempt.config.questionIds.map((qId, idx) => {
      const q = QUESTION_MAP[qId];
      const userAnswer = attempt.answers[qId];
      const isCorrect = userAnswer === q.correctAnswer;
      const isUnanswered = !userAnswer;
      const isFlagged = flaggedSet.has(qId);
      const usedHint = hintsSet.has(qId);
      return {
        index: idx + 1,
        question: q,
        userAnswer,
        isCorrect,
        isUnanswered,
        isFlagged,
        usedHint,
      };
    });
  }, [attempt, flaggedSet, hintsSet]);

  const totalQuestions = evaluated.length;
  const correctCount = evaluated.filter((e) => e.isCorrect).length;
  const unansweredCount = evaluated.filter((e) => e.isUnanswered).length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = scorePercent >= attempt.config.passThresholdPercent;

  const incorrectIds = useMemo(
    () => evaluated.filter((e) => !e.isCorrect).map((e) => e.question.id),
    [evaluated]
  );

  const timeSpentSeconds = useMemo(() => {
    if (attempt.config.durationSeconds > 0) {
      return Math.max(0, attempt.config.durationSeconds - attempt.remainingSeconds);
    }
    const end = attempt.submittedAt ?? Date.now();
    return Math.max(0, Math.floor((end - attempt.startedAt) / 1000));
  }, [attempt]);

  const sectionStats = useMemo(() => {
    return SECTIONS.map((sec) => {
      const items = evaluated.filter((e) => e.question.section === sec.id);
      if (items.length === 0) return null;
      const correct = items.filter((e) => e.isCorrect).length;
      const answered = items.filter((e) => !e.isUnanswered).length;
      const pct = Math.round((correct / items.length) * 100);
      return {
        section: sec,
        total: items.length,
        answered,
        correct,
        pct,
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
  }, [evaluated]);

  const sectionChartData: SectionChartDatum[] = useMemo(() => {
    return sectionStats.map(({ section, total: secTotal, answered, correct, pct }) => ({
      id: section.id,
      axisLabel: `Sec ${section.id} (${section.code})`,
      title: section.title,
      code: section.code,
      accuracy: pct,
      correct,
      missed: secTotal - correct,
      answered,
      total: secTotal,
      passedSection: pct >= attempt.config.passThresholdPercent,
    }));
  }, [sectionStats, attempt.config.passThresholdPercent]);

  const weakSectionIds = useMemo(
    () => sectionChartData.filter((s) => !s.passedSection).map((s) => `Section ${s.id} (${s.accuracy}%)`),
    [sectionChartData]
  );

  const handleBarSelectSection = (sectionId: SectionId) => {
    setSectionFilter(sectionId);
    setPage(0);
    const el = document.getElementById('answer-rationales');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const effectiveFilter: ReviewFilter =
    incorrectCount === 0 && filter === 'incorrect' ? 'all' : filter;

  const filteredItems = useMemo(() => {
    const qLower = searchQuery.trim().toLowerCase();
    return evaluated.filter((item) => {
      if (effectiveFilter === 'incorrect' && item.isCorrect) return false;
      if (effectiveFilter === 'unanswered' && !item.isUnanswered) return false;
      if (effectiveFilter === 'flagged' && !item.isFlagged) return false;
      if (effectiveFilter === 'correct' && !item.isCorrect) return false;

      if (sectionFilter !== 'ALL' && item.question.section !== sectionFilter) return false;

      if (qLower) {
        const hay = `${item.question.question} ${Object.values(item.question.options).join(' ')} ${item.question.rationale}`.toLowerCase();
        if (!hay.includes(qLower)) return false;
      }

      return true;
    });
  }, [evaluated, effectiveFilter, sectionFilter, searchQuery]);

  const PAGE_SIZE = 20;
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pagedItems = filteredItems.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      <div>
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 text-base font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Exam Papers
        </button>
      </div>

      {/* Grading Summary Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-500">
              Official Marking Report · {attempt.config.title}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                {passed ? 'Examination Passed' : 'Needs Further Revision'}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-md border ${
                  passed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {passed ? (
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <XCircle className="w-4 h-4" aria-hidden="true" />
                )}
                Pass Mark: {attempt.config.passThresholdPercent}%
              </span>
            </div>
            <p className="text-base text-slate-600">
              All answers and TNMC clinical rationales are now unlocked below for detailed review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {incorrectIds.length > 0 ? (
              <>
                <button
                  type="button"
                  onClick={() => handleExportPdf('missed')}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileDown className="w-4 h-4" aria-hidden="true" />
                  {exportedScope === 'missed'
                    ? 'Missed PDF Saved'
                    : `Export Missed PDF (${incorrectIds.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => handleExportPdf('all')}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileDown className="w-4 h-4" aria-hidden="true" />
                  {exportedScope === 'all' ? 'Full PDF Saved' : 'Full Paper PDF'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleExportPdf('all')}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm sm:text-base font-semibold text-emerald-950 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileDown className="w-4 h-4" aria-hidden="true" />
                {exportedScope === 'all' ? 'PDF Saved' : 'Export Results PDF'}
              </button>
            )}
            {incorrectIds.length > 0 && (
              <button
                type="button"
                onClick={() => onRetakeIncorrect(incorrectIds)}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm sm:text-base font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                Retake {incorrectIds.length} Incorrect
              </button>
            )}
            <button
              type="button"
              onClick={onRetakeSame}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm sm:text-base font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              Retake Full Paper
            </button>
          </div>
        </div>

        {/* Quantitative Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-sm font-medium text-slate-500">Overall Score</div>
            <div
              className={`font-mono text-3xl font-bold tabular-nums mt-1 ${
                passed ? 'text-emerald-800' : 'text-rose-700'
              }`}
            >
              {scorePercent}%
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-sm font-medium text-slate-500">Correct Answers</div>
            <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-1">
              {correctCount}
              <span className="text-lg font-normal text-slate-500">/{totalQuestions}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-sm font-medium text-slate-500">Incorrect / Skipped</div>
            <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-1">
              {incorrectCount}
              <span className="text-sm font-sans font-normal text-slate-500 ml-1.5">
                ({unansweredCount} skipped)
              </span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-sm font-medium text-slate-500">Hints Used</div>
            <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-1">
              {hintsSet.size}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2 lg:col-span-1">
            <div className="text-sm font-medium text-slate-500">Time Spent</div>
            <div className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-1">
              {formatDuration(timeSpentSeconds)}
            </div>
          </div>
        </div>
      </section>

      {/* Section Performance Breakdown */}
      <section id="section-breakdown" className="space-y-5">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Performance by Nursing Section
          </h2>
          <p className="text-base text-slate-600 mt-1">
            Identify weak clinical domains that require targeted revision before the December council examination.
          </p>
        </div>

        {/* Recharts Accuracy Bar Chart */}
        {sectionChartData.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 shrink-0">
                  <BarChart3 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Section Accuracy Comparison (%)
                  </h3>
                  <p className="text-sm text-slate-600 mt-0.5">
                    {weakSectionIds.length > 0
                      ? `Needs improvement: ${weakSectionIds.join(', ')}. Click any bar to review its questions below.`
                      : `All tested sections met or exceeded the ${attempt.config.passThresholdPercent}% pass threshold.`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-600 shrink-0">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" aria-hidden="true" />
                  Passed (&ge;{attempt.config.passThresholdPercent}%)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-rose-600 inline-block" aria-hidden="true" />
                  Needs Improvement (&lt;{attempt.config.passThresholdPercent}%)
                </span>
              </div>
            </div>

            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectionChartData}
                  margin={{ top: 16, right: 16, left: -8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis
                    dataKey="axisLabel"
                    tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                    interval={0}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(val: number) => `${val}%`}
                    tick={{ fill: '#475569', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    content={<SectionChartTooltip />}
                    cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
                  />
                  <ReferenceLine
                    y={attempt.config.passThresholdPercent}
                    stroke="#0F766E"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{
                      value: `Pass ${attempt.config.passThresholdPercent}%`,
                      position: 'insideTopRight',
                      fill: '#0F766E',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  />
                  <Bar
                    dataKey="accuracy"
                    name="Accuracy"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={68}
                    className="cursor-pointer"
                    onClick={(_, idx) => {
                      const target = sectionChartData[idx];
                      if (target) handleBarSelectSection(target.id);
                    }}
                  >
                    {sectionChartData.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.passedSection ? '#059669' : '#E11D48'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-4 text-right">Questions</th>
                  <th className="py-3.5 px-4 text-right">Attempted</th>
                  <th className="py-3.5 px-4 text-right">Correct</th>
                  <th className="py-3.5 px-4 text-right">Accuracy</th>
                  <th className="py-3.5 px-4 w-48 hidden sm:table-cell">Mastery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sectionStats.map(({ section, total, answered, correct, pct }) => (
                  <tr key={section.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        Section {section.id}: {section.title}
                      </div>
                      <div className="text-sm text-slate-500">{section.code}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      {total}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                      {answered}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 font-semibold">
                      {correct}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-mono font-bold tabular-nums ${
                        pct >= attempt.config.passThresholdPercent
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {pct}%
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            pct >= attempt.config.passThresholdPercent
                              ? 'bg-emerald-600'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Answer Key & Clinical Rationales Review */}
      <section id="answer-rationales" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Marking Scheme & Clinical Rationales
            </h2>
            <p className="text-base text-slate-600 mt-1 tabular-nums">
              Showing {filteredItems.length} of {totalQuestions} questions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="Search topic or drug..."
                className="pl-9 pr-3 py-2 text-sm sm:text-base bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 w-56"
              />
            </div>

            {sectionStats.length > 1 && (
              <select
                value={sectionFilter}
                onChange={(e) => {
                  setSectionFilter(e.target.value as SectionId | 'ALL');
                  setPage(0);
                }}
                aria-label="Filter by section"
                className="px-3 py-2 text-sm sm:text-base bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700"
              >
                <option value="ALL">All Sections</option>
                {sectionStats.map(({ section }) => (
                  <option key={section.id} value={section.id}>
                    Section {section.id}: {section.code}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Review Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg w-fit">
          {(
            [
              { id: 'all', label: `All (${totalQuestions})` },
              { id: 'incorrect', label: `Incorrect (${incorrectCount})` },
              { id: 'correct', label: `Correct (${correctCount})` },
              { id: 'unanswered', label: `Unanswered (${unansweredCount})` },
              { id: 'flagged', label: `Flagged (${attempt.flagged.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setFilter(tab.id);
                setPage(0);
              }}
              className={`px-3.5 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                effectiveFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Review Items */}
        {pagedItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-base text-slate-500">
            No questions match the selected filter criteria.
          </div>
        ) : (
          <div className="space-y-5">
            {pagedItems.map(
              ({ index, question, userAnswer, isCorrect, isUnanswered, isFlagged, usedHint }) => {
                const sec = getSectionInfo(question.section);
                return (
                  <article
                    key={question.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="text-sm font-medium text-slate-500 tabular-nums flex flex-wrap items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900">
                          Item {index} (TNMC Q{question.id})
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Section {sec.id}: {sec.code} — {sec.title}
                        </span>
                        {isFlagged && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                              <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                              Flagged
                            </span>
                          </>
                        )}
                        {usedHint && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 text-teal-700 font-semibold">
                              <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                              Hint Viewed
                            </span>
                          </>
                        )}
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-md border ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : isUnanswered
                              ? 'bg-slate-100 border-slate-200 text-slate-700'
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                            Correct
                          </>
                        ) : isUnanswered ? (
                          <>
                            <MinusCircle className="w-4 h-4" aria-hidden="true" />
                            Unanswered
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" aria-hidden="true" />
                            Incorrect
                          </>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 leading-relaxed max-w-[75ch]">
                      {question.question}
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5">
                      {OPTION_KEYS.map((key) => {
                        const isCorrectOption = question.correctAnswer === key;
                        const isUserSelection = userAnswer === key;

                        let rowStyle = 'bg-white border-slate-200 text-slate-700';
                        let badgeStyle = 'bg-slate-100 border-slate-200 text-slate-700';

                        if (isCorrectOption) {
                          rowStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-950';
                          badgeStyle = 'bg-emerald-700 border-emerald-700 text-white';
                        } else if (isUserSelection && !isCorrectOption) {
                          rowStyle = 'bg-rose-50/70 border-rose-300 text-rose-950';
                          badgeStyle = 'bg-rose-700 border-rose-700 text-white';
                        }

                        return (
                          <div
                            key={key}
                            className={`px-4 py-3.5 rounded-xl border text-base flex items-start justify-between gap-4 ${rowStyle}`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 border mt-0.5 ${badgeStyle}`}
                              >
                                {key}
                              </span>
                              <span className="leading-relaxed">{question.options[key]}</span>
                            </div>

                            <div className="shrink-0 text-sm font-semibold whitespace-nowrap pt-0.5">
                              {isCorrectOption && isUserSelection && (
                                <span className="text-emerald-800">Your Choice · Correct</span>
                              )}
                              {isCorrectOption && !isUserSelection && (
                                <span className="text-emerald-800">Correct Answer</span>
                              )}
                              {!isCorrectOption && isUserSelection && (
                                <span className="text-rose-800">Your Choice</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 text-base text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">Clinical Rationale: </span>
                      {question.rationale}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => {
                setPage((p) => Math.max(0, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 text-sm sm:text-base font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Previous Page
            </button>
            <span className="text-sm sm:text-base font-mono text-slate-600 tabular-nums">
              Page {safePage + 1} of {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => {
                setPage((p) => Math.min(totalPages - 1, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 text-sm sm:text-base font-medium bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Next Page
            </button>
          </div>
        )}
      </section>
    </main>
  );
};
