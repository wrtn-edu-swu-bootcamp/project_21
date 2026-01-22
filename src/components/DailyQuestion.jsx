import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getTodayQuestion } from '../utils/questionData'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import AnswerForm from './AnswerForm'
import './DailyQuestion.css'

function DailyQuestion() {
  const navigate = useNavigate()
  const [answers] = useLocalStorage('reframe_answers', [])
  const [todayQuestion, setTodayQuestion] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showAnswerForm, setShowAnswerForm] = useState(false)
  const [todayAnswer, setTodayAnswer] = useState(null)

  useEffect(() => {
    // 오늘의 질문 가져오기
    const question = getTodayQuestion()
    setTodayQuestion(question)

    // 오늘 이미 답변했는지 확인
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const answer = answers.find(a => {
      const answerDate = new Date(a.timestamp)
      answerDate.setHours(0, 0, 0, 0)
      return answerDate.getTime() === today.getTime() && a.questionId === question.id
    })

    if (answer) {
      setHasAnswered(true)
      setTodayAnswer(answer)
    }
  }, [answers])

  const handleAnswerComplete = () => {
    setHasAnswered(true)
    setShowAnswerForm(false)
    
    // 최신 답변 가져오기
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const answer = answers.find(a => {
      const answerDate = new Date(a.timestamp)
      answerDate.setHours(0, 0, 0, 0)
      return answerDate.getTime() === today.getTime() && a.questionId === todayQuestion.id
    })
    
    setTodayAnswer(answer)
  }

  const moodEmoji = (mood) => {
    const emojis = ['😢', '😟', '😐', '🙂', '😊']
    return emojis[mood - 1] || '😐'
  }

  if (!todayQuestion) return null

  if (showAnswerForm) {
    return (
      <AnswerForm 
        question={todayQuestion}
        onComplete={handleAnswerComplete}
        onCancel={() => setShowAnswerForm(false)}
      />
    )
  }

  return (
    <div className="daily-question-card card">
      <div className="question-header">
        <span className="question-label">오늘의 질문</span>
        <span className="question-date">
          {format(new Date(), 'M월 d일 (E)', { locale: ko })}
        </span>
      </div>

      <div className="question-category">
        <span className="category-badge">{todayQuestion.category}</span>
      </div>

      <h2 className="question-text">{todayQuestion.text}</h2>

      {hasAnswered && todayAnswer ? (
        <div className="answer-preview">
          <div className="answered-indicator">
            <span className="check-icon">✅</span>
            <span>답변 완료</span>
          </div>
          
          <div className="answer-content">
            <div className="answer-mood">
              <span>{moodEmoji(todayAnswer.mood)}</span>
              <span className="mood-label">오늘의 기분</span>
            </div>
            <p className="answer-text">{todayAnswer.answer}</p>
            {todayAnswer.tags && todayAnswer.tags.length > 0 && (
              <div className="answer-tags">
                {todayAnswer.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
          
          <button 
            className="view-history-button"
            onClick={() => navigate('/history')}
          >
            전체 기록 보기
          </button>
        </div>
      ) : (
        <div className="answer-prompt">
          <p className="prompt-text">오늘의 생각을 기록해보세요</p>
          <button 
            className="button-primary answer-button"
            onClick={() => setShowAnswerForm(true)}
          >
            답변 작성하기
          </button>
        </div>
      )}
    </div>
  )
}

export default DailyQuestion
