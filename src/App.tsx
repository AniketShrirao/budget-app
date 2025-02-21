import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Transactions from "./pages/Transactions";
import Summary from "./pages/Summary";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.scss";

function DebugRouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log("Current Path:", location.pathname);
  }, [location]);

  return null; // This component just logs route changes
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    checkUser();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>; // Prevents flickering

  return (
    <>
      <Header />
      <DebugRouteLogger />
      <Routes>
        {/* ✅ Redirect only from "/" if authenticated */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/transactions" replace /> : <LandingPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
