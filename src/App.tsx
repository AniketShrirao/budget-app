import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import Transactions from "./pages/Transactions";
import Summary from "./pages/Summary";
import "./App.scss";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </Router>
  );
}

export default App;
