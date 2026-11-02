import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const home = user?.role === 'admin' ? '/admin' : '/student';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to={home} className="brand"><span className="brand-mark">QB</span><span>Quiz Builder</span></NavLink>
        <nav className="nav-links">
          {user?.role === 'admin' ? (
            <>
              <NavLink to="/admin">Dashboard</NavLink>
              <NavLink to="/admin/create">Create Quiz</NavLink>
              <NavLink to="/admin/results">Results</NavLink>
              <NavLink to="/admin/profiles">Profiles</NavLink>
              <NavLink to="/profile">My Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/student">Available Quizzes</NavLink>
              <NavLink to="/student/results">My Results</NavLink>
              <NavLink to="/profile">My Profile</NavLink>
            </>
          )}
        </nav>
        <div className="user-menu">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details"><strong>{user?.name}</strong><span>{user?.role}</span></div>
          <button className="button button-ghost button-small" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="footer">Quiz Builder <span>•</span> Create, attempt and review quizzes</footer>
    </div>
  );
}
