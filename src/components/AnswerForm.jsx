import { useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { v4 as uuidv4 } from 'uuid'
import './AnswerForm.css'

function AnswerForm({ question, onComplete, onCancel, existingAnswer = null }) {
  const [answers, setAnswers] = useLocalStorage('reframe_answers', [])
  const [answer, setAnswer] = useState(existingAnswer?.answer || '')
  const [mood, setMood] = useState(existingAnswer?.mood || null)
  const [tags, setTags] = useState(existingAnswer?.tags?.join(' ') || '')
  const [draftAnswer, setDraftAnswer] = useLocalStorage('reframe_draft_answer', null)

  useEffect(() => {
    // 임시 저장된 답변 불러오기 (새 답변일 때만)
    if (!existingAnswer && draftAnswer && draftAnswer.questionId === question.id) {
      setAnswer(draftAnswer.answer)
      setMood(draftAnswer.mood)
      setTags(draftAnswer.tags.join(' '))
    }
  }, [])

  useEffect(() => {
    // 자동 임시 저장 (새 답변일 때만)
    if (!existingAnswer && (answer || mood || tags)) {
      const timer = setTimeout(() => {
        setDraftAnswer({
          questionId: question.id,
          answer,
          mood,
          tags: tags.split(' ').filter(t => t.trim()),
          savedAt: new Date().toISOString()
        })
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [answer, mood, tags, question.id, existingAnswer])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!answer.trim()) {
      alert('답변을 입력해주세요.')
      return
    }

    if (!mood) {
      alert('오늘의 기분을 선택해주세요.')
      return
    }

    const answerData = {
      id: existingAnswer?.id || uuidv4(),
      questionId: question.id,
      question: question.text,
      answer: answer.trim(),
      mood,
      tags: tags.split(' ').filter(t => t.trim()),
      timestamp: existingAnswer?.timestamp || new Date().toISOString(),
      edited: existingAnswer ? true : false
    }

    if (existingAnswer) {
      // 기존 답변 수정
      setAnswers(answers.map(a => a.id === existingAnswer.id ? answerData : a))
    } else {
      // 새 답변 추가
      setAnswers([...answers, answerData])
      setDraftAnswer(null) // 임시 저장 삭제
    }

    onComplete()
  }

  const handleMoodSelect = (value) => {
    setMood(value)
  }

  const moodOptions = [
    { value: 1, emoji: '😢', label: '매우 힘듦' },
    { value: 2, emoji: '😟', label: '힘듦' },
    { value: 3, emoji: '😐', label: '보통' },
    { value: 4, emoji: '🙂', label: '괜찮음' },
    { value: 5, emoji: '😊', label: '좋음' }
  ]

  return (
    <div className="answer-form-container card">
      <div className="form-header">
        <button className="back-button" onClick={onCancel}>
          ← 뒤로
        </button>
        <span className="form-title">답변 작성</span>
        <div style={{ width: '50px' }}></div>
      </div>

      <div className="question-display">
        <span className="category-badge">{question.category}</span>
        <h3 className="question-text-form">{question.text}</h3>
      </div>

      <form onSubmit={handleSubmit} className="answer-form">
        <div className="form-group">
          <label htmlFor="answer">당신의 생각</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 생각을 자유롭게 적어보세요..."
            rows="8"
            className="answer-textarea"
          />
        </div>

        <div className="form-group">
          <label>오늘 기분은 어때요?</label>
          <div className="mood-selector">
            {moodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`mood-option ${mood === option.value ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(option.value)}
                title={option.label}
              >
                <span className="mood-emoji">{option.emoji}</span>
                <span className="mood-label-small">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">태그 (선택, 띄어쓰기로 구분)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="예: 입시 대학 학벌"
            className="tags-input"
          />
          <span className="input-hint">생각과 관련된 키워드를 입력하세요</span>
        </div>

        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="button-primary">
            {existingAnswer ? '수정하기' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AnswerForm
