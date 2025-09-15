import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LoginNew from './Components/AuthO/LoginNew';
import ApplicationStatus from './Components/Admin/ApplicationStatus';
import FormsRepository from './Components/Admin/FormsRepository';
import InviteParent from './Components/Admin/InviteParent';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginNew />} />
          <Route path="/application-status" element={<ApplicationStatus />} />
          <Route path="/admin-dashboard" element={<ApplicationStatus />} />
          <Route path="/forms-repository" element={<FormsRepository />} />
          <Route path="/invite-parent" element={<InviteParent />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

export default App;
