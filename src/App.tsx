import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
import ModuleExercisePage from "./pages/ModuleExercisePage";
import ModuleOverviewPage from "./pages/ModuleOverviewPage";
import ModulePage from "./pages/ModulePage";
import ModulesPage from "./pages/ModulesPage";
import NounExercisePage from "./pages/NounExercisePage";
import NounPage from "./pages/NounPage";
import NounsPage from "./pages/NounsPage";
import StatisticsPage from "./pages/StatisticsPage";
import VerbPage from "./pages/VerbPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-5 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verbs/:verbId" element={<VerbPage />} />
          <Route path="/verbs/:verbId/exercises" element={<ExercisePage />} />
          <Route path="/nouns" element={<NounsPage />} />
          <Route path="/nouns/:nounId" element={<NounPage />} />
          <Route path="/nouns/:nounId/exercises" element={<NounExercisePage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/:moduleId" element={<ModuleOverviewPage />} />
          <Route path="/modules/:moduleId/:lessonId" element={<ModulePage />} />
          <Route path="/modules/:moduleId/:lessonId/exercises" element={<ModuleExercisePage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
