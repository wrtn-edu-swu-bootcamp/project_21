import { useState, useEffect } from 'react'
import DailyQuestion from '../components/DailyQuestion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './Home.css'

function Home() {
  const [answers] = useLocalStorage('reframe_answers', [])
  const totalAnswers = answers.length
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // 연속 답변 일수 계산
    const calculateStreak = () => {
      if (answers.length === 0) return 0
      
      const sortedAnswers = [...answers].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
      
      let currentStreak = 1
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const lastAnswerDate = new Date(sortedAnswers[0].timestamp)
      lastAnswerDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today - lastAnswerDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff > 1) return 0
      
      for (let i = 1; i < sortedAnswers.length; i++) {
        const prevDate = new Date(sortedAnswers[i - 1].timestamp)
        prevDate.setHours(0, 0, 0, 0)
        
        const currDate = new Date(sortedAnswers[i].timestamp)
        currDate.setHours(0, 0, 0, 0)
        
        const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24))
        
        if (diff === 1) {
          currentStreak++
        } else {
          break
        }
      }
      
      return currentStreak
    }
    
    setStreak(calculateStreak())
  }, [answers])

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="app-title">다시, 생각 💭</h1>
        <p className="app-subtitle">하루 한 번, 나를 돌아보는 시간</p>
      </header>

      <main className="home-main container">
        <DailyQuestion />
        
        <div className="stats-overview">
          {streak > 0 && (
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <span className="stat-label">{streak}일 연속</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-icon">📝</span>
            <span className="stat-label">총 {totalAnswers}개 답변</span>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
