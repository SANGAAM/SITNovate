import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';
import {
    Moon,
    Sun,
    Code,
    Users,
    Brain,
    ChevronRight,
    BookOpen,
    MessageSquare,
    PenTool,
    Cpu,
    Twitter,
    Facebook,
    Linkedin,
    Instagram,
  } from 'lucide-react';
  
  const HomePage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    const interviewTypes = [
      {
        title: 'Instant Preparation',
        description: 'Prepare yourself based on the available resources.',
        icon: <Brain className="w-8 h-8" />,
        lightStyles:
          'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 text-blue-600 hover:from-blue-100 hover:via-blue-200 hover:to-blue-300',
        darkStyles:
          'dark:bg-gradient-to-br dark:from-[#2A2D64] dark:via-[#2B2F77] dark:to-[#1E2153] dark:text-black dark:hover:from-[#2E3178] dark:hover:via-[#33367A] dark:hover:to-[#252966]'
           ,iconBg:
          'bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500 text-black',
      },
      {
        title: 'Testing Arena',
        description: 'Prepare yourself by practicing interviews, coding problems, and MCQs .',
        icon: <Code className="w-8 h-8" />,
        lightStyles:
          'bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 text-emerald-600 hover:from-emerald-100 hover:via-emerald-200 hover:to-emerald-300',
        darkStyles:
          'dark:bg-gradient-to-br dark:from-[#1E4E45] dark:via-[#1B584C] dark:to-[#133B33] dark:text-emerald-300 dark:hover:from-[#235D52] dark:hover:via-[#1F6357] dark:hover:to-[#184A41]',
        iconBg:
          'bg-gradient-to-br from-emerald-400 to-emerald-600 dark:from-emerald-300 dark:to-emerald-500 text-white',
      },
      {
        title: 'Job Finder',
        description: 'Find jobs that align with your skills and experience .',
        icon: <Users className="w-8 h-8" />,
        lightStyles:
          'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 text-purple-600 hover:from-purple-100 hover:via-purple-200 hover:to-purple-300',
        darkStyles:
          'dark:bg-gradient-to-br dark:from-[#432B65] dark:via-[#4E2B7B] dark:to-[#301B4D] dark:text-purple-300 dark:hover:from-[#523178] dark:hover:via-[#5D2B8F] dark:hover:to-[#3D2161]',
        iconBg:
          'bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-300 dark:to-purple-500 text-white',
      },
    ];
  
    const features = [
      { icon: <BookOpen className="w-6 h-6" />, title: 'Instant Preparation' ,path: '/instant-preparation'},
      { icon: <MessageSquare className="w-6 h-6" />, title: 'AI Assistant',path:'/instant-preparation' },
      { icon: <PenTool className="w-6 h-6" />, title: ' Tests',path: '/tests'},
    ];
  
    // Toggle dark mode on the document root
    useEffect(() => {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [isDarkMode]);
  
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
              <Cpu className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-500">TechClips</div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-200 transform hover:scale-110 ${
                isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
  
          {/* Welcome Section */}
          <div className="mb-12 text-center">
            <h1 className={`text-5xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back
            </h1>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose your AI preparation path
            </p>
          </div>
  
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
  {features.map((feature, index) => (
    <Link key={index} to={feature.path}>
      <div
        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 cursor-pointer ${
          isDarkMode
            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            : 'bg-white text-gray-600 shadow-lg hover:shadow-xl'
        }`}
      >
        {feature.icon}
        <span className="text-sm font-medium">{feature.title}</span>
      </div>
    </Link>
  ))}
</div>
  
          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {interviewTypes.map((type, index) => {
              // Set a link for each card. For now, the placeholders for pages other than Coding Round.
              let linkTo = '/coming-soon';
              if (type.title === 'Testing Arena') {
                linkTo = '/Test';
              } else if (type.title === 'Instant Preparation') {
                linkTo = '/instant-preparation';
              } else if (type.title === 'Job Finder') {
                linkTo = '/Job';
              }
  
              return (
                <Link to={linkTo} key={index}>
                  <Card
                    className={`border-none shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer backdrop-blur-sm ${
                      isDarkMode ? type.darkStyles : type.lightStyles
                    }`}
                  >
                    <CardContent className="p-8">
                      <div
                        className={`rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-300 hover:rotate-6 ${type.iconBg}`}
                      >
                        {type.icon}
                      </div>
                      <h2 className="text-2xl font-bold mb-3">{type.title}</h2>
                      <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {type.description}
                      </p>
                      <div className="flex items-center text-sm font-medium group">
                        <span className="mr-2">Start Preparing</span>
                        <ChevronRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
  
        {/* Footer Section */}
        <footer className="py-8 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* Branding & Contact Info */}
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Cpu className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">TechClips</h3>
                </div>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                  Innovating your technical interview preparation.
                </p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Contact us:{' '}
                  <a href="mailto:support@techclips.com" className="underline hover:text-indigo-500">
                    support@techclips.com
                  </a>
                </p>
              </div>
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-500"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} TechClips. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default HomePage;