import React from 'react'

export default function Question({
  question,
  questionIndex,
  userAnswer,
  isAnswered,
  onAnswerChange,
  onSubmit,
}) {
  const isMultipleAnswers = question.correctAnswers.length > 1
  const inputType = isMultipleAnswers ? 'checkbox' : 'radio'

  const renderQuestionText = (text) => {
    // Simple rendering of question text with code block support
    return (
      <div>
        {text.split('\n').map((line, i) => {
          if (line.trim().startsWith('{') || line.trim().startsWith('[')) {
            return (
              <pre key={i} style={{ background: '#f5f5f5', padding: '0.5rem', overflow: 'auto' }}>
                {line}
              </pre>
            )
          }
          return <div key={i}>{line}</div>
        })}
      </div>
    )
  }

  return (
    <>
      <div className="question-text">
        {renderQuestionText(question.question)}
      </div>

      <div className="options-container">
        {question.options.map((option, optionIndex) => {
          const isSelected = isMultipleAnswers
            ? Array.isArray(userAnswer) && userAnswer.includes(option)
            : userAnswer === option

          const isCorrect = question.correctAnswers.includes(option)
          const showCorrect = isAnswered && isCorrect
          const showIncorrect = isAnswered && isSelected && !isCorrect

          return (
            <label
              key={optionIndex}
              className={`option ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${
                showIncorrect ? 'incorrect' : ''
              }`}
            >
              <input
                type={inputType}
                name={`question-${questionIndex}`}
                value={option}
                checked={isSelected}
                onChange={() => onAnswerChange(questionIndex, option)}
                disabled={isAnswered}
              />
              <div className="option-label">
                {option}
                {isAnswered && showCorrect && (
                  <div className="option-feedback feedback-correct">✓ Correct</div>
                )}
                {isAnswered && showIncorrect && (
                  <div className="option-feedback feedback-incorrect">✗ Incorrect</div>
                )}
              </div>
            </label>
          )
        })}
      </div>

      {isAnswered && (
        <div className="explanation">
          <strong>Explanation:</strong>
          <p style={{ marginTop: '0.5rem' }}>{question.explanation}</p>
        </div>
      )}
    </>
  )
}
