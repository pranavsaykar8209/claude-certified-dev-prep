import React from 'react'

export default function PauseOverlay({ onResume }) {
  return (
    <div className="pause-overlay">
      <div className="pause-popup">
        <h2>⏸️ Your Exam is Paused</h2>
        <p>Click the button below to resume your exam</p>
        <button onClick={onResume}>Resume Exam</button>
      </div>
    </div>
  )
}
