import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Close } from "@mui/icons-material";
import "./Header.scss";
import AuthButton from "./AuthButton";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">Budget Tracker</div>

      {/* Hamburger Icon for Mobile */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <Close /> : <Menu />}
      </div>

      {/* Navbar Links */}
      <nav className={`navbar ${menuOpen ? "open" : ""}`}>
        <NavLink to="/transactions" activeClassName="active" onClick={toggleMenu}>
          Transactions
        </NavLink>
        <NavLink to="/income" activeClassName="active" onClick={toggleMenu}>
          Income
        </NavLink>
        <NavLink to="/lending" activeClassName="active" onClick={toggleMenu}>
          Lending
        </NavLink>
        <NavLink to="/summary" activeClassName="active" onClick={toggleMenu}>
          Summary
        </NavLink>
      </nav>

      <div className="auth-buttons">
        <AuthButton />
      </div>
    </header>
  );
};

export default Header;
