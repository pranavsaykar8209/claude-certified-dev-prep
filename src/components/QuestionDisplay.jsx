import React, { useState, useEffect } from 'react'
import { Sparkles, Bot, ExternalLink, Bookmark, ArrowLeft, ArrowRight, HelpCircle, CheckCircle2, XCircle, Check, Eye, EyeOff, Maximize, Minimize, RotateCcw } from 'lucide-react'
import { askGeminiForExplanation, openInChatGPT } from '../services/aiService'
import AIExplanationPanel from './AIExplanationPanel'

function ChatGPTIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9 6.0651 6.0651 0 0 0-4.981-2.01 6.01 6.01 0 0 0-5.7483 4.19 6.0135 6.0135 0 0 0-4.0416 3.12 6.0651 6.0651 0 0 0 .7418 7.14 5.9847 5.9847 0 0 0 .5157 4.9108 6.0462 6.0462 0 0 0 6.5098 2.9 6.0651 6.0651 0 0 0 4.981 2.01 6.01 6.01 0 0 0 5.7483-4.19 6.0135 6.0135 0 0 0 4.0416-3.12 6.0651 6.0651 0 0 0-.7418-7.14zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0819 4.7792-2.7582a.7954.7954 0 0 0 .3927-.6813v-6.7369l2.0221 1.1683a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4975 4.4962zm-9.6607-4.1254a4.47 4.47 0 0 1-.5346-3.0137l.142.0852 4.7838 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.08.08 0 0 1-.0332.0615l-4.8316 2.7877a4.4993 4.4993 0 0 1-6.1498-1.6428zm-1.1292-10.4636a4.4755 4.4755 0 0 1 2.3418-1.9729v5.6795a.784.784 0 0 0 .3927.6813l5.8286 3.3639-2.0221 1.1683a.071.071 0 0 1-.0678.0069l-4.8316-2.7923a4.501 4.501 0 0 1-1.6416-6.1347zm15.4616 2.337l-5.8332-3.3685 2.0221-1.1683a.071.071 0 0 1 .0678-.0069l4.8316 2.7923a4.501 4.501 0 0 1 1.6416 6.1347 4.4755 4.4755 0 0 1-2.3418 1.9729v-5.6795a.784.784 0 0 0-.3881-.6767zm2.2584 4.5714l-.142-.0852-4.7792-2.7582a.7712.7712 0 0 0-.7806 0l-5.8428 3.3685v-2.3324a.08.08 0 0 1 .0332-.0615l4.8316-2.7877a4.4993 4.4993 0 0 1 6.1498 1.6428 4.47 4.47 0 0 1 .53 3.0137zM8.307 12.8066l-2.0221-1.1683a.071.071 0 0 1-.038-.052v-5.5826a4.4975 4.4975 0 0 1 7.3739-3.4554l-.1419.0819-4.7792 2.7582a.7954.7954 0 0 0-.3927.6813v6.7369zm1.1897-3.6666l2.8718-1.6577 2.8718 1.6577v3.3155l-2.8718 1.6577-2.8718-1.6577z"/>
    </svg>
  )
}

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
              className="btn btn-secondary btn-sm btn-hide-header-desktop"
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
            className="btn btn-secondary btn-sm btn-fullscreen-desktop"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode (Hides URL bar & tabs)"}
          >
            {isFullscreen ? (
              <><Minimize size={14} /> Exit Fullscreen</>
            ) : (
              <><Maximize size={14} /> Fullscreen</>
            )}
          </button>

          {/* Mobile-only ChatGPT Icon Button with GPT text pushed to far right */}
          <button
            className="btn btn-ai-chatgpt btn-sm mobile-chatgpt-icon-btn"
            onClick={handleOpenChatGPT}
            title="Ask ChatGPT AI for question explanation"
          >
            <ChatGPTIcon size={14} />
            <span className="mobile-gpt-text">GPT</span>
          </button>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="question-prompt">
        <p>{question.question}</p>
      </div>

      {/* AI Assistance Tools Bar in Prepare Mode */}
      {isPrepareMode && (() => {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY
        const hasGeminiKey = !!apiKey && apiKey !== 'YOUR_GOOGLE_API_KEY_HERE'

        return (
          <>
            <div className={`ai-toolbar ${!hasGeminiKey ? 'ai-toolbar-mobile-hide' : ''}`}>
              <button className="btn btn-ai-chatgpt desktop-chatgpt-btn" onClick={handleOpenChatGPT}>
                <ChatGPTIcon size={16} />
                Open in ChatGPT
              </button>

              <button
                className={`btn btn-ai-gemini ${!hasGeminiKey ? 'hide-mobile-if-no-key' : ''}`}
                onClick={handleAskAI}
                disabled={aiLoading || !hasGeminiKey}
                title={
                  !hasGeminiKey
                    ? "Google Gemini API Key is missing. Add VITE_GOOGLE_API_KEY to your .env file to enable Gemini AI tutoring."
                    : aiLoading
                    ? "Asking Gemini..."
                    : "Ask Gemini AI for question explanation"
                }
              >
                <Sparkles size={16} className={hasGeminiKey ? "sparkle-anim" : ""} />
                {aiLoading ? 'Asking Gemini...' : hasGeminiKey ? 'Ask Gemini' : 'Ask Gemini (Disabled)'}
              </button>

              <button
                className="btn btn-ai-chatgpt-local"
                disabled={true}
                title="Local ChatGPT integration is currently disabled"
              >
                <Bot size={16} />
                Ask ChatGPT (Local)
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
        )
      })()}

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
