import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Supabase auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Skip auth for mock server
    if (API_BASE_URL.includes('localhost')) {
      return config;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Skip auth handling for mock server
    if (API_BASE_URL.includes('localhost')) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const { data, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        await supabase.auth.signOut();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);