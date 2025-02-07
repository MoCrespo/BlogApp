import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { Link } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await api.get(`posts/${id}`);
        setPost(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || 'Error fetching post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/posts"
          className="text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Back to Posts
        </Link>
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {post && (
          <div className="bg-gray-800 p-6 rounded shadow">
            <p className="text-sm text-gray-400 mb-2">
              {formatDate(post.created_at)}
            </p>
            <h1 className="text-3xl font-bold mb-4 text-blue-400">
              {post.title}
            </h1>
            <div className="text-gray-300 leading-relaxed">{post.content}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
