// Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Dashboard</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 w-full max-w-4xl">
        <Link to="/Technical-interview">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
            <h2 className="text-2xl font-bold mb-4">AI Mock Interview</h2>
            <p>Simulate interviews with AI-generated questions and feedback.</p>
          </div>
        </Link>
        <Link to="/tests">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
            <h2 className="text-2xl font-bold mb-4">MQs</h2>
            <p>Practice your multiple-choice questions to sharpen your skills.</p>
          </div>
        </Link>
        <Link to="/code">
          <div className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition transform hover:scale-105 cursor-pointer">
            <h2 className="text-2xl font-bold mb-4">Code</h2>
            <p>Enhance your coding skills with challenges and projects.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
