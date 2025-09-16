import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, ExternalLink, Users, FileText, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { classroomApis, formTemplateApis, enrollmentApis } from '../../services/allApis';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import Header from '../Header';


const ApplicationStatus = () => {
  const navigate = useNavigate();
  const isAuthenticated = true;
  const signOut = () => {
    console.log('Sign out clicked');
    navigate('/login');
  };
  
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
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
      console.log('Fetching classrooms for ApplicationStatus...');
      const response = await classroomApis.getClassrooms();
      console.log('Classrooms response:', response);
      
      // Handle the mock API response structure
      const mockData = response.data.data || response.data;
      console.log('Classrooms data:', mockData);
      
      const classroomOptions = [
        { value: 'all', label: 'All Classrooms', dataValue: 'all' },
        ...mockData.map(item => ({
          value: item.id,
          label: item.name,
          dataValue: item.name,
          selected: item.id === classID
        }))
      ];
      setClassrooms(classroomOptions);
      
      if (classID) {
        setSelectedClassroom(classID);
      }
    } catch (error) {
      console.error('Failed to load classrooms:', error);
      toast.error('Failed to load classrooms');
    }
  };

  const loadForms = async () => {
    try {
      console.log('Fetching form templates for ApplicationStatus...');
      const response = await formTemplateApis.getFormTemplates();
      console.log('Form templates response:', response);
      
      // Handle the mock API response structure
      const mockData = response.data.data || response.data;
      console.log('Form templates data:', mockData);
      
      const formOptions = [
        { value: 'all', label: 'All Forms' },
        ...mockData.map(item => ({
          value: item.id,
          label: item.form_name
        }))
      ];
      setForms(formOptions);
    } catch (error) {
      console.error('Failed to load forms:', error);
      toast.error('Failed to load forms');
    }
  };

  const loadData = async (formFilter = null, classroomFilter = null) => {
    setLoading(true);
    
    try {
      console.log('Fetching enrollments for ApplicationStatus...');
      const response = await enrollmentApis.getEnrollments();
      console.log('Enrollments response:', response);
      
      // Handle the mock API response structure
      const enrollments = response.data.data || response.data;
      console.log('Enrollments data:', enrollments);
      
      let responseData = enrollments.map(enrollment => ({
        child_first_name: enrollment.child?.first_name || '',
        child_last_name: enrollment.child?.last_name || '',
        class_name: enrollment.classroom?.name || 'Unassigned',
        primary_email: enrollment.parent?.email || '',
        additional_parent_email: enrollment.additional_parent?.email || '',
        form_status: enrollment.admin_approval_status === 'approved' ? 'Completed' : 'Incomplete'
      }));

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

      setOriginalData(responseData);
      setData(responseData);
    } catch (error) {
      console.error('Failed to load application data:', error);
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
  const mobileItemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const mobileTotalPages = Math.ceil(filteredData.length / mobileItemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const mobileStartIndex = (currentPage - 1) * mobileItemsPerPage;
  const mobileEndIndex = mobileStartIndex + mobileItemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const mobileCurrentData = filteredData.slice(mobileStartIndex, mobileEndIndex);

  const [stats, setStats] = useState({ total: 0, completed: 0, incomplete: 0 });

  useEffect(() => {
    const completed = filteredData.filter(row => 
      (row.form_status || '').toLowerCase().includes('completed')
    ).length;
    const incomplete = filteredData.filter(row => 
      (row.form_status || '').toLowerCase().includes('incomplete')
    ).length;
    
    setStats({ total: filteredData.length, completed, incomplete });
  }, [filteredData]);

  // Always render the component since we're using mock authentication
  // if (!isAuthenticated) {
  //   return null;
  // }

  // Show page loading overlay while initial data is loading
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSignOut={signOut} sidebar={true} component="Application Status" />
        
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
      <Header onSignOut={signOut} sidebar={true} component="Application Status" />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#002e4d] mb-2">Application Status</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Monitor and manage enrollment applications from prospective families
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Applications</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</h3>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</h3>
                </div>
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Incomplete</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.incomplete}</h3>
                </div>
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-4 sm:mb-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  Applications ({filteredData.length})
                </CardTitle>
                <CardDescription className="text-sm">
                  Click on any row to view detailed application information
                </CardDescription>
              </div>
              <Button onClick={exportToExcel} variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
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
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))
              ) : currentData.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                  No applications found matching your criteria
                </div>
              ) : (
                mobileCurrentData.map((row, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                    onClick={() => handleRowClick(row)}
                  >
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {`${row.child_first_name || ''} ${row.child_last_name || ''}`.trim()}
                        </h3>
                        {row.primary_email && (
                          <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-medium">
                          {row.class_name || 'Unassigned'}
                        </Badge>
                        {getStatusBadge(row.form_status)}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700 min-w-0 flex-shrink-0">Parent:</span>
                        <span className="text-gray-600 truncate">{row.primary_email || '-'}</span>
                      </div>
                      {row.additional_parent_email && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700 min-w-0 flex-shrink-0">Additional:</span>
                          <span className="text-gray-600 truncate">{row.additional_parent_email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {(filteredData.length > itemsPerPage || filteredData.length > mobileItemsPerPage) && (
              <div className="mt-4">
                {filteredData.length > itemsPerPage && (
                  <div className="hidden md:flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 ${page === currentPage ? 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90' : 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]'}`}
                          >
                            {page}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Mobile Pagination */}
                {filteredData.length > mobileItemsPerPage && (
                  <div className="md:hidden">
                    <div className="text-xs text-gray-600 text-center mb-3">
                      Page {currentPage} of {mobileTotalPages} ({filteredData.length} total)
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === mobileTotalPages}
                        className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationStatus;