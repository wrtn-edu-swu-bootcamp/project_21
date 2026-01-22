import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import History from './pages/History'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'
import Navigation from './components/Navigation'
import { useDailyNotification } from './hooks/useDailyNotification'
import './App.css'

function App() {
  // 알림 시스템 활성화
  useDailyNotification()

  return (
    <Router>
      <div className="app">
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  )
}

export default App
