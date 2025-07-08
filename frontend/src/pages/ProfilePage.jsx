import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar/Navbar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfilePersonalInfo from '../components/Profile/ProfilePersonalInfo';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileSubmissions from '../components/Profile/ProfileSubmissions';
import Footer from '../components/Footer/Footer';
import axios from '../api/axios';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState(null);

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

  useEffect(() => {
    setSubLoading(true);
    setSubError(null);
    axios.get(`/user/${username}/submissions`)
      .then(res => {
        setSubmissions(res.data.data);
        setSubLoading(false);
      })
      .catch(err => {
        setSubError(err.response?.data || err.message);
        setSubLoading(false);
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
          <div className="col-12">
            <ProfileSubmissions submissions={submissions} subLoading={subLoading} subError={subError} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage; 