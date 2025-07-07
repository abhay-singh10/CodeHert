import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../api/axios';
import { setUser } from '../features/auth/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        dispatch(setUser(res.data.data));
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [dispatch]);

  return null;
};

export default AuthInitializer;