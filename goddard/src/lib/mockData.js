// Mock data for Goddard School application

export const mockClassrooms = [
  { class_id: '1', class_name: 'Butterfly' },
  { class_id: '2', class_name: 'Purple' },
  { class_id: '3', class_name: 'Rainbow' },
  { class_id: '4', class_name: 'Sunshine' }
];

export const mockForms = [
  { form_id: '1', form_name: 'Admission Form' },
  { form_id: '2', form_name: 'Enrollment Agreement' },
  { form_id: '3', form_name: 'Parent Handbook' },
  { form_id: '4', form_name: 'Authorization Form' }
];

export const mockApplications = [
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