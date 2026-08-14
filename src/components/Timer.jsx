import React, { useState, useEffect } from 'react'

export default function Timer({ initialSeconds, isPaused, onTimeUp, sessionData }) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (sessionData?.pausedTime) {
      const elapsed = Math.floor((Date.now() - sessionData.startTime - sessionData.pausedTime) / 1000)
      setSeconds(Math.max(0, initialSeconds - elapsed))
    }
  }, [sessionData, initialSeconds])

  useEffect(() => {
    if (isPaused || seconds === 0) return

    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimeUp?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, seconds, onTimeUp])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isWarning = seconds <= 600 && seconds > 300
  const isCritical = seconds <= 300

  const timerClass = isCritical ? 'critical' : isWarning ? 'warning' : ''

  return (
    <div className={`timer ${timerClass}`}>
      {minutes}:{secs.toString().padStart(2, '0')}
    </div>
  )
}
