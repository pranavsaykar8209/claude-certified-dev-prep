import React from 'react'

export default function QuestionDisplay({
  question,
  questionNumber,
  userAnswer,
  isFlagged,
  onAnswer,
  onFlag,
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  onFinish,
}) {
  const isMultiple = question.correctAnswers.length > 1

  const handleChange = (option) => {
    if (isMultiple) {
      const current = Array.isArray(userAnswer) ? userAnswer : []
      if (current.includes(option)) {
        onAnswer(current.filter(o => o !== option))
      } else {
        onAnswer([...current, option])
      }
    } else {
      onAnswer(option)
    }
  }

  return (
    <div className="question-display">
      <div className="question-header">
        <h2>Question {questionNumber}</h2>
        <button
          className={`flag-btn ${isFlagged ? 'flagged' : ''}`}
          onClick={onFlag}
          title="Flag for review"
        >
          🚩 {isFlagged ? 'Flagged' : 'Flag'}
        </button>
      </div>

      <div className="question-text">
        <p>{question.question}</p>
      </div>

      <div className="options-list">
        {question.options.map((option, idx) => {
          const isSelected = isMultiple
            ? Array.isArray(userAnswer) && userAnswer.includes(option)
            : userAnswer === option

          return (
            <label key={idx} className={`option-item ${isSelected ? 'selected' : ''}`}>
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name={`question-${questionNumber}`}
                value={option}
                checked={isSelected}
                onChange={() => handleChange(option)}
              />
              <span className="option-text">{option}</span>
            </label>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="question-navigation">
        <button
          className="btn btn-secondary"
          onClick={onPrevious}
          disabled={isFirstQuestion}
        >
          ← Previous
        </button>

        {isLastQuestion ? (
          <button className="btn btn-primary" onClick={onFinish}>
            Finish Exam
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={onNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
