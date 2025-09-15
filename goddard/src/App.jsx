import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import SelectSchool from './Components/AuthO/SelectSchool';
import AdminDashboard from './Components/Admin/AdminDashboard';
import ApplicationStatus from './Components/Admin/ApplicationStatus';
import FormsRepository from './Components/Admin/FormsRepository';
import InviteParent from './Components/Admin/InviteParent';
import ParentDetails from './Components/Admin/ParentDetails';
import ParentDashboard from './Components/parentFlow/ParentDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<SelectSchool />} />
          <Route path="/application-status" element={<ApplicationStatus />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/forms-repository" element={<FormsRepository />} />
          <Route path="/invite-parent" element={<InviteParent />} />
          <Route path="/parent-details" element={<ParentDetails />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />

        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;
