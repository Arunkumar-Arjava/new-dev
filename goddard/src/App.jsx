import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SelectSchool from './Components/SelectSchool';
import AdminDashboard from './components/adminFlow/AdminDashboard';
import ParentDetails from './components/adminFlow/ParentDetails';
import ParentDashboard from './Components/parentFlow/ParentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - SelectSchool as landing page */}
        <Route path="/" element={<SelectSchool />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/parent-details" element={<ParentDetails />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App
