import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, School } from 'lucide-react';

import Header from '../Header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// vaishu changed for select school - start
const SelectSchool = () => {
  const navigate = useNavigate();

  const handleSchoolSelect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex justify-center items-center my-6">
        <div className="w-[470px] bg-white shadow-lg rounded-[20px] p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-[#002e4d] mb-2">Select Your School</h2>
            <p className="text-gray-600 text-base">Please choose your Goddard School location</p>
          </div>
          
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full max-w-[300px] justify-between">
                  <span className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Select School
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                <DropdownMenuLabel>Available Locations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleSchoolSelect}
                  className="cursor-pointer"
                >
                  <School className="mr-2 h-4 w-4" />
                  <span>Goddard-Lynnwood</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>More locations coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
// vaishu changed for select school - end

export default SelectSchool;