// Centralized API functions

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Form Repository APIs
export const createFormTemplate = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/form-templates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return response.json();
};

export const updateFormTemplate = async (id, formData) => {
  const response = await fetch(`${API_BASE_URL}/form-templates/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  return response.json();
};

export const deleteFormTemplate = async (id) => {
  const response = await fetch(`${API_BASE_URL}/form-templates/${id}`, {
    method: 'DELETE'
  });
  return response.json();
};

export const fetchFormTemplates = async () => {
  try {
    console.log('API URL:', `${API_BASE_URL}/form-templates`);
    const response = await fetch(`${API_BASE_URL}/form-templates`);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.get('content-type'));
    
    if (!response.ok) {
      const text = await response.text();
      console.log('Error response:', text);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Raw response:', text.substring(0, 200));
    
    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON response from server');
    }
    
    const apiData = result.data || [];
    
    const mappedForms = apiData.map(form => ({
      id: form.id,
      formName: form.form_name,
      changeType: form.status === 'active' ? 'Active' : 'Archive'
    }));
    
    return mappedForms;
  } catch (error) {
    console.error('Failed to load forms from API:', error);
    return [];
  }
};