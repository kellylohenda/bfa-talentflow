'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface ShellProps {
  children: React.ReactNode;
  userRole: string;
  userName: string;
}

export function Shell({ children, userRole, userName }: ShellProps) {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-dark dark:text-text-light">
      <Sidebar role={userRole} userName={userName} />
      <Topbar userName={userName} />
      <main className="md:ml-64 mt-16 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
