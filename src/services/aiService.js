import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Service to interact with Google Gemini AI and ChatGPT integration
 */

export async function askGeminiForExplanation(questionObj) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

  if (!apiKey || apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
    throw new Error(
      'Google API Key is missing. Please add your key to the .env file as VITE_GOOGLE_API_KEY and restart Vite.'
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)

  // Active production model endpoints on Google Gemini API
  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro',
    'gemini-pro-latest',
  ]

  const optionsFormatted = questionObj.options
    .map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`)
    .join('\n')

  const prompt = `
You are an expert tutor helping a student master this exam question.
Analyze the following question and options independently based ONLY on your domain knowledge. Do not assume you have seen an answer sheet.

Question:
${questionObj.question}

Options:
${optionsFormatted}

Provide your analysis strictly in JSON format matching this schema:
{
  "questionExplanation": "Concise summary of what this question is asking for.",
  "predictedAnswer": ["Exact option text 1"],
  "predictedOptionLetters": ["A"],
  "optionAnalysis": {
    "A": "Why option A is correct or incorrect",
    "B": "Why option B is correct or incorrect"
  },
  "rationale": "Clear reasoning why your predicted answer is correct."
}
`

  let lastError = null

  // Loop through candidate model endpoints
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const textResponse = result.response.text()

      // Safely parse JSON from text response
      try {
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
        const jsonString = jsonMatch ? jsonMatch[0] : textResponse
        const parsedData = JSON.parse(jsonString)
        return parsedData
      } catch (e) {
        return {
          questionExplanation: '',
          predictedAnswer: [],
          predictedOptionLetters: [],
          optionAnalysis: {},
          rationale: textResponse,
        }
      }
    } catch (err) {
      console.warn(`Gemini model ${modelName} failed, attempting fallback...`, err?.message)
      lastError = err
    }
  }

  throw new Error(
    lastError?.message || 'Failed to fetch AI explanation from Google Gemini. Please verify your Google API Key.'
  )
}

/**
 * Copies question prompt to clipboard & opens ChatGPT with prompt
 */
export async function openInChatGPT(questionObj) {
  const optionsFormatted = questionObj.options
    .map((opt, idx) => `${String.fromCharCode(65 + idx)}) ${opt}`)
    .join('\n')

  const promptText = `I need help understanding this exam question:\n\n` +
    `Question:\n${questionObj.question}\n\n` +
    `Options:\n${optionsFormatted}\n\n` +
    `Please:\n` +
    `1. Explain what this question is asking in simple terms.\n` +
    `2. Identify the correct answer(s).\n` +
    `3. Explain why the correct option is right and why the other options are incorrect.`

  // Copy to clipboard
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(promptText)
    }
  } catch (e) {
    console.warn('Clipboard write failed:', e)
  }

  // Open ChatGPT web interface with auto-populated query URL parameter
  const targetUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`
  window.open(targetUrl, '_blank', 'noopener,noreferrer')
}

