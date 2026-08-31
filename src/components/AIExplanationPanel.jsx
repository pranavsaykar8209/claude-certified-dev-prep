import React from 'react'
import { Sparkles, Bot, CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react'

export default function AIExplanationPanel({
  aiProvider,
  aiData,
  loading,
  error,
  userAnswer,
  actualCorrectAnswers,
  options,
  showAnswerComparison,
  onCheckAnswer,
}) {
  if (loading) {
    return (
      <div className="ai-panel ai-loading">
        <div className="ai-spinner">
          <Sparkles className="spin-icon" size={24} />
        </div>
        <div>
          <h4>Consulting AI...</h4>
          <p>Analyzing question & fetching response...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ai-panel ai-error">
        <div className="ai-error-header">
          <AlertCircle size={20} />
          <h4>AI Assistance Unavailable</h4>
        </div>
        <p>{error}</p>
      </div>
    )
  }

  if (!aiData) return null

  // Process answers for comparison
  const normalize = (val) => (Array.isArray(val) ? val : [val]).filter(Boolean)
  const userSelected = normalize(userAnswer)
  const actualCorrect = normalize(actualCorrectAnswers)
  const aiPredicted = normalize(aiData.predictedAnswer)

  return (
    <div className="ai-panel ai-success">
      <div className="ai-panel-header">
        <div className="ai-title">
          <Sparkles className="sparkle-icon" size={20} />
          <h3>Google Gemini AI Insights</h3>
        </div>
        {!showAnswerComparison && (
          <button className="btn btn-emerald btn-sm" onClick={onCheckAnswer}>
            <CheckCircle2 size={16} />
            Check Answer (AI vs Actual)
          </button>
        )}
      </div>

      {/* Question Breakdown */}
      {aiData.questionExplanation && (
        <div className="ai-section">
          <h4>💡 Question Breakdown</h4>
          <p>{aiData.questionExplanation}</p>
        </div>
      )}

      {/* AI Predicted Answer (Show only if predicted answers exist) */}
      {aiPredicted.length > 0 && (
        <div className="ai-section ai-prediction-box">
          <h4>🤖 AI Predicted Answer</h4>
          <div className="ai-predicted-list">
            {aiPredicted.map((ans, idx) => (
              <div key={idx} className="badge badge-indigo">
                {ans}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Rationale & Explanation */}
      {aiData.rationale && (
        <div className="ai-section">
          <h4>📝 Response & Explanation</h4>
          <div className="ai-rationale-box" style={{ whiteSpace: "pre-wrap" }}>
            {aiData.rationale}
          </div>
        </div>
      )}

      {/* Option Breakdown (Show only if option analysis exists) */}
      {aiData.optionAnalysis && Object.keys(aiData.optionAnalysis).length > 0 && (
        <div className="ai-section">
          <h4>🔍 Option-by-Option Breakdown</h4>
          <div className="options-breakdown-grid">
            {options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx)
              const exp = aiData.optionAnalysis[letter] || aiData.optionAnalysis[opt]
              if (!exp) return null
              return (
                <div key={idx} className="option-breakdown-card">
                  <span className="option-letter">{letter}</span>
                  <div className="option-breakdown-content">
                    <strong>{opt}</strong>
                    <p>{exp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Answer Comparison Section (When Check Answer clicked) */}
      {showAnswerComparison && (
        <div className="ai-comparison-card">
          <div className="comparison-header">
            <HelpCircle size={18} />
            <h4>Answer Verification Sheet</h4>
          </div>

          <div className="comparison-grid">
            <div className="comparison-box">
              <span className="box-label">Your Selection</span>
              <div className="box-content">
                {userSelected.length > 0 ? (
                  userSelected.map((u, idx) => (
                    <span key={idx} className="badge badge-user">
                      {u}
                    </span>
                  ))
                ) : (
                  <span className="badge badge-muted">Not Answered</span>
                )}
              </div>
            </div>

            {aiPredicted.length > 0 && (
              <div className="comparison-box">
                <span className="box-label">AI Prediction</span>
                <div className="box-content">
                  {aiPredicted.map((a, idx) => (
                    <span key={idx} className="badge badge-ai">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="comparison-box">
              <span className="box-label">Actual Correct Answer</span>
              <div className="box-content">
                {actualCorrect.map((c, idx) => (
                  <span key={idx} className="badge badge-actual">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Correctness Banner */}
          {userSelected.length > 0 && (
            <div
              className={`result-banner ${
                JSON.stringify(userSelected.sort()) === JSON.stringify(actualCorrect.sort())
                  ? 'banner-success'
                  : 'banner-error'
              }`}
            >
              {JSON.stringify(userSelected.sort()) === JSON.stringify(actualCorrect.sort()) ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Great job! Your answer matches the official answer key!</span>
                </>
              ) : (
                <>
                  <XCircle size={20} />
                  <span>
                    Your answer differs from the answer sheet. Review the explanation above to understand why!
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
