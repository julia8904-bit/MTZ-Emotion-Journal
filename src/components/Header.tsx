import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  streak: number;
}

export default function Header({ streak }: HeaderProps) {
  const navigate = useNavigate();

  const goInsight = () => {
    navigate("/");
    window.setTimeout(() => {
      const el = document.getElementById("insight");
      if (el) {
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: "smooth" });
      }
    }, 60);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </span>
          <span className="brand-name">Momentz</span>
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            홈
          </NavLink>
          <NavLink to="/journal" className={({ isActive }) => (isActive ? "active" : "")}>
            감정 기록
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active" : "")}>
            캘린더
          </NavLink>
          <button type="button" className="nav-link-btn" onClick={goInsight}>
            인사이트
          </button>
        </nav>
        <div className="site-header-actions">
          {streak > 0 && <span className="streak-label">{streak}일 연속 기록 중</span>}
          <button type="button" className="btn btn-primary btn-compact" onClick={() => navigate("/journal")}>
            바로 기록하기
          </button>
        </div>
      </div>
    </header>
  );
}
