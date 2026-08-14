import React, { useState, useMemo } from 'react'
import Timer from './Timer'
import QuestionNavigation from './QuestionNavigation'
import QuestionDisplay from './QuestionDisplay'
import '../styles/exam.css'

export default function ExamContent({
  examNumber,
  questions,
  sessionData,
  setSessionData,
  onComplete,
}) {
  const [currentIdx, setCurrentIdx] = useState(sessionData?.currentQuestion || 0)
  const [isPaused, setIsPaused] = useState(false)

  const currentQuestion = questions[currentIdx]

  const stats = useMemo(() => {
    const answered = Object.keys(sessionData?.answers || {}).length
    const flagged = Object.keys(sessionData?.flagged || {}).filter(k => sessionData.flagged[k]).length
    const notVisited = questions.length - Object.keys(sessionData?.visited || {}).length
    
    return { answered, flagged, notVisited }
  }, [sessionData, questions])

  const handleAnswer = (answer) => {
    const newAnswers = { ...sessionData?.answers, [currentIdx]: answer }
    const newVisited = { ...sessionData?.visited, [currentIdx]: true }
    
    setSessionData(prev => ({
      ...prev,
      answers: newAnswers,
      visited: newVisited,
      currentQuestion: currentIdx,
    }))
  }

  const handleFlag = () => {
    setSessionData(prev => ({
      ...prev,
      flagged: {
        ...(prev?.flagged || {}),
        [currentIdx]: !(prev?.flagged?.[currentIdx] || false),
      },
    }))
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  const handleSelectQuestion = (idx) => {
    setCurrentIdx(idx)
  }

  const handleFinish = () => {
    // Calculate results
    let correct = 0
    let incorrect = 0
    let notAttempted = 0

    questions.forEach((q, idx) => {
      const userAnswer = sessionData?.answers?.[idx]
      if (!userAnswer && userAnswer !== 0) {
        notAttempted++
      } else if (q.correctAnswers.includes(userAnswer)) {
        correct++
      } else {
        incorrect++
      }
    })

    const percentage = Math.round((correct / questions.length) * 100)
    const passed = percentage >= 72

    setSessionData(prev => ({
      ...prev,
      results: {
        correct,
        incorrect,
        notAttempted,
        total: questions.length,
        percentage,
        passed,
        answers: sessionData?.answers || {},
        flagged: sessionData?.flagged || {},
      },
      completed: true,
    }))

    onComplete()
  }

  if (isPaused) {
    return (
      <div className="pause-overlay">
        <div className="pause-popup">
          <h2>⏸️ Your Exam is Paused</h2>
          <p>Click the button below to resume your exam</p>
          <button onClick={() => setIsPaused(false)}>Resume Exam</button>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-container">
      {/* Header */}
      <div className="exam-header">
        <div className="header-left">
          <h1>Exam {examNumber}</h1>
          <div className="exam-stats">
            <span className="stat">
              <strong>{stats.answered}</strong> Answered
            </span>
            <span className="stat">
              <strong>{stats.flagged}</strong> Flagged
            </span>
            <span className="stat">
              <strong>{stats.notVisited}</strong> Not Visited
            </span>
          </div>
        </div>
        <div className="header-right">
          <Timer
            initialSeconds={120 * 60}
            isPaused={isPaused}
            onTimeUp={handleFinish}
            sessionData={sessionData}
          />
          <button className="pause-btn" onClick={() => setIsPaused(true)}>
            ⏸ Pause
          </button>
        </div>
      </div>

      <div className="exam-body">
        {/* Left Sidebar - Question Navigation */}
        <div className="questions-sidebar">
          <div className="sidebar-header">
            <h3>Questions</h3>
            <p className="question-count">
              {currentIdx + 1} of {questions.length}
            </p>
          </div>
          <QuestionNavigation
            questions={questions}
            currentIdx={currentIdx}
            onSelectQuestion={handleSelectQuestion}
            answers={sessionData?.answers || {}}
            visited={sessionData?.visited || {}}
            flagged={sessionData?.flagged || {}}
          />
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentIdx + 1}
            userAnswer={sessionData?.answers?.[currentIdx]}
            isFlagged={sessionData?.flagged?.[currentIdx] || false}
            onAnswer={handleAnswer}
            onFlag={handleFlag}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isFirstQuestion={currentIdx === 0}
            isLastQuestion={currentIdx === questions.length - 1}
            onFinish={handleFinish}
          />
        </div>
      </div>
    </div>
  )
}
