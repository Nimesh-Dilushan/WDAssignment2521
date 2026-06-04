import React, { useState } from 'react';

/**
 * Top Navbar component showing responsive menu navigation.
 * Modern glassmorphic styles with smooth slide animations.
 */
export default function Sidebar({ activePage, setActivePage, gymName }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    {
      key: 'members',
      label: 'Members',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      key: 'classes',
      label: 'Classes',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      key: 'workouts',
      label: 'Workouts',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M6 8H5a4 4 0 0 0 0 8h1" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <rect x="6" y="7" width="12" height="10" rx="2" />
        </svg>
      )
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/55 dark:border-zinc-800/50 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-accent text-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform duration-300">⚡</div>
          <span className="text-base font-semibold text-zinc-900 dark:text-zinc-55 tracking-tight">{gymName || 'Apex Fitness'}</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border-none bg-transparent cursor-pointer transition-all duration-300 hover:scale-[1.03] ${
                activePage === key
                  ? 'bg-accent-bg text-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
                  : 'text-zinc-550 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-50'
              }`}
              onClick={() => setActivePage(key)}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Profile Card & Hamburger wrapper */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2.5 p-1 px-2 rounded-lg border border-zinc-200/40 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="w-7 h-7 rounded-md bg-accent/10 text-accent flex items-center justify-center font-semibold text-[10px]">AD</div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-50 leading-none">Admin</span>
              <span className="text-[9px] text-zinc-550 mt-0.5">Administrator</span>
            </div>
          </div>

          {/* Hamburger button (visible on mobile only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-transparent cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with slideDown animation */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-955/95 backdrop-blur-md px-4 py-4 flex flex-col gap-1.5 animate-slide-down">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold border-none bg-transparent cursor-pointer text-left w-full transition-all duration-200 ${
                activePage === key
                  ? 'bg-accent-bg text-accent'
                  : 'text-zinc-550 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50'
              }`}
              onClick={() => {
                setActivePage(key);
                setIsOpen(false);
              }}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
          <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 mt-2.5 pt-3.5 flex items-center gap-3.5 px-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center font-semibold text-xs animate-pulse">AD</div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 leading-none">Admin Director</span>
              <span className="text-[10px] text-zinc-500 mt-1">Administrator</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
