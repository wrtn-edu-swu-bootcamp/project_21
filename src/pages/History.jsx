import { useState, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import AnswerCard from '../components/AnswerCard'
import './History.css'

function History() {
  const [answers] = useLocalStorage('reframe_answers', [])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAnswers = useMemo(() => {
    let filtered = [...answers]

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(answer =>
        answer.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 카테고리 필터
    if (filter !== 'all') {
      filtered = filtered.filter(answer => answer.questionId.startsWith(filter))
    }

    // 최신순 정렬
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [answers, filter, searchTerm])

  return (
    <div className="history-page">
      <header className="history-header">
        <h1>나의 기록</h1>
        <p>지금까지 {answers.length}개의 생각을 기록했어요</p>
      </header>

      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="질문이나 답변 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`filter-tab ${filter === 'structure' ? 'active' : ''}`}
            onClick={() => setFilter('structure')}
          >
            경쟁구조
          </button>
          <button
            className={`filter-tab ${filter === 'value' ? 'active' : ''}`}
            onClick={() => setFilter('value')}
          >
            자기가치
          </button>
          <button
            className={`filter-tab ${filter === 'relation' ? 'active' : ''}`}
            onClick={() => setFilter('relation')}
          >
            관계
          </button>
          <button
            className={`filter-tab ${filter === 'system' ? 'active' : ''}`}
            onClick={() => setFilter('system')}
          >
            시스템
          </button>
        </div>

        <div className="answers-list">
          {filteredAnswers.length === 0 ? (
            <div className="empty-state">
              <p>아직 기록이 없어요</p>
              <p className="empty-subtitle">첫 질문에 답변해보세요!</p>
            </div>
          ) : (
            filteredAnswers.map(answer => (
              <AnswerCard key={answer.id} answer={answer} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default History
