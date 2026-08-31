import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle, Bookmark, HelpCircle, ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react'
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

  useEffect(() => {
    const data = getExam(parseInt(examNumber))
    if (data) {
      setQuestions(data)
    }
    setLoading(false)
  }, [examNumber])

  const { results } = sessionData || {}
  const { correct, incorrect, notAttempted, percentage, passed } = results || {}

  // Process all questions with accurate evaluation
  const processedQuestions = questions.map((q, idx) => {
    const userAnswer = results?.answers?.[idx]
    const isFlagged = !!results?.flagged?.[idx]
    const isAttempted = userAnswer !== undefined && userAnswer !== null && (!Array.isArray(userAnswer) || userAnswer.length > 0)

    let isCorrect = false
    if (isAttempted) {
      const userArr = (Array.isArray(userAnswer) ? userAnswer : [userAnswer]).sort()
      const correctArr = [...q.correctAnswers].sort()
      isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr)
    }

    return {
      ...q,
      idx,
      userAnswer,
      isCorrect: isAttempted ? isCorrect : false,
      isFlagged,
      isAttempted,
    }
  })

  // Filter questions according to active tab
  const filteredQuestions = processedQuestions.filter(q => {
    if (filter === 'correct') return q.isCorrect === true
    if (filter === 'incorrect') return q.isAttempted && q.isCorrect === false
    if (filter === 'flagged') return q.isFlagged
    return true
  })

  // Auto-select first question if none selected or if current selection is not in filtered list
  useEffect(() => {
    if (filteredQuestions.length > 0) {
      if (!selectedQuestion || !filteredQuestions.some(q => q.idx === selectedQuestion.idx)) {
        setSelectedQuestion(filteredQuestions[0])
      }
    } else {
      setSelectedQuestion(null)
    }
  }, [filter, filteredQuestions.length])

  if (!sessionData?.results || questions.length === 0) {
    return (
      <div className="results-loading-container">
        <div className="results-loading-card">
          <p>{loading ? 'Loading exam results...' : 'No exam results available.'}</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="results-container">
      {/* Top Banner / Actions */}
      <div className="results-top-bar">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Selection
        </button>
        <div className="results-page-title">
          <h2>Exam {examNumber} Performance Report</h2>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/exam/${examNumber}`)}>
          <RotateCcw size={16} /> Retake Exam
        </button>
      </div>

      {/* Results Header Stats Cards */}
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
            <div className="stat-label">Unattempted</div>
          </div>
          <div className="stat-box total">
            <div className="stat-number">{results.total}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="results-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Questions ({questions.length})
        </button>
        <button
          className={`filter-btn filter-correct ${filter === 'correct' ? 'active' : ''}`}
          onClick={() => setFilter('correct')}
        >
          <CheckCircle2 size={15} /> Correct ({correct})
        </button>
        <button
          className={`filter-btn filter-incorrect ${filter === 'incorrect' ? 'active' : ''}`}
          onClick={() => setFilter('incorrect')}
        >
          <XCircle size={15} /> Incorrect ({incorrect})
        </button>
        <button
          className={`filter-btn filter-flagged ${filter === 'flagged' ? 'active' : ''}`}
          onClick={() => setFilter('flagged')}
        >
          <Bookmark size={15} /> Flagged ({processedQuestions.filter(q => q.isFlagged).length})
        </button>
      </div>

      {/* Main 2-Column Body */}
      <div className="results-body">
        {/* Left Side: Question List */}
        <div className="questions-list">
          {filteredQuestions.length === 0 ? (
            <div className="no-questions-placeholder">
              <p>No questions found under this filter.</p>
            </div>
          ) : (
            filteredQuestions.map(q => (
              <div
                key={q.idx}
                className={`result-item ${q.isCorrect === true ? 'item-correct' : q.isAttempted ? 'item-incorrect' : 'item-unattempted'} ${selectedQuestion?.idx === q.idx ? 'selected' : ''}`}
                onClick={() => setSelectedQuestion(q)}
              >
                <div className="result-item-top">
                  <span className="result-number">Question {q.idx + 1}</span>
                  <div className="result-item-tags">
                    {q.isFlagged && <span className="badge-flag-icon" title="Flagged"><Bookmark size={13} /></span>}
                    {q.isCorrect === true && <span className="badge-status-sm success"><CheckCircle2 size={13} /> Correct</span>}
                    {q.isCorrect === false && q.isAttempted && <span className="badge-status-sm danger"><XCircle size={13} /> Incorrect</span>}
                    {!q.isAttempted && <span className="badge-status-sm muted">Unattempted</span>}
                  </div>
                </div>
                <p className="result-question-snippet">
                  {q.question}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Detailed Question Review Panel */}
        {selectedQuestion ? (
          <div className="question-detail-card">
            <div className="detail-card-header">
              <div className="detail-title-group">
                <span className="detail-q-badge">Question {selectedQuestion.idx + 1} of {questions.length}</span>
                {selectedQuestion.isFlagged && (
                  <span className="badge-flag-lg"><Bookmark size={14} /> Flagged</span>
                )}
              </div>
              <span className={`detail-status-pill ${selectedQuestion.isCorrect === true ? 'status-pass' : selectedQuestion.isAttempted ? 'status-fail' : 'status-unanswered'}`}>
                {selectedQuestion.isCorrect === true && <><CheckCircle2 size={16} /> Correct</>}
                {selectedQuestion.isCorrect === false && selectedQuestion.isAttempted && <><XCircle size={16} /> Incorrect</>}
                {!selectedQuestion.isAttempted && <><AlertCircle size={16} /> Unattempted</>}
              </span>
            </div>

            {/* Question Text Prompt */}
            <div className="detail-question-prompt">
              <p>{selectedQuestion.question}</p>
            </div>

            {/* Detailed Option Review */}
            <div className="detail-options-group">
              <h4>Options Review:</h4>
              {selectedQuestion.options.map((opt, optIdx) => {
                const isUserChoice = Array.isArray(selectedQuestion.userAnswer)
                  ? selectedQuestion.userAnswer.includes(opt)
                  : selectedQuestion.userAnswer === opt

                const isCorrectChoice = selectedQuestion.correctAnswers.includes(opt)

                let optClass = "option-review-card"
                if (isCorrectChoice) {
                  optClass += " is-correct-answer"
                }
                if (isUserChoice && !isCorrectChoice) {
                  optClass += " is-wrong-answer"
                }
                if (isUserChoice && isCorrectChoice) {
                  optClass += " is-user-correct"
                }

                return (
                  <div key={optIdx} className={optClass}>
                    <div className="option-review-left">
                      <span className="option-review-letter">{String.fromCharCode(65 + optIdx)}</span>
                      <span className="option-review-text">{opt}</span>
                    </div>

                    <div className="option-review-right">
                      {isUserChoice && isCorrectChoice && (
                        <span className="badge-review success">
                          <CheckCircle2 size={14} /> Your Answer (Correct)
                        </span>
                      )}
                      {isUserChoice && !isCorrectChoice && (
                        <span className="badge-review danger">
                          <XCircle size={14} /> Your Choice (Incorrect)
                        </span>
                      )}
                      {!isUserChoice && isCorrectChoice && (
                        <span className="badge-review correct-reveal">
                          <CheckCircle2 size={14} /> Correct Answer
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Official Explanation */}
            {selectedQuestion.explanation && (
              <div className="detail-explanation-box">
                <div className="explanation-title">
                  <HelpCircle size={18} className="text-cyan" />
                  <span>Official Explanation</span>
                </div>
                <p className="explanation-content">{selectedQuestion.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="question-detail-card empty">
            <p>Select a question from the left panel to review option details.</p>
          </div>
        )}
      </div>
    </div>
  )
}
