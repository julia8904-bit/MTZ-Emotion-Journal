import type { JournalEntry } from "./storage";

export interface TrendPoint {
  date: string;
  label: string;
  rating: number;
}

export interface WordStat {
  word: string;
  count: number;
  pct: number;
}

export interface Insights {
  journalCount: number;
  isZeroState: boolean;
  remaining: number;
  progressPct: number;
  trend: TrendPoint[];
  words: WordStat[];
  avgRating: number | null;
  fullStepsAvg: number | null;
  partialStepsAvg: number | null;
  topWord: string | null;
}

const ZERO_STATE_THRESHOLD = 3;

function formatShortDate(dateKey: string): string {
  const [, m, d] = dateKey.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function computeInsights(entriesByDate: Record<string, JournalEntry>): Insights {
  const entries = Object.values(entriesByDate)
    .filter((e) => e.rating != null)
    .sort((a, b) => a.date.localeCompare(b.date));

  const journalCount = entries.length;
  const isZeroState = journalCount < ZERO_STATE_THRESHOLD;

  const trend: TrendPoint[] = entries.slice(-7).map((e) => ({
    date: e.date,
    label: formatShortDate(e.date),
    rating: e.rating as number,
  }));

  const wordCounts = new Map<string, number>();
  let totalWordPicks = 0;
  for (const e of entries) {
    for (const w of e.words) {
      wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1);
      totalWordPicks += 1;
    }
  }
  const words: WordStat[] = Array.from(wordCounts.entries())
    .map(([word, count]) => ({
      word,
      count,
      pct: totalWordPicks ? Math.round((count / totalWordPicks) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const avgRating = journalCount
    ? Math.round((entries.reduce((sum, e) => sum + (e.rating as number), 0) / journalCount) * 10) / 10
    : null;

  const fullStepEntries = entries.filter((e) => e.texts.every((t) => t.trim().length > 0));
  const partialStepEntries = entries.filter((e) => !e.texts.every((t) => t.trim().length > 0));

  const avgOf = (list: JournalEntry[]) =>
    list.length
      ? Math.round((list.reduce((sum, e) => sum + (e.rating as number), 0) / list.length) * 10) / 10
      : null;

  return {
    journalCount,
    isZeroState,
    remaining: Math.max(0, ZERO_STATE_THRESHOLD - journalCount),
    progressPct: Math.min(100, (journalCount / ZERO_STATE_THRESHOLD) * 100),
    trend,
    words,
    avgRating,
    fullStepsAvg: avgOf(fullStepEntries),
    partialStepsAvg: avgOf(partialStepEntries),
    topWord: words[0]?.word ?? null,
  };
}
