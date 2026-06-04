import React, { useState, useEffect } from 'react';

// ── Layout shell & Authentication ───────────────────────────────
import Sidebar from './components/Sidebar';   // Navbar / top navigation
import AuthPage from './components/AuthPage';   // Secure Authentication Portal
import Classes from './pages/Classes';
import Workouts from './pages/Workouts';
import { DEFAULT_CLASSES, DEFAULT_ROUTINES, DEFAULT_LOGS } from './data/defaultData';

// ── Firebase-connected panels ───────────────────────────────────
import MemberForm from './components/MemberForm';
import MemberList from './components/MemberList';

// ── Global context ──────────────────────────────────────────────
import { useGym } from './context/GymContext';

/**
 * App – Master layout wireframe with integrated Authentication Route Guard.
 */
export default function App() {
  // ── Bridge state: null = fresh-create mode; object = edit mode ──
  const [editingMember, setEditingMember] = useState(null);

  // ── Page routing state: dashboard, members, classes, workouts, settings ──
  const [activePage, setActivePage] = useState('members');

  // ── Classes state and handlers ──────────────────────────────────
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('gym_classes');
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  });

  useEffect(() => {
    localStorage.setItem('gym_classes', JSON.stringify(classes));
  }, [classes]);

  const handleAddClass = (newClass) => {
    setClasses(prev => [...prev, newClass]);
  };

  const handleToggleBookClass = (classId) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        const isBooking = !c.isBooked;
        return {
          ...c,
          isBooked: isBooking,
          enrolled: isBooking ? Math.min(c.capacity, c.enrolled + 1) : Math.max(0, c.enrolled - 1)
        };
      }
      return c;
    }));
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to cancel this class session?')) {
      setClasses(prev => prev.filter(c => c.id !== classId));
    }
  };

  const handleUpdateClass = (updatedClass) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  // ── Workouts and Routines state and handlers ─────────────────────
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('gym_routines');
    return saved ? JSON.parse(saved) : DEFAULT_ROUTINES;
  });

  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const saved = localStorage.getItem('gym_workout_logs');
    return saved ? JSON.parse(saved) : DEFAULT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('gym_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('gym_workout_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  const handleAddRoutine = (newRoutine) => {
    setRoutines(prev => [...prev, newRoutine]);
  };

  const handleLogWorkout = (newLog) => {
    setWorkoutLogs(prev => [newLog, ...prev]);
  };

  const handleDeleteRoutine = (routineId) => {
    if (window.confirm('Are you sure you want to delete this workout routine?')) {
      setRoutines(prev => prev.filter(r => r.id !== routineId));
    }
  };

  // ── Consume user context and theme from global GymContext ───────
  const { user, logoutUser, theme, toggleTheme, config, members } = useGym();
  const gymName = config?.gymName || 'Apex Fitness';

  // ── ROUTING GUARD: Serve AuthPage if user session is not active ──
  if (!user) {
    return <AuthPage />;
  }

  // ── DYNAMIC PAGE RENDERING ──────────────────────────────────────
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        const activeMembersCount = members.filter(m => m.status === 'Active' || m.status === 'active').length;
        const goldMembersCount = members.filter(m => m.membershipTier?.toLowerCase() === 'gold').length;
        const platinumMembersCount = members.filter(m => m.membershipTier?.toLowerCase() === 'platinum').length;
        const silverMembersCount = members.filter(m => m.membershipTier?.toLowerCase() === 'silver').length;

        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/55 dark:border-zinc-800/50 backdrop-blur-md rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Welcome Back, Admin!</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Here is a quick overview of your gym performance and analytics metrics for today.</p>
            </div>

            {/* Quick Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">Total Roster</span>
                <div className="text-3xl font-extrabold text-zinc-850 dark:text-white mt-1">{members.length}</div>
                <p className="text-[11px] text-zinc-550 dark:text-zinc-450 mt-2">Registered members</p>
                <div className="absolute right-4 bottom-4 text-indigo-500/20 font-bold text-4xl">👥</div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Active Status</span>
                <div className="text-3xl font-extrabold text-zinc-850 dark:text-white mt-1">{activeMembersCount}</div>
                <p className="text-[11px] text-zinc-550 dark:text-zinc-450 mt-2">Currently checking in</p>
                <div className="absolute right-4 bottom-4 text-emerald-500/20 font-bold text-4xl">⚡</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">Tier Distribution</span>
                <div className="flex gap-4 mt-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <div>🏆 G: <span className="font-extrabold">{goldMembersCount}</span></div>
                  <div>💎 P: <span className="font-extrabold">{platinumMembersCount}</span></div>
                  <div>🥈 S: <span className="font-extrabold">{silverMembersCount}</span></div>
                </div>
                <p className="text-[11px] text-zinc-550 dark:text-zinc-450 mt-2">High tier split</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-5 relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-pink-600 dark:text-pink-400 tracking-wider">Gym Name</span>
                <div className="text-xl font-extrabold text-zinc-850 dark:text-white mt-2 truncate">{gymName}</div>
                <p className="text-[11px] text-zinc-550 dark:text-zinc-450 mt-2">Active database tenant</p>
                <div className="absolute right-4 bottom-4 text-pink-500/20 font-bold text-4xl">🏢</div>
              </div>
            </div>

            {/* Quick Actions / Recent Activity layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/55 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-850 dark:text-white mb-4">Quick Operations</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActivePage('members')}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-700 dark:text-zinc-350 hover:bg-accent-bg hover:text-accent hover:border-accent/30 transition-all cursor-pointer text-left"
                  >
                    <span>➕ Add a New Member Profile</span>
                    <span>➜</span>
                  </button>
                  <button
                    onClick={() => setActivePage('classes')}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-700 dark:text-zinc-350 hover:bg-accent-bg hover:text-accent hover:border-accent/30 transition-all cursor-pointer text-left"
                  >
                    <span>📅 Check Training Class Schedule</span>
                    <span>➜</span>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/55 dark:border-zinc-800/50 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-850 dark:text-white mb-4">Live Activity Roster</h3>
                {members.length === 0 ? (
                  <p className="text-xs text-zinc-400 dark:text-zinc-550 py-4 text-center">No recent activities available. Add members to see lists here.</p>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {members.slice(0, 4).map(m => (
                      <div key={m.id} className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-zinc-50/40 dark:bg-zinc-950/20 border border-zinc-100/50 dark:border-zinc-900">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-850 dark:text-zinc-200">{m.fullName || m.name}</span>
                          <span className="text-[9px] text-zinc-400">{m.membershipTier || m.tier || 'Standard'} Member</span>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold ${m.status?.toLowerCase() === 'active'
                          ? 'bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
                          : 'bg-zinc-200/70 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                          }`}>
                          {m.status || 'Active'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">
            {/* LEFT: MemberForm sidebar panel */}
            <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-[7rem] flex-shrink-0">
              <MemberForm
                editingMember={editingMember}
                setEditingMember={setEditingMember}
              />
            </div>
            {/* RIGHT: MemberList grid */}
            <div className="flex-1 min-w-0">
              <MemberList setEditingMember={setEditingMember} />
            </div>
          </div>
        );

      case 'classes':
        return (
          <Classes
            classes={classes}
            onAddClass={handleAddClass}
            onToggleBookClass={handleToggleBookClass}
            onDeleteClass={handleDeleteClass}
            onUpdateClass={handleUpdateClass}
          />
        );

      case 'workouts':
        return (
          <Workouts
            routines={routines}
            workoutLogs={workoutLogs}
            onAddRoutine={handleAddRoutine}
            onLogWorkout={handleLogWorkout}
            onDeleteRoutine={handleDeleteRoutine}
          />
        );

      case 'settings':
        return (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/55 dark:border-zinc-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Portal Settings</h2>
              <p className="text-zinc-550 dark:text-zinc-400 text-sm">Manage configuration details, view tenant attributes, and edit interface choices.</p>
            </div>

            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/55 dark:border-zinc-850 rounded-2xl p-6 space-y-6">
              {/* Gym Name setting info */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Tenant Name</label>
                <input
                  type="text"
                  disabled
                  value={gymName}
                  className="w-full px-4 py-2 text-xs bg-zinc-100/70 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500">Tenant gym settings are configured in config.json.</p>
              </div>

              {/* Preferences */}
              <div className="border-t border-zinc-100 dark:border-zinc-850/80 pt-6 space-y-4">
                <h3 className="text-xs font-bold text-zinc-850 dark:text-white">Preferences</h3>

                <div className="flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold text-zinc-750 dark:text-zinc-200">Light / Dark Theme</span>
                    <span className="text-[10px] text-zinc-400">Toggle dark styling across entire app</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-250 font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    {theme.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`
        min-h-screen flex flex-col
        bg-zinc-50 dark:bg-zinc-950
        text-zinc-700 dark:text-zinc-300
        font-sans antialiased
        transition-colors duration-300
      `}
    >
      {/* ── 1. Sticky Navbar (Sidebar component) ─────────────────── */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        gymName={gymName}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* ── Secure Sub-header Breadcrumb & Account Bar ────────────── */}
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/40 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between text-xs">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <span className="capitalize">{activePage}</span>
            {activePage === 'members' && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">/</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                  {editingMember ? `Editing: ${editingMember.fullName || editingMember.name}` : 'Roster'}
                </span>
              </>
            )}
          </div>

          {/* Secure Identity & Control Panels */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
              <span>🔒 Signed in as:</span>
              <strong className="font-bold text-zinc-800 dark:text-zinc-200">{user.email}</strong>
            </div>

            {/* Logout Trigger */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to log out of the portal?')) {
                  logoutUser();
                }
              }}
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              Sign Out 🔌
            </button>

            {/* Dark-mode quick toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title="Toggle dark / light mode"
              className="
                flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer transition-all duration-200
                border border-zinc-200/60 dark:border-zinc-700/60
                bg-white/70 dark:bg-zinc-900/60
                text-zinc-550 dark:text-zinc-450
                hover:border-zinc-450 dark:hover:border-zinc-550
                hover:text-zinc-800 dark:hover:text-zinc-200
                text-[10px] font-semibold uppercase tracking-wider
              "
            >
              {theme === 'dark' ? (
                <>
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  Light
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  Dark
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Main content area ─────────────────────────────────── */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          {renderContent()}
        </div>
      </main>

      {/* ── 4. Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200/40 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-10 flex items-center justify-between text-[10px] text-zinc-450 dark:text-zinc-650">
          <span>© {new Date().getFullYear()} {gymName} · Multi-Tenant Fullstack Architecture</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scoped User Stream Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- PWA SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('PWA Service Worker successfully registered with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('PWA Service Worker registration failed: ', error);
      });
  });
}