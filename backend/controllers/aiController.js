const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

exports.codeReview = async (req, res) => {
  try {
    const { code, language, problemName, problemStatement } = req.body;
    if (!code || !language || !problemName || !problemStatement) {
      return res.status(400).json({ error: 'Code, language, problem name, and problem statement are required.' });
    }

    

    const prompt = `You are a concise and expert code reviewer.\n\nProblem Name: ${problemName}\nProblem Statement: ${problemStatement}\n\nReview the following ${language} code:\n\n${code}\n\nGive a brief, to-the-point review with:\n1. Logical or functional issues (if any)\n2. Best practices not followed\n3. Suggestions to improve performance or readability\n4. Any potential edge cases missed\n\nKeep the review clear and short (under 200 words).`;

    const geminiPayload = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    const response = await fetch(GEMINI_MODEL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(geminiPayload)
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: 'AI API error', details: error });
    }

    const data = await response.json();
    // Extract the model's answer from Gemini response
    const review = data?.candidates?.[0]?.content?.parts?.[0]?.text || data;

    res.json({ review });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
