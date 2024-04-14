import React from 'react';

const NotFound = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">404</h1>
          <p className="text-2xl mb-8">Oops! Page not found.</p>
          <a href="/" className="btn btn-primary">
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;