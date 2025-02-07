import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

interface UserProfile {
  id: number;
  username: string;
  email: string;
}

const ProfileEdit: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get('/profile');
        const data = response.data as UserProfile;
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.put('/profile', { username, email });
      setSuccess('Profile updated successfully');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none"
                />
              </div>
              {success && <p className="mb-4 text-green-500">{success}</p>}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileEdit;
