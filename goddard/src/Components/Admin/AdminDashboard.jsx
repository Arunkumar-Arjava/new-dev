import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Settings, ChevronRight, Activity } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import Header from '../Header';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = true;
  const signOut = () => {
    console.log('Sign out clicked');
    navigate('/login');
  };

  // Dashboard metrics (these could be fetched from an API)
  const dashboardStats = [
    {
      title: 'Active Applications',
      value: '24',
      description: 'Pending review',
      trend: '+12%',
      trendType: 'positive'
    },
    {
      title: 'Total Parents',
      value: '156',
      description: 'Registered users',
      trend: '+8%',
      trendType: 'positive'
    },
    {
      title: 'Forms Submitted',
      value: '89',
      description: 'This month',
      trend: '+15%',
      trendType: 'positive'
    }
  ];

  const dashboardCards = [
    {
      title: 'Application Status',
      description: 'Review and manage application submissions from prospective parents',
      href: '/application-status',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
      stats: '24 Pending'
    },
    {
      title: 'Parent Details',
      description: 'View and manage parent information and contact details',
      href: '/parent-details',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
      stats: '156 Total'
    },
    {
      title: 'Classroom & Form Management',
      description: 'Configure classrooms, manage forms, and system settings',
      href: '/forms-repository',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100',
      stats: '12 Forms'
    }
  ];

  const handleCardClick = (href) => {
    navigate(href);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSignOut={signOut} sidebar={true} component="Dashboard" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#002e4d] mb-2">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage applications, parent details, and system settings from one central location
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  <div className="text-right">
                    <Activity className="h-5 w-5 text-gray-400 mb-1" />
                    <Badge 
                      variant="secondary" 
                      className={`${stat.trendType === 'positive' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            
            return (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${card.hoverColor} border-0 shadow-sm`}
                onClick={() => handleCardClick(card.href)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${card.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {card.stats}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${card.color} hover:bg-transparent text-xs`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(card.href);
                      }}
                    >
                      View Details →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/invite-parent')}
            >
              <div>
                <p className="font-medium text-gray-900">Invite New Parent</p>
                <p className="text-sm text-gray-500 mt-1">Send enrollment invitations</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/application-status')}
            >
              <div>
                <p className="font-medium text-gray-900">Review Applications</p>
                <p className="text-sm text-gray-500 mt-1">Process pending submissions</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/parent-details')}
            >
              <div>
                <p className="font-medium text-gray-900">Parent Directory</p>
                <p className="text-sm text-gray-500 mt-1">Browse all parent profiles</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/forms-repository')}
            >
              <div>
                <p className="font-medium text-gray-900">Manage Forms</p>
                <p className="text-sm text-gray-500 mt-1">Configure form templates</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;