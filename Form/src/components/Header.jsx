import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await JSON.parse(sessionStorage.getItem('userData'));
    if (data && data.isLoggedIn) {
      setUserData(data.userData);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUserData(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <i className="fas fa-bicycle logo-icon"></i>
        <span className="logo-text">Bike Rental</span>
      </div>
      
      {/* Navigation before login */}
      <ul className="navbar-links">
          <>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            </li>
            <li>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link>
            </li>
          </> 
      </ul>
    </nav>
  );
};

export default Header;
