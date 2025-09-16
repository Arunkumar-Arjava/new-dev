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
  X,
  ChevronLeft,
  ChevronRight
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
  const [currentPage, setCurrentPage] = useState(1);
  const [desktopCurrentPage, setDesktopCurrentPage] = useState(1);
  const [classroomCurrentPage, setClassroomCurrentPage] = useState(1);
  const [classroomDesktopCurrentPage, setClassroomDesktopCurrentPage] = useState(1);
  const [studentCurrentPage, setStudentCurrentPage] = useState(1);
  const [studentDesktopCurrentPage, setStudentDesktopCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const desktopItemsPerPage = 10;
  const classroomItemsPerPage = 5;
  const classroomDesktopItemsPerPage = 10;
  const studentItemsPerPage = 5;
  const studentDesktopItemsPerPage = 10;



  // Modal states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditFormDialog, setShowEditFormDialog] = useState(false);
  const [showDeleteFormDialog, setShowDeleteFormDialog] = useState(false);
  const [showStudentFormsDialog, setShowStudentFormsDialog] = useState(false);
  const [showDeleteStudentFormDialog, setShowDeleteStudentFormDialog] = useState(false);
  const [showDeleteStudentDialog, setShowDeleteStudentDialog] = useState(false);

  // Form management state
  const [editingForm, setEditingForm] = useState(null);
  const [deletingForm, setDeletingForm] = useState(null);
  const [editFormName, setEditFormName] = useState('');
  const [editFormType, setEditFormType] = useState('');
  const [editFormChangeType, setEditFormChangeType] = useState('');

  // Student form management state
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudentForm, setDeletingStudentForm] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

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
        },
        {
          class_id: '5',
          class_name: 'Starfish',
          count: 14,
          forms: { '1': 'admission_form', '2': 'enrollment_agreement', '5': 'medical_form' }
        },
        {
          class_id: '6',
          class_name: 'Dolphin',
          count: 16,
          forms: { '1': 'admission_form', '3': 'parent_handbook' }
        },
        {
          class_id: '7',
          class_name: 'Eagle',
          count: 11,
          forms: { '1': 'admission_form', '4': 'authorization_form', '5': 'medical_form' }
        },
        {
          class_id: '8',
          class_name: 'Tiger',
          count: 13,
          forms: { '1': 'admission_form', '2': 'enrollment_agreement' }
        },
        {
          class_id: '9',
          class_name: 'Lion',
          count: 17,
          forms: { '1': 'admission_form', '3': 'parent_handbook', '4': 'authorization_form' }
        },
        {
          class_id: '10',
          class_name: 'Elephant',
          count: 9,
          forms: { '1': 'admission_form' }
        },
        {
          class_id: '11',
          class_name: 'Giraffe',
          count: 20,
          forms: { '1': 'admission_form', '2': 'enrollment_agreement', '5': 'medical_form' }
        },
        {
          class_id: '12',
          class_name: 'Zebra',
          count: 8,
          forms: { '1': 'admission_form', '3': 'parent_handbook' }
        },
        {
          class_id: '13',
          class_name: 'Panda',
          count: 15,
          forms: { '1': 'admission_form', '4': 'authorization_form' }
        },
        {
          class_id: '14',
          class_name: 'Koala',
          count: 12,
          forms: { '1': 'admission_form', '2': 'enrollment_agreement', '3': 'parent_handbook' }
        },
        {
          class_id: '15',
          class_name: 'Kangaroo',
          count: 19,
          forms: { '1': 'admission_form', '5': 'medical_form' }
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
        { id: '5', formName: 'Medical Form', changeType: 'Active' },
        { id: '6', formName: 'Emergency Contact Form', changeType: 'Default' },
        { id: '7', formName: 'Field Trip Permission', changeType: 'Available' },
        { id: '8', formName: 'Allergy Information', changeType: 'Active' },
        { id: '9', formName: 'Photo Release Form', changeType: 'Archive' },
        { id: '10', formName: 'Transportation Form', changeType: 'Default' },
        { id: '11', formName: 'Immunization Record', changeType: 'Active' },
        { id: '12', formName: 'Behavioral Plan', changeType: 'Available' },
        { id: '13', formName: 'Pickup Authorization', changeType: 'Active' },
        { id: '14', formName: 'Tuition Agreement', changeType: 'Default' },
        { id: '15', formName: 'Supply List Form', changeType: 'Archive' }
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
        },
        {
          child_id: '4',
          child_first_name: 'Noah',
          class_name: 'Sunshine',
          primary_email: 'noah.parent@email.com',
          forms: { '1': 'admission_form', '4': 'authorization_form' }
        },
        {
          child_id: '5',
          child_first_name: 'Ava',
          class_name: 'Starfish',
          primary_email: 'ava.parent@email.com',
          forms: { '1': 'admission_form', '2': 'enrollment_agreement', '5': 'medical_form' }
        },
        {
          child_id: '6',
          child_first_name: 'William',
          class_name: 'Dolphin',
          primary_email: 'william.parent@email.com',
          forms: { '1': 'admission_form' }
        },
        {
          child_id: '7',
          child_first_name: 'Sophia',
          class_name: 'Eagle',
          primary_email: 'sophia.parent@email.com',
          forms: { '1': 'admission_form', '3': 'parent_handbook' }
        },
        {
          child_id: '8',
          child_first_name: 'James',
          class_name: 'Tiger',
          primary_email: 'james.parent@email.com',
          forms: { '1': 'admission_form', '2': 'enrollment_agreement' }
        },
        {
          child_id: '9',
          child_first_name: 'Isabella',
          class_name: 'Lion',
          primary_email: 'isabella.parent@email.com',
          forms: { '1': 'admission_form', '4': 'authorization_form', '5': 'medical_form' }
        },
        {
          child_id: '10',
          child_first_name: 'Benjamin',
          class_name: 'Elephant',
          primary_email: 'benjamin.parent@email.com',
          forms: { '1': 'admission_form' }
        },
        {
          child_id: '11',
          child_first_name: 'Charlotte',
          class_name: 'Giraffe',
          primary_email: 'charlotte.parent@email.com',
          forms: { '1': 'admission_form', '2': 'enrollment_agreement' }
        },
        {
          child_id: '12',
          child_first_name: 'Lucas',
          class_name: 'Zebra',
          primary_email: 'lucas.parent@email.com',
          forms: { '1': 'admission_form', '3': 'parent_handbook' }
        },
        {
          child_id: '13',
          child_first_name: 'Amelia',
          class_name: 'Panda',
          primary_email: 'amelia.parent@email.com',
          forms: { '1': 'admission_form', '4': 'authorization_form' }
        },
        {
          child_id: '14',
          child_first_name: 'Henry',
          class_name: 'Koala',
          primary_email: 'henry.parent@email.com',
          forms: { '1': 'admission_form', '2': 'enrollment_agreement', '3': 'parent_handbook' }
        },
        {
          child_id: '15',
          child_first_name: 'Mia',
          class_name: 'Kangaroo',
          primary_email: 'mia.parent@email.com',
          forms: { '1': 'admission_form', '5': 'medical_form' }
        },
        {
          child_id: '16',
          child_first_name: 'Alexander',
          class_name: 'Butterfly',
          primary_email: 'alexander.parent@email.com',
          forms: { '1': 'admission_form' }
        },
        {
          child_id: '17',
          child_first_name: 'Harper',
          class_name: 'Purple',
          primary_email: 'harper.parent@email.com',
          forms: { '1': 'admission_form', '3': 'parent_handbook' }
        },
        {
          child_id: '18',
          child_first_name: 'Ethan',
          class_name: 'Rainbow',
          primary_email: 'ethan.parent@email.com',
          forms: { '1': 'admission_form', '2': 'enrollment_agreement' }
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

      // Remove the deleted form from all student assignments
      setStudentForms(prev => prev.map(student => ({
        ...student,
        forms: student.forms.filter(form => form !== deletingForm.formName)
      })));

      toast.success('Form deleted successfully!');
      setShowDeleteFormDialog(false);
      setDeletingForm(null);
    } catch (error) {
      toast.error('Error deleting form');
    }
  };

  const openStudentFormsDialog = (student) => {
    setEditingStudent(student);
    setShowStudentFormsDialog(true);
  };

  const openDeleteStudentFormDialog = (student, form) => {
    setDeletingStudentForm({ student, form });
    setShowDeleteStudentFormDialog(true);
  };

  const openDeleteStudentDialog = (student) => {
    setDeletingStudent(student);
    setShowDeleteStudentDialog(true);
  };

  const handleDeleteStudentForm = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const { student, form } = deletingStudentForm;
      const updatedForms = [...studentForms];
      const studentIndex = updatedForms.findIndex(s => s.id === student.id);
      updatedForms[studentIndex].forms = updatedForms[studentIndex].forms.filter(f => f !== form);
      setStudentForms(updatedForms);
      toast.success('Form removed successfully!');
      setShowDeleteStudentFormDialog(false);
      setDeletingStudentForm(null);
    } catch (error) {
      toast.error('Error removing form');
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedStudents = studentForms.filter(student => student.id !== deletingStudent.id);
      setStudentForms(updatedStudents);
      toast.success('Student removed successfully!');
      setShowDeleteStudentDialog(false);
      setDeletingStudent(null);
    } catch (error) {
      toast.error('Error removing student');
    }
  };

  const handleAddStudentForm = async (formName) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedForms = [...studentForms];
      const studentIndex = updatedForms.findIndex(s => s.id === editingStudent.id);

      if (!updatedForms[studentIndex].forms.includes(formName)) {
        updatedForms[studentIndex].forms.push(formName);
        setStudentForms(updatedForms);
        setEditingStudent({ ...editingStudent, forms: updatedForms[studentIndex].forms });
        toast.success('Form added successfully!');
      }
    } catch (error) {
      toast.error('Error adding form');
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
                  {(() => {
                    const startIndex = (classroomCurrentPage - 1) * classroomItemsPerPage;
                    const endIndex = Math.min(startIndex + classroomItemsPerPage, classrooms.length);
                    return (
                      <div className="mb-3 text-sm text-gray-600">
                        Showing {startIndex + 1}-{endIndex} of {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}
                      </div>
                    );
                  })()}
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
                      (() => {
                        const startIndex = (classroomCurrentPage - 1) * classroomItemsPerPage;
                        const endIndex = startIndex + classroomItemsPerPage;
                        const paginatedClassrooms = classrooms.slice(startIndex, endIndex);
                        return paginatedClassrooms.map((classroom, index) => (
                          <div key={classroom.class_id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 bg-[#002e4d] rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-white" />
                              </div>
                              <div className="w-full">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 flex-shrink-0">#{startIndex + index + 1}</span>
                                  <h3 className="font-medium text-gray-900 text-sm leading-tight break-words">{classroom.class_name}</h3>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
                              <span className="text-xs text-gray-600">Students</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                {classroom.count || 0} students
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
                              <span className="text-xs text-gray-600">Status</span>
                              {classroom.class_name === 'Unassign' ? (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                                  Unassigned
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>

                            <div className="mb-3 pt-2 border-t border-gray-100">
                              <span className="text-xs text-gray-600 mb-1 block">Forms</span>
                              <div className="flex flex-wrap gap-1">
                                {(classroomForms[classroom.class_id] || []).length > 0 ? (
                                  classroomForms[classroom.class_id].map((form, index) => (
                                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                                      {form}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs">No forms assigned</span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditDialog(classroom)}
                                disabled={classroom.class_name === 'Unassign'}
                                className="flex-1 h-8 text-xs"
                              >
                                <Pencil className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDeleteDialog(classroom)}
                                disabled={classroom.class_name === 'Unassign'}
                                className="flex-1 h-8 text-xs text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ));
                      })()
                    )}
                  </div>
                  
                  {(() => {
                    const totalPages = Math.ceil(classrooms.length / classroomItemsPerPage);
                    return totalPages > 1 && (
                      <div className="mt-4">
                        <div className="text-xs text-gray-600 text-center mb-3">
                          Page {classroomCurrentPage} of {totalPages} ({classrooms.length} total)
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setClassroomCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={classroomCurrentPage === 1}
                            className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setClassroomCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={classroomCurrentPage === totalPages}
                            className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  {(() => {
                    const startIndex = (classroomDesktopCurrentPage - 1) * classroomDesktopItemsPerPage;
                    const endIndex = Math.min(startIndex + classroomDesktopItemsPerPage, classrooms.length);
                    return (
                      <div className="mb-3 text-sm text-gray-600">
                        Showing {startIndex + 1}-{endIndex} of {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}
                      </div>
                    );
                  })()}
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>S.No</TableHead>
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
                              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-60" /></TableCell>
                              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                              <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                            </TableRow>
                          ))
                        ) : classrooms.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No classrooms found
                            </TableCell>
                          </TableRow>
                        ) : (
                          (() => {
                            const startIndex = (classroomDesktopCurrentPage - 1) * classroomDesktopItemsPerPage;
                            const endIndex = startIndex + classroomDesktopItemsPerPage;
                            const paginatedClassrooms = classrooms.slice(startIndex, endIndex);
                            return paginatedClassrooms.map((classroom, index) => (
                            <TableRow key={classroom.class_id}>
                              <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
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
                            ));
                          })()
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {(() => {
                    const totalPages = Math.ceil(classrooms.length / classroomDesktopItemsPerPage);
                    const startIndex = (classroomDesktopCurrentPage - 1) * classroomDesktopItemsPerPage;
                    const endIndex = Math.min(startIndex + classroomDesktopItemsPerPage, classrooms.length);
                    return totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to {endIndex} of {classrooms.length} results
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setClassroomDesktopCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={classroomDesktopCurrentPage === 1}
                            className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={page === classroomDesktopCurrentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setClassroomDesktopCurrentPage(page)}
                                className={`w-8 ${page === classroomDesktopCurrentPage ? 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90' : 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]'}`}
                              >
                                {page}
                              </Button>
                            );
                          })}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setClassroomDesktopCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={classroomDesktopCurrentPage === totalPages}
                            className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
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
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                          setDesktopCurrentPage(1);
                        }}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Select value={typeFilter} onValueChange={(value) => {
                        setTypeFilter(value);
                        setCurrentPage(1);
                        setDesktopCurrentPage(1);
                      }}>
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
                  {(() => {
                    const filteredForms = forms.filter(form => {
                      const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                      const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                      const matchesType = typeFilter === 'All' || displayType === typeFilter;
                      return matchesSearch && matchesType;
                    });
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = Math.min(startIndex + itemsPerPage, filteredForms.length);
                    return (
                      <div className="mb-3 text-sm text-gray-600">
                        Showing {startIndex + 1}-{endIndex} of {filteredForms.length} form{filteredForms.length !== 1 ? 's' : ''}
                      </div>
                    );
                  })()}
                  <div className="space-y-3">
                    {(() => {
                      const filteredForms = forms.filter(form => {
                        const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                        const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                        const matchesType = typeFilter === 'All' || displayType === typeFilter;
                        return matchesSearch && matchesType;
                      });
                      const startIndex = (currentPage - 1) * itemsPerPage;
                      const endIndex = startIndex + itemsPerPage;
                      const paginatedForms = filteredForms.slice(startIndex, endIndex);
                      return paginatedForms.map((form, index) => (
                        <div key={form.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-[#002e4d] rounded-full flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-full">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 flex-shrink-0">#{startIndex + index + 1}</span>
                                <h3 className="font-medium text-gray-900 text-sm leading-tight break-words">{form.formName}</h3>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-600">Status</span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${form.changeType === 'Active' ? 'bg-green-100 text-green-700' :
                                  form.changeType === 'Default' ? 'bg-blue-100 text-blue-700' :
                                    form.changeType === 'Archive' ? 'bg-gray-100 text-gray-700' :
                                      'bg-orange-100 text-orange-700'
                                }`}
                            >
                              {form.changeType}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditFormDialog(form)}
                              className="flex-1 h-8 text-xs"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDeleteFormDialog(form)}
                              className="flex-1 h-8 text-xs text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ));
                    })()}
                    {(() => {
                      const filteredForms = forms.filter(form => {
                        const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                        const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                        const matchesType = typeFilter === 'All' || displayType === typeFilter;
                        return matchesSearch && matchesType;
                      });
                      return filteredForms.length === 0 && (
                        <div className="text-center py-8">
                          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm font-medium">No forms found</p>
                          <p className="text-gray-400 text-xs">Try adjusting your search or filter</p>
                        </div>
                      );
                    })()} 
                  </div>
                  
                  {(() => {
                    const filteredForms = forms.filter(form => {
                      const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                      const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                      const matchesType = typeFilter === 'All' || displayType === typeFilter;
                      return matchesSearch && matchesType;
                    });
                    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
                    return totalPages > 1 && (
                      <div className="mt-4">
                        <div className="text-xs text-gray-600 text-center mb-3">
                          Page {currentPage} of {totalPages} ({filteredForms.length} total)
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()} 
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  {(() => {
                    const filteredForms = forms.filter(form => {
                      const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                      const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                      const matchesType = typeFilter === 'All' || displayType === typeFilter;
                      return matchesSearch && matchesType;
                    });
                    const startIndex = (desktopCurrentPage - 1) * desktopItemsPerPage;
                    const endIndex = Math.min(startIndex + desktopItemsPerPage, filteredForms.length);
                    return (
                      <div className="mb-3 text-sm text-gray-600">
                        Showing {startIndex + 1}-{endIndex} of {filteredForms.length} form{filteredForms.length !== 1 ? 's' : ''}
                      </div>
                    );
                  })()}
                  <div className="rounded-md border overflow-x-auto">
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
                        {(() => {
                          const filteredForms = forms.filter(form => {
                            const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                            const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                            const matchesType = typeFilter === 'All' || displayType === typeFilter;
                            return matchesSearch && matchesType;
                          });
                          const startIndex = (desktopCurrentPage - 1) * desktopItemsPerPage;
                          const endIndex = startIndex + desktopItemsPerPage;
                          const paginatedForms = filteredForms.slice(startIndex, endIndex);
                          return paginatedForms.map((form, index) => (
                          <TableRow key={form.id}>
                            <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#002e4d]" />
                                {form.formName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`${form.changeType === 'Active' ? 'bg-green-100 text-green-700' :
                                    form.changeType === 'Default' ? 'bg-blue-100 text-blue-700' :
                                      form.changeType === 'Archive' ? 'bg-gray-100 text-gray-700' :
                                        'bg-orange-100 text-orange-700'
                                  }`}
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
                          ));
                        })()}
                        {(() => {
                          const filteredForms = forms.filter(form => {
                            const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                            const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                            const matchesType = typeFilter === 'All' || displayType === typeFilter;
                            return matchesSearch && matchesType;
                          });
                          return filteredForms.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No forms found
                              </TableCell>
                            </TableRow>
                          );
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {(() => {
                    const filteredForms = forms.filter(form => {
                      const matchesSearch = form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        form.changeType.toLowerCase().includes(searchTerm.toLowerCase());
                      const displayType = form.changeType === 'All' ? 'Active' : form.changeType;
                      const matchesType = typeFilter === 'All' || displayType === typeFilter;
                      return matchesSearch && matchesType;
                    });
                    const totalPages = Math.ceil(filteredForms.length / desktopItemsPerPage);
                    const startIndex = (desktopCurrentPage - 1) * desktopItemsPerPage;
                    const endIndex = Math.min(startIndex + desktopItemsPerPage, filteredForms.length);
                    return totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to {endIndex} of {filteredForms.length} results
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDesktopCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={desktopCurrentPage === 1}
                            className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={page === desktopCurrentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setDesktopCurrentPage(page)}
                                className={`w-8 ${page === desktopCurrentPage ? 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90' : 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]'}`}
                              >
                                {page}
                              </Button>
                            );
                          })}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDesktopCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={desktopCurrentPage === totalPages}
                            className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
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
                  {(() => {
                    const startIndex = (studentCurrentPage - 1) * studentItemsPerPage;
                    const endIndex = Math.min(startIndex + studentItemsPerPage, studentForms.length);
                    return (
                      <div className="mb-3 text-sm text-gray-600">
                        Showing {startIndex + 1}-{endIndex} of {studentForms.length} student{studentForms.length !== 1 ? 's' : ''}
                      </div>
                    );
                  })()}
                  <div className="space-y-3 max-w-md mx-auto">
                    {(() => {
                      const startIndex = (studentCurrentPage - 1) * studentItemsPerPage;
                      const endIndex = startIndex + studentItemsPerPage;
                      const paginatedStudents = studentForms.slice(startIndex, endIndex);
                      return paginatedStudents.map((student, index) => (
                        <div key={student.id} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-[#002e4d] rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div className="w-full">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 flex-shrink-0">#{startIndex + index + 1}</span>
                                <h3 className="font-medium text-gray-900 text-sm leading-tight break-words">{student.childName}</h3>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-600">Classroom</span>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                              {student.classroom}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between mb-3 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-600">Parent Email</span>
                            <span className="text-xs text-gray-600 truncate max-w-[150px]">{student.parentEmail}</span>
                          </div>

                          <div className="mb-3 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-600 mb-1 block">Forms</span>
                            <div className="flex flex-wrap gap-1">
                              {student.forms.length > 0 ? (
                                student.forms.map((form, index) => (
                                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1 px-2 py-0.5 text-xs">
                                    <span>{form}</span>
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs">No forms assigned</span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openStudentFormsDialog(student)}
                              className="flex-1 h-8 text-xs"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openStudentFormsDialog(student)}
                              className="flex-1 h-8 text-xs text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete Forms
                            </Button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                  
                  {(() => {
                    const totalPages = Math.ceil(studentForms.length / studentItemsPerPage);
                    return totalPages > 1 && (
                      <div className="mt-4">
                        <div className="text-xs text-gray-600 text-center mb-3">
                          Page {studentCurrentPage} of {totalPages} ({studentForms.length} total)
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStudentCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={studentCurrentPage === 1}
                            className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStudentCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={studentCurrentPage === totalPages}
                            className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  {(() => {
                    const startIndex = (studentDesktopCurrentPage - 1) * studentDesktopItemsPerPage;
                    const endIndex = Math.min(startIndex + studentDesktopItemsPerPage, studentForms.length);
                    return (
                      <div className="mb-3 text-sm text-gray-600">
                        Showing {startIndex + 1}-{endIndex} of {studentForms.length} student{studentForms.length !== 1 ? 's' : ''}
                      </div>
                    );
                  })()}
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>S.No</TableHead>
                          <TableHead>Child Name</TableHead>
                          <TableHead>Classroom</TableHead>
                          <TableHead>Parent Email</TableHead>
                          <TableHead>Forms</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          const startIndex = (studentDesktopCurrentPage - 1) * studentDesktopItemsPerPage;
                          const endIndex = startIndex + studentDesktopItemsPerPage;
                          const paginatedStudents = studentForms.slice(startIndex, endIndex);
                          return paginatedStudents.map((student, index) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{startIndex + index + 1}</TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#002e4d]" />
                                {student.childName}
                              </div>
                            </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {student.classroom}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{student.parentEmail}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {student.forms.length > 0 ? (
                                student.forms.map((form, index) => (
                                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1 px-3 py-1">
                                    <span>{form}</span>

                                  </Badge>
                                ))
                              ) : (
                                <span className="text-gray-400 text-sm">No forms assigned</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openStudentFormsDialog(student)}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openStudentFormsDialog(student)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          ));
                        })()}
                        {studentForms.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No students found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {(() => {
                    const totalPages = Math.ceil(studentForms.length / studentDesktopItemsPerPage);
                    const startIndex = (studentDesktopCurrentPage - 1) * studentDesktopItemsPerPage;
                    const endIndex = Math.min(startIndex + studentDesktopItemsPerPage, studentForms.length);
                    return totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Showing {startIndex + 1} to {endIndex} of {studentForms.length} results
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStudentDesktopCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={studentDesktopCurrentPage === 1}
                            className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={page === studentDesktopCurrentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => setStudentDesktopCurrentPage(page)}
                                className={`w-8 ${page === studentDesktopCurrentPage ? 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90' : 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]'}`}
                              >
                                {page}
                              </Button>
                            );
                          })}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStudentDesktopCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={studentDesktopCurrentPage === totalPages}
                            className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
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

      {/* Student Forms Management Dialog */}
      <Dialog open={showStudentFormsDialog} onOpenChange={setShowStudentFormsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Forms - {editingStudent?.childName}</DialogTitle>
            <DialogDescription>
              Add or remove forms for this student.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label>Current Forms</Label>
              <div className="mt-2 flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-md">
                {editingStudent?.forms?.length > 0 ? (
                  editingStudent.forms.map((form, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1 px-3 py-1">
                      <span>{form}</span>
                      <button
                        onClick={() => openDeleteStudentFormDialog(editingStudent, form)}
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
          </div>

          <div>
            <Label>Add New Form</Label>
            <Select
              key={`student-modal-${editingStudent?.forms?.length || 0}`}
              onValueChange={handleAddStudentForm}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a form to add" />
              </SelectTrigger>
              <SelectContent>
                {studentDropdownForms
                  .filter(form => !(editingStudent?.forms || []).includes(form))
                  .map((form, index) => (
                    <SelectItem key={index} value={form}>{form}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => setShowStudentFormsDialog(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      {/* Delete Student Form Confirmation Dialog */ }
  <Dialog open={showDeleteStudentFormDialog} onOpenChange={setShowDeleteStudentFormDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remove Form</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove "{deletingStudentForm?.form}" from {deletingStudentForm?.student?.childName}?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setShowDeleteStudentFormDialog(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteStudentForm}>
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Form
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  {/* Delete Student Confirmation Dialog */ }
  <Dialog open={showDeleteStudentDialog} onOpenChange={setShowDeleteStudentDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remove Student</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove "{deletingStudent?.childName}" from the student form repository?
          This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => setShowDeleteStudentDialog(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDeleteStudent}>
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Student
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
    </div >
  );
};

export default FormsRepository;