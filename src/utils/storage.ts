import { AttemptHistoryEntry, ExamAttemptState } from '../types/exam';

const ACTIVE_ATTEMPT_KEY = 'tnmcle_rn005_active_attempt_v1';
const HISTORY_KEY = 'tnmcle_rn005_attempt_history_v1';

export function loadActiveAttempt(): ExamAttemptState | null {
  try {
    const raw = localStorage.getItem(ACTIVE_ATTEMPT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamAttemptState;
    if (!parsed || !parsed.sessionId || !parsed.config) return null;
    return {
      ...parsed,
      flagged: Array.isArray(parsed.flagged) ? parsed.flagged : [],
      hintsViewed: Array.isArray(parsed.hintsViewed) ? parsed.hintsViewed : [],
    };
  } catch {
    return null;
  }
}

export function saveActiveAttempt(attempt: ExamAttemptState | null): void {
  try {
    if (!attempt) {
      localStorage.removeItem(ACTIVE_ATTEMPT_KEY);
    } else {
      localStorage.setItem(ACTIVE_ATTEMPT_KEY, JSON.stringify(attempt));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function loadAttemptHistory(): AttemptHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AttemptHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttemptToHistory(entry: AttemptHistoryEntry): AttemptHistoryEntry[] {
  const existing = loadAttemptHistory();
  const filtered = existing.filter((item) => item.sessionId !== entry.sessionId);
  const updated = [entry, ...filtered].slice(0, 25);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

export function clearAttemptHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore
  }
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
