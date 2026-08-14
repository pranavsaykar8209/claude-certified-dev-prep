# 📋 Adding New Exams - Quick Guide

## How It Works

The platform now **automatically detects and loads** exam JSON files directly from `src/exams/` without needing a `public/exams` folder.

**No need to copy files!** Just add to `src/exams/` and update the index.

## Steps to Add a New Exam

### 1. Create the JSON File

Create a file in `src/exams/` named `exam-6.json` (or any number):

```json
[
  {
    "number": 1,
    "question": "What is React?",
    "options": [
      "A JavaScript library for building UIs",
      "A CSS framework",
      "A database system",
      "A build tool"
    ],
    "correctAnswers": ["A JavaScript library for building UIs"],
    "explanation": "React is a popular JavaScript library for building user interfaces with reusable components."
  },
  // ... more questions
]
```

### 2. Update the Index File

Edit `src/exams/index.js` and add:

```javascript
import exam6 from './exam-6.json'

const exams = {
  1: exam1,
  2: exam2,
  3: exam3,
  4: exam4,
  5: exam5,
  6: exam6,  // Add this line
}
```

### 3. That's It! 🎉

- The app will automatically detect the new exam
- It will appear on the selection screen as "Exam 6"
- No copying files needed
- No build step needed

## Current Structure

```
src/exams/
├── exam-1.json
├── exam-2.json
├── exam-3.json
├── exam-4.json
├── exam-5.json
└── index.js        # Central export file
```

## JSON File Format

Each exam JSON file should be an array of question objects:

```json
[
  {
    "number": 1,           // Question number (1-based)
    "question": "...",     // Question text
    "options": [           // Array of answer options
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswers": [    // Array of correct answers
      "Option A"           // For single answer: ["Option A"]
                          // For multiple: ["Option A", "Option C"]
    ],
    "explanation": "..."   // Explanation shown after answer
  },
  // More questions...
]
```

## No Need for public/exams

- ✅ Removed `public/exams/` folder
- ✅ Direct imports are cleaner and faster
- ✅ No copying needed
- ✅ All exams loaded at build time

## Using Existing Parsers

If you have exam files that need parsing:

```bash
# For files in the old format (like CCDV-F-*.txt)
node parse_exam_v2.cjs CCDV-F-6.txt exam-6

# This creates: exam-6/exam_data.json
# Move it to: src/exams/exam-6.json
# Update src/exams/index.js with the import
```

## Modifying the System

If you want to dynamically support unlimited exams instead of manually editing index.js, you can use webpack/Vite's `import.meta.glob()`:

```javascript
// Advanced: Dynamic import of all exams
const examModules = import.meta.glob('./*.json')
```

But for now, the manual approach is cleaner and more maintainable.

## Summary

| Step | Action |
|------|--------|
| 1 | Create `src/exams/exam-N.json` |
| 2 | Import in `src/exams/index.js` |
| 3 | Add to `exams` object in index.js |
| 4 | Refresh browser - exam appears! |

**That's all!** No copying, no build steps, just add and import. 🚀
