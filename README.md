# 🎓 Claude Certified Developer Exam Prep Platform

An interactive, AI-powered study and exam simulation platform designed to prepare developers for the **Claude Certified Developer** certification and Anthropic AI development topics.

Features **5 complete practice exams** (265 scenario-based questions), live **Google Gemini AI tutoring**, **120-minute timed exam mode**, and **comprehensive performance review**.

---

## ✨ Features

- **📚 5 Complete Practice Exams**: 265 total questions (53 scenario-based questions per exam).
- **⚡ Dual Study Modes**:
  - **Preparation Mode (AI Tutoring)**: Untimed practice with instant feedback, official solution explanations, and Google Gemini AI insights.
  - **Official Timed Exam Mode**: Realistic 120-minute exam simulation with countdown timer and score report.
- **🤖 Google Gemini AI Integration**:
  - Generates detailed independent question breakdowns.
  - Predicts answers with rationale.
  - Provides option-by-option correct/incorrect analysis.
- **📊 Detailed Results & Answer Review**:
  - Score percentage and Pass/Fail status (72% passing threshold).
  - Filter review by **All**, **Correct**, **Incorrect**, or **Flagged** questions.
  - Clear visual indicator of your choice vs. official answer.
- **🚩 Flagging & Navigation**:
  - Flag questions for later review.
  - Pop-up Question Grid modal to jump directly to any question.
- **💾 Session Persistence**: Automatically saves user answers, flagged state, and timer progress across refreshes.
- **📱 Fully Responsive UI**: Modern dark glassmorphism design optimized for desktop, tablet, and mobile views.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v16+
- **npm**: v8+

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pranavsaykar8209/claude-certified-dev-prep.git
   cd claude-certified-dev-prep
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional - for Gemini AI tutoring):
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_API_KEY=YOUR_GEMINI_API_KEY_HERE
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## 📁 Project Structure

```
claude-certified-dev-prep/
├── src/
│   ├── components/
│   │   ├── ExamSelection.jsx       # Home screen with exam card selection
│   │   ├── ExamContent.jsx         # Main exam interface & header controls
│   │   ├── QuestionDisplay.jsx     # Question layout & option selector
│   │   ├── AIExplanationPanel.jsx  # Google Gemini AI tutoring panel
│   │   ├── QuestionGridModal.jsx   # Quick jump question grid modal
│   │   ├── ResultsScreen.jsx       # Detailed performance review screen
│   │   ├── Timer.jsx               # 120-minute countdown timer
│   │   └── PauseOverlay.jsx        # Exam pause modal overlay
│   ├── services/
│   │   └── aiService.js            # Google Gemini AI API integration
│   ├── exams/
│   │   ├── exam-1.json             # Practice Exam 1 (53 questions)
│   │   ├── exam-2.json             # Practice Exam 2 (53 questions)
│   │   ├── exam-3.json             # Practice Exam 3 (53 questions)
│   │   ├── exam-4.json             # Practice Exam 4 (53 questions)
│   │   ├── exam-5.json             # Practice Exam 5 (53 questions)
│   │   └── index.js                # Exam data loader
│   ├── styles/
│   │   └── exam.css                # Component & layout styling
│   ├── App.jsx                     # Router configuration
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global design tokens & base styles
├── public/                         # Public assets & static exams
├── vite.config.js                  # Vite build configuration
└── package.json                    # Project dependencies & scripts
```

---

## 🎯 How to Use the Platform

### 1. Select an Exam
From the homepage, select any of the 5 practice exams:
- Click **"Start Exam (Timed)"** to test yourself under simulated 120-minute exam conditions.
- Click **"Prepare Exam (AI)"** to practice untimed with Gemini AI explanations and immediate feedback.

### 2. Answering Questions
- **Single Choice**: Select one radio option.
- **Multiple Choice**: Select the exact number of required checkbox options (e.g. *Select 2 Answers*).
- Click **"Flag"** to mark questions you want to review later.
- Click **"Questions"** button in the header to jump to any specific question via the grid overlay.

### 3. Using AI Assistance (Preparation Mode)
- Click **"Ask Gemini"** to fetch AI tutoring, predicted answers, and option analysis for the current question.
- Click **"Open in ChatGPT"** to copy the question prompt to your clipboard and open ChatGPT.

### 4. Reviewing Performance
Upon finishing an exam, the **Results Screen** presents:
- Final Score percentage and Pass/Fail badge.
- Question count summary (Correct, Incorrect, Not Attempted).
- Left-side filterable list of all questions.
- Right-side detailed question breakdown displaying your selection, the official correct answer, and explanation.

---

## 🛠️ Built With

- **[React 18](https://react.dev/)**: UI Library
- **[Vite](https://vitejs.dev/)**: Next-Generation Frontend Tooling
- **[React Router DOM v7](https://reactrouter.com/)**: Application Routing
- **[Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)**: Gemini AI API Integration
- **[Lucide React](https://lucide.dev/)**: Icon Set

---

## 📦 Production Build

To build the app for production deployment:

```bash
npm run build
```

The optimized static bundle will be created in the `dist/` directory. You can preview the build locally with:

```bash
npm run preview
```

---

## 📄 License

This project is open-source and intended for educational and study purposes.
