import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, User } from 'lucide-react';

const toast = { success: (msg) => console.log(msg) };

function Header({ onSignOut, sidebar, component }) {
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    toast.success('Signed out successfully');
    onSignOut();
  };

  const handleCancelSignOut = () => {
    setShowSignOutModal(false);
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-white shadow-md border-b sticky top-0 z-40">
        {/* Desktop / Tablet View */}
        <div className="hidden sm:flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Left Section - Sidebar */}
          <div className="flex items-center">
            {/* {sidebar && <SidebarNew activeItem={component} />} */}
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <a 
              href="/admin-dashboard" 
              className="transition-transform hover:scale-105"
              onClick={() => toast.success('Navigating to dashboard')}
            >
              <img
                src="image/gs_logo_lynnwood.png"
                alt="The Goddard School - Lynnwood"
                className="h-12 w-auto sm:h-16 lg:h-20 max-w-full object-contain"
              />
            </a>
          </div>

          {/* Right Section - Sign Out */}
          {onSignOut && (
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOutClick}
                className="border-[#0F2D52] text-[#0F2D52] hover:bg-[#0F2D52] hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          {/* Top Row - Logo */}
          <div className="flex justify-center py-3 border-b bg-gray-50">
            <a 
              href="/admin-dashboard"
              onClick={() => toast.success('Navigating to dashboard')}
            >
              <img
                src="image/gs_logo_lynnwood.png"
                alt="The Goddard School - Lynnwood"
                className="h-12 w-auto max-w-full object-contain"
              />
            </a>
          </div>

          {/* Bottom Row - Navigation + Sign Out */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              {/* {sidebar && <SidebarNew activeItem={component} />} */}
            </div>

            {onSignOut && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOutClick}
                className="border-[#0F2D52] text-[#0F2D52] hover:bg-[#0F2D52] hover:text-white h-8 w-8 p-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={showSignOutModal} onOpenChange={setShowSignOutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0F2D52]">
              <LogOut className="h-5 w-5" />
              Confirm Sign Out
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out of the admin portal? You will need to log in again to access the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Current Session: Admin Portal Access
              </span>
            </div>
          </div>

          <DialogFooter className="flex flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelSignOut}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSignOut}
              className="flex-1 sm:flex-none bg-[#0F2D52] hover:bg-[#0F2D52]/90"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Header;