import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../slices/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);


  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="modern-navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Brand Section */}
          <Link className="navbar-brand-modern" to="/">
            <div className="brand-icon">
              <i className="fas fa-code"></i>
            </div>
            <div className="brand-text">
              <span className="brand-title">CodeHert</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="navbar-nav-modern">
            <Link className={`nav-link-modern ${isActive('/')}`} to="/">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
            <Link className={`nav-link-modern ${isActive('/problems')}`} to="/problems">
              <i className="fas fa-tasks"></i>
              <span>Problems</span>
            </Link>
            {auth.isAuthenticated && auth.user && auth.user.role === 'admin' && (
              <Link className={`nav-link-modern ${isActive('/admin/problems')}`} to="/admin/problems">
                <i className="fas fa-cog"></i>
                <span>Admin</span>
              </Link>
            )}
            <Link className={`nav-link-modern ${isActive('/about')}`} to="/about">
              <i className="fas fa-info-circle"></i>
              <span>About</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="navbar-user-section">
            {auth.isAuthenticated && auth.user ? (
              <div className="user-dropdown-modern">
                <button className="user-button-modern">
                  <div className="user-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="user-info">
                    <span className="username">{auth.user.username}</span>
                  </div>
                  <i className="fas fa-chevron-down dropdown-arrow"></i>
                </button>
                <div className="dropdown-menu-modern">
                  <Link className="dropdown-item-modern" to={`/profile/${auth.user.username}`}>
                    <i className="fas fa-user-circle"></i>
                    <span>Profile</span>
                  </Link>
                  <Link className="dropdown-item-modern" to={`/submissions/user/${auth.user.username}`}>
                    <i className="fas fa-history"></i>
                    <span>Submissions</span>
                  </Link>
                  <div className="dropdown-divider-modern"></div>
                  <button className="dropdown-item-modern logout-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons-modern">
                <Link to="/login" className="btn-login-modern">
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-register-modern">
                  <i className="fas fa-user-plus"></i>
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>


        </div>
      </div>
    </nav>
  );
};

export default Navbar; 