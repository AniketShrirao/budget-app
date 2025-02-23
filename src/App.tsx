import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Header from './components/Header';
import Transactions from './pages/Transactions';
import Summary from './pages/Summary';
import { useEffect } from 'react';
import './App.scss';
import { useAuth, AuthProvider } from './context/AuthContext';

function DebugRouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log('Current Path:', location.pathname);
  }, [location]);

  return null; // This component just logs route changes
}

function AppContent() {
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading;

  if (loading) return <div>Loading...</div>; // Prevents flickering

  return (
    <>
      <Header />
      <DebugRouteLogger />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/transactions" replace />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}