import React from 'react';
import { Box, Flex } from '@mantine/core';
import { AdminSidebar } from './components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Flex className="min-h-screen bg-slate-50 font-sans" wrap="nowrap">
      {/* Enterprise Left Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <Box className="flex-1 min-w-0 flex flex-col">
        {children}
      </Box>
    </Flex>
  );
};
