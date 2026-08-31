import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import ExamContent from './ExamContent'
import { getExam } from '../exams'
import useSessionStorage from '../hooks/useSessionStorage'

export default function ExamInterface() {
  const { examNumber } = useParams()
  const [searchParams] = useSearchParams()
  const modeParam = searchParams.get('mode') || 'prepare' // 'exam' or 'prepare'

  const navigate = useNavigate()
  const [sessionData, setSessionData] = useSessionStorage(`examSession-${examNumber}`, null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadExamData()
  }, [examNumber])

  const loadExamData = () => {
    try {
      setLoading(true)
      setError(null)

      const data = getExam(parseInt(examNumber))
      if (!data) {
        throw new Error(`Exam ${examNumber} not found`)
      }

      setQuestions(data)

      // Initialize session if not exists or if mode changed
      if (!sessionData || sessionData.mode !== modeParam) {
        setSessionData({
          startTime: Date.now(),
          answers: {},
          visited: {},
          flagged: {},
          currentQuestion: 0,
          mode: modeParam, // 'exam' or 'prepare'
        })
      }
    } catch (err) {
      console.error('Error loading exam:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="exam-loading">
        <div className="loader">Loading Exam {examNumber}...</div>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="exam-loading">
        <div className="error">{error || 'No questions found in this exam'}</div>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>
          Go Back
        </button>
      </div>
    )
  }

  return (
    <ExamContent
      examNumber={parseInt(examNumber)}
      mode={sessionData?.mode || modeParam}
      questions={questions}
      sessionData={sessionData}
      setSessionData={setSessionData}
      onComplete={() => navigate(`/exam/${examNumber}/results`)}
    />
  )
}
