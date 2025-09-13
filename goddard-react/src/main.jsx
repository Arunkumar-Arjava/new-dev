import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminDashboardNew from './AdminDashboardNew.jsx'
import ApplicationStatusNew from './ApplicationStatusNew.jsx'
import './index.css'
import LoginNew from './components/LoginNew.jsx'
import { Toaster } from '@/components/ui/sonner'
import ParentDashboard from './components/ParentDashboardSimple.jsx'
import InviteParentNew from './InviteParentNew.jsx'
import ParentDetailsNew from './ParentDetailsNew.jsx'
import FormsRepositoryNew from './FormsRepositoryNew.jsx'
import SignUp from './components/SignUp.jsx'
import SelectSchool from './SelectSchool.jsx'
// Removed Auth0 and API service dependencies - using mock authentication


// Simple app component without Auth0 or API services
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<SelectSchool />} />
        <Route path="/login" element={<LoginNew />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* All routes are now public since we removed authentication */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboardNew />} />
        <Route path="/application-status" element={<ApplicationStatusNew />} />
        <Route path="/parent-details" element={<ParentDetailsNew />} />
        <Route path="/invite-parent" element={<InviteParentNew />} />
        <Route path="/forms-repository" element={<FormsRepositoryNew />} />
      </Routes>
      <Toaster />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)