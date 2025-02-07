import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const NewPost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await api.post('posts', { title, content });
      setSuccess('Post created successfully');
      setTimeout(() => {
        navigate('/posts');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Error creating post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter post title"
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Enter post content"
              rows={8}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            {saving ? 'Saving...' : 'Create Post'}
          </button>
        </form>
        {saving && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default NewPost;
