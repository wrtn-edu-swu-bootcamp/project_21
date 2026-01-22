import { useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { format, subDays } from 'date-fns'
import { ko } from 'date-fns/locale'
import './Statistics.css'

function Statistics() {
  const [answers] = useLocalStorage('reframe_answers', [])

  const stats = useMemo(() => {
    if (answers.length === 0) {
      return {
        total: 0,
        streak: 0,
        avgMood: 0,
        topTags: [],
        categoryDistribution: {},
        recentMoodTrend: []
      }
    }

    // 총 답변 수
    const total = answers.length

    // 연속 일수 계산
    const calculateStreak = () => {
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

    // 평균 감정 점수
    const avgMood = (answers.reduce((sum, a) => sum + (a.mood || 3), 0) / answers.length).toFixed(1)

    // 인기 태그
    const tagCounts = {}
    answers.forEach(answer => {
      answer.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // 카테고리별 분포
    const categoryDistribution = {}
    answers.forEach(answer => {
      const prefix = answer.questionId.split('_')[0]
      categoryDistribution[prefix] = (categoryDistribution[prefix] || 0) + 1
    })

    // 최근 감정 추이 (최근 14일)
    const recentMoodTrend = []
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i)
      date.setHours(0, 0, 0, 0)
      
      const dayAnswers = answers.filter(a => {
        const answerDate = new Date(a.timestamp)
        answerDate.setHours(0, 0, 0, 0)
        return answerDate.getTime() === date.getTime()
      })
      
      if (dayAnswers.length > 0) {
        const avgDayMood = dayAnswers.reduce((sum, a) => sum + (a.mood || 3), 0) / dayAnswers.length
        recentMoodTrend.push({
          date: format(date, 'MM/dd', { locale: ko }),
          mood: avgDayMood
        })
      }
    }

    return {
      total,
      streak: calculateStreak(),
      avgMood,
      topTags,
      categoryDistribution,
      recentMoodTrend
    }
  }, [answers])

  const moodEmoji = (score) => {
    if (score >= 4.5) return '😊'
    if (score >= 3.5) return '🙂'
    if (score >= 2.5) return '😐'
    if (score >= 1.5) return '😟'
    return '😢'
  }

  return (
    <div className="statistics-page">
      <header className="statistics-header">
        <h1>나의 변화</h1>
        <p>생각의 흐름을 한눈에</p>
      </header>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-large">🔥</div>
            <div className="stat-value">{stats.streak}일</div>
            <div className="stat-label">연속 답변</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-large">📝</div>
            <div className="stat-value">{stats.total}개</div>
            <div className="stat-label">총 답변</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-large">{moodEmoji(stats.avgMood)}</div>
            <div className="stat-value">{stats.avgMood}점</div>
            <div className="stat-label">평균 감정</div>
          </div>
        </div>

        {stats.recentMoodTrend.length > 0 && (
          <div className="card mt-3">
            <h2 className="section-title">최근 감정 변화</h2>
            <div className="mood-chart">
              {stats.recentMoodTrend.map((item, index) => (
                <div key={index} className="mood-bar-container">
                  <div 
                    className="mood-bar" 
                    style={{ 
                      height: `${item.mood * 20}%`,
                      backgroundColor: `var(--mood-${
                        item.mood >= 4.5 ? 'very-good' :
                        item.mood >= 3.5 ? 'good' :
                        item.mood >= 2.5 ? 'neutral' :
                        item.mood >= 1.5 ? 'bad' : 'very-bad'
                      })`
                    }}
                  />
                  <div className="mood-label">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.topTags.length > 0 && (
          <div className="card mt-3">
            <h2 className="section-title">자주 생각한 주제</h2>
            <div className="tags-cloud">
              {stats.topTags.map(([tag, count]) => (
                <div key={tag} className="tag-item">
                  <span className="tag-name">#{tag}</span>
                  <span className="tag-count">{count}회</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(stats.categoryDistribution).length > 0 && (
          <div className="card mt-3">
            <h2 className="section-title">카테고리별 답변</h2>
            <div className="category-list">
              {Object.entries(stats.categoryDistribution).map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-name">
                    {category === 'structure' ? '경쟁 구조 인식' :
                     category === 'value' ? '자기 가치 재발견' :
                     category === 'relation' ? '관계 재인식' :
                     category === 'system' ? '시스템 성찰' : category}
                  </span>
                  <div className="category-bar-bg">
                    <div 
                      className="category-bar" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="category-count">{count}개</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Statistics
