import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import SelectSchool from './Components/SelectSchool';
import AdminDashboard from './Components/adminFlow/AdminDashboard';
import ParentDetails from './Components/adminFlow/ParentDetails';
import ParentDashboard from './Components/parentFlow/ParentDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SelectSchool />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/parent-details" element={<ParentDetails />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;
