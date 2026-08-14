import React from 'react'

export default function QuestionNavigation({
  questions,
  currentIdx,
  onSelectQuestion,
  answers,
  visited,
  flagged,
}) {
  return (
    <div className="questions-grid">
      {questions.map((_, idx) => {
        const isAnswered = answers[idx] !== undefined && answers[idx] !== null
        const isVisited = visited[idx]
        const isFlagged = flagged[idx]
        const isCurrent = idx === currentIdx

        let className = 'question-btn'
        if (isCurrent) className += ' current'
        if (isAnswered) className += ' answered'
        if (isFlagged) className += ' flagged'
        if (!isVisited && !isAnswered) className += ' not-visited'

        return (
          <button
            key={idx}
            className={className}
            onClick={() => onSelectQuestion(idx)}
            title={`Question ${idx + 1}${isFlagged ? ' - Flagged' : ''}${isAnswered ? ' - Answered' : ''}`}
          >
            {idx + 1}
            {isFlagged && <span className="flag-icon">🚩</span>}
          </button>
        )
      })}
    </div>
  )
}
