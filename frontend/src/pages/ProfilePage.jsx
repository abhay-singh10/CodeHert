import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar/Navbar';
import axios from '../api/axios';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfilePersonalInfo from '../components/Profile/ProfilePersonalInfo';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileSubmissions from '../components/Profile/ProfileSubmissions';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subError, setSubError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ first_name: '', last_name: '' });

  const isOwnProfile = loggedInUser && loggedInUser.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/user/${username}`);
        setProfile(res.data.data);
        setProfileData({
          first_name: res.data.data.first_name || '',
          last_name: res.data.data.last_name || ''
        });
      } catch (err) {
        setError(
          err.response?.data?.error || 'User not found or server error.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setSubLoading(true);
      setSubError(null);
      try {
        const res = await axios.get(`/user/${username}/submissions`);
        setSubmissions(res.data.data);
      } catch (err) {
        setSubError(
          err.response?.data?.error || 'Could not fetch submissions.'
        );
      } finally {
        setSubLoading(false);
      }
    };
    fetchSubmissions();
  }, [username]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setProfileData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || ''
    });
    setIsEditing(false);
  };
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      // Only allow editing if own profile
      if (!isOwnProfile) return;
      await axios.put('/user/me', profileData);
      setProfile({ ...profile, ...profileData });
      setIsEditing(false);
    } catch (err) {
      // Optionally show error
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <ProfileHeader profile={profile} username={username} />
          <div className="col-lg-6">
            <ProfilePersonalInfo
              profile={profile}
              loading={loading}
              error={error}
              isOwnProfile={isOwnProfile}
              isEditing={isEditing}
              profileData={profileData}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleChange={handleChange}
            />
          </div>
          <div className="col-lg-6">
            <ProfileStats profile={profile} loading={loading} error={error} />
          </div>
          <div className="col-12">
            <ProfileSubmissions submissions={submissions} subLoading={subLoading} subError={subError} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 