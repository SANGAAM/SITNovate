import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import CodeEditorPage from './CodeEditor.jsx';
import TechnicalInterviewPage from './TechnicalInterviewPage.jsx';
import HrInterviewPage from './HrInterviewPage.jsx';
import InstantPreparationPage from './InstantPreparationPage.jsx'; // new page
import Exam from './Exam.jsx'
import Dashboard from './dashboard.jsx'
import Job from './Job.jsx';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Test" element={<Dashboard />} />
        <Route path="/technical-interview" element={<TechnicalInterviewPage />} />
        <Route path="/code" element={<CodeEditorPage />} />
        <Route path="/instant-preparation" element={<InstantPreparationPage />} />
        <Route path="/tests" element={<Exam />} />
        <Route path="/Job" element={<Job />} />


      </Routes>
    </Router>
  );
}

export default App;
