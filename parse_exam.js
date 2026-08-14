const fs = require('fs');
const path = require('path');

function parseExamFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const questions = [];
    let i = 0;
    
    while (i < lines.length) {
        const line = lines[i].trim();
        
        // Look for "Question X"
        if (line.startsWith('Question ')) {
            const questionNum = parseInt(line.replace('Question ', ''));
            i++;
            
            // Skip status line (Correct/Incorrect)
            if (i < lines.length && (lines[i].trim() === 'Correct' || lines[i].trim() === 'Incorrect')) {
                i++;
            }
            
            // Skip empty line
            while (i < lines.length && lines[i].trim() === '') {
                i++;
            }
            
            // Get question text (until empty line)
            let questionText = '';
            while (i < lines.length && lines[i].trim() !== '') {
                questionText += lines[i].trim() + ' ';
                i++;
            }
            questionText = questionText.trim();
            
            // Skip empty lines
            while (i < lines.length && lines[i].trim() === '') {
                i++;
            }
            
            // Collect options and explanations
            const options = [];
            const optionExplanations = {};
            let correctAnswers = [];
            let explanation = '';
            let currentOption = null;
            
            while (i < lines.length && !lines[i].trim().startsWith('Question ')) {
                const currentLine = lines[i].trim();
                
                // Stop at next question
                if (currentLine.startsWith('Question ')) {
                    break;
                }
                
                // Check for "Correct answer" marker
                if (currentLine.toLowerCase() === 'correct answer') {
                    i++;
                    if (i < lines.length && lines[i].trim() !== '') {
                        const correctOption = lines[i].trim();
                        if (!correctAnswers.includes(correctOption)) {
                            correctAnswers.push(correctOption);
                        }
                        i++;
                    }
                    while (i < lines.length && lines[i].trim() === '') {
                        i++;
                    }
                    continue;
                }
                
                if (currentLine.toLowerCase() === 'explanation') {
                    i++;
                    // Get explanation text (next non-empty line)
                    if (i < lines.length && lines[i].trim() !== '') {
                        const expText = lines[i].trim();
                        if (currentOption) {
                            optionExplanations[currentOption] = expText;
                        } else {
                            explanation = expText;
                        }
                        i++;
                    }
                    continue;
                }
                
                if (currentLine.toLowerCase().startsWith('your answer')) {
                    i++;
                    continue;
                }
                
                // This is an option line
                if (currentLine && !currentLine.toLowerCase().includes('explanation') && 
                    !currentLine.toLowerCase().includes('question') && 
                    !currentLine.toLowerCase().includes('correct')) {
                    options.push(currentLine);
                    currentOption = currentLine;
                }
                
                i++;
            }
            
            // If no explicit correct answers found, use first option
            if (correctAnswers.length === 0 && options.length > 0) {
                correctAnswers = [options[0]];
            }
            
            if (options.length > 0 && correctAnswers.length > 0 && questionText.length > 10) {
                questions.push({
                    number: questionNum,
                    question: questionText,
                    options: options,
                    correctAnswers: correctAnswers,
                    explanation: explanation || (optionExplanations[correctAnswers[0]] ? optionExplanations[correctAnswers[0]] : '')
                });
            }
        } else {
            i++;
        }
    }
    
    return questions;
}

// Main execution
const inputFile = process.argv[2];
const outputDir = process.argv[3];

if (!inputFile || !outputDir) {
    console.error('Usage: node parse_exam.js <input-file> <output-dir>');
    process.exit(1);
}

try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const questions = parseExamFile(inputFile);
    console.log(`Extracted ${questions.length} questions from ${inputFile}`);
    
    const multiAnswerQuestions = questions.filter(q => q.correctAnswers.length > 1);
    console.log(`Questions with multiple correct answers: ${multiAnswerQuestions.length}`);
    
    const outputFile = path.join(outputDir, 'exam_data.json');
    fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2));
    console.log(`Saved to ${outputFile}`);
} catch (error) {
    console.error('Error parsing exam file:', error.message);
    process.exit(1);
}
