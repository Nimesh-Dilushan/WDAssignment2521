import { useState, useEffect } from 'react';
import {
  DEFAULT_MEMBERS,
  DEFAULT_CLASSES,
  DEFAULT_ROUTINES,
  DEFAULT_LOGS,
  DEFAULT_SETTINGS,
  DEFAULT_CHECKINS
} from '../data/defaultData';

/**
 * useAppState — custom hook encapsulating all gym app state,
 * localStorage persistence effects, derived stats, and action handlers.
 */
export function useAppState() {
  // --- STATE ---
  const [themeAccent, setThemeAccent] = useState(
    () => localStorage.getItem('gym_theme_accent') || 'violet'
  );

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('gym_members');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });

  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('gym_classes');
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES;
  });

  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('gym_routines');
    return saved ? JSON.parse(saved) : DEFAULT_ROUTINES;
  });

  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const saved = localStorage.getItem('gym_workout_logs');
    return saved ? JSON.parse(saved) : DEFAULT_LOGS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('gym_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [recentCheckins, setRecentCheckins] = useState(() => {
    const saved = localStorage.getItem('gym_recent_checkins');
    return saved ? JSON.parse(saved) : DEFAULT_CHECKINS;
  });

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => { localStorage.setItem('gym_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('gym_classes', JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem('gym_routines', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('gym_workout_logs', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('gym_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('gym_recent_checkins', JSON.stringify(recentCheckins)); }, [recentCheckins]);
  useEffect(() => { localStorage.setItem('gym_theme_accent', themeAccent); }, [themeAccent]);

  // --- DERIVED STATS ---
  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'Active').length,
    classesToday: classes.filter(c => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return c.day === days[new Date().getDay()];
    }).length,
    checkedInToday: recentCheckins.filter(c => c.time.startsWith('Today')).length
  };

  // --- MEMBER HANDLERS ---
  const handleAddMember = (newMember) => {
    setMembers(prev => [newMember, ...prev]);
  };

  const handleEditMember = (updatedMember) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    setRecentCheckins(prev => prev.map(c => {
      const original = members.find(m => m.id === updatedMember.id);
      if (original && c.memberName === original.name) {
        return { ...c, memberName: updatedMember.name, tier: updatedMember.tier, status: updatedMember.status };
      }
      return c;
    }));
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const memberToDelete = members.find(m => m.id === id);
      setMembers(prev => prev.filter(m => m.id !== id));
      if (memberToDelete) {
        setRecentCheckins(prev => prev.filter(c => c.memberName !== memberToDelete.name));
      }
    }
  };

  const handleCheckIn = (member) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const checkinTime = `Today, ${timeStr}`;
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, lastCheckIn: checkinTime } : m));
    const newCheckIn = {
      id: 'c_' + Date.now(),
      memberName: member.name,
      time: checkinTime,
      tier: member.tier,
      status: member.status
    };
    setRecentCheckins(prev => [newCheckIn, ...prev].slice(0, 15));
  };

  // --- CLASS HANDLERS ---
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

  // --- WORKOUT HANDLERS ---
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

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const handleResetData = () => {
    setMembers(DEFAULT_MEMBERS);
    setClasses(DEFAULT_CLASSES);
    setRoutines(DEFAULT_ROUTINES);
    setWorkoutLogs(DEFAULT_LOGS);
    setSettings(DEFAULT_SETTINGS);
    setRecentCheckins(DEFAULT_CHECKINS);
    setThemeAccent('violet');
    localStorage.clear();
  };

  return {
    // State
    themeAccent,
    setThemeAccent,
    members,
    classes,
    routines,
    workoutLogs,
    settings,
    recentCheckins,
    // Derived
    stats,
    // Handlers
    handleAddMember,
    handleEditMember,
    handleDeleteMember,
    handleCheckIn,
    handleAddClass,
    handleToggleBookClass,
    handleDeleteClass,
    handleAddRoutine,
    handleLogWorkout,
    handleDeleteRoutine,
    handleSaveSettings,
    handleResetData
  };
}
