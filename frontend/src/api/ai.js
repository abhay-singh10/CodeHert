import axios from './axios';

export const getAICodeReview = async ({ problemName, problemStatement, code, language }) => {
  if (!code || code.trim() === "") {
    return "Code is empty";
  }
  const response = await axios.post('/ai/codeReview', {
    problemName,
    problemStatement,
    code,
    language
  });
  return response.data.review;
}; 