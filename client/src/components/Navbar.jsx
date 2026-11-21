import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand-logo">
          Alzikrayat
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="greeting-text">Hi {user.firstName}</span>
              <button type="button" onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Please Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
