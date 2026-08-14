import React, { useState, useEffect } from 'react'
import { getAllExams } from '../exams'

export default function ExamSelection({ onSelectExam }) {
  const [exams, setExams] = useState([])

  useEffect(() => {
    // Load exams directly from imports
    const allExams = getAllExams()
    const examList = allExams.map(exam => ({
      number: exam.number,
      title: `Exam ${exam.number}`,
      description: `${exam.count} Questions • Multiple Choice`,
    }))
    setExams(examList)
  }, [])

  if (exams.length === 0) {
    return (
      <div className="exam-selection">
        <div className="exam-selection-card">
          <p style={{ textAlign: 'center', marginTop: '3rem', color: '#999' }}>No exams found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-selection">
      <div className="exam-selection-card">
        <h1>📚 Exam Platform</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Select an exam to begin. You have 120 minutes to complete each exam.
        </p>
        <div className="exam-grid">
          {exams.map(exam => (
            <div
              key={exam.number}
              className="exam-card"
              onClick={() => onSelectExam(exam.number)}
            >
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.8 }}>
                ⏱️ 120 min • Passing: 72%
              </p>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#999' }}>
          💡 Tip: Add new exam JSON files to <code>src/exams/</code> and update <code>src/exams/index.js</code>
        </p>
      </div>
    </div>
  )
}
