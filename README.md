# 📚 Exam Platform - Udemy Style

A professional exam platform built with React featuring a modern Udemy-inspired UI with question navigation, flagging system, comprehensive results analysis, and session persistence.

## ✨ Features

- **5 Complete Exams**: 265 total questions (53 each)
- **Question Navigation**: Click any question to jump instantly
- **Flagging System**: Mark questions for review
- **Real-time Statistics**: See answered, flagged, and not visited counts
- **120-Minute Timer**: With color-coded warnings
- **Session Persistence**: Resume where you left off
- **Comprehensive Results**: 
  - Score with pass/fail status
  - Breakdown of correct/incorrect/not attempted
  - Filter by question status
  - Detailed review with explanations
- **Pause Feature**: Hide exam content when paused
- **Responsive Design**: Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm

### Installation & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173/ in your browser

## 📁 Project Structure

```
ClaudeCode/
├── src/
│   ├── components/
│   │   ├── ExamSelection.jsx       # Exam selection screen
│   │   ├── ExamInterface.jsx       # Main exam layout
│   │   ├── ExamContent.jsx         # Exam logic
│   │   ├── QuestionNavigation.jsx  # Question grid
│   │   ├── QuestionDisplay.jsx     # Question rendering
│   │   ├── ResultsScreen.jsx       # Results & analysis
│   │   ├── Timer.jsx               # 120-min countdown
│   │   └── PauseOverlay.jsx        # Pause modal
│   ├── styles/
│   │   └── exam.css                # All styling
│   ├── hooks/
│   │   └── useSessionStorage.js    # Session persistence
│   ├── exams/
│   │   ├── exam-1.json             # Exam questions
│   │   ├── exam-2.json
│   │   ├── exam-3.json
│   │   ├── exam-4.json
│   │   └── exam-5.json
│   ├── App.jsx                     # Main router
│   └── index.css                   # Global styles
├── public/
│   └── exams/                      # Exam data accessible to app
├── dist/                           # Production build
├── index.html                      # HTML entry point
├── main.jsx                        # React entry point
├── vite.config.js                  # Vite configuration
└── package.json                    # Dependencies

```

## 🎯 Using the Platform

### 1. Select an Exam
- Choose from 5 available exams
- Each exam has 53 questions

### 2. Take the Exam
- **Left Sidebar**: Navigate questions with color-coded status
  - Blue = Current question
  - Green = Answered
  - Orange = Flagged
  - Gray = Not visited
- **Main Area**: Display question and options
- **Header**: Timer and statistics
- **Navigation**: Previous/Next or jump to any question

### 3. During Exam
- Select answer (radio for single, checkbox for multiple)
- Click flag button to mark for review
- See real-time stats update
- Use Previous/Next buttons
- Click any question number to jump

### 4. Finish Exam
- Click "Finish Exam" on last question
- Automatic calculation of results

### 5. Review Results
- See score percentage and status
- View statistics (Correct/Incorrect/Not Attempted)
- Filter questions by status
- Click any question to see details and explanation
- Retake exam or go back to selection

## 💾 Session Storage

Each exam maintains isolated session data:
- User's answers
- Visited questions
- Flagged questions
- Results (after completion)

Session data is automatically saved and restored on page refresh.

## 🎨 Design Features

- **Modern Color Scheme**: Blue, green, red, orange accents
- **Clean Typography**: Easy to read fonts and hierarchy
- **Responsive Layout**: Grid-based, works on mobile
- **Smooth Interactions**: Hover effects and transitions
- **Professional UI**: Matches Udemy course style

## 🔧 Technologies

- **React 18**: UI framework
- **React Router DOM**: URL routing
- **Vite**: Fast build tool
- **CSS3**: Modern styling

## 📊 Exam Statistics

- **Total Questions**: 265 (53 per exam × 5 exams)
- **Question Types**: Multiple choice (single & multiple answers)
- **Passing Score**: 72%
- **Time Limit**: 120 minutes per exam

## 🌐 Browser Support

- Chrome/Chromium ✓
- Firefox ✓
- Safari ✓
- Edge ✓
- Mobile browsers ✓

## 📦 Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder

## 🐛 Troubleshooting

**Exam won't load?**
- Check browser console (F12)
- Ensure exam files exist in `public/exams/`
- Try refreshing the page

**Session not saving?**
- Check if sessionStorage is enabled
- Try a different browser
- Clear browser cache

**Questions not appearing?**
- Verify exam data files are in `public/exams/`
- Check network tab in browser DevTools
- Restart dev server

## 📝 Development

### Add New Exam
1. Create `src/exams/exam-6.json` with questions
2. Copy to `public/exams/exam-6.json`
3. Update `ExamSelection.jsx` to include new exam

### Modify Styling
- Edit `src/styles/exam.css`
- Changes apply immediately with hot reload

### Change Passing Score
- Edit `ExamContent.jsx` line with `percentage >= 72`
- Change 72 to desired threshold

## 📄 License

This project is for educational purposes.

---

**Your professional exam platform is ready!** 🎓

Start at: http://localhost:5173/
