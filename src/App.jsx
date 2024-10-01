import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SchoolTable from './components/SchoolTable';
import StudentTable from './components/StudentTable';
import './App.css';
import SchoolScorecard from './components/SchoolScorecard';
import BoardResultOverall from './components/BoardResultOverall';
import ResultAnalysis from './components/ResultAnalysis';
import SlabWiseStudentPercentage from './components/SlabWiseStudentPercentage';
import ExamAndSubjectWisePercentage from './components/ExamAndSubjectWisePercentage';
import Header from './components/Header';
import TreeMapComponent from './components/TreeMapComponent';

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar for navigation */}

        <nav style={{
          width: '200px',
          padding: '20px',
          backgroundColor: '#f4f4f4',
          boxShadow: '2px 0px 5px rgba(0,0,0,0.1)'
        }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/schools" style={{ textDecoration: 'none', color: '#333' }}>School Table</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/students" style={{ textDecoration: 'none', color: '#333' }}>Student Table</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/scorecard" style={{ textDecoration: 'none', color: '#333' }}>Scorecard</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/boardresult" style={{ textDecoration: 'none', color: '#333' }}>Board Result Overall</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/result" style={{ textDecoration: 'none', color: '#333' }}>Result Analysis</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/slab" style={{ textDecoration: 'none', color: '#333' }}>Slabwise Analysis</Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/persentage" style={{ textDecoration: 'none', color: '#333' }}>Subject & Exam Percentage</Link>
            </li>
          </ul>
        </nav>
        {/* Main content */}

        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/schools" element={<SchoolTable />} />
            <Route path="/students" element={<StudentTable />} />
            <Route path="/scorecard" element={<SchoolScorecard />} />
            <Route path="/boardresult" element={<BoardResultOverall />} />
            <Route path="/result" element={<ResultAnalysis />} />
            <Route path="/slab" element={<SlabWiseStudentPercentage />} />
            <Route path="/persentage" element={<ExamAndSubjectWisePercentage />} />
            <Route path="/tree" element={<TreeMapComponent />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
