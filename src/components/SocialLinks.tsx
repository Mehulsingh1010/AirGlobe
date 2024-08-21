// SocialLinks.jsx
"use client"
import React from 'react';

const SocialLinks = () => {
  return (
    <div className="flex p-2 flex-col items-center mt-6">
      <p className="text-center text-gray-600 dark:text-gray-300 mb-2">Visit my socials:</p>
      <div className="flex space-x-4">
        <a
          href="https://www.linkedin.com/in/mehul-singh-73154b251/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/mehulsingh1010"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-gray-400 hover:underline"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
