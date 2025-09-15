import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Clock,
  CheckCircle,
  FileText,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const toast = { 
  success: (msg) => console.log('Success:', msg),
  error: (msg) => console.log('Error:', msg)
};

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [activeChildId, setActiveChildId] = useState(null);
  const [parentName, setParentName] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data
  useEffect(() => {
    // Mock parent data
    setParentName('Sarah Johnson');
    const mockChildren = [
      { child_id: 1, child_first_name: 'Emma', child_last_name: 'Johnson' },
      { child_id: 2, child_first_name: 'Liam', child_last_name: 'Johnson' }
    ];
    setChildren(mockChildren);
    setActiveChildId(mockChildren[0].child_id);
  }, []);

  const handleChildSelect = (childId) => {
    setActiveChildId(childId);
    const selectedChild = children.find(child => child.child_id === childId);
    if (selectedChild) {
      toast.success(`Selected child: ${selectedChild.child_first_name}`);
    }
  };

  const getWelcomeMessage = () => {
    return `Welcome ${parentName}`;
  };

  // Mock statistics
  const getFormStatistics = () => {
    return {
      total: 4,
      completed: 2,
      incomplete: 2,
      progress: 50
    };
  };

  const stats = getFormStatistics();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <Header />

      {/* Welcome Section */}
      <div className="bg-background border-b">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Parent Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mb-6" id="welcomeText">
              {getWelcomeMessage()}
            </p>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
                      <p className="text-2xl font-bold text-primary">{stats.total}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Incomplete</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.incomplete}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.progress}%</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{stats.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Child Tabs */}
      <div className="bg-primary border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {children.map((child) => (
              <Button
                key={child.child_id}
                variant={activeChildId === child.child_id ? "secondary" : "ghost"}
                className={`min-w-fit whitespace-nowrap ${activeChildId === child.child_id
                    ? 'bg-white text-primary hover:bg-gray-100'
                    : 'text-white hover:bg-primary/80'
                  }`}
                onClick={() => handleChildSelect(child.child_id)}
              >
                <Users className="h-4 w-4 mr-2" />
                {child.child_first_name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="w-full">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Dashboard Overview
                    </CardTitle>
                    <CardDescription>
                      Child: {children.find(child => child.child_id === activeChildId)?.child_first_name || 'No child selected'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <label htmlFor="year" className="text-sm font-medium text-foreground">Year:</label>
                      <select
                        name="year"
                        id="year"
                        className="border border-input rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      >
                        {[...Array(11)].map((_, i) => {
                          const year = new Date().getFullYear() - 10 + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Welcome to Parent Dashboard
                  </h3>
                  <p className="text-muted-foreground">
                    Manage your child's enrollment and view important information here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;