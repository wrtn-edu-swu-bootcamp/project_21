import { useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import './ShareModal.css'

function ShareModal({ answer, onClose }) {
  const [showDateOnShare, setShowDateOnShare] = useState(true)
  const [copied, setCopied] = useState(false)

  const moodEmoji = (mood) => {
    const emojis = ['😢', '😟', '😐', '🙂', '😊']
    return emojis[mood - 1] || '😐'
  }

  const handleCopyText = () => {
    const text = `📝 다시, 생각
    
질문: ${answer.question}
${showDateOnShare ? `날짜: ${format(new Date(answer.timestamp), 'yyyy년 M월 d일', { locale: ko })}` : ''}
기분: ${moodEmoji(answer.mood)}

${answer.answer}

${answer.tags?.length > 0 ? `#${answer.tags.join(' #')}` : ''}

---
경쟁 인식 리프레이밍 앱 "다시, 생각"`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(err => {
      alert('복사 중 오류가 발생했습니다.')
      console.error('Failed to copy:', err)
    })
  }

  const handleDownloadImage = () => {
    // HTML2Canvas를 사용하는 대신 간단한 canvas로 이미지 생성
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 800
    const ctx = canvas.getContext('2d')

    // 배경
    ctx.fillStyle = '#FAF9F6'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 카드 배경
    ctx.fillStyle = 'white'
    ctx.roundRect(30, 30, 540, 740, 20)
    ctx.fill()

    // 제목
    ctx.fillStyle = '#4A90A4'
    ctx.font = 'bold 32px sans-serif'
    ctx.fillText('💭 다시, 생각', 50, 80)

    // 날짜 (선택적)
    if (showDateOnShare) {
      ctx.fillStyle = '#7F8C8D'
      ctx.font = '16px sans-serif'
      ctx.fillText(format(new Date(answer.timestamp), 'yyyy년 M월 d일', { locale: ko }), 50, 110)
    }

    // 질문
    ctx.fillStyle = '#2C3E50'
    ctx.font = 'bold 20px sans-serif'
    const questionY = showDateOnShare ? 160 : 140
    wrapText(ctx, answer.question, 50, questionY, 500, 28)

    // 감정
    ctx.font = '32px sans-serif'
    ctx.fillText(moodEmoji(answer.mood), 50, questionY + 60)

    // 답변
    ctx.fillStyle = '#2C3E50'
    ctx.font = '18px sans-serif'
    wrapText(ctx, answer.answer, 50, questionY + 110, 500, 26, 400)

    // 태그
    if (answer.tags && answer.tags.length > 0) {
      ctx.fillStyle = '#4A90A4'
      ctx.font = '14px sans-serif'
      ctx.fillText(`#${answer.tags.join(' #')}`, 50, 720)
    }

    // 다운로드
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `rethink-${format(new Date(), 'yyyyMMdd')}.png`
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  // 텍스트 줄바꿈 헬퍼 함수
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxHeight = Infinity) => {
    const words = text.split(' ')
    let line = ''
    let currentY = y
    let totalHeight = 0

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY)
        line = words[n] + ' '
        currentY += lineHeight
        totalHeight += lineHeight

        if (totalHeight > maxHeight) {
          ctx.fillText('...', x, currentY)
          break
        }
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <h3>답변 공유하기</h3>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <div className="share-preview card">
          <div className="preview-header">
            <span className="preview-title">💭 다시, 생각</span>
            {showDateOnShare && (
              <span className="preview-date">
                {format(new Date(answer.timestamp), 'yyyy년 M월 d일', { locale: ko })}
              </span>
            )}
          </div>
          
          <div className="preview-question">{answer.question}</div>
          
          <div className="preview-mood">{moodEmoji(answer.mood)}</div>
          
          <div className="preview-answer">{answer.answer}</div>
          
          {answer.tags && answer.tags.length > 0 && (
            <div className="preview-tags">
              {answer.tags.map((tag, index) => (
                <span key={index}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="share-options">
          <label className="share-option">
            <input
              type="checkbox"
              checked={showDateOnShare}
              onChange={(e) => setShowDateOnShare(e.target.checked)}
            />
            <span>날짜 표시</span>
          </label>
        </div>

        <div className="share-actions">
          <button className="button-secondary" onClick={handleCopyText}>
            {copied ? '✓ 복사됨' : '📋 텍스트 복사'}
          </button>
          <button className="button-primary" onClick={handleDownloadImage}>
            📷 이미지 저장
          </button>
        </div>

        <p className="share-note">
          * 이미지 저장 기능은 간단한 형식으로 제공됩니다
        </p>
      </div>
    </div>
  )
}

export default ShareModal
