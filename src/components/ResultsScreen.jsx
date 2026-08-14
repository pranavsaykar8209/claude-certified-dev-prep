import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useSessionStorage from '../hooks/useSessionStorage'
import { getExam } from '../exams'

export default function ResultsScreen() {
  const { examNumber } = useParams()
  const navigate = useNavigate()
  const [sessionData] = useSessionStorage(`examSession-${examNumber}`, null)
  const [questions, setQuestions] = useState([])
  const [filter, setFilter] = useState('all') // all, correct, incorrect, flagged
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    // Load exam data from direct imports
    const data = getExam(parseInt(examNumber))
    if (data) {
      setQuestions(data)
    }
    setLoading(false)
  }, [examNumber])

  if (!sessionData?.results || questions.length === 0) {
    return (
      <div className="results-loading">
        <p>{loading ? 'Loading results...' : 'No results available'}</p>
      </div>
    )
  }

  const { results } = sessionData
  const { correct, incorrect, notAttempted, percentage, passed } = results

  // Filter questions
  const filteredQuestions = questions.map((q, idx) => {
    const userAnswer = results.answers[idx]
    const isCorrect = q.correctAnswers.includes(userAnswer)
    const isFlagged = results.flagged[idx]
    const isAttempted = userAnswer !== undefined

    return {
      ...q,
      idx,
      userAnswer,
      isCorrect: isAttempted ? isCorrect : null,
      isFlagged,
      isAttempted,
    }
  }).filter(q => {
    if (filter === 'correct') return q.isCorrect === true
    if (filter === 'incorrect') return q.isCorrect === false
    if (filter === 'flagged') return q.isFlagged
    return true
  })

  return (
    <div className="results-container">
      {/* Results Header */}
      <div className="results-header">
        <div className={`score-card ${passed ? 'passed' : 'failed'}`}>
          <div className="score-badge">
            <span className="percentage">{percentage}%</span>
            <span className="status">{passed ? '✓ PASSED' : '✗ FAILED'}</span>
          </div>
        </div>

        <div className="results-stats">
          <div className="stat-box correct">
            <div className="stat-number">{correct}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-box incorrect">
            <div className="stat-number">{incorrect}</div>
            <div className="stat-label">Incorrect</div>
          </div>
          <div className="stat-box not-attempted">
            <div className="stat-number">{notAttempted}</div>
            <div className="stat-label">Not Attempted</div>
          </div>
          <div className="stat-box total">
            <div className="stat-number">{results.total}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="results-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Questions ({questions.length})
        </button>
        <button
          className={`filter-btn ${filter === 'correct' ? 'active' : ''}`}
          onClick={() => setFilter('correct')}
        >
          ✓ Correct ({correct})
        </button>
        <button
          className={`filter-btn ${filter === 'incorrect' ? 'active' : ''}`}
          onClick={() => setFilter('incorrect')}
        >
          ✗ Incorrect ({incorrect})
        </button>
        <button
          className={`filter-btn ${filter === 'flagged' ? 'active' : ''}`}
          onClick={() => setFilter('flagged')}
        >
          🚩 Flagged ({Object.values(results.flagged).filter(f => f).length})
        </button>
      </div>

      {/* Questions Analysis */}
      <div className="results-body">
        <div className="questions-list">
          {filteredQuestions.map(q => (
            <div
              key={q.idx}
              className={`result-item ${q.isCorrect === true ? 'correct' : q.isCorrect === false ? 'incorrect' : 'not-attempted'} ${selectedQuestion?.idx === q.idx ? 'selected' : ''}`}
              onClick={() => setSelectedQuestion(q)}
            >
              <div className="result-item-header">
                <span className="result-number">Q{q.idx + 1}</span>
                <span className="result-icon">
                  {q.isCorrect === true && '✓'}
                  {q.isCorrect === false && '✗'}
                  {q.isAttempted === false && '—'}
                </span>
                {q.isFlagged && <span className="flag">🚩</span>}
              </div>
              <div className="result-question-preview">
                {q.question.substring(0, 100)}...
              </div>
            </div>
          ))}
        </div>

        {/* Question Detail */}
        {selectedQuestion && (
          <div className="question-detail">
            <div className="detail-header">
              <h3>Question {selectedQuestion.idx + 1}</h3>
              <span className={`detail-status ${selectedQuestion.isCorrect === true ? 'correct' : selectedQuestion.isCorrect === false ? 'incorrect' : 'not-attempted'}`}>
                {selectedQuestion.isCorrect === true && '✓ Correct'}
                {selectedQuestion.isCorrect === false && '✗ Incorrect'}
                {selectedQuestion.isAttempted === false && '— Not Attempted'}
              </span>
            </div>

            <div className="detail-question">
              <p>{selectedQuestion.question}</p>
            </div>

            <div className="detail-options">
              <h4>Options:</h4>
              {selectedQuestion.options.map((opt, idx) => {
                const isUserAnswer = selectedQuestion.userAnswer === opt || (Array.isArray(selectedQuestion.userAnswer) && selectedQuestion.userAnswer.includes(opt))
                const isCorrectAnswer = selectedQuestion.correctAnswers.includes(opt)

                return (
                  <div
                    key={idx}
                    className={`detail-option ${isCorrectAnswer ? 'correct-answer' : ''} ${isUserAnswer && !isCorrectAnswer ? 'wrong-answer' : ''}`}
                  >
                    <span className="option-marker">
                      {isCorrectAnswer && '✓'}
                      {isUserAnswer && !isCorrectAnswer && '✗'}
                    </span>
                    <span>{opt}</span>
                  </div>
                )
              })}
            </div>

            {selectedQuestion.isAttempted && (
              <div className="detail-user-answer">
                <strong>Your Answer:</strong>
                <p>{Array.isArray(selectedQuestion.userAnswer) ? selectedQuestion.userAnswer.join(', ') : selectedQuestion.userAnswer}</p>
              </div>
            )}

            <div className="detail-explanation">
              <h4>Explanation:</h4>
              <p>{selectedQuestion.explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="results-footer">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Back to Selection
        </button>
        <button className="btn btn-primary" onClick={() => navigate(`/exam/${examNumber}`)}>
          Retake Exam
        </button>
      </div>
    </div>
  )
}
