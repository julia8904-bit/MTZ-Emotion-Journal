import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHECKINS, STEPS } from "../lib/steps";
import { computeInsights } from "../lib/insights";
import { getCheckins, getEntries, getEntry, saveCheckin, todayKey } from "../lib/storage";
import "./Home.css";

interface HomeProps {
  onDataChange: () => void;
}

export default function Home({ onDataChange }: HomeProps) {
  const navigate = useNavigate();
  const today = todayKey();
  const [checkin, setCheckin] = useState<string | null>(() => getCheckins()[today]?.emoji ?? null);
  const [openStep, setOpenStep] = useState<number | null>(null);

  const todayEntry = getEntry(today);
  const insights = computeInsights(getEntries());

  const pickCheckin = (emoji: string) => {
    setCheckin(emoji);
    saveCheckin(today, emoji);
    onDataChange();
  };

  const trendMax = 5;
  const trendMin = 1;
  const chartW = 560;
  const chartH = 200;
  const padX = 30;
  const padTop = 20;
  const padBottom = 40;
  const points = insights.trend.map((p, i, arr) => {
    const x = arr.length > 1 ? padX + (i / (arr.length - 1)) * (chartW - padX * 2) : chartW / 2;
    const t = (p.rating - trendMin) / (trendMax - trendMin);
    const y = chartH - padBottom - t * (chartH - padTop - padBottom);
    return { ...p, x, y };
  });
  const polyline = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <main>
      <div className="page">
        <section className="hero">
          <div>
            <span className="pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              MTZ 감정 기록
            </span>
            <h1 className="hero-title">
              오늘 마음은
              <br />좀 어떠신가요?
            </h1>
            <p className="hero-desc">기록으로 발견하는 나만의 감정 패턴과 성장. 5단계 정화 프로세스로 마음을 정리해 보세요.</p>

            <div className="checkin-box">
              <p className="checkin-label">⚡ 1초 퀵 체크인 (오늘의 한 줄 느낌)</p>
              <div className="checkin-row">
                {CHECKINS.map((c) => {
                  const on = checkin === c.emoji;
                  return (
                    <button
                      key={c.emoji}
                      type="button"
                      title={c.label}
                      className={`checkin-btn${on ? " on" : ""}`}
                      onClick={() => pickCheckin(c.emoji)}
                    >
                      {c.emoji}
                    </button>
                  );
                })}
              </div>
              {checkin && <p className="checkin-done">오늘의 퀵 체크인 완료! 여유가 생기시면 5단계 정화 일기도 남겨보세요.</p>}
            </div>

            <div className="hero-actions">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate("/journal")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
                바로 감정 기록하기
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate("/calendar")}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="4" />
                  <path d="M8 2v4M16 2v4M3 10h18" />
                </svg>
                캘린더 보기
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
            <div className="score-card">
              <p className="score-label">오늘의 감정 점수</p>
              <p className="score-value">{todayEntry?.rating ? todayEntry.rating.toFixed(1) : "–"}</p>
              <div className="score-bar">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={i < (todayEntry?.rating ?? 0) ? "filled" : ""} />
                ))}
              </div>
              <p className="score-meta">
                {insights.journalCount > 0
                  ? `기록 ${insights.journalCount}일 누적${insights.topWord ? ` · ${insights.topWord}` : ""}`
                  : "첫 기록을 남겨보세요"}
              </p>
            </div>
          </div>
        </section>

        <section className="nav-cards">
          <button type="button" className="nav-card" onClick={() => navigate("/journal")}>
            <span className="nav-card-icon accent">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
              </svg>
            </span>
            <h3>감정 기록하기</h3>
            <p>5단계로 감정을 정화하고 기록하세요</p>
          </button>
          <button type="button" className="nav-card" onClick={() => navigate("/calendar")}>
            <span className="nav-card-icon accent-2">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="4" />
                <path d="M8 2v4M16 2v4M3 10h18" />
              </svg>
            </span>
            <h3>기록 돌아보기</h3>
            <p>지난 감정들을 캘린더로 확인하세요</p>
          </button>
        </section>

        <section id="insight" className="insight-section">
          <div className="insight-header">
            <h2>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-600)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 7l-8.5 8.5-5-5L2 17" />
                <path d="M16 7h6v6" />
              </svg>
              나의 감정 인사이트
            </h2>
            <span className="badge">{insights.isZeroState ? "데이터 수집 중" : "누적 기록 기준"}</span>
          </div>

          {insights.isZeroState && (
            <div className="zero-banner">
              <div className="zero-banner-top">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-300)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
                </svg>
                <h3>나만의 감정 패턴 분석 준비 중</h3>
                <span className="zero-banner-count">{insights.journalCount} / 3 완료</span>
              </div>
              <p>
                기록이 <strong>3개 이상</strong> 쌓이면 흐름 차트와 감정 어휘 분석이 자동으로 생성돼요! 🌿
              </p>
              <div className="zero-progress">
                <div style={{ width: `${insights.progressPct}%` }} />
              </div>
              <p className="zero-remaining">
                첫 인사이트까지 앞으로 <strong>{insights.remaining}번</strong> 남았어요
              </p>
            </div>
          )}

          <div className="insight-charts-wrap">
            {insights.isZeroState && (
              <div className="insight-lock">
                <span className="insight-lock-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="4" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <h4>분석 리포트 잠금 해제 필요</h4>
                <p>감정 정화 기록을 작성하고 나에게 영향을 주는 요소들의 통계를 확인해보세요.</p>
                <button type="button" className="btn btn-primary" onClick={() => navigate("/journal")}>
                  지금 첫 기록 남기기
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}

            <div className={`insight-charts${insights.isZeroState ? " locked" : ""}`}>
              {insights.fullStepsAvg != null && insights.partialStepsAvg != null && (
                <div className="effect-banner">
                  <div>
                    <div className="effect-kicker">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
                      </svg>
                      행동 효과 분석
                    </div>
                    <p className="effect-headline">
                      5단계를 모두 작성한 날은 평소보다 감정 점수가{" "}
                      <strong>
                        {insights.partialStepsAvg > 0
                          ? `${Math.round(((insights.fullStepsAvg - insights.partialStepsAvg) / insights.partialStepsAvg) * 100)}%`
                          : "-"}
                      </strong>{" "}
                      {insights.fullStepsAvg >= insights.partialStepsAvg ? "높아요!" : "달라요."}
                    </p>
                    <p className="effect-sub">정화 단계를 끝까지 쓸수록 감정을 다루는 힘이 쌓여요.</p>
                  </div>
                  <div className="effect-compare">
                    <div>
                      <p className="effect-compare-label">일부만 작성</p>
                      <p className="effect-compare-value muted">{insights.partialStepsAvg.toFixed(1)}</p>
                    </div>
                    <span>➔</span>
                    <div>
                      <p className="effect-compare-label accent">5단계 완료</p>
                      <p className="effect-compare-value">{insights.fullStepsAvg.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="insight-grid">
                <div className="card insight-card">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-600)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    감정 흐름 추이
                  </h3>
                  <p className="insight-card-sub">
                    평균 감정 점수: <strong>{insights.avgRating ?? "–"}</strong>
                  </p>
                  <svg viewBox="0 0 560 200" width="100%" height="210" role="img" aria-label="감정 점수 추이">
                    <g stroke="var(--color-neutral-300)" strokeWidth={1}>
                      <line x1={24} y1={20} x2={540} y2={20} />
                      <line x1={24} y1={55} x2={540} y2={55} />
                      <line x1={24} y1={90} x2={540} y2={90} />
                      <line x1={24} y1={125} x2={540} y2={125} />
                      <line x1={24} y1={160} x2={540} y2={160} />
                    </g>
                    <g fill="var(--color-neutral-600)" fontSize={12} textAnchor="end">
                      <text x={18} y={24}>5</text>
                      <text x={18} y={94}>3</text>
                      <text x={18} y={164}>1</text>
                    </g>
                    {points.length > 0 && (
                      <>
                        <polyline points={polyline} fill="none" stroke="var(--color-accent-500)" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                        <g fill="var(--color-accent-600)">
                          {points.map((p) => (
                            <circle key={p.date} cx={p.x} cy={p.y} r={5.5} />
                          ))}
                        </g>
                        <g fill="var(--color-neutral-700)" fontSize={12.5} textAnchor="middle">
                          {points.map((p) => (
                            <text key={p.date} x={p.x} y={188}>{p.label}</text>
                          ))}
                        </g>
                      </>
                    )}
                  </svg>
                </div>

                <div className="card insight-card">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-600)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                    </svg>
                    자주 느낀 감정 어휘
                  </h3>
                  <p className="insight-card-sub">
                    가장 많이 고른 어휘: <strong>{insights.topWord ?? "–"}</strong>
                  </p>
                  <div className="word-bars">
                    {insights.words.length === 0 && <p className="empty-hint">아직 선택한 감정 어휘가 없어요.</p>}
                    {insights.words.map((w) => (
                      <div className="word-bar-row" key={w.word}>
                        <span className="word-bar-label">{w.word}</span>
                        <span className="word-bar-track">
                          <span className="word-bar-fill" style={{ width: `${w.pct}%` }} />
                        </span>
                        <span className="word-bar-pct">{w.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <div>
            <h2 className="guide-title">
              5단계
              <br />
              감정 정화 가이드
            </h2>
            <p className="guide-desc">한 단계씩 눌러서 무엇을 쓰면 되는지 확인해 보세요.</p>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/journal")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
              1단계부터 시작하기
            </button>
          </div>
          <div className="card guide-list">
            {STEPS.map((step, i) => {
              const open = openStep === i;
              return (
                <div className="guide-item" key={step.num}>
                  <button type="button" className="guide-item-head" onClick={() => setOpenStep(open ? null : i)}>
                    <span className={`guide-item-badge${open ? " open" : ""}`}>{step.num}</span>
                    <span className="guide-item-title">{step.title}</span>
                    <span className={`guide-item-chevron${open ? " open" : ""}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  {open && (
                    <div className="guide-item-body">
                      <p>{step.desc}</p>
                      <button type="button" className="guide-item-start" onClick={() => navigate("/journal", { state: { step: i } })}>
                        [{step.num}단계부터 바로 작성해보기 →]
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="guide-cta">
              <button type="button" className="btn btn-dark guide-cta-btn" onClick={() => navigate("/journal")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-400)" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                </svg>
                가이드를 이해하셨나요? 바로 1단계 사건 기록부터 시작해보세요
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
