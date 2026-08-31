import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import ExamSelection from './components/ExamSelection'
import ExamInterface from './components/ExamInterface'
import ResultsScreen from './components/ResultsScreen'

function SelectionPage() {
  const navigate = useNavigate()

  const handleSelectExam = (examNumber, mode = 'prepare') => {
    navigate(`/exam/${examNumber}?mode=${mode}`)
  }

  return <ExamSelection onSelectExam={handleSelectExam} />
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectionPage />} />
        <Route path="/exam/:examNumber" element={<ExamInterface />} />
        <Route path="/exam/:examNumber/results" element={<ResultsScreen />} />
      </Routes>
    </Router>
  )
}
