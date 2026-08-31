import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Grid, PauseCircle, PlayCircle, Award, CheckCircle2, Bookmark, Circle, Sparkles, Eye, EyeOff, Home } from 'lucide-react'
import Timer from './Timer'
import QuestionDisplay from './QuestionDisplay'
import QuestionGridModal from './QuestionGridModal'
import '../styles/exam.css'

export default function ExamContent({
  examNumber,
  mode = 'prepare', // 'exam' or 'prepare'
  questions,
  sessionData,
  setSessionData,
  onComplete,
}) {
  const navigate = useNavigate()
  const [currentIdx, setCurrentIdx] = useState(sessionData?.currentQuestion || 0)
  const [isPaused, setIsPaused] = useState(false)
  const [isGridModalOpen, setIsGridModalOpen] = useState(false)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)

  const isPrepareMode = mode === 'prepare'
  const currentQuestion = questions[currentIdx]

  const stats = useMemo(() => {
    const answered = Object.keys(sessionData?.answers || {}).length
    const flagged = Object.keys(sessionData?.flagged || {}).filter((k) => sessionData.flagged[k]).length
    const notVisited = questions.length - Object.keys(sessionData?.visited || {}).length

    return { answered, flagged, notVisited }
  }, [sessionData, questions])

  const handleAnswer = (answer) => {
    const newAnswers = { ...sessionData?.answers, [currentIdx]: answer }
    const newVisited = { ...sessionData?.visited, [currentIdx]: true }

    setSessionData((prev) => ({
      ...prev,
      answers: newAnswers,
      visited: newVisited,
      currentQuestion: currentIdx,
    }))
  }

  const handleFlag = () => {
    setSessionData((prev) => ({
      ...prev,
      flagged: {
        ...(prev?.flagged || {}),
        [currentIdx]: !(prev?.flagged?.[currentIdx] || false),
      },
    }))
  }

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1
      setCurrentIdx(nextIdx)
      setSessionData((prev) => ({
        ...prev,
        visited: { ...(prev?.visited || {}), [nextIdx]: true },
        currentQuestion: nextIdx,
      }))
    }
  }

  const handlePrevious = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1
      setCurrentIdx(prevIdx)
      setSessionData((prev) => ({
        ...prev,
        currentQuestion: prevIdx,
      }))
    }
  }

  const handleSelectQuestion = (idx) => {
    setCurrentIdx(idx)
    setSessionData((prev) => ({
      ...prev,
      visited: { ...(prev?.visited || {}), [idx]: true },
      currentQuestion: idx,
    }))
  }

  const handleFinish = () => {
    let correct = 0
    let incorrect = 0
    let notAttempted = 0

    questions.forEach((q, idx) => {
      const userAnswer = sessionData?.answers?.[idx]
      if (!userAnswer && userAnswer !== 0 && (!Array.isArray(userAnswer) || userAnswer.length === 0)) {
        notAttempted++
      } else {
        const userArr = (Array.isArray(userAnswer) ? userAnswer : [userAnswer]).sort()
        const correctArr = [...q.correctAnswers].sort()
        if (JSON.stringify(userArr) === JSON.stringify(correctArr)) {
          correct++
        } else {
          incorrect++
        }
      }
    })

    const percentage = Math.round((correct / questions.length) * 100)
    const passed = percentage >= 72

    setSessionData((prev) => ({
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
        <div className="pause-card">
          <PauseCircle size={48} className="pause-icon" />
          <h2>{isPrepareMode ? 'Preparation Session Paused' : 'Exam Session Paused'}</h2>
          <p>Take a break! Your answers and progress are safely saved.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setIsPaused(false)}>
            <PlayCircle size={20} /> Resume Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`exam-app-wrapper ${isHeaderHidden ? 'header-hidden' : ''}`}>
      {/* Top Main Navigation Bar (Visible when not hidden) */}
      {!isHeaderHidden && (
        <header className="exam-navbar">
          <div className="navbar-brand">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/')}
              title="Go to Home / Exam Selection"
            >
              <Home size={15} /> Home
            </button>
          </div>

          {/* Center Quick Stats */}
          <div className="navbar-stats">
            <div className="stat-item stat-answered" title="Answered questions">
              <CheckCircle2 size={16} className="icon-emerald" />
              <span className="stat-label">Answered:</span>
              <span className="stat-value">{stats.answered} / {questions.length}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item stat-flagged" title="Flagged questions">
              <Bookmark size={16} className="icon-amber" />
              <span className="stat-label">Flagged:</span>
              <span className="stat-value">{stats.flagged}</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item stat-unvisited" title="Unvisited questions">
              <Circle size={16} className="icon-muted" />
              <span className="stat-label">Unvisited:</span>
              <span className="stat-value">{stats.notVisited}</span>
            </div>
          </div>

          {/* Right Actions & Controls */}
          <div className="navbar-controls">
            {/* Jump to Question Pop-up Button */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsGridModalOpen(true)}
            >
              <Grid size={16} /> Questions ({currentIdx + 1}/{questions.length})
            </button>

            {/* Timer Display ONLY in Timed Exam Mode */}
            {!isPrepareMode && (
              <div className="timer-wrapper">
                <Timer
                  initialSeconds={120 * 60}
                  isPaused={isPaused}
                  onTimeUp={handleFinish}
                  sessionData={sessionData}
                />
              </div>
            )}

            {/* Hide Header Button */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsHeaderHidden(true)}
              title="Hide top header to maximize screen height"
            >
              <EyeOff size={16} /> Hide Header
            </button>

            <button className="btn btn-ghost btn-sm" onClick={() => setIsPaused(true)}>
              <PauseCircle size={18} /> Pause
            </button>

            <button className="btn btn-primary btn-sm" onClick={handleFinish}>
              <Award size={16} /> Finish
            </button>
          </div>
        </header>
      )}

      {/* Main Single Column Layout */}
      <main className="exam-main-container">
        <QuestionDisplay
          question={currentQuestion}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
          userAnswer={sessionData?.answers?.[currentIdx]}
          isFlagged={sessionData?.flagged?.[currentIdx] || false}
          isPrepareMode={isPrepareMode}
          isHeaderHidden={isHeaderHidden}
          onToggleHeader={() => setIsHeaderHidden((prev) => !prev)}
          onAnswer={handleAnswer}
          onFlag={handleFlag}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isFirstQuestion={currentIdx === 0}
          isLastQuestion={currentIdx === questions.length - 1}
          onFinish={handleFinish}
          onOpenGridModal={() => setIsGridModalOpen(true)}
        />
      </main>

      {/* Pop-up Question Navigator Modal */}
      <QuestionGridModal
        isOpen={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        questions={questions}
        currentIdx={currentIdx}
        onSelectQuestion={handleSelectQuestion}
        answers={sessionData?.answers || {}}
        visited={sessionData?.visited || {}}
        flagged={sessionData?.flagged || {}}
      />
    </div>
  )
}
