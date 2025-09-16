import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { fetchFormTemplates, createFormTemplate, updateFormTemplate, deleteFormTemplate } from '../../lib/centralizedApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import {
  BookOpen,
  Users,
  Plus,
  Pencil,
  Trash2,
  Download,
  School,
  FileText,
  Settings,
  Save,
  Search,
  Filter,
  X
} from 'lucide-react';
const FormsRepository = () => {
  const isAuthenticated = true;
  const signOut = () => {
    console.log('Sign out clicked');
    window.location.href = '/login';
  };

  // Get class_id from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const classID = urlParams.get('id') || '';

  // Classroom management state
  const [classrooms, setClassrooms] = useState([]);
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newFormName, setFormName] = useState('');
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [editClassroomName, setEditClassroomName] = useState('');
  const [deletingClassroom, setDeletingClassroom] = useState(null);

  // Loading states
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(true);
  const [isAddingClassroom, setIsAddingClassroom] = useState(false);

    const [isAddingForm, setIsAddingForm] = useState(false);
  const [isEditingClassroom, setIsEditingClassroom] = useState(false);
  const [isDeletingClassroom, setIsDeletingClassroom] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [forms, setForms] = useState([]);



  // Modal states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditFormDialog, setShowEditFormDialog] = useState(false);
  const [showDeleteFormDialog, setShowDeleteFormDialog] = useState(false);

  // Form management state
  const [editingForm, setEditingForm] = useState(null);
  const [deletingForm, setDeletingForm] = useState(null);
  const [editFormName, setEditFormName] = useState('');
  const [editFormType, setEditFormType] = useState('');
  const [editFormChangeType, setEditFormChangeType] = useState('');

  // Classroom forms state
  const [classroomForms, setClassroomForms] = useState({});

  // Statistics
  const [stats, setStats] = useState({
    totalClassrooms: 0,
    totalChildren: 0,
    activeClassrooms: 0
  });

  // Student Forms state
  const [studentForms, setStudentForms] = useState([]);
  const [availableForms, setAvailableForms] = useState([]);
  const [studentDropdownForms, setStudentDropdownForms] = useState([]);

  useEffect(() => {
    loadClassroomData();
    loadFormsWithMockData();
    loadStudentForms();
    loadAvailableForms();
    loadStudentDropdownForms();
  }, []);

  useEffect(() => {
    // Calculate statistics
    const totalClassrooms = classrooms.length;
    const totalChildren = classrooms.reduce((sum, classroom) => sum + (classroom.count || 0), 0);
    const activeClassrooms = classrooms.filter(classroom => classroom.class_name !== 'Unassign').length;

    setStats({
      totalClassrooms,
      totalChildren,
      activeClassrooms
    });
  }, [classrooms]);


  // Load classroom data with mock data
  const loadClassroomData = async () => {
    setIsLoadingClassrooms(true);
    try {
      // Mock classroom data
      const mockData = [
        {
          class_id: '1',
          class_name: 'Butterfly',
          count: 15,
          forms: { '1': 'admission_form', '2': 'enrollment_agreement' }
        },
        {
          class_id: '2',
          class_name: 'Purple',
          count: 12,
          forms: { '1': 'admission_form', '3': 'parent_handbook' }
        },
        {
          class_id: '3',
          class_name: 'Rainbow',
          count: 18,
          forms: { '1': 'admission_form' }
        },
        {
          class_id: '4',
          class_name: 'Sunshine',
          count: 10,
          forms: { '1': 'admission_form', '4': 'authorization_form' }
        }
      ];
      setClassrooms(mockData || []);

      // Process forms data from mock response
      const formsMap = {};
      mockData.forEach(classroom => {
        const formsList = [];
        if (classroom.forms && Object.keys(classroom.forms).length > 0) {
          Object.values(classroom.forms).forEach(formName => {
            formsList.push(formName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
          });
        }
        formsMap[classroom.class_id] = formsList;
      });
      setClassroomForms(formsMap);
    } catch (error) {
      toast.error('Failed to load classroom data');
    } finally {
      setIsLoadingClassrooms(false);
    }
  };

  // Load classroom forms with mock data
  const loadClassroomForms = async () => {
    try {
      // Mock data already loaded in loadClassroomData
      console.log('Classroom forms loaded from mock data');
    } catch (error) {
      console.log('Failed to load classroom forms');
    }
  };

  // Load forms with mock data
  const loadFormsWithMockData = async () => {
    try {
      const mockForms = [
        { id: '1', formName: 'Admission Form', changeType: 'Active' },
        { id: '2', formName: 'Enrollment Agreement', changeType: 'Default' },
        { id: '3', formName: 'Parent Handbook', changeType: 'Active' },
        { id: '4', formName: 'Authorization Form', changeType: 'Available' },
        { id: '5', formName: 'Medical Form', changeType: 'Active' }
      ];
      setForms(mockForms);
    } catch (error) {
      console.log('Failed to load forms with mock data');
      setForms([]);
    }
  };

  // Load available forms for dropdown with mock data
  const loadAvailableForms = async () => {
    try {
      // Mock available forms data
      const mockData = [
        { form_id: '1', form_name: 'admission_form' },
        { form_id: '2', form_name: 'enrollment_agreement' },
        { form_id: '3', form_name: 'parent_handbook' },
        { form_id: '4', form_name: 'authorization_form' },
        { form_id: '5', form_name: 'medical_form' }
      ];

      const formsList = [];
      if (Array.isArray(mockData)) {
        mockData.forEach(item => {
          if (item.form_name && item.form_id) {
            const formattedName = item.form_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            formsList.push({
              id: item.form_id,
              name: formattedName
            });
          }
        });
      }

      console.log('Final forms list:', formsList);
      setAvailableForms(formsList);
    } catch (error) {
      console.log('Failed to load available forms:', error);
    }
  };

  // Load student forms data with mock data
  const loadStudentForms = async () => {
    try {
      // Mock student forms data
      const mockData = [
        {
          child_id: '1',
          child_first_name: 'Emma',
          class_name: 'Butterfly',
          primary_email: 'emma.parent@email.com',
          forms: { '1': 'admission_form', '2': 'enrollment_agreement' }
        },
        {
          child_id: '2',
          child_first_name: 'Liam',
          class_name: 'Purple',
          primary_email: 'liam.parent@email.com',
          forms: { '1': 'admission_form' }
        },
        {
          child_id: '3',
          child_first_name: 'Olivia',
          class_name: 'Rainbow',
          primary_email: 'olivia.parent@email.com',
          forms: { '1': 'admission_form', '3': 'parent_handbook' }
        }
      ];

      const studentsList = [];
      if (Array.isArray(mockData)) {
        mockData.forEach(item => {
          const formsList = [];
          if (item.forms && Object.keys(item.forms).length > 0) {
            Object.values(item.forms).forEach(formName => {
              formsList.push(formName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
            });
          }

          studentsList.push({
            id: item.child_id,
            childName: item.child_first_name || 'No name',
            classroom: item.class_name || 'Unassigned',
            parentEmail: item.primary_email || 'No email provided',
            forms: formsList
          });
        });
      }

      setStudentForms(studentsList);
    } catch (error) {
      console.log('Failed to load student forms data:', error);
    }
  };

  // Load student dropdown forms with mock data
  const loadStudentDropdownForms = async () => {
    try {
      // Mock dropdown forms
      const mockForms = [
        'Admission Form',
        'Enrollment Agreement',
        'Parent Handbook',
        'Authorization Form',
        'Medical Form'
      ];

      setStudentDropdownForms(mockForms);
    } catch (error) {
      console.log('Failed to load student dropdown forms:', error);
    }
  };

  // add classroom with mock functionality
  const handleAddClassroom = async (e) => {
    e.preventDefault();

    if (!newClassroomName.trim()) {
      toast.error('Please enter a classroom name');
      return;
    }

    setIsAddingClassroom(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful creation
      const newClassroom = {
        class_id: String(classrooms.length + 1),
        class_name: newClassroomName.trim(),
        count: 0,
        forms: { '1': 'admission_form' }
      };
      
      setClassrooms(prev => [...prev, newClassroom]);
      toast.success('Classroom created successfully!');
      setNewClassroomName('');
    } catch (error) {
      toast.error('Error creating classroom');
    } finally {
      setIsAddingClassroom(false);
    }
  };


  // edit classroom with mock functionality
  const handleEditClassroom = async () => {
    setIsEditingClassroom(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update classroom name in classrooms array
      setClassrooms(prev => prev.map(classroom => 
        classroom.class_id === editingClassroom.class_id 
          ? { ...classroom, class_name: editClassroomName.trim() }
          : classroom
      ));

      // Update classroom forms
      setClassroomForms(prev => ({
        ...prev,
        [editingClassroom.class_id]: editingClassroom.forms
      }));

      // Update student forms if classroom name changed
      if (editClassroomName.trim() !== editingClassroom.class_name) {
        setStudentForms(prev => prev.map(student => 
          student.classroom === editingClassroom.class_name
            ? { ...student, classroom: editClassroomName.trim() }
            : student
        ));
      }

      toast.success('Classroom updated successfully!');
      setShowEditDialog(false);
      setEditingClassroom(null);
      setEditClassroomName('');
    } catch (error) {
      console.error('Error updating classroom:', error);
      toast.error('Error updating classroom');
    } finally {
      setIsEditingClassroom(false);
    }
  };

  // delete classroom with mock functionality
  const handleDeleteClassroom = async () => {
    setIsDeletingClassroom(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove classroom from local state
      setClassrooms(prev => prev.filter(c => c.class_id !== deletingClassroom.class_id));
      
      toast.success('Classroom deleted successfully!');
      setShowDeleteDialog(false);
      setDeletingClassroom(null);
    } catch (error) {
      toast.error('Error deleting classroom');
    } finally {
      setIsDeletingClassroom(false);
    }
  };



  const openEditDialog = (classroom) => {
    const currentForms = classroomForms[classroom.class_id] || ['Admission Form'];
    setEditingClassroom({ ...classroom, forms: currentForms });
    setEditClassroomName(classroom.class_name);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (classroom) => {
    setDeletingClassroom(classroom);
    setShowDeleteDialog(true);
  };

  const openEditFormDialog = (form) => {
    console.log(form)
    setEditingForm(form);
    setEditFormName(form.formName);
    setEditFormType(form.type);
    setEditFormChangeType(form.changeType);
    setShowEditFormDialog(true);
  };

  const openDeleteFormDialog = (form) => {
    setDeletingForm(form);
    setShowDeleteFormDialog(true);
  };

  const handleEditForm = async () => {
    if (!editFormName.trim()) {
      toast.error('Please enter a form name');
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const oldFormName = editingForm.formName;
      const newFormName = editFormName.trim();
      
      // Update forms array
      setForms(prev => prev.map(form =>
        form.id === editingForm.id
          ? { ...form, formName: newFormName, changeType: editFormChangeType }
          : form
      ));

      // Update available forms if name changed
      if (oldFormName !== newFormName) {
        setAvailableForms(prev => prev.map(form =>
          form.name === oldFormName
            ? { ...form, name: newFormName }
            : form
        ));

        // Update student dropdown forms
        setStudentDropdownForms(prev => prev.map(form =>
          form === oldFormName ? newFormName : form
        ));

        // Update classroom forms
        setClassroomForms(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(classId => {
            updated[classId] = updated[classId].map(form =>
              form === oldFormName ? newFormName : form
            );
          });
          return updated;
        });

        // Update student forms
        setStudentForms(prev => prev.map(student => ({
          ...student,
          forms: student.forms.map(form => form === oldFormName ? newFormName : form)
        })));
      }

      toast.success('Form updated successfully!');
      setShowEditFormDialog(false);
      setEditingForm(null);
      setEditFormName('');
      setEditFormType('');
      setEditFormChangeType('');
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Error updating form');
    }
  };

  const handleAddForm = async (e) => {
    e.preventDefault();

    if (!newFormName.trim()) {
      toast.error('Please enter a form name');
      return;
    }

    setIsAddingForm(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newForm = {
        id: String(forms.length + 1),
        formName: newFormName.trim(),
        changeType: 'Active'
      };
      
      const formattedName = newFormName.trim().replace(/\b\w/g, l => l.toUpperCase());
      
      // Update forms list
      setForms(prev => [...prev, newForm]);
      
      // Update available forms for dropdowns
      setAvailableForms(prev => [...prev, {
        id: newForm.id,
        name: formattedName
      }]);
      
      // Update student dropdown forms
      setStudentDropdownForms(prev => [...prev, formattedName]);
      
      toast.success('Form created successfully!');
      setFormName('');
    } catch (error) {
      toast.error('Error creating form');
    } finally {
      setIsAddingForm(false);
    }
  };

  const handleDeleteForm = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedForms = forms.filter(form => form.id !== deletingForm.id);
      setForms(updatedForms);
      
      // Also remove from available forms and student dropdown
      setAvailableForms(prev => prev.filter(form => form.id !== deletingForm.id));
      setStudentDropdownForms(prev => prev.filter(form => form !== deletingForm.formName));
      
      toast.success('Form deleted successfully!');
      setShowDeleteFormDialog(false);
      setDeletingForm(null);
    } catch (error) {
      toast.error('Error deleting form');
    }
  };

  const handleDeleteStudentForm = async (student, form) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedForms = [...studentForms];
      const studentIndex = updatedForms.findIndex(s => s.id === student.id);
      updatedForms[studentIndex].forms = updatedForms[studentIndex].forms.filter(f => f !== form);
      setStudentForms(updatedForms);
      toast.success('Form removed successfully!');
    } catch (error) {
      toast.error('Error removing form');
    }
  };

  const handleExportClassrooms = () => {
    const exportData = classrooms.map(classroom => ({
      'Classroom Name': classroom.class_name || '',
      'Student Count': classroom.count || 0,
      'Status': classroom.class_name === 'Unassign' ? 'Unassigned' : 'Active'
    }));

    if (window.XLSX) {
      const ws = window.XLSX.utils.json_to_sheet(exportData);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, 'Classrooms');
      window.XLSX.writeFile(wb, 'Classrooms.xlsx');
    } else {
      // Fallback to CSV
      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Classrooms.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    toast.success('Export completed successfully!');
  };

  // Always render the component since we're using mock authentication
  // if (!isAuthenticated) {
  //   return null;
  // }

  console.log(forms)

  return (
    <div className="min-h-screen bg-gray-50 mb-5">
      <Header onSignOut={signOut} sidebar={true} component="Forms Repository" />

      <div className="container mx-auto pt-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forms & Classroom Repository</h1>
            <p className="text-gray-600 mt-1">Manage classrooms, forms, and educational resources</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Classrooms</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalClassrooms}</p>
                </div>
                <School className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalChildren}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Classrooms</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.activeClassrooms}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="classroom" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
            <TabsTrigger value="classroom" className="flex items-center gap-2 text-xs sm:text-sm">
              <School className="w-4 h-4" />
              <span className="hidden sm:inline">Classroom Repository</span>
              <span className="sm:hidden">Classrooms</span>
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center gap-2 text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Forms Repository</span>
              <span className="sm:hidden">Forms</span>
            </TabsTrigger>
            <TabsTrigger value="student-forms" className="flex items-center gap-2 text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Student Form Repo</span>
              <span className="sm:hidden">Students</span>
            </TabsTrigger>
          </TabsList>

          {/* Classroom Repository Tab */}
          <TabsContent value="classroom" className="space-y-6">
            {/* Add Classroom Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#002e4d]" />
                  Add New Classroom
                </CardTitle>
                <CardDescription>
                  Create a new classroom to organize students and manage educational activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddClassroom} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="classroom-name">Classroom Name</Label>
                    <Input
                      id="classroom-name"
                      placeholder="Enter classroom name (e.g., Butterfly, Purple, etc.)"
                      value={newClassroomName}
                      onChange={(e) => setNewClassroomName(e.target.value)}
                      className="mt-1"
                      disabled={isAddingClassroom}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isAddingClassroom}
                    className="bg-[#002e4d] hover:bg-[#002e4d]/90 sm:mt-6 w-full sm:w-auto"
                  >
                    {isAddingClassroom ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Add Classroom</span>
                        <span className="sm:hidden">Add</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Classrooms Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Classroom Management</CardTitle>
                    <CardDescription>View and manage all classroom information</CardDescription>
                  </div>
                  <Button variant="outline" onClick={handleExportClassrooms}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {/* Mobile Card View */}
                <div className="block sm:hidden">
                  <div className="space-y-3 max-w-md mx-auto">
                    {isLoadingClassrooms ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-4 w-16 mb-2" />
                          <Skeleton className="h-6 w-60" />
                        </div>
                      ))
                    ) : classrooms.length === 0 ? (
                      <div className="text-center py-8">
                        <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm font-medium">No classrooms found</p>
                        <p className="text-gray-400 text-xs">Create your first classroom to get started</p>
                      </div>
                    ) : (
                      classrooms.map((classroom) => (
                        <div key={classroom.class_id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-[#002e4d] rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-gray-900 text-sm leading-tight break-words">{classroom.class_name}</h3>
                                <p className="text-xs text-gray-500">{classroom.count || 0} students</p>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditDialog(classroom)}
                                disabled={classroom.class_name === 'Unassign'}
                                className="h-7 w-7 p-0 hover:bg-gray-100"
                              >
                                <Pencil className="w-3 h-3 text-gray-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openDeleteDialog(classroom)}
                                disabled={classroom.class_name === 'Unassign'}
                                className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-600">Status</span>
                            {classroom.class_name === 'Unassign' ? (
                              <Badge variant="outline" className="text-gray-600 border-gray-600 text-xs">
                                Unassigned
                              </Badge>
                            ) : (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-xs">
                                Active
                              </Badge>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-xs text-gray-600 mb-1 block">Forms</span>
                            <div className="flex flex-wrap gap-1">
                              {(classroomForms[classroom.class_id] || []).length > 0 ? (
                                classroomForms[classroom.class_id].map((form, index) => (
                                  <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5">
                                    {form}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs">No forms assigned</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Classroom Name</TableHead>
                        <TableHead>Student Count</TableHead>
                        <TableHead>Forms</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingClassrooms ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-60" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                          </TableRow>
                        ))
                      ) : classrooms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No classrooms found
                          </TableCell>
                        </TableRow>
                      ) : (
                        classrooms.map((classroom) => (
                          <TableRow key={classroom.class_id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-[#002e4d]" />
                                {classroom.class_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                {classroom.count || 0} students
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-2">
                                {(classroomForms[classroom.class_id] || []).length > 0 ? (
                                  classroomForms[classroom.class_id].map((form, index) => (
                                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                                      {form}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-gray-500 text-sm">No forms assigned</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {classroom.class_name === 'Unassign' ? (
                                <Badge variant="outline" className="text-gray-600 border-gray-600">
                                  Unassigned
                                </Badge>
                              ) : (
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                  Active
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditDialog(classroom)}
                                  disabled={classroom.class_name === 'Unassign'}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openDeleteDialog(classroom)}
                                  disabled={classroom.class_name === 'Unassign'}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Repository Tab */}
          {/* Forms Repository Tab */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#002e4d]" />
                  Add New Form
                </CardTitle>
                <CardDescription>
                  Create a new form to organize students and manage educational activities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddForm} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="Form-name">Form Name</Label>
                    <Input
                      id="Form-name"
                      placeholder="Enter form name"
                      value={newFormName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="mt-1"
                      disabled={isAddingForm}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isAddingForm}
                    className="bg-[#002e4d] hover:bg-[#002e4d]/90 sm:mt-6 w-full sm:w-auto"
                  >
                    {isAddingForm ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Add Form</span>
                        <span className="sm:hidden">Add</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#002e4d]" />
                      Forms Repository
                    </CardTitle>
                    <CardDescription>
                      Manage enrollment forms, parent handbooks, and other educational documents.
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search forms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-48">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Default">Default</SelectItem>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Archive">Archive</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" className="whitespace-nowrap">
                        <Download className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Mobile Card View */}
                <div className="block sm:hidden">
                  <div className="space-y-3">
                    {forms
                      .filter(form => {
                        const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                        const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                        const matchesType = typeFilter === 'All' || displayType === typeFilter;
                        return matchesSearch && matchesType;
                      })
                      .map((form, index) => (
                        <div key={form.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-[#002e4d] rounded-full flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-gray-500 flex-shrink-0">#{index + 1}</span>
                                </div>
                                <h3 className="font-medium text-gray-900 text-sm leading-tight break-words">{form.formName}</h3>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openEditFormDialog(form)}
                                className="h-7 w-7 p-0 hover:bg-gray-100"
                              >
                                <Pencil className="w-3 h-3 text-gray-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openDeleteFormDialog(form)}
                                className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-600">Status</span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                form.changeType === 'Active' ? 'bg-green-100 text-green-700' :
                                form.changeType === 'Default' ? 'bg-blue-100 text-blue-700' :
                                form.changeType === 'Archive' ? 'bg-gray-100 text-gray-700' :
                                'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {form.changeType}
                            </Badge>
                          </div>
                        </div>
                      ))
                    }
                    {forms.filter(form => {
                      const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                      const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                      const matchesType = typeFilter === 'All' || displayType === typeFilter;
                      return matchesSearch && matchesType;
                    }).length === 0 && (
                      <div className="text-center py-8">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm font-medium">No forms found</p>
                        <p className="text-gray-400 text-xs">Try adjusting your search or filter</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No</TableHead>
                        <TableHead>Form Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {forms
                        .filter(form => {
                          const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                          const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                          const matchesType = typeFilter === 'All' || displayType === typeFilter;
                          return matchesSearch && matchesType;
                        })
                        .map((form, index) => (
                          <TableRow key={form.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#002e4d]" />
                                {form.formName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700"
                              >
                                {form.changeType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditFormDialog(form)}
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openDeleteFormDialog(form)}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                      {forms.filter(form => {
                        const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                        const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                        const matchesType = typeFilter === 'All' || displayType === typeFilter;
                        return matchesSearch && matchesType;
                      }).length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No forms found
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Form Repository Tab */}
          <TabsContent value="student-forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#002e4d]" />
                  Student Form Repository
                </CardTitle>
                <CardDescription>
                  Manage student forms and track completion status for each child.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mobile Card View */}
                <div className="block sm:hidden">
                  <div className="space-y-3 max-w-md mx-auto">
                    {studentForms.map((student) => (
                      <div key={student.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="w-8 h-8 bg-[#002e4d] rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 text-sm leading-tight break-words">{student.childName}</h3>
                              <p className="text-xs text-gray-500 truncate">{student.parentEmail}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs flex-shrink-0">
                            {student.classroom}
                          </Badge>
                        </div>
                        
                        <div className="mb-3 pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-600 mb-1 block">Forms</span>
                          <div className="flex flex-wrap gap-1">
                            {student.forms.length > 0 ? (
                              student.forms.map((form, index) => (
                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1 px-2 py-0.5 text-xs">
                                  <span>{form}</span>
                                  <button
                                    onClick={() => handleDeleteStudentForm(student, form)}
                                    className="ml-1 hover:bg-red-200 rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="w-2 h-2" />
                                  </button>
                                </Badge>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">No forms assigned</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Select
                            key={`mobile-${student.id}-${student.forms.length}`}
                            onValueChange={async (value) => {
                              if (value) {
                                const updatedForms = [...studentForms];
                                const studentIndex = updatedForms.findIndex(s => s.id === student.id);

                                if (!updatedForms[studentIndex].forms.includes(value)) {
                                  try {
                                    await new Promise(resolve => setTimeout(resolve, 500));
                                    updatedForms[studentIndex].forms.push(value);
                                    setStudentForms(updatedForms);
                                    toast.success('Form added successfully!');
                                  } catch (error) {
                                    toast.error('Error adding form');
                                  }
                                }
                              }
                            }}
                          >
                            <SelectTrigger className="w-full h-8 text-xs">
                              <SelectValue placeholder="+ Add Form" />
                            </SelectTrigger>
                            <SelectContent>
                              {studentDropdownForms
                                .filter(form => !student.forms.includes(form))
                                .map((form, index) => (
                                  <SelectItem key={index} value={form}>{form}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Child Name</TableHead>
                        <TableHead>Classroom</TableHead>
                        <TableHead>Parent Email</TableHead>
                        <TableHead>Forms</TableHead>
                        <TableHead>Add Form</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentForms.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.childName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {student.classroom}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{student.parentEmail}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {student.forms.map((form, index) => (
                                <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1 px-3 py-1">
                                  <span>{form}</span>
                                  <button
                                    onClick={() => handleDeleteStudentForm(student, form)}
                                    className="ml-1 hover:bg-red-200 rounded-full p-0.5 transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="w-48">
                            <Select
                              key={`desktop-${student.id}-${student.forms.length}`}
                              onValueChange={async (value) => {
                                if (value) {
                                  const updatedForms = [...studentForms];
                                  const studentIndex = updatedForms.findIndex(s => s.id === student.id);

                                  if (!updatedForms[studentIndex].forms.includes(value)) {
                                    try {
                                      await new Promise(resolve => setTimeout(resolve, 500));
                                      updatedForms[studentIndex].forms.push(value);
                                      setStudentForms(updatedForms);
                                      toast.success('Form added successfully!');
                                    } catch (error) {
                                      toast.error('Error adding form');
                                    }
                                  }
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Form" />
                              </SelectTrigger>
                              <SelectContent>
                                {studentDropdownForms
                                  .filter(form => !student.forms.includes(form))
                                  .map((form, index) => (
                                    <SelectItem key={index} value={form}>{form}</SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Classroom Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Classroom</DialogTitle>
            <DialogDescription>
              Update classroom information and manage assigned forms.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="classroom" className="py-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="classroom" className="flex items-center gap-2">
                <School className="w-4 h-4" />
                Classroom Info
              </TabsTrigger>
              <TabsTrigger value="forms" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Forms Management
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="classroom" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="edit-classroom-name">Classroom Name</Label>
                <Input
                  id="edit-classroom-name"
                  value={editClassroomName}
                  onChange={(e) => setEditClassroomName(e.target.value)}
                  className="mt-1"
                  disabled={isEditingClassroom}
                  placeholder="Enter classroom name"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="forms" className="space-y-4 mt-4">
              <div>
                <Label>Assigned Forms</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                    {(editingClassroom?.forms || ['Admission Form']).length > 0 ? (
                      (editingClassroom?.forms || ['Admission Form']).map((form, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1 px-3 py-1">
                          <span>{form}</span>
                          <button
                            onClick={() => {
                              const updatedForms = (editingClassroom?.forms || ['Admission Form']).filter(f => f !== form);
                              setEditingClassroom({ ...editingClassroom, forms: updatedForms });
                            }}
                            className="ml-1 hover:bg-red-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No forms assigned</span>
                    )}
                  </div>

                  <div>
                    <Label>Add New Form</Label>
                    <Select
                      key={`classroom-forms-${editingClassroom?.forms?.length || 0}`}
                      onValueChange={(value) => {
                        if (value) {
                          const currentForms = editingClassroom?.forms || ['Admission Form'];
                          if (!currentForms.includes(value)) {
                            setEditingClassroom({ ...editingClassroom, forms: [...currentForms, value] });
                          }
                        }
                      }}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select a form to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableForms
                          .filter(form => !(editingClassroom?.forms || ['Admission Form']).includes(form.name))
                          .map((form, index) => (
                            <SelectItem key={index} value={form.name}>{form.name}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditClassroom}
              disabled={isEditingClassroom}
              className="bg-[#002e4d] hover:bg-[#002e4d]/90"
            >
              {isEditingClassroom ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={showEditFormDialog} onOpenChange={setShowEditFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Form</DialogTitle>
            <DialogDescription>
              Update the form details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="edit-form-name">Form Name</Label>
              <Input
                id="edit-form-name"
                value={editFormName}
                onChange={(e) => setEditFormName(e.target.value)}
                className="mt-1"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="edit-form-status">Status</Label>
              <Select value={editFormChangeType} onValueChange={setEditFormChangeType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Default</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFormDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditForm} className="bg-[#002e4d] hover:bg-[#002e4d]/90">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Form Dialog */}
      <Dialog open={showDeleteFormDialog} onOpenChange={setShowDeleteFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingForm?.formName}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteFormDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteForm}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Classroom</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingClassroom?.class_name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteClassroom}
              disabled={isDeletingClassroom}
            >
              {isDeletingClassroom ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormsRepository;