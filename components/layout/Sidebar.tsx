'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Menu, X, LogOut } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: string;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  };

  const navItems: NavItem[] = getNavItems(role);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-brand-orange text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 z-40 ${
          isOpen ? 'w-64' : 'w-0'
        } md:w-64 overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-brand-orange">BFA</h1>
            <p className="text-xs text-gray-400 mt-1">TalentFlow</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <span className="w-5 h-5">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-gray-700 px-4 py-4 space-y-3">
            <div className="px-2">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="font-semibold text-sm text-white truncate">{userName}</p>
              <p className="text-xs text-brand-orange capitalize mt-1">{role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function getNavItems(role: string): NavItem[] {
  if (role === 'rh' || role === 'direction') {
    return [
      { label: 'Overview', href: '/dashboard', icon: '📊' },
      { label: 'Talentos', href: '/dashboard/talents', icon: '👥' },
      { label: 'Candidaturas', href: '/dashboard/applications', icon: '📝' },
      { label: 'Pagamentos', href: '/dashboard/payments', icon: '💰' },
      { label: 'Mentoria', href: '/dashboard/mentors', icon: '🎓' },
      { label: 'Avaliações 360°', href: '/dashboard/evaluations', icon: '⭐' },
      { label: '9-Box', href: '/dashboard/nine-box', icon: '📈' },
      { label: 'Workflows', href: '/dashboard/workflows', icon: '⚙️' },
      { label: 'Compliance', href: '/dashboard/compliance', icon: '📋' },
    ];
  } else if (role === 'bolseiro') {
    return [
      { label: 'Home', href: '/dashboard', icon: '🏠' },
      { label: 'Pagamentos', href: '/dashboard/payments', icon: '💰' },
      { label: 'Documentos', href: '/dashboard/documents', icon: '📄' },
      { label: 'Meu Mentor', href: '/dashboard/mentor', icon: '👨‍🏫' },
      { label: 'Tarefas', href: '/dashboard/tasks', icon: '✅' },
      { label: 'Faltas', href: '/dashboard/absences', icon: '📅' },
      { label: 'Eventos', href: '/dashboard/events', icon: '🎉' },
    ];
  }

  return [];
}
