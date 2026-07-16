import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./pages/Dashboard/DashboardOverview";
import CompetitorsPage from "./pages/Competitors/CompetitorsPage";
import { Insights, Reports, CEOBriefing } from "./pages/Dashboard/DummyPages";
import ProtectedRoute from "./routes/ProtectedRoute";
import CompetitorDetails from "./pages/CompetitorDetails/CompetitorDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout  />}>
            <Route index element={<DashboardOverview />} />
            <Route path="overview" element={<Navigate to="/dashboard" replace />} />
            <Route path="competitors" element={<CompetitorsPage />} />
            <Route path="competitors/:id" element={<CompetitorDetails />} />
            <Route path="insights" element={<Insights />} />
            <Route path="reports" element={<Reports />} />
            <Route path="ceo-briefing" element={<CEOBriefing />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
