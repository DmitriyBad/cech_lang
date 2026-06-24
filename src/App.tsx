import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
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
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
