import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function useSubmissions(username) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/user/${username}/submissions`);
        setSubmissions(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not fetch submissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [username]);

  return { submissions, loading, error };
} 