import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    toast.success('Account created successfully!');
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 border-0 shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-[#002e4d] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">GS</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#002e4d]">
            Welcome
          </CardTitle>
          <p className="text-gray-600">
            Sign up to access your dashboard
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            onClick={handleSignup}
            className="w-full bg-[#002e4d] hover:bg-[#002e4d]/90"
          >
            Sign Up
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#002e4d] hover:underline font-medium"
              >
                Log In
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;