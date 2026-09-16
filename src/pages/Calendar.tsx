import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEntries } from "../lib/storage";
import type { JournalEntry } from "../lib/storage";
import "./Calendar.css";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateKey(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function dotColor(r: number): string {
  if (r >= 4) return "var(--color-accent-800)";
  if (r >= 3) return "var(--color-accent-500)";
  return "var(--color-accent-300)";
}

function stepsDone(entry: JournalEntry): number {
  return entry.texts.filter((t) => t.trim().length > 0).length;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());

  const entries = getEntries();

  const { year, month } = cursor;
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const list: { day: number | null }[] = [];
    for (let i = 0; i < firstWeekday; i++) list.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) list.push({ day: d });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const monthEntries = useMemo(() => {
    const prefix = `${year}-${pad(month + 1)}-`;
    return Object.values(entries).filter((e) => e.date.startsWith(prefix) && e.rating != null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries, year, month]);

  const summary = useMemo(() => {
    if (monthEntries.length === 0) return null;
    const avg = monthEntries.reduce((s, e) => s + (e.rating as number), 0) / monthEntries.length;
    const wordCounts = new Map<string, number>();
    for (const e of monthEntries) for (const w of e.words) wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1);
    let topWord: string | null = null;
    let max = 0;
    for (const [w, c] of wordCounts) {
      if (c > max) {
        max = c;
        topWord = w;
      }
    }
    return { count: monthEntries.length, avg: Math.round(avg * 10) / 10, topWord };
  }, [monthEntries]);

  const selectedEntry = selectedDay ? entries[dateKey(year, month, selectedDay)] : undefined;
  const isTodayVisible = today.getFullYear() === year && today.getMonth() === month;

  const goPrevMonth = () => {
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
    setSelectedDay(0);
  };
  const goNextMonth = () => {
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
    setSelectedDay(0);
  };

  return (
    <main>
      <div className="page">
        <p className="eyebrow">기록 돌아보기</p>
        <div className="calendar-title-row">
          <h1 className="calendar-title">
            {year}년 {month + 1}월
          </h1>
          <div className="calendar-nav-btns">
            <button type="button" className="btn btn-secondary btn-icon" onClick={goPrevMonth} aria-label="이전 달">
              ‹
            </button>
            <button type="button" className="btn btn-secondary btn-icon" onClick={goNextMonth} aria-label="다음 달">
              ›
            </button>
          </div>
        </div>

        <div className="calendar-layout">
          <div className="card calendar-grid-card">
            <div className="weekday-row">
              {WEEKDAYS.map((w, i) => (
                <span key={w} className={`weekday${i === 0 ? " sun" : ""}${i === 6 ? " sat" : ""}`}>
                  {w}
                </span>
              ))}
            </div>
            <div className="day-grid">
              {cells.map((c, i) => {
                if (c.day == null) return <span key={`empty-${i}`} className="day-cell empty" />;
                const entry = entries[dateKey(year, month, c.day)];
                const sel = selectedDay === c.day;
                const isFuture = isTodayVisible && c.day > today.getDate();
                return (
                  <button
                    key={c.day}
                    type="button"
                    className={`day-cell${sel ? " selected" : ""}${entry ? " has-entry" : ""}`}
                    style={isFuture ? { opacity: 0.45 } : undefined}
                    onClick={() => setSelectedDay(c.day as number)}
                  >
                    <span className="day-num">{c.day}</span>
                    {entry?.rating != null && (
                      <span className="day-dot" style={{ background: dotColor(entry.rating) }} />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="legend-row">
              <span>
                <span className="legend-dot" style={{ background: "var(--color-accent-800)" }} />4점 이상
              </span>
              <span>
                <span className="legend-dot" style={{ background: "var(--color-accent-500)" }} />3점대
              </span>
              <span>
                <span className="legend-dot" style={{ background: "var(--color-accent-300)" }} />2점 이하
              </span>
            </div>
          </div>

          <aside className="calendar-aside">
            <div className="card day-detail">
              <p className="eyebrow small">
                {selectedDay ? `${year}년 ${month + 1}월 ${selectedDay}일` : "날짜를 선택하세요"}
              </p>
              <h2 className="day-detail-title">{selectedEntry ? "이 날의 기록" : "기록 없음"}</h2>
              {selectedEntry ? (
                <div>
                  <div className="day-detail-rating">
                    <span className="day-detail-rating-value">{selectedEntry.rating?.toFixed(1)}</span>
                    <span className="day-detail-rating-label">감정 점수</span>
                  </div>
                  {selectedEntry.words.length > 0 && (
                    <div className="day-detail-tags">
                      {selectedEntry.words.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="day-detail-note">{selectedEntry.texts[0] || selectedEntry.texts.find((t) => t) || ""}</p>
                  <p className="day-detail-steps">정화 단계 {stepsDone(selectedEntry)}/5 작성</p>
                </div>
              ) : (
                <div>
                  <p className="day-detail-empty">
                    {selectedDay === today.getDate() && isTodayVisible
                      ? "오늘은 아직 기록이 없어요. 지금 남겨두면 다음에 같은 감정이 올 때 도움이 됩니다."
                      : "이 날은 기록이 없어요."}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/journal")}
                    disabled={!(isTodayVisible && selectedDay === today.getDate())}
                  >
                    이 날 기록 쓰기
                  </button>
                </div>
              )}
            </div>
            <div className="month-summary">
              <p className="month-summary-label">이번 달 요약</p>
              <div className="month-summary-list">
                <div className="month-summary-row">
                  <span>기록한 날</span>
                  <span className="value">{summary ? `${summary.count}일` : "–"}</span>
                </div>
                <div className="month-summary-row">
                  <span>평균 감정 점수</span>
                  <span className="value">{summary ? summary.avg : "–"}</span>
                </div>
                <div className="month-summary-row">
                  <span>가장 자주 쓴 어휘</span>
                  <span className="value">{summary?.topWord ?? "–"}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
