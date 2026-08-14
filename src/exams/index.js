// Dynamic exam loader
// Import exam data directly instead of fetching from public folder

import exam1 from './exam-1.json'
import exam2 from './exam-2.json'
import exam3 from './exam-3.json'
import exam4 from './exam-4.json'
import exam5 from './exam-5.json'

const exams = {
  1: exam1,
  2: exam2,
  3: exam3,
  4: exam4,
  5: exam5,
}

export const getExam = (examNumber) => {
  return exams[examNumber] || null
}

export const getAllExams = () => {
  return Object.keys(exams).map((num) => ({
    number: parseInt(num),
    questions: exams[num],
    count: exams[num].length,
  }))
}
