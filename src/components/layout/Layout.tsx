import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '@/context/AuthContext';
import AuthPages from '@/pages/auth/AuthPages';

const Layout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Keeping the loading check for completeness
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl font-semibold text-buzzer-primary">
          Loading...
        </div>
      </div>
    );
  }

  // Comment out this condition to always show the main layout
  // Instead, add a way to toggle between auth pages and main dashboard for testing
  
  // Uncomment the next block to test the auth pages
  /*
  if (!isAuthenticated) {
    return <AuthPages />;
  }
  */
  
  // For demonstration purposes, let's add a button to view the auth pages
  const showAuthPages = false; // Set to true to see auth pages, false to see dashboard
  
  if (showAuthPages) {
    return <AuthPages />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
