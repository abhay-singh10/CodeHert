import { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function useProfile(username) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/user/${username}`);
        setProfile(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'User not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  return { profile, loading, error, setProfile };
} 