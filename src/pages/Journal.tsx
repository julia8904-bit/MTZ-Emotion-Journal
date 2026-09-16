import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { STEPS, WORDS } from "../lib/steps";
import { getEntry, saveEntry, todayKey } from "../lib/storage";
import "./Journal.css";

interface JournalProps {
  onSaved: () => void;
}

const emptyTexts = () => ["", "", "", "", ""];

function todayLabel(): string {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function Journal({ onSaved }: JournalProps) {
  const location = useLocation();
  const today = todayKey();
  const existing = getEntry(today);

  const [step, setStep] = useState<number>(() => {
    const s = (location.state as { step?: number } | null)?.step;
    return typeof s === "number" ? s : 0;
  });
  const [texts, setTexts] = useState<string[]>(existing?.texts ?? emptyTexts());
  const [picked, setPicked] = useState<string[]>(existing?.words ?? []);
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = (location.state as { step?: number } | null)?.step;
    if (typeof s === "number") setStep(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = STEPS[step];

  const toggleWord = (w: string) => {
    setPicked((prev) => (prev.includes(w) ? prev.filter((x) => x !== w) : [...prev, w]));
    setSaved(false);
  };

  const updateText = (v: string) => {
    setTexts((prev) => {
      const next = prev.slice();
      next[step] = v;
      return next;
    });
    setSaved(false);
  };

  const persist = () => {
    saveEntry({ date: today, texts, words: picked, rating, updatedAt: new Date().toISOString() });
    setSaved(true);
    onSaved();
  };

  const nextStep = () => {
    if (step === STEPS.length - 1) {
      persist();
    } else {
      setStep((s) => Math.min(STEPS.length - 1, s + 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  return (
    <main>
      <div className="page">
        <p className="eyebrow">감정 기록 · {todayLabel()}</p>
        <h1 className="journal-title">5단계로 감정 정화하기</h1>

        <div className="stepper">
          {STEPS.map((s, i) => {
            const done = texts[i].trim().length > 0;
            const active = i === step;
            const state = active ? "active" : done ? "done" : "idle";
            return (
              <div className="stepper-item" key={s.num}>
                <button type="button" className="stepper-node-btn" onClick={() => setStep(i)}>
                  <span className={`stepper-node ${state}`}>{s.num}</span>
                  <span className={`stepper-short ${state}`}>{s.short}</span>
                </button>
                {i < STEPS.length - 1 && <span className={`stepper-line ${done ? "done" : ""}`} />}
              </div>
            );
          })}
        </div>

        <div className="journal-layout">
          <div className="card journal-card">
            <span className="step-tag">STEP {current.num} / 5</span>
            <h2 className="journal-step-title">{current.title}</h2>
            <p className="journal-step-desc">{current.desc}</p>

            {step === 1 && (
              <div className="word-picker">
                <p className="word-picker-label">감정 어휘 고르기 (여러 개 가능)</p>
                <div className="word-chip-row">
                  {WORDS.map((w) => {
                    const on = picked.includes(w);
                    return (
                      <button
                        key={w}
                        type="button"
                        className={`word-chip${on ? " on" : ""}`}
                        onClick={() => toggleWord(w)}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <label className="field-label" htmlFor="journal-textarea">
              {current.fieldLabel}
            </label>
            <textarea
              id="journal-textarea"
              className="journal-textarea"
              value={texts[step]}
              onChange={(e) => updateText(e.target.value)}
              placeholder={current.placeholder}
            />

            {step === 0 && (
              <div className="rating-picker">
                <p className="word-picker-label">오늘의 감정 점수</p>
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((v) => {
                    const on = rating === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        className={`rating-btn${on ? " on" : ""}`}
                        onClick={() => {
                          setRating(v);
                          setSaved(false);
                        }}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="journal-actions">
              <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={step === 0}>
                이전
              </button>
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                {step === STEPS.length - 1 ? "기록 저장하기" : "다음 단계"}
              </button>
              {saved && <span className="saved-label">저장되었습니다</span>}
            </div>
          </div>

          <aside className="journal-aside">
            <div className="tip-box">
              <p className="tip-label">이 단계의 팁</p>
              <p className="tip-text">{current.tip}</p>
            </div>
            <div className="card status-box">
              <p className="status-label">작성 현황</p>
              <div className="status-list">
                {STEPS.map((s, i) => {
                  const done = texts[i].trim().length > 0;
                  const active = i === step;
                  const state = active ? "active" : done ? "done" : "idle";
                  return (
                    <div className="status-row" key={s.num}>
                      <span className={`status-num ${state}`}>{s.num}</span>
                      <span className="status-short">{s.short}</span>
                      <span className={`status-state ${state}`}>{done ? "작성 완료" : active ? "작성 중" : "대기"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
