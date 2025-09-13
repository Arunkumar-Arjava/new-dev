import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SelectSchool = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#002e4d] text-center">
            The Goddard School
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Welcome! Please select your role to continue.
          </p>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-[#002e4d] hover:bg-[#002e4d]/90"
              onClick={() => navigate('/admin-dashboard')}
            >
              Admin Dashboard
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-[#002e4d] text-[#002e4d] hover:bg-[#002e4d] hover:text-white"
              onClick={() => navigate('/parent-dashboard')}
            >
              Parent Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectSchool;