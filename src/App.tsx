import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import VerbsPage from "./pages/VerbsPage";
import ModuleExercisePage from "./pages/ModuleExercisePage";
import ModuleOverviewPage from "./pages/ModuleOverviewPage";
import ModulePage from "./pages/ModulePage";
import ModulesPage from "./pages/ModulesPage";
import NounExercisePage from "./pages/NounExercisePage";
import NounPage from "./pages/NounPage";
import NounRulesPage from "./pages/NounRulesPage";
import NounsPage from "./pages/NounsPage";
import PracticePage from "./pages/PracticePage";
import PhrasesPage from "./pages/PhrasesPage";
import PronunciationPage from "./pages/PronunciationPage";
import StatisticsPage from "./pages/StatisticsPage";
import VerbPage from "./pages/VerbPage";
import { saveLastVisit } from "./utils/lastVisit";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    saveLastVisit(pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-5 pb-24 sm:px-6 md:pb-5 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/verbs" element={<VerbsPage />} />
          <Route path="/verbs/:verbId" element={<VerbPage />} />
          <Route path="/verbs/:verbId/exercises" element={<ExercisePage />} />
          <Route path="/nouns" element={<NounsPage />} />
          <Route path="/nouns/rules" element={<NounRulesPage />} />
          <Route path="/nouns/rules/:patternId" element={<NounRulesPage />} />
          <Route path="/nouns/:nounId" element={<NounPage />} />
          <Route path="/nouns/:nounId/exercises" element={<NounExercisePage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:moduleId" element={<ModuleOverviewPage />} />
          <Route path="/modules/:moduleId/:lessonId" element={<ModulePage />} />
          <Route path="/modules/:moduleId/:lessonId/exercises" element={<ModuleExercisePage />} />
          <Route path="/start/pronunciation" element={<PronunciationPage />} />
          <Route path="/start/phrases" element={<PhrasesPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
