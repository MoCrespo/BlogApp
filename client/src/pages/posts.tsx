import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await api.get('posts');
        setPosts(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || 'Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 p-4 rounded shadow">
            <p className="text-sm text-gray-400 mb-1">
              {formatDate(post.created_at)}
            </p>
            <Link to={`/posts/${post.id}`}>
              <h2 className="text-xl font-semibold text-gray-200 hover:underline">
                {post.title}
              </h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
