import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  LayoutDashboard, 
  FileText, 
  Users, 
  FolderOpen,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

function SidebarNew({ activeItem }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 'Dashboard',
      href: '/admin-dashboard',
      label: 'Admin Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      id: 'Application Status',
      href: '/application-status',
      label: 'Application Status',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'ParentDetails',
      href: '/parent-details',
      label: 'Parent Details',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'InviteParent',
      href: '/invite-parent',
      label: 'Invite Parent',
      icon: <UserPlus className="h-5 w-5" />
    },
    {
      id: 'Forms Repository',
      href: '/forms-repository',
      label: 'Form Management',
      icon: <FolderOpen className="h-5 w-5" />
    }
  ];

  const handleMenuClick = (item) => {
    setIsOpen(false);
    // Add a small delay for smooth transition
    setTimeout(() => {
      window.location.href = item.href;
      toast.success(`Navigating to ${item.label}`);
    }, 150);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="bg-[#0F2D52] hover:bg-[#0F2D52]/90 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2 text-[#0F2D52] text-xl">
            <LayoutDashboard className="h-6 w-6" />
            Admin Navigation
          </SheetTitle>
          <SheetDescription>
            Access all administrative functions and pages
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <Button
                variant={activeItem === item.id ? "default" : "ghost"}
                className={`w-full justify-start p-3 text-left transition-all ${
                  activeItem === item.id
                    ? 'bg-[#0F2D52] hover:bg-[#0F2D52]/90 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => handleMenuClick(item)}
              >
                <div className="flex items-center w-full gap-3">
                  <div className={`flex-shrink-0 ${
                    activeItem === item.id ? 'text-white' : 'text-[#0F2D52]'
                  }`}>
                    {item.icon}
                  </div>
                  
                  <span className="font-medium text-sm">
                    {item.label}
                  </span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SidebarNew;