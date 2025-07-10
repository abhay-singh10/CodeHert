import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar/Navbar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfilePersonalInfo from '../components/Profile/ProfilePersonalInfo';
import ProfileStats from '../components/Profile/ProfileStats';
import Footer from '../components/Footer/Footer';
import axios from '../api/axios';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    setProfileLoading(true);
    setProfileError(null);
    axios.get(`/user/${username}`)
      .then(res => {
        setProfile(res.data.data);
        setProfileLoading(false);
      })
      .catch(err => {
        setProfileError(err.response?.data || err.message);
        setProfileLoading(false);
      });
  }, [username]);

  const isOwnProfile = loggedInUser && loggedInUser.username === username;

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <ProfileHeader profile={profile} username={username} />
          <div className="col-lg-6">
            <ProfilePersonalInfo
              profile={profile}
              loading={profileLoading}
              error={profileError}
              isOwnProfile={isOwnProfile}
            />
          </div>
          <div className="col-lg-6">
            <ProfileStats profile={profile} loading={profileLoading} error={profileError} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage; 