import React, { useState, useEffect } from 'react'
import { Sparkles, Bot, ExternalLink, Bookmark, ArrowLeft, ArrowRight, HelpCircle, CheckCircle2, XCircle, Check, Eye, EyeOff, Maximize, Minimize, RotateCcw } from 'lucide-react'
import { askGeminiForExplanation, openInChatGPT } from '../services/aiService'
import AIExplanationPanel from './AIExplanationPanel'

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions = 53,
  userAnswer,
  isFlagged,
  isPrepareMode = true,
  isHeaderHidden = false,
  onToggleHeader,
  onAnswer,
  onFlag,
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  onFinish,
  onOpenGridModal,
}) {
  const requiredCount = question.correctAnswers.length
  const isMultiple = requiredCount > 1

  // AI & Fullscreen states
  const [aiData, setAiData] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [aiProvider, setAiProvider] = useState("gemini")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Reset AI state when question changes
  useEffect(() => {
    setAiData(null)
    setAiProvider("gemini")
    setAiLoading(false)
    setAiError(null)
  }, [questionNumber])

  // Track Fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Toggle browser Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen error:', err)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Handle option selection
  const handleChange = (option) => {
    if (isMultiple) {
      const current = Array.isArray(userAnswer) ? userAnswer : []
      if (current.includes(option)) {
        onAnswer(current.filter((o) => o !== option))
      } else {
        onAnswer([...current, option])
      }
    } else {
      onAnswer(option)
    }
  }

  // Clear answer / reset current question
  const handleClear = () => {
    onAnswer(isMultiple ? [] : null)
  }

  // Handle Ask AI
  const handleAskAI = async () => {
    try {
      setAiProvider("gemini")
      setAiLoading(true)
      setAiError(null)
      const result = await askGeminiForExplanation(question)
      setAiData(result)
    } catch (err) {
      setAiError(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  // Handle Open in ChatGPT
  const handleOpenChatGPT = () => {
    openInChatGPT(question)
  }

  // For multiple-choice, auto-evaluate ONLY when the user has selected all required options!
  const currentSelectedCount = Array.isArray(userAnswer) ? userAnswer.length : (userAnswer ? 1 : 0)
  const hasSelectedOptions = currentSelectedCount > 0

  const isAnswered = isMultiple
    ? currentSelectedCount === requiredCount
    : userAnswer !== undefined && userAnswer !== null && userAnswer !== ''

  const isOptionSelected = (opt) => {
    return isMultiple
      ? Array.isArray(userAnswer) && userAnswer.includes(opt)
      : userAnswer === opt
  }

  const isOptionCorrect = (opt) => {
    return question.correctAnswers.includes(opt)
  }

  return (
    <div className="question-card">
      {/* Top Meta Bar with Navigation, Reset, Header Toggle, & Fullscreen Buttons */}
      <div className="question-card-header">
        <div className="header-meta-group">
          <span className="question-badge">Question {questionNumber} of {totalQuestions}</span>
          {isMultiple && (
            <span className="badge badge-multiple">
              Select {requiredCount} Answers ({currentSelectedCount}/{requiredCount})
            </span>
          )}
        </div>

        <div className="header-action-group">
          {/* Previous & Next Navigation Buttons */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onPrevious}
            disabled={isFirstQuestion}
            title="Previous question"
          >
            <ArrowLeft size={14} /> Prev
          </button>

          {isLastQuestion ? (
            <button className="btn btn-primary btn-sm btn-glow" onClick={onFinish}>
              Finish 🎉
            </button>
          ) : (
            <button className="btn btn-primary btn-sm btn-glow" onClick={onNext}>
              Next <ArrowRight size={14} />
            </button>
          )}

          {/* Clear / Reset Selection Button */}
          {hasSelectedOptions && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleClear}
              title="Clear selected option(s) and reset this question"
            >
              <RotateCcw size={14} /> Clear
            </button>
          )}

          {/* Flag button */}
          <button
            className={`btn-flag ${isFlagged ? 'flagged' : ''}`}
            onClick={onFlag}
            title="Flag question for review"
          >
            <Bookmark size={15} className={isFlagged ? 'fill-amber' : ''} />
            <span>{isFlagged ? 'Flagged' : 'Flag'}</span>
          </button>

          {/* Show / Hide Top Header Button */}
          {onToggleHeader && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onToggleHeader}
              title={isHeaderHidden ? "Show top header navbar" : "Hide top header navbar"}
            >
              {isHeaderHidden ? (
                <><Eye size={14} /> Show Header</>
              ) : (
                <><EyeOff size={14} /> Hide Header</>
              )}
            </button>
          )}

          {/* Native Browser Fullscreen Toggle Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode (Hides URL bar & tabs)"}
          >
            {isFullscreen ? (
              <><Minimize size={14} /> Exit Fullscreen</>
            ) : (
              <><Maximize size={14} /> Fullscreen</>
            )}
          </button>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="question-prompt">
        <p>{question.question}</p>
      </div>

      {/* AI Assistance Tools Bar in Prepare Mode */}
      {isPrepareMode && (
        <>
          <div className="ai-toolbar">
            <button
              className="btn btn-ai-gemini"
              onClick={handleAskAI}
              disabled={aiLoading}
            >
              <Sparkles size={16} className="sparkle-anim" />
              {aiLoading ? 'Asking Gemini...' : 'Ask Gemini'}
            </button>

            <button
              className="btn btn-ai-chatgpt-local"
              disabled={true}
              title="Local ChatGPT integration is currently disabled"
            >
              <Bot size={16} />
              Ask ChatGPT (Local)
            </button>

            <button className="btn btn-ai-chatgpt" onClick={handleOpenChatGPT}>
              <ExternalLink size={16} />
              Open in ChatGPT
            </button>
          </div>

          {/* AI Explanation Panel */}
          <AIExplanationPanel
            aiProvider={aiProvider}
            aiData={aiData}
            loading={aiLoading}
            error={aiError}
            userAnswer={userAnswer}
            actualCorrectAnswers={question.correctAnswers}
            options={question.options}
            showAnswerComparison={isAnswered}
          />
        </>
      )}

      {/* Options List */}
      <div className="options-container">
        {question.options.map((option, idx) => {
          const selected = isOptionSelected(option)
          const correct = isOptionCorrect(option)
          let optionStateClass = ''

          if (selected) optionStateClass += ' selected'

          // Immediate visual feedback in Prepare Mode ONLY once all required options are selected
          if (isPrepareMode && isAnswered) {
            if (selected && correct) {
              optionStateClass += ' option-correct'
            } else if (selected && !correct) {
              optionStateClass += ' option-incorrect'
            } else if (!selected && correct) {
              // Reveal correct answer in green when user chose wrong answer
              optionStateClass += ' option-correct-reveal'
            }
          }

          return (
            <div
              key={idx}
              className={`option-card ${optionStateClass} ${
                isPrepareMode && isAnswered && correct ? 'has-explanation' : ''
              }`}
            >
              <div className="option-card-main" onClick={() => handleChange(option)}>
                <div className="option-content">
                  {/* Custom Styled Radio/Checkbox control */}
                  <div
                    className={`custom-control ${isMultiple ? 'checkbox' : 'radio'} ${
                      selected ? 'checked' : ''
                    } ${
                      isPrepareMode && isAnswered
                        ? correct
                          ? 'control-correct'
                          : selected
                          ? 'control-incorrect'
                          : ''
                        : ''
                    }`}
                  >
                    <input
                      type={isMultiple ? 'checkbox' : 'radio'}
                      name={`question-${questionNumber}`}
                      value={option}
                      checked={selected}
                      onChange={() => {}}
                      tabIndex={-1}
                      className="sr-only"
                    />
                    {selected && !isMultiple && <div className="radio-dot" />}
                    {selected && isMultiple && <Check size={13} className="check-icon" />}
                  </div>

                  <span className="option-label">{option}</span>
                </div>

                {/* Immediate Feedback Badges (shown ONLY when isAnswered === true) */}
                {isPrepareMode && isAnswered && (
                  <div className="option-feedback-badge">
                    {selected && correct && (
                      <span className="badge-status badge-success">
                        <CheckCircle2 size={16} /> Correct
                      </span>
                    )}
                    {selected && !correct && (
                      <span className="badge-status badge-danger">
                        <XCircle size={16} /> Incorrect
                      </span>
                    )}
                    {!selected && correct && (
                      <span className="badge-status badge-success-reveal">
                        <CheckCircle2 size={16} /> Correct Answer
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Merged Official Explanation attached directly inside the Correct Answer option box */}
              {isPrepareMode && isAnswered && correct && question.explanation && (
                <div className="option-merged-explanation">
                  <div className="merged-explanation-header">
                    <HelpCircle size={16} className="text-cyan" />
                    <span>Official Explanation</span>
                  </div>
                  <p className="merged-explanation-body">{question.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
