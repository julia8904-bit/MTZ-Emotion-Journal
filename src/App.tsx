import { useCallback, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import CalendarPage from "./pages/Calendar";
import { computeStreak } from "./lib/storage";

function App() {
  const [streak, setStreak] = useState(computeStreak);

  const refreshStreak = useCallback(() => {
    setStreak(computeStreak());
  }, []);

  return (
    <div className="app-shell">
      <Header streak={streak} />
      <Routes>
        <Route path="/" element={<Home onDataChange={refreshStreak} />} />
        <Route path="/journal" element={<Journal onSaved={refreshStreak} />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
