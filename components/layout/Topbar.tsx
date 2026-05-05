'use client';

import React, { useState } from 'react';
import { Settings, Sun, Moon, Zap } from 'lucide-react';

interface TopbarProps {
  userName: string;
}

export function Topbar({ userName }: TopbarProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [density, setDensity] = useState('balanced');

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
  };

  const changeDensity = (newDensity: string) => {
    setDensity(newDensity);
    const html = document.documentElement;
    html.setAttribute('data-density', newDensity);
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white dark:bg-gray-900 border-b border-border-light dark:border-border-dark z-30 flex items-center justify-between px-6">
      <div className="flex-1">
        <input
          type="search"
          placeholder="Search..."
          className="w-full max-w-sm px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange text-sm"
        />
      </div>

      <div className="flex items-center space-x-4 ml-6">
        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Toggle dark mode"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Settings button */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Settings menu */}
          {showSettings && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border-light dark:border-border-dark p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Densidade Visual</p>
                <div className="space-y-1">
                  {['compact', 'balanced', 'comfortable'].map((d) => (
                    <button
                      key={d}
                      onClick={() => changeDensity(d)}
                      className={`w-full text-left px-3 py-2 rounded text-sm capitalize ${
                        density === d
                          ? 'bg-brand-orange text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-border-light dark:border-border-dark">
                <p className="text-xs text-gray-500">Usuário: {userName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
