import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">
        Welcome to Our App 🚀
      </h1>

      <p className="text-lg text-gray-300 max-w-md text-center mb-6">
        This application allows users to share posts, edit profiles, and explore
        content. Built with React, TypeScript, and a modern UI.
      </p>

      <div className="flex space-x-4">
        <Link to="/posts">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow">
            View Posts
          </button>
        </Link>

        <a
          href="https://github.com/MoCrespo/BlogApp"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow"
        >
          GitHub Repo
        </a>
      </div>
    </div>
  );
};

export default Home;
