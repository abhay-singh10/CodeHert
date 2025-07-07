import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar/Navbar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfilePersonalInfo from '../components/Profile/ProfilePersonalInfo';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileSubmissions from '../components/Profile/ProfileSubmissions';
import Footer from '../components/Footer/Footer';
import useProfile from '../hooks/useProfile';
import useSubmissions from '../hooks/useSubmissions';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { profile, loading, error, setProfile } = useProfile(username);
  const { submissions, loading: subLoading, error: subError } = useSubmissions(username);

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
              loading={loading}
              error={error}
              isOwnProfile={isOwnProfile}
              setProfile={setProfile}
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
      <Footer />
    </>
  );
};

export default ProfilePage; 