import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useDailyNotification() {
  const [settings] = useLocalStorage('reframe_user_settings', {
    notificationTime: '09:00',
    notificationEnabled: false
  })

  useEffect(() => {
    if (!settings.notificationEnabled) return

    // 브라우저 알림 권한 요청
    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications')
        return
      }

      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }
    }

    requestNotificationPermission()

    // 매일 설정된 시간에 알림 체크
    const checkAndSendNotification = () => {
      const now = new Date()
      const [hours, minutes] = settings.notificationTime.split(':')
      const targetTime = new Date()
      targetTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      // 현재 시간이 설정 시간과 일치하는지 확인 (1분 오차 허용)
      const timeDiff = Math.abs(now - targetTime)
      if (timeDiff < 60000) { // 1분 이내
        sendNotification()
      }
    }

    // 매분마다 체크
    const interval = setInterval(checkAndSendNotification, 60000)

    // 컴포넌트 마운트 시 한 번 체크
    checkAndSendNotification()

    return () => clearInterval(interval)
  }, [settings])

  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('다시, 생각 💭', {
        body: '오늘의 질문이 준비되었어요. 잠시 시간을 내어 생각을 정리해보세요.',
        icon: '/vite.svg',
        tag: 'daily-question',
        requireInteraction: false
      })
    }
  }

  return { sendNotification }
}
