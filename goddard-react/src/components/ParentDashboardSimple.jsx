// Simplified Parent Dashboard
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import HeaderNew from './HeaderNew';
import { useNavigate } from 'react-router-dom';

const ParentDashboardSimple = () => {
  const navigate = useNavigate();
  const isAuthenticated = true;
  const signOut = () => {
    console.log('Sign out clicked');
    navigate('/login');
  };
  
  // Mock data
  const [loading] = useState(false);
  const [error] = useState(null);
  const parentName = 'Sarah Johnson';
  const children = [{ id: '1', firstName: 'Emma', lastName: 'Johnson' }];
  const activeChild = children[0];
  const hasData = true;

  const [currentSection, setCurrentSection] = useState(null);

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-center" />
      <HeaderNew onSignOut={signOut} sidebar={false} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#002e4d] mb-2">
            Welcome, {parentName}
          </h1>
          <p className="text-gray-600">
            Manage your child's enrollment and forms
          </p>
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Child: {activeChild?.firstName} {activeChild?.lastName}
            </h2>
            <p className="text-gray-600">
              Parent dashboard functionality will be implemented here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboardSimple;