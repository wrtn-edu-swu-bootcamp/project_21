import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

function Navigation() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bottom-navigation">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">홈</span>
      </Link>

      <Link 
        to="/history" 
        className={`nav-item ${isActive('/history') ? 'active' : ''}`}
      >
        <span className="nav-icon">📝</span>
        <span className="nav-label">기록</span>
      </Link>

      <Link 
        to="/statistics" 
        className={`nav-item ${isActive('/statistics') ? 'active' : ''}`}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">통계</span>
      </Link>

      <Link 
        to="/settings" 
        className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
      >
        <span className="nav-icon">⚙️</span>
        <span className="nav-label">설정</span>
      </Link>
    </nav>
  )
}

export default Navigation
