import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get('/profile');
        setProfile(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || 'Error fetching profile');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : profile ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Profile</h1>
              <Link
                to="/profile/edit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </Link>
            </div>
            <p className="text-lg">
              <span className="font-semibold">Username: </span>
              {profile.username}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email: </span>
              {profile.email}
            </p>
          </>
        ) : (
          <p>No profile data available</p>
        )}
      </div>
      <Link
        to="/posts/new"
        className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      >
        New Post
      </Link>
    </div>
  );
};

export default Profile;
