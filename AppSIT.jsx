// import React, { useState } from 'react';
// import { Search } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';

// // Helper function to extract the domain name from a URL.
// const getDomain = (url) => {
//   try {
//     const { hostname } = new URL(url);
//     return hostname.replace(/^www\./, '');
//   } catch (err) {
//     return url;
//   }
// };

// const PreparationGuide = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState({
//     groq_response: '',
//     videos: [],
//     playlists: [],
//     learning_resources: [] // expects learning_resources as an array of URLs
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (!query) return;
//     setLoading(true);
//     try {
//       const response = await fetch('http://127.0.0.1:8000/get_resources', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ query })
//       });
//       const data = await response.json();
//       setResults(data);
//     } catch (error) {
//       console.error('Error fetching resources:', error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 shadow-md">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold">Preparation Guide</h1>
//           <p className="mt-2 text-lg text-indigo-100">Get curated resources to help you prepare</p>
//         </div>
//       </header>

//       {/* Search Section */}
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="relative">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Enter topic to prepare..."
//             className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 text-lg"
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//           />
//           <button
//             onClick={handleSearch}
//             disabled={loading}
//             className="absolute right-3 top-3 flex items-center bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-xl transition-colors"
//           >
//             <Search size={20} />
//             <span className="ml-2">{loading ? 'Searching...' : 'Search'}</span>
//           </button>
//         </div>
//       </div>

//       {/* Groq AI Response */}
//       {results.groq_response && (
//         <div className="max-w-4xl mx-auto p-6">
//           <h2 className="text-3xl font-bold mb-4">Preparation Hint</h2>
//           <div className="bg-gray-700 p-5 rounded-xl shadow-lg text-gray-100">
//             <ReactMarkdown>{results.groq_response}</ReactMarkdown>
//           </div>
//         </div>
//       )}

//       {/* Videos Section */}
//       {results.videos.length > 0 && (
//         <div className="max-w-4xl mx-auto p-6">
//           <h2 className="text-3xl font-bold mb-4">Videos</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {results.videos.map((video, idx) => (
//               <a
//                 key={idx}
//                 href={video.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-gray-700 rounded-xl overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
//               >
//                 {video.thumbnail && (
//                   <img
//                     src={video.thumbnail}
//                     alt={video.title}
//                     className="w-full h-56 object-cover"
//                   />
//                 )}
//                 <div className="p-4">
//                   <h3 className="text-xl font-semibold">{video.title}</h3>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Playlists Section */}
//       {results.playlists.length > 0 && (
//         <div className="max-w-4xl mx-auto p-6">
//           <h2 className="text-3xl font-bold mb-4">Playlists</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {results.playlists.map((playlist, idx) => (
//               <a
//                 key={idx}
//                 href={playlist.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="bg-gray-700 rounded-xl overflow-hidden hover:shadow-2xl transition transform hover:scale-105"
//               >
//                 {playlist.thumbnail && (
//                   <img
//                     src={playlist.thumbnail}
//                     alt={playlist.title}
//                     className="w-full h-56 object-cover"
//                   />
//                 )}
//                 <div className="p-4">
//                   <h3 className="text-xl font-semibold">{playlist.title}</h3>
//                 </div>
//               </a>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Learning Resources Section */}
//       {results.learning_resources.length > 0 && (
//         <div className="max-w-4xl mx-auto p-6">
//           <h2 className="text-3xl font-bold mb-4">Learning Resources</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {results.learning_resources.map((resource, idx) => {
//               const domain = getDomain(resource);
//               const logoUrl = `https://logo.clearbit.com/${domain}`;
//               return (
//                 <a
//                   key={idx}
//                   href={resource}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="bg-gray-700 rounded-xl p-4 hover:shadow-2xl transition transform hover:scale-105 flex items-center"
//                 >
//                   <img
//                     src={logoUrl}
//                     alt={domain}
//                     className="w-12 h-12 mr-4 object-contain"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                   <p className="text-xl font-medium truncate">{domain}</p>
//                 </a>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PreparationGuide;

// import React, { useState } from 'react';
// import { Search } from 'lucide-react';

// const getDomain = (url) => {
//   try {
//     const { hostname } = new URL(url);
//     return hostname.replace(/^www\./, '');
//   } catch (err) {
//     return url;
//   }
// };

// const PreparationGuide = () => {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState({
//     groq_response: '',
//     videos: [],
//     playlists: [],
//     learning_resources: []
//   });
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (!query) return;
//     setLoading(true);
//     try {
//       const response = await fetch('http://127.0.0.1:8000/get_resources', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ query })
//       });
//       const data = await response.json();
//       setResults(data);
//     } catch (error) {
//       console.error('Error fetching resources:', error);
//     }
//     setLoading(false);
//   };

//   // Function to format text with line breaks
//   const formatText = (text) => {
//     return text.split('\n').map((line, index) => (
//       <React.Fragment key={index}>
//         {line}
//         {index !== text.split('\n').length - 1 && <br />}
//       </React.Fragment>
//     ));
//   };

//   return (
//     <div className="min-h-screen bg-black/60 text-slate-900 font-sans">
//       {/* Header */}
//       <header className="bg-[#FFB200] p-8">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-4xl font-bold text-black">Preparation Guide</h1>
//           <p className="mt-2 text-lg text-violet-100 text-black">Get curated resources to help you prepare</p>
//         </div>
//       </header>

//       {/* Search Section */}
//       <div className="max-w-3xl mx-auto p-6">
//         <div className="relative">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Enter topic to prepare..."
//             className="w-full p-4 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-slate-400 text-lg shadow-sm"
//             onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//           />
//           <button
//             onClick={handleSearch}
//             disabled={loading}
//             className="absolute right-2 top-2 flex items-center bg-[#FFB200] hover:bg-[#DF6D14] px-6 py-2 rounded-full transition-colors text-white"
//           >
//             <Search size={20} />
//             <span className="ml-2">{loading ? 'Searching...' : 'Search'}</span>
//           </button>
//         </div>
//       </div>

//       {/* Content Container */}
//       <div className="max-w-3xl mx-auto space-y-12 px-6 pb-12">
//         {/* Groq AI Response */}
//         {results.groq_response && (
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
//             <h2 className="text-2xl font-bold mb-4 text-slate-800">Preparation Hint</h2>
//             <div className="prose prose-slate text-slate-700">
//               {formatText(results.groq_response)}
//             </div>
//           </div>
//         )}

//         {/* Videos Section */}
//         {results.videos.length > 0 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6 text-slate-800">Videos</h2>
//             <div className="space-y-4">
//               {results.videos.map((video, idx) => (
//                 <a
//                   key={idx}
//                   href={video.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 border border-slate-100"
//                 >
//                   <div className="flex flex-col sm:flex-row">
//                     {video.thumbnail && (
//                       <div className="sm:w-64 h-48 flex-shrink-0">
//                         <img
//                           src={video.thumbnail}
//                           alt={video.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     )}
//                     <div className="p-6">
//                       <h3 className="text-xl font-semibold text-slate-800">{video.title}</h3>
//                     </div>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Playlists Section */}
//         {results.playlists.length > 0 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6 text-slate-800">Playlists</h2>
//             <div className="space-y-4">
//               {results.playlists.map((playlist, idx) => (
//                 <a
//                   key={idx}
//                   href={playlist.link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 border border-slate-100"
//                 >
//                   <div className="flex flex-col sm:flex-row">
//                     {playlist.thumbnail && (
//                       <div className="sm:w-64 h-48 flex-shrink-0">
//                         <img
//                           src={playlist.thumbnail}
//                           alt={playlist.title}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     )}
//                     <div className="p-6">
//                       <h3 className="text-xl font-semibold text-slate-800">{playlist.title}</h3>
//                     </div>
//                   </div>
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Learning Resources Section */}
//         {results.learning_resources.length > 0 && (
//           <div>
//             <h2 className="text-2xl font-bold mb-6 text-slate-800">Learning Resources</h2>
//             <div className="space-y-4">
//               {results.learning_resources.map((resource, idx) => {
//                 const domain = getDomain(resource);
//                 const logoUrl = `https://logo.clearbit.com/${domain}`;
//                 return (
//                   <a
//                     key={idx}
//                     href={resource}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="block bg-white rounded-2xl p-4 hover:shadow-lg transition transform hover:-translate-y-1 border border-slate-100"
//                   >
//                     <div className="flex items-center">
//                       <img
//                         src={logoUrl}
//                         alt={domain}
//                         className="w-12 h-12 mr-4 object-contain rounded-lg"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                       <p className="text-xl font-medium text-slate-800 truncate">{domain}</p>
//                     </div>
//                   </a>
//                 )}
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PreparationGuide;

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const getDomain = (url) => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch (err) {
    return url;
  }
};

const PreparationGuide = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    groq_response: '',
    videos: [],
    playlists: [],
    learning_resources: []
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/get_resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
    setLoading(false);
  };

  const formatText = (text) => {
    return text.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        {line}
        {index !== arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-900 font-sans">
      {/* Full-width Header */}
      <header className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-white">Preparation Guide</h1>
          <p className="mt-2 text-lg text-indigo-100">
            Get curated resources to help you prepare
          </p>
        </div>
      </header>

      <div className="relative">
        {/* Fixed Left Column for Lottie Animation (hidden on small screens) */}
        <div className="hidden md:block md:fixed md:top-32 md:left-0 md:h-[calc(100vh-8rem)] md:w-1/4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center scale-125">
            <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/e230966e-636a-4b44-af95-16d565fd2a65/rl5m8Y3ytl.lottie"
                loop
                autoplay
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-slate-950/30" />
          </div>
        </div>

        {/* Main Content */}
        <div className="md:ml-[25%]">
          {/* Search Section */}
          <div className="max-w-3xl mx-auto p-6">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter topic to prepare..."
                className="w-full p-4 rounded-full bg-slate-900 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-400 text-slate-100 text-lg shadow-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-2 flex items-center bg-violet-600 hover:bg-violet-700 px-6 py-2 rounded-full transition-colors text-white shadow-lg"
              >
                <Search size={20} />
                <span className="ml-2">{loading ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-3xl mx-auto space-y-8 px-6 pb-12">
            {/* Groq AI Response */}
            {results.groq_response && (
              <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Preparation Hint</h2>
                <div className="text-slate-300">
                  {formatText(results.groq_response)}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {results.videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Videos</h2>
                <div className="space-y-4">
                  {results.videos.map((video, idx) => (
                    <a
                      key={idx}
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-slate-900 rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-800"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {video.thumbnail && (
                          <div className="sm:w-64 h-48 flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white">{video.title}</h3>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Playlists Section */}
            {results.playlists.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Playlists</h2>
                <div className="space-y-4">
                  {results.playlists.map((playlist, idx) => (
                    <a
                      key={idx}
                      href={playlist.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-slate-900 rounded-2xl overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-800"
                    >
                      <div className="flex flex-col sm:flex-row">
                        {playlist.thumbnail && (
                          <div className="sm:w-64 h-48 flex-shrink-0">
                            <img
                              src={playlist.thumbnail}
                              alt={playlist.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-white">{playlist.title}</h3>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Resources Section */}
            {results.learning_resources.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-white">Learning Resources</h2>
                <div className="space-y-4">
                  {results.learning_resources.map((resource, idx) => {
                    const domain = getDomain(resource);
                    const logoUrl = `https://logo.clearbit.com/${domain}`;
                    return (
                      <a
                        key={idx}
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-slate-900 rounded-2xl p-4 hover:shadow-xl transition transform hover:-translate-y-1 border border-slate-800"
                      >
                        <div className="flex items-center">
                          <img
                            src={logoUrl}
                            alt={domain}
                            className="w-12 h-12 mr-4 object-contain rounded-lg bg-white/10 p-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <p className="text-xl font-medium text-white truncate">{domain}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationGuide;