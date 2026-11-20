import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActiveExamView } from './components/ActiveExamView';
import { ExamResultsView } from './components/ExamResultsView';
import { ExamSetupView } from './components/ExamSetupView';
import { TopBar } from './components/TopBar';
import { ALL_QUESTIONS, EXAM_METADATA, QUESTION_MAP, getSectionInfo } from './data/examData';
import { auth, googleProvider } from './firebase';
import {
  DEFAULT_GLOBAL_STATS,
  deleteActiveAttemptFromCloud,
  ensureStudentProfile,
  loadLatestActiveAttemptFromCloud,
  loadUserHistoryFromCloud,
  recordCompletedAttemptToCloud,
  saveActiveAttemptToCloud,
  subscribeGlobalStats,
} from './services/cloudSync';
import {
  AttemptHistoryEntry,
  ExamAttemptState,
  ExamSessionConfig,
  GlobalDashboardStats,
  OptionKey,
} from './types/exam';
import {
  clearAttemptHistory,
  loadActiveAttempt,
  loadAttemptHistory,
  saveActiveAttempt,
  saveAttemptToHistory,
  shuffleArray,
} from './utils/storage';

type Screen = 'setup' | 'exam' | 'results';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [globalStats, setGlobalStats] = useState<GlobalDashboardStats>(DEFAULT_GLOBAL_STATS);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  const [savedAttempt, setSavedAttempt] = useState<ExamAttemptState | null>(() =>
    loadActiveAttempt()
  );
  const [currentAttempt, setCurrentAttempt] = useState<ExamAttemptState | null>(() => {
    const existing = loadActiveAttempt();
    return existing && existing.status === 'submitted' ? existing : null;
  });
  const [screen, setScreen] = useState<Screen>('setup');
  const [history, setHistory] = useState<AttemptHistoryEntry[]>(() => loadAttemptHistory());
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  const latestAttemptRef = useRef<ExamAttemptState | null>(currentAttempt);
  latestAttemptRef.current = currentAttempt;

  // Subscribe to global student participation stats
  useEffect(() => {
    const unsub = subscribeGlobalStats(
      (stats) => {
        setGlobalStats(stats);
        setIsLoadingStats(false);
      },
      () => {
        setIsLoadingStats(false);
      }
    );
    return () => unsub();
  }, []);

  // Listen for Firebase Auth state & sync cloud records
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);

      if (nextUser) {
        try {
          await ensureStudentProfile(nextUser);
          const [cloudActive, cloudHistory] = await Promise.all([
            loadLatestActiveAttemptFromCloud(nextUser.uid),
            loadUserHistoryFromCloud(nextUser.uid),
          ]);

          const localActive = loadActiveAttempt();
          if (cloudActive && (!localActive || localActive.status !== 'in-progress')) {
            setSavedAttempt(cloudActive);
            saveActiveAttempt(cloudActive);
          } else if (
            localActive &&
            localActive.status === 'in-progress' &&
            (!cloudActive || Object.keys(localActive.answers).length >= Object.keys(cloudActive.answers).length)
          ) {
            await saveActiveAttemptToCloud(nextUser.uid, localActive);
          } else if (cloudActive) {
            setSavedAttempt(cloudActive);
            saveActiveAttempt(cloudActive);
          }

          if (cloudHistory.length > 0) {
            setHistory((prevLocal) => {
              const map = new Map<string, AttemptHistoryEntry>();
              for (const item of prevLocal) map.set(item.sessionId, item);
              for (const item of cloudHistory) map.set(item.sessionId, item);
              return Array.from(map.values()).sort((a, b) => b.submittedAt - a.submittedAt);
            });
          }
        } catch (err) {
          console.error('Failed to sync student records:', err);
        }
      }
    });
    return () => unsub();
  }, []);

  // Sync active attempt to localStorage whenever it changes
  useEffect(() => {
    if (currentAttempt) {
      saveActiveAttempt(currentAttempt);
      setSavedAttempt(currentAttempt);
    }
  }, [currentAttempt]);

  // Debounced cloud save when answers/flags/hints/navigation change during active exam
  useEffect(() => {
    if (!user || screen !== 'exam' || !currentAttempt || currentAttempt.status !== 'in-progress') {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsSyncingCloud(true);
      saveActiveAttemptToCloud(user.uid, currentAttempt)
        .catch(() => {})
        .finally(() => setIsSyncingCloud(false));
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [
    user,
    screen,
    currentAttempt?.sessionId,
    currentAttempt?.answers,
    currentAttempt?.flagged,
    currentAttempt?.hintsViewed,
    currentAttempt?.currentIndex,
    currentAttempt?.status,
  ]);

  // Periodic cloud checkpoint every 15 seconds to preserve timer remainingSeconds
  useEffect(() => {
    if (!user || screen !== 'exam') return;
    const interval = window.setInterval(() => {
      const latest = latestAttemptRef.current;
      if (latest && latest.status === 'in-progress') {
        saveActiveAttemptToCloud(user.uid, latest).catch(() => {});
      }
    }, 15000);
    return () => window.clearInterval(interval);
  }, [user, screen]);

  const handleSignIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign-in failed or cancelled:', err);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      setHistory(loadAttemptHistory());
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  }, []);

  const finalizeAndGradeAttempt = useCallback(
    async (attemptToGrade: ExamAttemptState) => {
      if (attemptToGrade.status === 'submitted') return;

      const submittedAt = Date.now();
      const completed: ExamAttemptState = {
        ...attemptToGrade,
        status: 'submitted',
        submittedAt,
      };

      const totalQuestions = completed.config.questionIds.length;
      const answeredCount = Object.keys(completed.answers).length;
      const incorrectIds: number[] = [];
      let correctCount = 0;

      for (const qId of completed.config.questionIds) {
        const q = QUESTION_MAP[qId];
        if (q && completed.answers[qId] === q.correctAnswer) {
          correctCount += 1;
        } else {
          incorrectIds.push(qId);
        }
      }

      const scorePercent =
        totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const passed = scorePercent >= completed.config.passThresholdPercent;
      const timeSpentSeconds =
        completed.config.durationSeconds > 0
          ? Math.max(0, completed.config.durationSeconds - completed.remainingSeconds)
          : Math.max(0, Math.floor((submittedAt - completed.startedAt) / 1000));

      const entry: AttemptHistoryEntry = {
        sessionId: completed.sessionId,
        title: completed.config.title,
        mode: completed.config.mode,
        totalQuestions,
        answeredCount,
        correctCount,
        scorePercent,
        passed,
        timeSpentSeconds,
        hintsUsedCount: (completed.hintsViewed ?? []).length,
        submittedAt,
        incorrectIds,
        questionIds: completed.config.questionIds,
        answers: completed.answers,
        flagged: completed.flagged,
        hintsViewed: completed.hintsViewed ?? [],
        passThresholdPercent: completed.config.passThresholdPercent,
      };

      const updatedHistory = saveAttemptToHistory(entry);
      setHistory(updatedHistory);
      setCurrentAttempt(completed);
      saveActiveAttempt(completed);
      setSavedAttempt(completed);
      setShowSubmitModal(false);
      setScreen('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (user) {
        try {
          await recordCompletedAttemptToCloud(user, completed, entry);
        } catch (err) {
          console.error('Cloud record submission error:', err);
        }
      }
    },
    [user]
  );

  // Automatic 1-second timer tick for timed papers in progress
  useEffect(() => {
    if (
      screen !== 'exam' ||
      !currentAttempt ||
      currentAttempt.status !== 'in-progress' ||
      currentAttempt.config.durationSeconds <= 0
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentAttempt((prev) => {
        if (!prev || prev.status !== 'in-progress') return prev;
        if (prev.remainingSeconds <= 1) {
          const zeroed: ExamAttemptState = { ...prev, remainingSeconds: 0 };
          window.setTimeout(() => void finalizeAndGradeAttempt(zeroed), 0);
          return zeroed;
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    screen,
    currentAttempt?.sessionId,
    currentAttempt?.status,
    currentAttempt?.config.durationSeconds,
    finalizeAndGradeAttempt,
  ]);

  const startExamWithConfig = useCallback(
    (config: ExamSessionConfig) => {
      const newAttempt: ExamAttemptState = {
        sessionId: `tnmcle-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        config,
        answers: {},
        flagged: [],
        hintsViewed: [],
        currentIndex: 0,
        remainingSeconds: config.durationSeconds,
        startedAt: Date.now(),
        submittedAt: null,
        status: 'in-progress',
      };
      setCurrentAttempt(newAttempt);
      saveActiveAttempt(newAttempt);
      setSavedAttempt(newAttempt);
      setShowSubmitModal(false);
      setScreen('exam');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (user) {
        saveActiveAttemptToCloud(user.uid, newAttempt).catch(() => {});
      }
    },
    [user]
  );

  const handleStartFullPaper = useCallback(() => {
    startExamWithConfig({
      mode: 'full',
      title: 'Full Licensure Paper (RN005-2015)',
      questionIds: ALL_QUESTIONS.map((q) => q.id),
      durationSeconds: EXAM_METADATA.recommendedFullDurationMinutes * 60,
      shuffleQuestions: false,
      passThresholdPercent: EXAM_METADATA.passThresholdPercent,
    });
  }, [startExamWithConfig]);

  const handleResumeAttempt = useCallback(() => {
    if (savedAttempt && savedAttempt.status === 'in-progress') {
      setCurrentAttempt(savedAttempt);
      setScreen('exam');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [savedAttempt]);

  const handleDiscardAttempt = useCallback(() => {
    const idToDelete = savedAttempt?.sessionId;
    saveActiveAttempt(null);
    setSavedAttempt(null);
    setCurrentAttempt(null);
    if (user && idToDelete) {
      deleteActiveAttemptFromCloud(user.uid, idToDelete).catch(() => {});
    }
  }, [user, savedAttempt?.sessionId]);

  const handleSelectAnswer = useCallback((questionId: number, option: OptionKey) => {
    setCurrentAttempt((prev) => {
      if (!prev || prev.status !== 'in-progress') return prev;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: option,
        },
      };
    });
  }, []);

  const handleClearAnswer = useCallback((questionId: number) => {
    setCurrentAttempt((prev) => {
      if (!prev || prev.status !== 'in-progress') return prev;
      const nextAnswers = { ...prev.answers };
      delete nextAnswers[questionId];
      return {
        ...prev,
        answers: nextAnswers,
      };
    });
  }, []);

  const handleToggleFlag = useCallback((questionId: number) => {
    setCurrentAttempt((prev) => {
      if (!prev || prev.status !== 'in-progress') return prev;
      const exists = prev.flagged.includes(questionId);
      return {
        ...prev,
        flagged: exists
          ? prev.flagged.filter((id) => id !== questionId)
          : [...prev.flagged, questionId],
      };
    });
  }, []);

  const handleRevealHint = useCallback((questionId: number) => {
    setCurrentAttempt((prev) => {
      if (!prev || prev.status !== 'in-progress') return prev;
      const existing = prev.hintsViewed ?? [];
      if (existing.includes(questionId)) return prev;
      return {
        ...prev,
        hintsViewed: [...existing, questionId],
      };
    });
  }, []);

  const handleNavigateIndex = useCallback((index: number) => {
    setCurrentAttempt((prev) => {
      if (!prev) return prev;
      const clamped = Math.min(Math.max(0, index), prev.config.questionIds.length - 1);
      return {
        ...prev,
        currentIndex: clamped,
      };
    });
  }, []);

  const handleRetakeIncorrect = useCallback(
    (incorrectIds: number[], passThresholdPercent = 50) => {
      if (incorrectIds.length === 0) return;
      const durationMinutes = Math.max(10, incorrectIds.length);
      startExamWithConfig({
        mode: 'retry-incorrect',
        title: `Missed Questions Remediation (${incorrectIds.length} Items)`,
        questionIds: shuffleArray(incorrectIds),
        durationSeconds: durationMinutes * 60,
        shuffleQuestions: true,
        passThresholdPercent,
      });
    },
    [startExamWithConfig]
  );

  const handleReviewHistoryEntry = useCallback((entry: AttemptHistoryEntry) => {
    if (!entry.questionIds || !entry.answers) return;
    const reconstructed: ExamAttemptState = {
      sessionId: entry.sessionId,
      config: {
        mode: entry.mode,
        title: entry.title,
        questionIds: entry.questionIds,
        durationSeconds: entry.timeSpentSeconds,
        shuffleQuestions: false,
        passThresholdPercent: entry.passThresholdPercent ?? 50,
      },
      answers: entry.answers,
      flagged: entry.flagged ?? [],
      hintsViewed: entry.hintsViewed ?? [],
      currentIndex: 0,
      remainingSeconds: 0,
      startedAt: entry.submittedAt - entry.timeSpentSeconds * 1000,
      submittedAt: entry.submittedAt,
      status: 'submitted',
    };
    setCurrentAttempt(reconstructed);
    setScreen('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearHistory = useCallback(() => {
    clearAttemptHistory();
    setHistory([]);
  }, []);

  const handleNavigateHome = useCallback(() => {
    setShowSubmitModal(false);
    if (screen === 'exam' && currentAttempt && currentAttempt.status === 'in-progress') {
      saveActiveAttempt(currentAttempt);
      setSavedAttempt(currentAttempt);
      if (user) {
        saveActiveAttemptToCloud(user.uid, currentAttempt).catch(() => {});
      }
    }
    setScreen('setup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen, currentAttempt, user]);

  const activeSectionLabel = (() => {
    if (screen !== 'exam' || !currentAttempt) return undefined;
    const qId = currentAttempt.config.questionIds[currentAttempt.currentIndex];
    const q = QUESTION_MAP[qId];
    if (!q) return undefined;
    const sec = getSectionInfo(q.section);
    return `Section ${sec.id} · ${sec.title}`;
  })();

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <TopBar
        screen={screen}
        onNavigateHome={handleNavigateHome}
        onStartFullExam={handleStartFullPaper}
        onRequestSubmit={() => setShowSubmitModal(true)}
        onRetakeNew={handleNavigateHome}
        activeSectionLabel={activeSectionLabel}
      />

      <div className="flex-1">
        {screen === 'setup' && (
          <ExamSetupView
            user={user}
            authLoading={authLoading}
            onSignIn={() => void handleSignIn()}
            onSignOut={() => void handleSignOut()}
            savedAttempt={savedAttempt}
            history={history}
            globalStats={globalStats}
            isLoadingStats={isLoadingStats}
            onStartExam={startExamWithConfig}
            onResumeAttempt={handleResumeAttempt}
            onDiscardAttempt={handleDiscardAttempt}
            onReviewHistoryEntry={handleReviewHistoryEntry}
            onRetryIncorrectFromHistory={(entry) => handleRetakeIncorrect(entry.incorrectIds)}
            onClearHistory={handleClearHistory}
          />
        )}

        {screen === 'exam' && currentAttempt && (
          <ActiveExamView
            attempt={currentAttempt}
            showSubmitModal={showSubmitModal}
            isSyncingCloud={isSyncingCloud}
            onCloseSubmitModal={() => setShowSubmitModal(false)}
            onOpenSubmitModal={() => setShowSubmitModal(true)}
            onSelectAnswer={handleSelectAnswer}
            onClearAnswer={handleClearAnswer}
            onToggleFlag={handleToggleFlag}
            onRevealHint={handleRevealHint}
            onNavigateIndex={handleNavigateIndex}
            onConfirmSubmit={() => void finalizeAndGradeAttempt(currentAttempt)}
          />
        )}

        {screen === 'results' && currentAttempt && currentAttempt.status === 'submitted' && (
          <ExamResultsView
            attempt={currentAttempt}
            candidateName={user?.displayName || user?.email || undefined}
            onBackHome={handleNavigateHome}
            onRetakeSame={() => startExamWithConfig(currentAttempt.config)}
            onRetakeIncorrect={(ids) =>
              handleRetakeIncorrect(ids, currentAttempt.config.passThresholdPercent)
            }
          />
        )}
      </div>

      <footer className="border-t border-slate-200 bg-white/90 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
          <span>
            JIPIME TNMCLE PREPARATION TO DECEMBER · {EXAM_METADATA.council} ({EXAM_METADATA.paperCode})
          </span>
          <span className="tabular-nums">
            Questions 1–{EXAM_METADATA.totalQuestions} · Answers Locked During Active Attempt
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
