import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, ExternalLink, Users, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import HeaderNew from './components/HeaderNew';


const ApplicationStatusNew = () => {
  const navigate = useNavigate();
  const isAuthenticated = true;
  const signOut = () => {
    console.log('Sign out clicked');
    navigate('/login');
  };
  
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [forms, setForms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('all');
  const [selectedForm, setSelectedForm] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const urlParams = new URLSearchParams(window.location.search);
  const classID = urlParams.get('id') || '';

  useEffect(() => {
    initializePageData();
  }, []);

  const initializePageData = async () => {
    setPageLoading(true);
    try {
      await Promise.all([
        loadClassrooms(),
        loadForms(),
        loadData()
      ]);
    } catch (error) {
      toast.error('Failed to initialize page data');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [data, selectedClassroom, selectedForm, searchTerm]);

  const loadClassrooms = async () => {
    try {
      // Mock classroom data
      const mockData = [
        { class_id: '1', class_name: 'Butterfly' },
        { class_id: '2', class_name: 'Purple' },
        { class_id: '3', class_name: 'Rainbow' },
        { class_id: '4', class_name: 'Sunshine' }
      ];
      
      const classroomOptions = [
        { value: 'all', label: 'All Classrooms', dataValue: 'all' },
        ...mockData.filter(item => item.class_name && item.class_name !== undefined)
          .map(item => ({
            value: item.class_id,
            label: item.class_name,
            dataValue: item.class_name,
            selected: item.class_id === classID
          }))
      ];
      setClassrooms(classroomOptions);
      
      if (classID) {
        setSelectedClassroom(classID);
      }
    } catch (error) {
      toast.error('Failed to load classrooms');
    }
  };

  const loadForms = async () => {
    try {
      // Mock form data
      const mockData = [
        { form_id: '1', form_name: 'Admission Form' },
        { form_id: '2', form_name: 'Enrollment Agreement' },
        { form_id: '3', form_name: 'Parent Handbook' },
        { form_id: '4', form_name: 'Authorization Form' }
      ];
      const formOptions = [
        { value: 'all', label: 'All Forms' },
        ...mockData.filter(item => item.form_name && item.form_name !== undefined)
          .map(item => ({
            value: item.form_id,
            label: item.form_name
          }))
      ];
      setForms(formOptions);
    } catch (error) {
      toast.error('Failed to load forms');
    }
  };

  const loadData = async (formFilter = null, classroomFilter = null) => {
    setLoading(true);
    
    try {
      // Mock application data
      const mockData = [
        {
          child_first_name: 'Emma',
          child_last_name: 'Johnson',
          class_name: 'Butterfly',
          primary_email: 'emma.johnson@email.com',
          additional_parent_email: 'john.johnson@email.com',
          form_status: 'Completed'
        },
        {
          child_first_name: 'Liam',
          child_last_name: 'Smith',
          class_name: 'Purple',
          primary_email: 'sarah.smith@email.com',
          additional_parent_email: '',
          form_status: 'Incomplete'
        },
        {
          child_first_name: 'Olivia',
          child_last_name: 'Brown',
          class_name: 'Rainbow',
          primary_email: 'mike.brown@email.com',
          additional_parent_email: 'lisa.brown@email.com',
          form_status: 'Completed'
        },
        {
          child_first_name: 'Noah',
          child_last_name: 'Davis',
          class_name: 'Sunshine',
          primary_email: 'anna.davis@email.com',
          additional_parent_email: '',
          form_status: 'Incomplete'
        }
      ];

      let responseData = [...mockData];

      // Apply filtering logic
      const isFormAll = formFilter === 'all' || !formFilter;
      const isClassroomAll = classroomFilter === 'all' || !classroomFilter;
      
      if (!isClassroomAll) {
        const selectedClassroom = classrooms.find(c => c.value == classroomFilter);
        const classroomName = selectedClassroom?.dataValue;
        
        if (classroomName && classroomName !== 'all') {
          responseData = responseData.filter(row => row.class_name === classroomName);
        }
      }

      setData(responseData);
    } catch (error) {
      toast.error('Failed to load application data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row => {
        const childName = `${row.child_first_name || ''} ${row.child_last_name || ''}`.toLowerCase();
        const parentEmail = (row.primary_email || '').toLowerCase();
        const parentTwoEmail = (row.additional_parent_email || '').toLowerCase();
        const className = (row.class_name || '').toLowerCase();
        const status = (row.form_status || '').toLowerCase();
        
        return childName.includes(searchTerm.toLowerCase()) ||
               parentEmail.includes(searchTerm.toLowerCase()) ||
               parentTwoEmail.includes(searchTerm.toLowerCase()) ||
               className.includes(searchTerm.toLowerCase()) ||
               status.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleClassroomChange = (value) => {
    setSelectedClassroom(value);
    loadData(selectedForm, value);
  };

  const handleFormChange = (value) => {
    setSelectedForm(value);
    loadData(value, selectedClassroom);
  };

  const exportToExcel = () => {
    const exportData = filteredData.map(row => ({
      'Child Name': `${row.child_first_name || ''} ${row.child_last_name || ''}`.trim(),
      'Child Class Name': row.class_name || 'Unassigned',
      'Parent Email': row.primary_email || '',
      'Parent Two Email': row.additional_parent_email || '',
      'Form Status': row.form_status || ''
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Application_Status.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleRowClick = (row) => {
    if (row.primary_email) {
      navigate(`/parent-dashboard?id=${row.primary_email}`);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    
    if (statusLower.includes('completed')) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    } else if (statusLower.includes('incomplete')) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Incomplete
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          {status || 'Unknown'}
        </Badge>
      );
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getStatsData = () => {
    const completed = filteredData.filter(row => 
      (row.form_status || '').toLowerCase().includes('completed')
    ).length;
    const incomplete = filteredData.filter(row => 
      (row.form_status || '').toLowerCase().includes('incomplete')
    ).length;
    
    return { total: filteredData.length, completed, incomplete };
  };

  const stats = getStatsData();

  // Always render the component since we're using mock authentication
  // if (!isAuthenticated) {
  //   return null;
  // }

  // Show page loading overlay while initial data is loading
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderNew onSignOut={signOut} sidebar={true} component="Application Status" />
        
        <div className="container mx-auto px-4 py-6">
          {/* Header Section Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters Card Skeleton */}
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Table Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-64 mt-1" />
                </div>
                <Skeleton className="h-10 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <TableHead key={index}>
                          <Skeleton className="h-4 w-20" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from({ length: 6 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Loading indicator overlay */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="p-6">
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600">Loading application data...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNew onSignOut={signOut} sidebar={true} component="Application Status" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#002e4d] mb-2">Application Status</h1>
          <p className="text-gray-600">
            Monitor and manage enrollment applications from prospective families
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.completed}</h3>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Incomplete</p>
                  <h3 className="text-2xl font-bold text-yellow-600">{stats.incomplete}</h3>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <CardDescription>
              Filter applications by form type, classroom, or search by name and email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Form Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Form Type</label>
                <Select value={selectedForm} onValueChange={handleFormChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form type" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => (
                      <SelectItem key={form.value} value={form.value}>
                        {form.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Classroom Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Classroom</label>
                <Select value={selectedClassroom} onValueChange={handleClassroomChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((classroom) => (
                      <SelectItem key={classroom.value} value={classroom.value}>
                        {classroom.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Applications ({filteredData.length})
                </CardTitle>
                <CardDescription>
                  Click on any row to view detailed application information
                </CardDescription>
              </div>
              <Button onClick={exportToExcel} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Child Name</TableHead>
                    <TableHead>Classroom</TableHead>
                    <TableHead>Parent Email</TableHead>
                    <TableHead>Additional Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No applications found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentData.map((row, index) => (
                      <TableRow 
                        key={index}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleRowClick(row)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {`${row.child_first_name || ''} ${row.child_last_name || ''}`.trim()}
                            {row.primary_email && (
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {row.class_name || 'Unassigned'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {row.primary_email || '-'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {row.additional_parent_email || '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(row.form_status)}
                        </TableCell>
                        
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationStatusNew;