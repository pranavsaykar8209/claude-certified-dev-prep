import React, { useState } from 'react'
import { X, Filter, CheckCircle2, Bookmark, Circle } from 'lucide-react'

export default function QuestionGridModal({
  isOpen,
  onClose,
  questions,
  currentIdx,
  onSelectQuestion,
  answers = {},
  visited = {},
  flagged = {},
}) {
  const [filter, setFilter] = useState('all')

  if (!isOpen) return null

  const getStatus = (idx) => {
    const isCurrent = idx === currentIdx
    const isAnswered = answers[idx] !== undefined && answers[idx] !== null && answers[idx].length !== 0
    const isFlagged = flagged[idx]
    const isVisited = visited[idx]

    return { isCurrent, isAnswered, isFlagged, isVisited }
  }

  const filteredQuestions = questions.map((q, idx) => ({ ...q, originalIdx: idx })).filter((q) => {
    const { isAnswered, isFlagged, isVisited } = getStatus(q.originalIdx)
    if (filter === 'answered') return isAnswered
    if (filter === 'flagged') return isFlagged
    if (filter === 'not-visited') return !isVisited
    return true
  })

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-grid-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>Question Navigator</h3>
            <span className="modal-subtitle">
              Jump to any question ({currentIdx + 1} / {questions.length})
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="modal-filters">
          <button
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({questions.length})
          </button>
          <button
            className={`filter-pill ${filter === 'answered' ? 'active' : ''}`}
            onClick={() => setFilter('answered')}
          >
            <CheckCircle2 size={14} /> Answered ({Object.keys(answers).length})
          </button>
          <button
            className={`filter-pill ${filter === 'flagged' ? 'active' : ''}`}
            onClick={() => setFilter('flagged')}
          >
            <Bookmark size={14} /> Flagged ({Object.values(flagged).filter(Boolean).length})
          </button>
          <button
            className={`filter-pill ${filter === 'not-visited' ? 'active' : ''}`}
            onClick={() => setFilter('not-visited')}
          >
            <Circle size={14} /> Unvisited ({questions.length - Object.keys(visited).length})
          </button>
        </div>

        {/* Question Grid */}
        <div className="modal-grid-container">
          {filteredQuestions.length === 0 ? (
            <p className="no-questions-msg">No questions match the selected filter.</p>
          ) : (
            filteredQuestions.map((q) => {
              const idx = q.originalIdx
              const { isCurrent, isAnswered, isFlagged, isVisited } = getStatus(idx)

              let classNames = 'grid-item'
              if (isCurrent) classNames += ' active'
              else if (isAnswered) classNames += ' answered'
              else if (isVisited) classNames += ' visited'

              return (
                <button
                  key={idx}
                  className={classNames}
                  onClick={() => {
                    onSelectQuestion(idx)
                    onClose()
                  }}
                >
                  <span className="item-number">{idx + 1}</span>
                  {isFlagged && <span className="item-flag-dot">🚩</span>}
                </button>
              )
            })
          )}
        </div>

        {/* Legend */}
        <div className="modal-legend">
          <div className="legend-item">
            <span className="legend-badge active"></span> Active
          </div>
          <div className="legend-item">
            <span className="legend-badge answered"></span> Answered
          </div>
          <div className="legend-item">
            <span className="legend-badge visited"></span> Visited
          </div>
          <div className="legend-item">
            <span className="legend-badge unvisited"></span> Unvisited
          </div>
        </div>
      </div>
    </div>
  )
}
