import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useLocalStorage } from '../hooks/useLocalStorage'
import AnswerForm from './AnswerForm'
import ShareModal from './ShareModal'
import './AnswerCard.css'

function AnswerCard({ answer }) {
  const [answers, setAnswers] = useLocalStorage('reframe_answers', [])
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const moodEmoji = (mood) => {
    const emojis = ['😢', '😟', '😐', '🙂', '😊']
    return emojis[mood - 1] || '😐'
  }

  const handleDelete = () => {
    if (window.confirm('이 답변을 삭제하시겠습니까?')) {
      setAnswers(answers.filter(a => a.id !== answer.id))
    }
    setShowMenu(false)
  }

  const handleEditComplete = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <AnswerForm
        question={{
          id: answer.questionId,
          text: answer.question,
          category: answer.questionId.split('_')[0]
        }}
        existingAnswer={answer}
        onComplete={handleEditComplete}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <div className="answer-card">
      <div className="answer-card-header">
        <div className="answer-date">
          <span className="date-icon">📅</span>
          <span>{format(new Date(answer.timestamp), 'yyyy년 M월 d일 (E)', { locale: ko })}</span>
        </div>
        <div className="answer-menu">
          <button 
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={() => { setShowShareModal(true); setShowMenu(false); }}>
                공유
              </button>
              <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>
                수정
              </button>
              <button onClick={handleDelete} className="danger">
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="answer-card-body">
        <h4 className="answer-question">{answer.question}</h4>
        
        <div className="answer-mood-display">
          <span className="mood-emoji-large">{moodEmoji(answer.mood)}</span>
        </div>

        <p className="answer-text-display">{answer.answer}</p>

        {answer.tags && answer.tags.length > 0 && (
          <div className="answer-tags-display">
            {answer.tags.map((tag, index) => (
              <span key={index} className="tag-display">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {showShareModal && (
        <ShareModal 
          answer={answer} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  )
}

export default AnswerCard
