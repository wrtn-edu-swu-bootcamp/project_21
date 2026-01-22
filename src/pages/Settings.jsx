import { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './Settings.css'

function Settings() {
  const [settings, setSettings] = useLocalStorage('reframe_user_settings', {
    notificationTime: '09:00',
    theme: 'light',
    notificationEnabled: false,
    firstVisit: false
  })

  const [answers, setAnswers] = useLocalStorage('reframe_answers', [])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleNotificationTimeChange = (e) => {
    setSettings({
      ...settings,
      notificationTime: e.target.value
    })
  }

  const handleNotificationToggle = () => {
    setSettings({
      ...settings,
      notificationEnabled: !settings.notificationEnabled
    })
  }

  const handleExportData = () => {
    const data = {
      settings,
      answers,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rethink-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result)
        if (data.settings) setSettings(data.settings)
        if (data.answers) setAnswers(data.answers)
        alert('데이터를 성공적으로 가져왔습니다!')
      } catch (error) {
        alert('파일을 읽는 중 오류가 발생했습니다.')
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteAllData = () => {
    setAnswers([])
    setSettings({
      notificationTime: '09:00',
      theme: 'light',
      notificationEnabled: false,
      firstVisit: false
    })
    localStorage.clear()
    setShowDeleteConfirm(false)
    alert('모든 데이터가 삭제되었습니다.')
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>설정</h1>
        <p>앱을 나에게 맞게</p>
      </header>

      <div className="container">
        <div className="settings-section card">
          <h2 className="settings-section-title">알림 설정</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">알림 활성화</div>
              <div className="setting-description">매일 설정한 시간에 알림을 받습니다</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.notificationEnabled}
                onChange={handleNotificationToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">알림 시간</div>
              <div className="setting-description">질문을 받을 시간을 선택하세요</div>
            </div>
            <input
              type="time"
              value={settings.notificationTime}
              onChange={handleNotificationTimeChange}
              className="time-input"
            />
          </div>
        </div>

        <div className="settings-section card mt-3">
          <h2 className="settings-section-title">데이터 관리</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">데이터 내보내기</div>
              <div className="setting-description">답변 데이터를 JSON 파일로 저장</div>
            </div>
            <button className="button-secondary" onClick={handleExportData}>
              내보내기
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">데이터 가져오기</div>
              <div className="setting-description">백업 파일에서 데이터 복원</div>
            </div>
            <label className="button-secondary" style={{ cursor: 'pointer' }}>
              가져오기
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-label">모든 데이터 삭제</div>
              <div className="setting-description danger-text">모든 답변과 설정이 삭제됩니다</div>
            </div>
            <button 
              className="button-danger" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              삭제
            </button>
          </div>
        </div>

        <div className="settings-section card mt-3">
          <h2 className="settings-section-title">앱 정보</h2>
          <div className="app-info">
            <p><strong>버전:</strong> 1.0.0</p>
            <p><strong>개발:</strong> 경쟁 완화 앱 팀</p>
            <p><strong>문의:</strong> contact@rethink.app</p>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>정말 삭제하시겠습니까?</h3>
            <p>모든 답변과 설정이 영구적으로 삭제됩니다.</p>
            <p>이 작업은 되돌릴 수 없습니다.</p>
            <div className="modal-buttons">
              <button 
                className="button-secondary" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                취소
              </button>
              <button 
                className="button-danger" 
                onClick={handleDeleteAllData}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
