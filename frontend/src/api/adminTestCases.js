import axios from './axios';

// Get all test cases for a problem (by problem code)
export const getTestCases = async (problemCode) => {
  const res = await axios.get(`/admin/testcases/problems/${problemCode}`);
  return res.data;
};

// Create a new test case for a problem
export const createTestCase = async ({ problemCode, input, expected_output, points }) => {
  const res = await axios.post('/admin/testcases', { problemCode, input, expected_output, points });
  return res.data;
};

// Update an existing test case
export const updateTestCase = async (testcaseId, { input, expected_output, index, points }) => {
  const res = await axios.put(`/admin/testcases/${testcaseId}`, { input, expected_output, index, points });
  return res.data;
};

// Delete a test case
export const deleteTestCase = async (testcaseId) => {
  const res = await axios.delete(`/admin/testcases/${testcaseId}`);
  return res.data;
}; 