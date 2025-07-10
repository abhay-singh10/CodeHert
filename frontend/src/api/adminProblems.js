import axios from './axios';

export const getAllProblems = async () => {
  const res = await axios.get('/problems');
  return res.data;
};

export const deleteProblem = async (code) => {
  const res = await axios.delete(`/admin/problems/code/${code}`);
  return res.data;
};

export const updateProblem = async (code, data) => {
  const res = await axios.put(`/admin/problems/code/${code}`, data);
  return res.data;
};

export const createProblem = async (data) => {
  const res = await axios.post('/admin/problems', data);
  return res.data;
}; 