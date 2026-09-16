export interface JournalEntry {
  /** ISO date key, e.g. "2026-09-16" */
  date: string;
  texts: string[];
  words: string[];
  rating: number | null;
  updatedAt: string;
}

export interface CheckinEntry {
  date: string;
  emoji: string;
}

const ENTRIES_KEY = "mtz.journal.entries.v1";
const CHECKINS_KEY = "mtz.journal.checkins.v1";

function read<T>(key: string): Record<string, T> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, T>) : {};
  } catch {
    return {};
  }
}

function write<T>(key: string, value: Record<string, T>) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getEntries(): Record<string, JournalEntry> {
  return read<JournalEntry>(ENTRIES_KEY);
}

export function getEntry(date: string): JournalEntry | undefined {
  return getEntries()[date];
}

export function saveEntry(entry: JournalEntry) {
  const all = getEntries();
  all[entry.date] = entry;
  write(ENTRIES_KEY, all);
}

export function getCheckins(): Record<string, CheckinEntry> {
  return read<CheckinEntry>(CHECKINS_KEY);
}

export function saveCheckin(date: string, emoji: string) {
  const all = getCheckins();
  all[date] = { date, emoji };
  write(CHECKINS_KEY, all);
}

/** Consecutive-day streak ending today, counting any day with a journal entry or quick check-in. */
export function computeStreak(): number {
  const entries = getEntries();
  const checkins = getCheckins();
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = todayKey(cursor);
    if (entries[key] || checkins[key]) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
