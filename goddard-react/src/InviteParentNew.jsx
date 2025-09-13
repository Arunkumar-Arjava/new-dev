import React, { useState, useEffect } from 'react';
import HeaderNew from './components/HeaderNew';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from './components/ui/form';
import { Skeleton } from './components/ui/skeleton';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Mail, 
  User, 
  Users, 
  BookOpen, 
  ArrowLeft, 
  Send,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Form validation schema
const inviteFormSchema = z.object({
  child_fname: z.string().min(1, 'Child first name is required').min(2, 'First name must be at least 2 characters'),
  child_lname: z.string().min(1, 'Child last name is required').min(2, 'Last name must be at least 2 characters'),
  child_classroom_id: z.string().min(1, 'Please select a classroom'),
  parent_name: z.string().min(1, 'Parent full name is required').min(2, 'Name must be at least 2 characters'),
  invite_email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

const InviteParentNew = () => {
  const navigate = useNavigate();
  const isAuthenticated = true;
  const signOut = () => {
    console.log('Sign out clicked');
    navigate('/login');
  };
  const [classrooms, setClassrooms] = useState([]);
  const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      child_fname: '',
      child_lname: '',
      child_classroom_id: '',
      parent_name: '',
      invite_email: ''
    }
  });

  useEffect(() => {
    loadClassroomData();
  }, []);

  const loadClassroomData = async () => {
    try {
      // Mock classroom data
      const mockData = [
        { class_id: '1', class_name: 'Butterfly' },
        { class_id: '2', class_name: 'Purple' },
        { class_id: '3', class_name: 'Rainbow' },
        { class_id: '4', class_name: 'Sunshine' },
        { class_id: '5', class_name: 'Unassign' }
      ];
      const classroomOptions = mockData
        .filter(item => item.class_name && item.class_name !== undefined)
        .map(item => ({
          id: String(item.class_id), // Ensure id is a string
          name: item.class_name,
          selected: item.class_name === "Unassign"
        }));
      setClassrooms(classroomOptions);
    } catch (error) {
      toast.error('Failed to load classroom data');
    } finally {
      setIsLoadingClassrooms(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful invitation
      console.log('Mock invitation data:', data);
      
      toast.success('Invitation sent successfully! The parent will receive an email shortly.');
      form.reset();
      // Optionally navigate back to parent details after success
      setTimeout(() => {
        navigate('/parent-details');
      }, 2000);
    } catch (error) {
      toast.error('An error occurred while sending the invitation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Always render the component since we're using mock authentication
  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNew onSignOut={signOut} sidebar={true} component="InviteParent" />
      
      <div className="container mx-auto pt-6 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/parent-details')}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Send Parent Invitation</h1>
            </div>
            <p className="text-gray-600">Invite a new parent to join the enrollment system</p>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Step 1</p>
                  <p className="text-lg font-semibold text-blue-600">Child Information</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Step 2</p>
                  <p className="text-lg font-semibold text-green-600">Parent Details</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Step 3</p>
                  <p className="text-lg font-semibold text-purple-600">Send Invitation</p>
                </div>
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-6 h-6 text-[#002e4d]" />
              Parent Invitation Form
            </CardTitle>
            <CardDescription>
              Fill in the child and parent information below to send an enrollment invitation email.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Child Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="w-5 h-5 text-[#002e4d]" />
                    <h3 className="text-lg font-semibold text-[#002e4d]">Child Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="child_fname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child First Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter first name" 
                              {...field} 
                              className="focus:ring-[#002e4d] focus:border-[#002e4d]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="child_lname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter last name" 
                              {...field} 
                              className="focus:ring-[#002e4d] focus:border-[#002e4d]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="child_classroom_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classroom</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={isLoadingClassrooms}
                          >
                            <FormControl>
                              <SelectTrigger className="focus:ring-[#002e4d] focus:border-[#002e4d]">
                                <SelectValue placeholder={
                                  isLoadingClassrooms ? "Loading classrooms..." : "Select classroom"
                                } />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingClassrooms ? (
                                <div className="p-2">
                                  <Skeleton className="h-4 w-24" />
                                </div>
                              ) : (
                                classrooms.map((classroom) => (
                                  <SelectItem key={classroom.id} value={classroom.id}>
                                    {classroom.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Parent Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Users className="w-5 h-5 text-[#002e4d]" />
                    <h3 className="text-lg font-semibold text-[#002e4d]">Parent Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parent_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter parent's full name" 
                              {...field} 
                              className="focus:ring-[#002e4d] focus:border-[#002e4d]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="invite_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="parent@example.com" 
                              {...field} 
                              className="focus:ring-[#002e4d] focus:border-[#002e4d]"
                            />
                          </FormControl>
                          <FormDescription>
                            The invitation will be sent to this email address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Information Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-800 font-medium">What happens next?</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        The parent will receive an email invitation with instructions to create their account 
                        and complete the enrollment process for their child.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/parent-details')}
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-[#002e4d] hover:bg-[#002e4d]/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Success Tips */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Before sending:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Verify the email address is correct</li>
                  <li>Ensure the parent name matches official records</li>
                  <li>Select the appropriate classroom for the child</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">After sending:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Parent will receive the invitation within minutes</li>
                  <li>They can create their account using the link</li>
                  <li>Follow up if they don't respond within 48 hours</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#002e4d]"></div>
                <p className="text-sm font-medium text-gray-700">
                  Sending invitation email...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InviteParentNew;