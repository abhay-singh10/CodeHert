const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

exports.codeReview = async (req, res) => {
  try {
    const { code, language, problemName, problemStatement } = req.body;
    if (!code || !language || !problemName || !problemStatement) {
      return res.status(400).json({ error: 'Code, language, problem name, and problem statement are required.' });
    }

    

    const prompt = `You are a concise and expert code reviewer specializing in Data Structures and Algorithms (DSA) using ${language}.

    Your task is to review the following code submission for a DSA problem.
    
    **Problem Name:** ${problemName}  
    **Problem Statement:** ${problemStatement}
    
    **Code Submitted:**  
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Provide a brief, focused review covering:
    1. **Correctness:** Any logical or functional errors? Are edge cases handled properly?
    2. **Time Complexity:** Does the solution follow optimal practices (preferably O(n) or better where applicable)?
    3. **DSA Best Practices:** Are appropriate data structures and algorithms used efficiently?
    4. **Code Quality:** Suggestions to improve readability, maintainability, or performance.
    5. **Edge Cases:** Any scenarios or inputs that might fail or degrade the solution?
    
    **Instructions:**  
    - Be specific and constructive — avoid vague or generic feedback.  
    - Use markdown bullet points (start each point with "- ") with no extra indentation or blank lines between them.
    - Use bullet points for clarity.  
    - Keep the review concise and under **200 words**.`.trim();
    

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
