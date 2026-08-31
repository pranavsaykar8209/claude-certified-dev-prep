import React, { useState, useEffect } from 'react'
import { BookOpen, Sparkles, Clock, ArrowRight, BrainCircuit, PlayCircle } from 'lucide-react'
import { getAllExams } from '../exams'

export default function ExamSelection({ onSelectExam }) {
  const [exams, setExams] = useState([])

  useEffect(() => {
    const allExams = getAllExams()
    const examList = allExams.map((exam) => ({
      number: exam.number,
      title: `Exam ${exam.number}`,
      description: `${exam.count} Questions • Single & Multiple Choice`,
    }))
    setExams(examList)
  }, [])

  if (exams.length === 0) {
    return (
      <div className="selection-wrapper">
        <div className="selection-container">
          <p className="no-data-text">No exams found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="selection-wrapper">
      <div className="selection-container">
        {/* Hero Section */}
        <div className="selection-hero">
          <div className="hero-badge">
            <Sparkles size={16} /> AI-Powered Study & Practice Platform
          </div>
          <h1 className="hero-title">Exam & Practice Simulator</h1>
          <p className="hero-description">
            Choose between taking a timed <strong>Official Exam</strong> or studying with <strong>AI Preparation Mode</strong> (Google Gemini explanations, ChatGPT quick-prompts & answer checks).
          </p>

          <div className="hero-feature-tags">
            <span className="feature-tag">
              <Clock size={14} className="text-amber" /> 120-Min Official Exam Mode
            </span>
            <span className="feature-tag">
              <Sparkles size={14} className="text-cyan" /> Gemini AI & ChatGPT Preparation
            </span>
            <span className="feature-tag">
              <BookOpen size={14} className="text-emerald" /> Untimed Learning Mode
            </span>
          </div>
        </div>

        {/* Exams Grid */}
        <div className="selection-grid">
          {exams.map((exam) => (
            <div key={exam.number} className="selection-card">
              <div className="card-header">
                <div className="card-icon-box">
                  <BookOpen size={24} />
                </div>
                <span className="card-badge">53 Questions</span>
              </div>

              <h3>{exam.title}</h3>
              <p className="card-desc">{exam.description}</p>

              <div className="card-meta">
                <span>Passing threshold: 72%</span>
              </div>

              {/* Two Distinct Modes */}
              <div className="card-action-group">
                <button
                  className="btn btn-secondary btn-full"
                  onClick={() => onSelectExam(exam.number, 'exam')}
                >
                  <PlayCircle size={16} /> Start Exam (Timed)
                </button>
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => onSelectExam(exam.number, 'prepare')}
                >
                  <Sparkles size={16} /> Prepare Exam (AI)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
