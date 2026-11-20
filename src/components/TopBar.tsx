import React from 'react';

interface TopBarProps {
  screen: 'setup' | 'exam' | 'results';
  onNavigateHome: () => void;
  onStartFullExam: () => void;
  onRequestSubmit?: () => void;
  onRetakeNew?: () => void;
  activeSectionLabel?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  screen,
  onNavigateHome,
  onStartFullExam,
  onRequestSubmit,
  onRetakeNew,
  activeSectionLabel,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="font-serif text-base sm:text-lg font-bold tracking-tight text-emerald-950 whitespace-nowrap shrink-0 truncate max-w-[210px] sm:max-w-none hover:text-emerald-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 cursor-pointer"
          title="JIPIME TNMCLE PREPARATION TO DECEMBER"
        >
          JIPIME TNMCLE PREPARATION TO DECEMBER
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        {screen === 'setup' ? (
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#maelekezo-muhimu"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Maelekezo
            </a>
            <a
              href="#paper-modes"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Exam Papers
            </a>
            <a
              href="#student-dashboard"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Dashboard
            </a>
            <a
              href="#formulas-guide"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Formulas
            </a>
            <a
              href="#attempt-history"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              History
            </a>
          </nav>
        ) : screen === 'exam' ? (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Save & Exit
            </button>
            <span className="text-slate-500 whitespace-nowrap shrink-0 truncate max-w-xs">
              {activeSectionLabel || 'Licensure Examination'}
            </span>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Exam Papers
            </button>
            <a
              href="#section-breakdown"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Score Breakdown
            </a>
            <a
              href="#answer-rationales"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Answer Key
            </a>
          </nav>
        )}

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          {screen === 'setup' && (
            <button
              type="button"
              onClick={onStartFullExam}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Start Full Paper
            </button>
          )}
          {screen === 'exam' && onRequestSubmit && (
            <button
              type="button"
              onClick={onRequestSubmit}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Submit Paper
            </button>
          )}
          {screen === 'results' && onRetakeNew && (
            <button
              type="button"
              onClick={onRetakeNew}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              New Paper
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
