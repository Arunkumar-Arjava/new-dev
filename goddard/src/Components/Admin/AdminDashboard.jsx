import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Settings, ChevronRight, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '../Header';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const signOut = () => {
    console.log('Sign out clicked');
    window.location.href = '/login';
  };

  // Dashboard metrics
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

  return (
    <div className="min-h-screen bg-background">
      <Header onSignOut={signOut} sidebar={true} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage applications, parent details, and system settings from one central location
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </div>
                  <div className="text-right">
                    <Activity className="h-5 w-5 text-muted-foreground mb-1" />
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
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${card.hoverColor} shadow-md`}
                onClick={() => handleCardClick(card.href)}
              >
                <CardHeader className="pb-4 px-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${card.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                
                <CardContent className="px-6 pb-6 pt-0">
                  <CardTitle className="text-lg font-semibold text-foreground mb-3">
                    {card.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="outline" className="text-xs px-3 py-1">
                      {card.stats}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`${card.color} hover:bg-transparent text-xs font-medium`}
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/invite-parent')}
            >
              <div>
                <p className="font-medium text-foreground">Invite New Parent</p>
                <p className="text-sm text-muted-foreground mt-1">Send enrollment invitations</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/application-status')}
            >
              <div>
                <p className="font-medium text-foreground">Review Applications</p>
                <p className="text-sm text-muted-foreground mt-1">Process pending submissions</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/parent-details')}
            >
              <div>
                <p className="font-medium text-foreground">Parent Directory</p>
                <p className="text-sm text-muted-foreground mt-1">Browse all parent profiles</p>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 text-left justify-start"
              onClick={() => navigate('/forms-repository')}
            >
              <div>
                <p className="font-medium text-foreground">Manage Forms</p>
                <p className="text-sm text-muted-foreground mt-1">Configure form templates</p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;