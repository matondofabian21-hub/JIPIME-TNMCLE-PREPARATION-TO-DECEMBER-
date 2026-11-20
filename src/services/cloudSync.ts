import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { QUESTION_MAP } from '../data/examData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  AttemptHistoryEntry,
  ExamAttemptState,
  GlobalDashboardStats,
  OptionKey,
  RecentStudentActivity,
  SectionId,
} from '../types/exam';

const EMPTY_SECTION_MAP = (): Record<SectionId, number> => ({
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0,
});

export const DEFAULT_GLOBAL_STATS: GlobalDashboardStats = {
  totalSubmissions: 0,
  uniqueStudentsCount: 0,
  fullExamSubmissions: 0,
  passedSubmissions: 0,
  totalScoreSum: 0,
  sectionCounts: EMPTY_SECTION_MAP(),
  sectionScoreSums: EMPTY_SECTION_MAP(),
  recentActivity: [],
};

function sanitizeDisplayName(user: User, customName?: string): string {
  const raw = (customName || user.displayName || 'Registered Nurse Candidate').trim();
  // Strip email-like strings so no PII is published
  const safe = raw.includes('@') ? raw.split('@')[0] : raw;
  return (safe || 'Nurse Candidate').slice(0, 60);
}

export async function ensureStudentProfile(user: User, customName?: string): Promise<void> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    const cleanName = sanitizeDisplayName(user, customName);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        displayName: cleanName,
        hasRecordedSubmission: false,
        totalCompleted: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else if (customName && customName.trim()) {
      const data = snap.data();
      await setDoc(ref, {
        uid: user.uid,
        displayName: cleanName,
        hasRecordedSubmission: Boolean(data.hasRecordedSubmission),
        totalCompleted: typeof data.totalCompleted === 'number' ? data.totalCompleted : 0,
        createdAt: data.createdAt,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveActiveAttemptToCloud(
  userId: string,
  attempt: ExamAttemptState
): Promise<void> {
  if (attempt.status !== 'in-progress') return;
  const path = `users/${userId}/activeAttempts/${attempt.sessionId}`;
  const ref = doc(db, 'users', userId, 'activeAttempts', attempt.sessionId);

  // Convert answers keys to strings safely
  const safeAnswers: Record<string, OptionKey> = {};
  for (const [k, v] of Object.entries(attempt.answers)) {
    if (v === 'A' || v === 'B' || v === 'C' || v === 'D') {
      safeAnswers[String(k)] = v;
    }
  }

  const payload: Record<string, unknown> = {
    userId,
    sessionId: attempt.sessionId,
    title: attempt.config.title.slice(0, 160),
    mode: attempt.config.mode,
    questionIds: attempt.config.questionIds.slice(0, 189),
    answers: safeAnswers,
    flagged: attempt.flagged.slice(0, 189),
    hintsViewed: (attempt.hintsViewed ?? []).slice(0, 189),
    currentIndex: Math.min(Math.max(0, attempt.currentIndex), 188),
    durationSeconds: Math.min(Math.max(0, attempt.config.durationSeconds), 28800),
    remainingSeconds: Math.min(Math.max(0, attempt.remainingSeconds), 28800),
    passThresholdPercent: attempt.config.passThresholdPercent,
    shuffleQuestions: Boolean(attempt.config.shuffleQuestions),
    startedAtMs: attempt.startedAt,
    updatedAt: serverTimestamp(),
  };

  if (attempt.config.sectionId) {
    payload.sectionId = attempt.config.sectionId;
  }

  try {
    await setDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadLatestActiveAttemptFromCloud(
  userId: string
): Promise<ExamAttemptState | null> {
  const path = `users/${userId}/activeAttempts`;
  try {
    const q = query(
      collection(db, 'users', userId, 'activeAttempts'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const sortedDocs = [...snap.docs].sort((a, b) => {
      const aData = a.data();
      const bData = b.data();
      const aMs =
        aData.updatedAt && typeof aData.updatedAt.toMillis === 'function'
          ? aData.updatedAt.toMillis()
          : Number(aData.startedAtMs) || 0;
      const bMs =
        bData.updatedAt && typeof bData.updatedAt.toMillis === 'function'
          ? bData.updatedAt.toMillis()
          : Number(bData.startedAtMs) || 0;
      return bMs - aMs;
    });

    const first = sortedDocs[0].data();
    const answers: Record<number, OptionKey> = {};
    if (first.answers && typeof first.answers === 'object') {
      for (const [k, v] of Object.entries(first.answers as Record<string, OptionKey>)) {
        answers[Number(k)] = v;
      }
    }

    return {
      sessionId: String(first.sessionId),
      config: {
        mode: first.mode,
        title: String(first.title),
        sectionId: first.sectionId,
        questionIds: Array.isArray(first.questionIds) ? first.questionIds : [],
        durationSeconds: Number(first.durationSeconds) || 0,
        shuffleQuestions: Boolean(first.shuffleQuestions),
        passThresholdPercent: Number(first.passThresholdPercent) || 50,
      },
      answers,
      flagged: Array.isArray(first.flagged) ? first.flagged : [],
      hintsViewed: Array.isArray(first.hintsViewed) ? first.hintsViewed : [],
      currentIndex: Number(first.currentIndex) || 0,
      remainingSeconds: Number(first.remainingSeconds) || 0,
      startedAt: Number(first.startedAtMs) || Date.now(),
      submittedAt: null,
      status: 'in-progress',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteActiveAttemptFromCloud(
  userId: string,
  sessionId: string
): Promise<void> {
  const path = `users/${userId}/activeAttempts/${sessionId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'activeAttempts', sessionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function loadUserHistoryFromCloud(userId: string): Promise<AttemptHistoryEntry[]> {
  const path = `users/${userId}/attempts`;
  try {
    const q = query(
      collection(db, 'users', userId, 'attempts'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const entries = snap.docs.map((d) => {
      const data = d.data();
      const submittedMs =
        data.submittedAt && typeof data.submittedAt.toMillis === 'function'
          ? data.submittedAt.toMillis()
          : Date.now();
      const restoredAnswers: Record<number, OptionKey> = {};
      if (data.answers && typeof data.answers === 'object') {
        for (const [k, v] of Object.entries(data.answers as Record<string, OptionKey>)) {
          restoredAnswers[Number(k)] = v;
        }
      }
      return {
        sessionId: String(data.sessionId),
        title: String(data.title),
        mode: data.mode,
        totalQuestions: Number(data.totalQuestions) || 0,
        answeredCount: Number(data.answeredCount) || 0,
        correctCount: Number(data.correctCount) || 0,
        scorePercent: Number(data.scorePercent) || 0,
        passed: Boolean(data.passed),
        timeSpentSeconds: Number(data.timeSpentSeconds) || 0,
        hintsUsedCount: Number(data.hintsUsedCount) || 0,
        submittedAt: submittedMs,
        incorrectIds: Array.isArray(data.incorrectIds) ? data.incorrectIds : [],
        questionIds: Array.isArray(data.questionIds) ? data.questionIds : undefined,
        answers: restoredAnswers,
        flagged: Array.isArray(data.flagged) ? data.flagged : [],
        hintsViewed: Array.isArray(data.hintsViewed) ? data.hintsViewed : [],
        passThresholdPercent: Number(data.passThresholdPercent) || 50,
      };
    });
    return entries.sort((a, b) => b.submittedAt - a.submittedAt);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function recordCompletedAttemptToCloud(
  user: User,
  completed: ExamAttemptState,
  entry: AttemptHistoryEntry
): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const attemptRef = doc(db, 'users', user.uid, 'attempts', completed.sessionId);
  const activeRef = doc(db, 'users', user.uid, 'activeAttempts', completed.sessionId);
  const statsRef = doc(db, 'stats', 'global');

  const safeAnswers: Record<string, OptionKey> = {};
  for (const [k, v] of Object.entries(completed.answers)) {
    if (v === 'A' || v === 'B' || v === 'C' || v === 'D') {
      safeAnswers[String(k)] = v;
    }
  }

  // Compute section accuracy contributions for this attempt
  const attemptSectionTotals = EMPTY_SECTION_MAP();
  const attemptSectionCorrect = EMPTY_SECTION_MAP();
  for (const qId of completed.config.questionIds) {
    const q = QUESTION_MAP[qId];
    if (!q) continue;
    attemptSectionTotals[q.section] += 1;
    if (completed.answers[qId] === q.correctAnswer) {
      attemptSectionCorrect[q.section] += 1;
    }
  }

  const transactionPath = `users/${user.uid}/attempts/${completed.sessionId}`;
  try {
    await runTransaction(db, async (tx) => {
      const [userSnap, statsSnap] = await Promise.all([tx.get(userRef), tx.get(statsRef)]);

      const displayName = sanitizeDisplayName(
        user,
        userSnap.exists() ? (userSnap.data().displayName as string) : undefined
      );
      const alreadyRecorded = userSnap.exists()
        ? Boolean(userSnap.data().hasRecordedSubmission)
        : false;
      const prevTotalCompleted = userSnap.exists()
        ? Number(userSnap.data().totalCompleted) || 0
        : 0;

      // 1. Write or update student profile
      if (!userSnap.exists()) {
        tx.set(userRef, {
          uid: user.uid,
          displayName,
          hasRecordedSubmission: true,
          totalCompleted: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        tx.set(userRef, {
          uid: user.uid,
          displayName,
          hasRecordedSubmission: true,
          totalCompleted: prevTotalCompleted + 1,
          createdAt: userSnap.data().createdAt,
          updatedAt: serverTimestamp(),
        });
      }

      // 2. Write completed attempt
      const attemptDoc: Record<string, unknown> = {
        userId: user.uid,
        sessionId: completed.sessionId,
        title: completed.config.title.slice(0, 160),
        mode: completed.config.mode,
        totalQuestions: entry.totalQuestions,
        answeredCount: entry.answeredCount,
        correctCount: entry.correctCount,
        scorePercent: entry.scorePercent,
        passed: entry.passed,
        timeSpentSeconds: entry.timeSpentSeconds,
        hintsUsedCount: (completed.hintsViewed ?? []).length,
        incorrectIds: entry.incorrectIds.slice(0, 189),
        questionIds: completed.config.questionIds.slice(0, 189),
        answers: safeAnswers,
        flagged: completed.flagged.slice(0, 189),
        hintsViewed: (completed.hintsViewed ?? []).slice(0, 189),
        passThresholdPercent: completed.config.passThresholdPercent,
        submittedAt: serverTimestamp(),
      };
      if (completed.config.sectionId) {
        attemptDoc.sectionId = completed.config.sectionId;
      }
      tx.set(attemptRef, attemptDoc);

      // 3. Remove in-progress draft if it existed
      tx.delete(activeRef);

      // 4. Atomically update global dashboard stats
      const newActivityItem: RecentStudentActivity = {
        displayName,
        paperTitle: completed.config.title.slice(0, 100),
        mode: completed.config.mode,
        totalQuestions: entry.totalQuestions,
        correctCount: entry.correctCount,
        scorePercent: entry.scorePercent,
        passed: entry.passed,
        submittedAtMs: Date.now(),
      };

      const prevStats: GlobalDashboardStats = statsSnap.exists()
        ? (statsSnap.data() as GlobalDashboardStats)
        : DEFAULT_GLOBAL_STATS;

      const nextSectionCounts = { ...EMPTY_SECTION_MAP(), ...(prevStats.sectionCounts || {}) };
      const nextSectionScoreSums = {
        ...EMPTY_SECTION_MAP(),
        ...(prevStats.sectionScoreSums || {}),
      };

      (['A', 'B', 'C', 'D', 'E', 'F'] as SectionId[]).forEach((secId) => {
        if (attemptSectionTotals[secId] > 0) {
          const secPct = Math.round(
            (attemptSectionCorrect[secId] / attemptSectionTotals[secId]) * 100
          );
          nextSectionCounts[secId] = (nextSectionCounts[secId] || 0) + 1;
          nextSectionScoreSums[secId] = (nextSectionScoreSums[secId] || 0) + secPct;
        }
      });

      const prevRecent = Array.isArray(prevStats.recentActivity) ? prevStats.recentActivity : [];
      const nextRecent = [newActivityItem, ...prevRecent].slice(0, 15);

      const nextStats = {
        totalSubmissions: (prevStats.totalSubmissions || 0) + 1,
        uniqueStudentsCount:
          (prevStats.uniqueStudentsCount || 0) + (alreadyRecorded ? 0 : 1),
        fullExamSubmissions:
          (prevStats.fullExamSubmissions || 0) + (completed.config.mode === 'full' ? 1 : 0),
        passedSubmissions: (prevStats.passedSubmissions || 0) + (entry.passed ? 1 : 0),
        totalScoreSum: (prevStats.totalScoreSum || 0) + entry.scorePercent,
        sectionCounts: nextSectionCounts,
        sectionScoreSums: nextSectionScoreSums,
        recentActivity: nextRecent,
        updatedAt: serverTimestamp(),
      };

      tx.set(statsRef, nextStats);
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, transactionPath);
  }
}

export function subscribeGlobalStats(
  onUpdate: (stats: GlobalDashboardStats) => void,
  onError?: (err: Error) => void
): () => void {
  const path = 'stats/global';
  const statsRef = doc(db, 'stats', 'global');
  return onSnapshot(
    statsRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onUpdate(DEFAULT_GLOBAL_STATS);
        return;
      }
      const data = snapshot.data();
      onUpdate({
        totalSubmissions: Number(data.totalSubmissions) || 0,
        uniqueStudentsCount: Number(data.uniqueStudentsCount) || 0,
        fullExamSubmissions: Number(data.fullExamSubmissions) || 0,
        passedSubmissions: Number(data.passedSubmissions) || 0,
        totalScoreSum: Number(data.totalScoreSum) || 0,
        sectionCounts: { ...EMPTY_SECTION_MAP(), ...(data.sectionCounts || {}) },
        sectionScoreSums: { ...EMPTY_SECTION_MAP(), ...(data.sectionScoreSums || {}) },
        recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity : [],
        updatedAt: undefined,
      } as GlobalDashboardStats);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}
