import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { profileApis } from '../../services/allApis';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';
import { toast } from 'sonner';
import {
  UserPlus,
  Mail,
  Plus,
  Download,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ParentDetails = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  const [selectedParentEmail, setSelectedParentEmail] = useState('');
  const [selectedParentID, setSelectedParentID] = useState('');
  const [selectedParentForStatus, setSelectedParentForStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const isAuthenticated = true;
  const signOut = () => {
    console.log('Sign out clicked');
    navigate('/login');
  };

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
    invited: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Calculate statistics from original unfiltered data
    const activeCount = originalData.filter(item => item.status === 'Active').length;
    const archivedCount = originalData.filter(item => item.status === 'Archive').length;
    const invitedCount = originalData.filter(item => item.invite_status === 'Active').length;

    setStats({
      total: originalData.length,
      active: activeCount,
      archived: archivedCount,
      invited: invitedCount
    });
  }, [originalData]);

  const loadData = async (statusFilter = '') => {
    setLoading(true);
    try {
      console.log('Fetching profiles...');
      const response = await profileApis.getProfiles();
      console.log('Profiles response:', response);
      
      // Handle the mock API response structure
      const profiles = response.data.data || response.data;
      console.log('Profiles data:', profiles);
      
      let responseData = profiles.map(parent => ({
        parent_name: `${parent.first_name || ''} ${parent.last_name || ''}`.trim() || 'No Name',
        primary_email: parent.email,
        invite_email: parent.email,
        time_stamp: parent.created_at,
        status: parent.is_active ? 'Active' : 'Archive',
        invite_status: parent.is_active ? 'Active' : 'Inactive',
        parent_id: parent.id
      }));

      setOriginalData(responseData);
      
      if (statusFilter && statusFilter !== 'All') {
        responseData = responseData.filter(item => item.status === statusFilter);
      }

      setData(responseData);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to load parent data:', error);
      setData([]);
      toast.error('Failed to load parent data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    loadData(value);
  };

  const handleResendEmail = async (email) => {
    setSendingEmail(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Mock resend email to:', email);
      toast.success('Email sent successfully!');
    } catch (error) {
      toast.error('Email sending failed!');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleStatusUpdate = async (parentId, newStatus) => {
    setUpdatingStatus(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Mock status update for parent:', parentId, 'to status:', newStatus);
      
      // Update local data
      setData(prevData => 
        prevData.map(parent => 
          parent.parent_id === parentId 
            ? { ...parent, status: newStatus === 1 ? 'Active' : 'Archive' }
            : parent
        )
      );
      
      toast.success('Parent status updated successfully!');
      setShowStatusUpdateModal(false);
    } catch (error) {
      toast.error('Failed to update status!');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openStatusUpdateModal = (parent, newStatus) => {
    setSelectedParentForStatus({ ...parent, newStatus });
    setShowStatusUpdateModal(true);
  };

  const handleAddChild = async (childData) => {
    childData.parent_id = String(childData.parent_id);

    setAddingChild(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Mock add child data:', childData);
      toast.success('Child information created successfully!');
      setShowAddChildModal(false);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setAddingChild(false);
    }
  };

  const handleExportToExcel = () => {
    const exportData = data.map(row => ({
      'Parent Name': row.parent_name || '',
      'Parent Email': row.primary_email || row.invite_email || '',
      'Date': row.time_stamp?.split(' ')[0] || '',
      'Status': row.status || ''
    }));

    if (window.XLSX) {
      const ws = window.XLSX.utils.json_to_sheet(exportData);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, 'Parent Details');
      window.XLSX.writeFile(wb, 'Parent_details.xlsx');
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
      a.download = 'Parent_details.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    toast.success('Export completed successfully!');
  };

  // Pagination
  const mobileItemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const mobileTotalPages = Math.ceil(data.length / mobileItemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const mobileStartIndex = (currentPage - 1) * mobileItemsPerPage;
  const mobileEndIndex = mobileStartIndex + mobileItemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const mobileCurrentData = data.slice(mobileStartIndex, mobileEndIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600 text-white">Archived</Badge>;
    }
  };

  const getInviteStatusBadge = (inviteStatus) => {
    if (inviteStatus === 'Active') {
      return <Badge variant="outline" className="text-green-600 border-green-600">Signed</Badge>;
    } else {
      return <Badge variant="outline" className="text-gray-600 border-gray-600">Not Signed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSignOut={signOut} sidebar={true} component="ParentDetails" />

      <div className="container mx-auto pt-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parent Details</h1>
            <p className="text-gray-600 mt-1">Manage parent information and invitations</p>
          </div>
          <Button onClick={() => navigate('/invite-parent')} className="bg-[#002e4d] hover:bg-[#002e4d]/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Parent
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Parents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Archived</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Signed Parents</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.invited}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-xl">Parent Management</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archive">Archived</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleExportToExcel}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parent Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signed Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No parent data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {row.primary_email ? (
                            <button
                              onClick={() => navigate(`/parent-dashboard?id=${row.primary_email}`)}
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                            >
                              {row.parent_name}
                            </button>
                          ) : (
                            <span className="text-gray-900">{row.parent_name}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.primary_email || row.invite_email}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {row.time_stamp?.split(' ')[0]}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={row.status === 'Active' ? '1' : '2'}
                            onValueChange={(value) => openStatusUpdateModal(row, value)}
                          >
                            <SelectTrigger className="w-28">
                              <SelectValue>
                                {getStatusBadge(row.status)}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                <Badge variant="default" className="bg-green-500">Active</Badge>
                              </SelectItem>
                              <SelectItem value="2">
                                <Badge variant="secondary" className="bg-gray-500 text-white">Archive</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {getInviteStatusBadge(row.invite_status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={row.invite_status === 'Active' ? "secondary" : "default"}
                              onClick={() => handleResendEmail(row.invite_email)}
                              disabled={row.invite_status === 'Active' || sendingEmail}
                              className={row.invite_status === 'Active' ? "" : "bg-[#002e4d] hover:bg-[#002e4d]/90"}
                            >
                              <Mail className="w-3 h-3 mr-1" />
                              Send
                            </Button>
                            <Button
                              size="sm"
                              variant={row.invite_status === 'Inactive' ? "secondary" : "default"}
                              onClick={() => {
                                setSelectedParentEmail(row.invite_email);
                                setSelectedParentID(row.parent_id)
                                setShowAddChildModal(true);
                              }}
                              disabled={row.invite_status === 'Inactive' || addingChild}
                              className={row.invite_status === 'Inactive' ? "" : "bg-[#002e4d] hover:bg-[#002e4d]/90"}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Child
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-full mb-3" />
                      <div className="flex gap-2 mb-3">
                        <Skeleton className="h-5 w-14" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : currentData.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No parent data found
                  </CardContent>
                </Card>
              ) : (
                mobileCurrentData.map((row, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <div className="mb-3">
                        {row.primary_email ? (
                          <button
                            onClick={() => navigate(`/parent-dashboard?id=${row.primary_email}`)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline block w-full text-left truncate cursor-pointer"
                          >
                            {row.parent_name}
                          </button>
                        ) : (
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{row.parent_name}</h3>
                        )}
                        <p className="text-xs text-gray-600 mt-1 truncate">{row.primary_email || row.invite_email}</p>
                        <p className="text-xs text-gray-500 mt-1">{row.time_stamp?.split(' ')[0]}</p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        {getStatusBadge(row.status)}
                        {getInviteStatusBadge(row.invite_status)}
                      </div>
                      
                      <div className="mb-3">
                        <Select
                          value={row.status === 'Active' ? '1' : '2'}
                          onValueChange={(value) => openStatusUpdateModal(row, value)}
                        >
                          <SelectTrigger className="w-full h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Active</SelectItem>
                            <SelectItem value="2">Archive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant={row.invite_status === 'Active' ? "secondary" : "default"}
                          onClick={() => handleResendEmail(row.invite_email)}
                          disabled={row.invite_status === 'Active' || sendingEmail}
                          className={`h-8 text-xs ${row.invite_status === 'Active' ? "" : "bg-[#002e4d] hover:bg-[#002e4d]/90"}`}
                        >
                          <Mail className="w-3 h-3 mr-1" />
                          Send
                        </Button>
                        <Button
                          size="sm"
                          variant={row.invite_status === 'Inactive' ? "secondary" : "default"}
                          onClick={() => {
                            setSelectedParentEmail(row.invite_email);
                            setSelectedParentID(row.parent_id)
                            setShowAddChildModal(true);
                          }}
                          disabled={row.invite_status === 'Inactive' || addingChild}
                          className={`h-8 text-xs ${row.invite_status === 'Inactive' ? "" : "bg-[#002e4d] hover:bg-[#002e4d]/90"}`}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Child
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {data.length > itemsPerPage && (
              <div className="mt-4">
                <div className="hidden md:flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
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
                          onClick={() => goToPage(page)}
                          className={`w-8 ${page === currentPage ? 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90' : 'bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]'}`}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Mobile Pagination */}
                <div className="md:hidden">
                  <div className="text-xs text-gray-600 text-center mb-3">
                    Page {currentPage} of {mobileTotalPages} ({data.length} total)
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === mobileTotalPages}
                      className="h-8 bg-[#002e4d] text-white hover:bg-[#002e4d]/90 border-[#002e4d]"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Update Confirmation Modal */}
      <Dialog open={showStatusUpdateModal} onOpenChange={setShowStatusUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedParentForStatus?.newStatus === '1' ? 'activate' : 'archive'} the parent "{selectedParentForStatus?.parent_name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusUpdateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate(selectedParentForStatus?.parent_id, selectedParentForStatus?.newStatus === '1' ? 1 : 0)}
              disabled={updatingStatus}
              className="bg-[#002e4d] hover:bg-[#002e4d]/90"
            >
              {updatingStatus ? 'Updating...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {(sendingEmail || addingChild || updatingStatus) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002e4d]"></div>
                <p className="text-sm font-medium text-gray-700">
                  {sendingEmail ? 'Sending Email...' : addingChild ? 'Adding Child...' : 'Updating Status...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ParentDetails;