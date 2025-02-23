import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Close } from '@mui/icons-material';
import './Header.scss';
import AuthButton from './AuthButton';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="icon-ham">
      <div className="logo">Budget Tracker</div>

      {/* Hamburger Icon for Mobile */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <Close /> : <Menu />}
      </div>
      </div>

      {/* Navbar Links */}
      <nav className={`navbar ${menuOpen ? 'open' : ''}`}>
      {menuOpen && <AuthButton isMobile={true} />}
        <NavLink
          to="/transactions"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={toggleMenu}
        >
          Transactions
        </NavLink>
        <NavLink to="/summary" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
          Summary
        </NavLink>
        <NavLink to="/income" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
          Income
        </NavLink>
        <NavLink to="/lending" className={({ isActive }) => (isActive ? 'active' : '')} onClick={toggleMenu}>
          Lending
        </NavLink>
      </nav>

      <div className="auth-buttons">
        <AuthButton isMobile={false} />
      </div>
    </header>
  );
};

export default Header;
