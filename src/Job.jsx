import React, { useState, useEffect } from 'react';
import { MapPin, Building, Calendar, ExternalLink, Loader2 } from 'lucide-react';

const JobBoard = () => {
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('http://localhost:8000/job-scraper/city');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      if (!data.city_results) {
        throw new Error('Invalid API response format');
      }
      
      setJobs(data.city_results);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError('Failed to fetch jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button 
            onClick={fetchJobs}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Software Engineering Jobs
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(jobs).map(([city, jobData]) => {
            let jobInfo;
            try {
              jobInfo = typeof jobData === 'string' ? JSON.parse(jobData) : jobData;
            } catch (e) {
              console.error("Error parsing job data for", city, e);
              jobInfo = null;
            }

            return (
              <div key={city} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{city}</h2>
                    {jobInfo?.date_posted && (
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">{jobInfo.date_posted}</span>
                      </div>
                    )}
                  </div>

                  {jobInfo ? (
                    <>
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                          {jobInfo.job_title}
                        </h3>
                        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                          <Building className="w-4 h-4 mr-1" />
                          <span>{jobInfo.company_name}</span>
                        </div>
                        <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{jobInfo.location}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {jobInfo.job_description}
                      </p>

                      <a
                        href={jobInfo.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-300">
                      No job data available for this location
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
