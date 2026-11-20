import React from 'react';
import { Award, CheckCircle2, FileCheck2, Users, XCircle } from 'lucide-react';
import { SECTIONS } from '../data/examData';
import { GlobalDashboardStats } from '../types/exam';

interface StudentDashboardSectionProps {
  stats: GlobalDashboardStats;
  isLoadingStats: boolean;
}

export const StudentDashboardSection: React.FC<StudentDashboardSectionProps> = ({
  stats,
  isLoadingStats,
}) => {
  const passRate =
    stats.totalSubmissions > 0
      ? Math.round((stats.passedSubmissions / stats.totalSubmissions) * 100)
      : 0;
  const avgScore =
    stats.totalSubmissions > 0
      ? Math.round(stats.totalScoreSum / stats.totalSubmissions)
      : 0;

  return (
    <section id="student-dashboard" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Student Participation Dashboard
          </h2>
          <p className="text-base text-slate-600 mt-1">
            Live cohort overview showing how many registered nurse candidates have attempted and completed papers.
          </p>
        </div>
        <div className="text-sm font-medium text-emerald-800 tabular-nums">
          {isLoadingStats ? 'Syncing live statistics...' : 'Live Cohort Metrics'}
        </div>
      </div>

      {/* 4 Primary Cohort Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Students Participated</span>
            <Users className="w-5 h-5 text-emerald-700" aria-hidden="true" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums">
            {stats.uniqueStudentsCount}
          </div>
          <div className="text-sm text-slate-500">
            Signed-in candidates who completed papers
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Total Papers Submitted</span>
            <FileCheck2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums">
            {stats.totalSubmissions}
          </div>
          <div className="text-sm text-slate-500 tabular-nums">
            {stats.fullExamSubmissions} full 189-question papers
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Cohort Average Score</span>
            <Award className="w-5 h-5 text-emerald-700" aria-hidden="true" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-slate-900 tabular-nums">
            {avgScore}%
          </div>
          <div className="text-sm text-slate-500">
            Across all recorded paper submissions
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Cohort Pass Rate</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-bold text-emerald-800 tabular-nums">
            {passRate}%
          </div>
          <div className="text-sm text-slate-500 tabular-nums">
            {stats.passedSubmissions} passed attempts
          </div>
        </div>
      </div>

      {/* Section Participation Breakdown + Recent Student Completions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900">
            Attempts by Nursing Section
          </h3>
          <div className="space-y-3.5">
            {SECTIONS.map((sec) => {
              const count = stats.sectionCounts[sec.id] || 0;
              const sum = stats.sectionScoreSums[sec.id] || 0;
              const secAvg = count > 0 ? Math.round(sum / count) : 0;
              return (
                <div key={sec.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-slate-800 truncate">
                      {sec.id}. {sec.title}
                    </span>
                    <span className="font-mono text-slate-600 tabular-nums shrink-0">
                      {count} attempts · {secAvg}% avg
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 transition-all duration-300"
                      style={{ width: `${secAvg}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Recent Student Submissions
            </h3>
            <span className="text-sm text-slate-500">Latest 15 verified completions</span>
          </div>

          {stats.recentActivity.length === 0 ? (
            <div className="py-10 text-center text-base text-slate-500">
              No student submissions recorded yet. Sign in with Google and submit any paper to appear on the live cohort board.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-2.5 pr-3">Student</th>
                    <th className="py-2.5 px-3">Paper</th>
                    <th className="py-2.5 px-3 text-right">Score</th>
                    <th className="py-2.5 pl-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentActivity.map((item, i) => (
                    <tr key={`${item.submittedAtMs}-${i}`}>
                      <td className="py-3 pr-3 font-semibold text-slate-900 whitespace-nowrap">
                        {item.displayName}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[240px] truncate">
                        {item.paperTitle}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-slate-900 whitespace-nowrap">
                        {item.scorePercent}% ({item.correctCount}/{item.totalQuestions})
                      </td>
                      <td className="py-3 pl-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-semibold ${
                            item.passed ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {item.passed ? (
                            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <XCircle className="w-4 h-4" aria-hidden="true" />
                          )}
                          {item.passed ? 'Passed' : 'Review'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
