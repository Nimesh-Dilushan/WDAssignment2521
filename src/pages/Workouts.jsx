import React, { useState, useEffect, useRef } from 'react';

export default function Workouts({ routines, workoutLogs, onAddRoutine, onLogWorkout, onDeleteRoutine }) {
  const [activeRoutine, setActiveRoutine] = useState(null);

  // States that were created for the timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // States that were created for the "REST TIMER"
  const [restSeconds, setRestSeconds] = useState(0);
  const [restIsRunning, setRestIsRunning] = useState(false);
  const restIntervalRef = useRef(null);

  // Checklist of completed exercises
  const [completedExercises, setCompletedExercises] = useState({});

  // Adding Routine Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    name: '',
    category: 'Strength',
    description: '',
    exercises: '' // Comma-separated or newline-separated
  });

  // Tracking the main stopwatch timer
  useEffect(() => {
    if (timerIsRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerIsRunning]);

  // Tracking the countdown rest timer
  useEffect(() => {
    if (restIsRunning && restSeconds > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestSeconds(prev => prev - 1);
      }, 1000);
    } else if (restSeconds === 0) {
      setRestIsRunning(false);
      clearInterval(restIntervalRef.current);
    }
    return () => clearInterval(restIntervalRef.current);
  }, [restIsRunning, restSeconds]);

  const handleStartWorkout = (routine) => {
    setActiveRoutine(routine);
    setTimerSeconds(0);
    setTimerIsRunning(true);
    setCompletedExercises({});
    setRestSeconds(0);
    setRestIsRunning(false);
  };

  const handleCancelWorkout = () => {
    if (window.confirm('Are you sure you want to discard this workout session?')) {
      setActiveRoutine(null);
      setTimerIsRunning(false);
      setTimerSeconds(0);
      setCompletedExercises({});
      setRestSeconds(0);
      setRestIsRunning(false);
    }
  };

  const handleToggleTimer = () => {
    setTimerIsRunning(!timerIsRunning);
  };

  const handleResetTimer = () => {
    setTimerSeconds(0);
  };

  const handleStartRest = (seconds) => {
    setRestSeconds(seconds);
    setRestIsRunning(true);
  };

  const handleToggleExercise = (index) => {
    setCompletedExercises(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishWorkout = () => {
    const completedCount = Object.values(completedExercises).filter(Boolean).length;
    const totalCount = activeRoutine.exercises.length;

    if (completedCount < totalCount) {
      if (!window.confirm(`You checked off only ${completedCount}/${totalCount} exercises. Finish anyway?`)) {
        return;
      }
    }

    // Log the workout in history
    onLogWorkout({
      id: 'log_' + Date.now(),
      routineName: activeRoutine.name,
      duration: formatTime(timerSeconds),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });

    // Stop all timers & clear active workout
    setTimerIsRunning(false);
    setActiveRoutine(null);
    setTimerSeconds(0);
    setCompletedExercises({});
    setRestSeconds(0);
    setRestIsRunning(false);
    alert('Workout saved successfully! Keep it up! 🏆');
  };

  // Add User's Custom Routine
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewRoutine({
      name: '',
      category: 'Strength',
      description: '',
      exercises: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoutine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRoutine = (e) => {
    e.preventDefault();
    if (!newRoutine.name || !newRoutine.exercises) return;

    // Convert all exercises string list to an array
    const exerciseArray = newRoutine.exercises
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        // Parse "Squats - 3x12" or similar, or just take the line
        const parts = line.split('-');
        return {
          id: index,
          name: parts[0]?.trim() || line,
          sets: parts[1]?.trim() || '3 sets x 10 reps'
        };
      });

    onAddRoutine({
      id: 'r_' + Date.now(),
      name: newRoutine.name,
      category: newRoutine.category,
      description: newRoutine.description || 'Custom fitness routine',
      exercises: exerciseArray
    });

    handleCloseModal();
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Workouts</h2>
          <p className="text-zinc-550 dark:text-zinc-400 text-xs mt-1">
            Choose a routine, track your live sets, and log your fitness journey logs.
          </p>
        </div>
        <button
          className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          onClick={handleOpenModal}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Routine
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Workout Library & Activity Logs */}
        <div className="space-y-6">
          {/* Library card */}
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-5">Workout Library</h3>
            <div className="space-y-4">
              {routines.map(routine => (
                <div
                  key={routine.id}
                  className="flex justify-between items-center p-4 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl hover:border-accent/30 hover:bg-white dark:hover:bg-zinc-850/40 transition-all duration-300 bg-zinc-50/30 dark:bg-zinc-950/10"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">{routine.name}</h3>
                    <p className="text-zinc-400 dark:text-zinc-500 text-xs my-1.5 truncate">{routine.description}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 mt-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 uppercase inline-block tracking-wider">
                      {routine.category} &middot; {routine.exercises.length} Exercises
                    </span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <button
                      className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-3.5 py-2 rounded-xl text-xs font-bold active:scale-[0.97] transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:hover:brightness-100 disabled:active:scale-100"
                      disabled={activeRoutine !== null}
                      onClick={() => handleStartWorkout(routine)}
                    >
                      Start
                    </button>
                    {routine.id.startsWith('r_') && ( // only delete custom routines
                      <button
                        className="border border-zinc-250 dark:border-zinc-800 w-9 h-9 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-200 cursor-pointer flex-shrink-0"
                        onClick={() => onDeleteRoutine(routine.id)}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs card */}
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-5">Recent Activity Logs</h3>
            <div className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto pr-1.5 scrollbar-thin">
              {workoutLogs.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-xs text-center my-8">No workouts logged yet. Finish a session to see logs here!</p>
              ) : (
                workoutLogs.map(log => (
                  <div
                    key={log.id}
                    className="flex justify-between items-center p-3.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 hover:bg-white dark:hover:bg-zinc-850/40 hover:border-accent/20 transition-all duration-300 text-xs"
                  >
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{log.routineName}</div>
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">{log.date}</div>
                    </div>
                    <span className="text-[10px] bg-accent-bg text-accent border border-accent-border px-2.5 py-1 rounded-md font-bold tracking-tight inline-flex items-center gap-1">
                      ⏱️ {log.duration}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Tracker Drawer */}
        <div className="flex flex-col h-full">
          {activeRoutine ? (
            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-accent/40 rounded-2xl p-6 relative flex flex-col gap-6 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
              <div className="flex justify-between items-center border-b border-zinc-150/45 dark:border-zinc-800/50 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-accent font-bold">Active Workout Session</span>
                  <h3 className="m-0 text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mt-0.5">
                    {activeRoutine.name}
                  </h3>
                </div>
                <button
                  className="bg-transparent border-none text-rose-500 hover:text-rose-600 font-bold text-xs cursor-pointer hover:underline"
                  onClick={handleCancelWorkout}
                >
                  Discard Workout
                </button>
              </div>

              {/* Session Stopwatch Timer */}
              <div className="flex items-center justify-between p-4.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/50 text-zinc-900 dark:text-zinc-50">
                <div>
                  <div className="text-[9px] text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-bold">Workout Timer</div>
                  <div className="text-3xl font-black font-mono tracking-tight text-accent mt-0.5">{formatTime(timerSeconds)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-850 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-900 dark:text-zinc-550 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-[0.95]"
                    onClick={handleToggleTimer}
                  >
                    {timerIsRunning ? (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 ml-0.5" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>
                  <button
                    className="bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-850 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-900 dark:text-zinc-550 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-[0.95]"
                    onClick={handleResetTimer}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Countdown Rest Timer */}
              <div className="flex justify-between items-center p-4 bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/50 rounded-xl text-xs gap-3">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {restIsRunning ? (
                    <span className="flex items-center gap-1.5 text-accent font-bold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                      </span>
                      Rest Timer: {restSeconds}s
                    </span>
                  ) : 'Rest countdown between sets?'}
                </span>
                <div className="flex gap-2">
                  <button
                    className="border border-zinc-250 dark:border-zinc-850 text-zinc-800 dark:text-zinc-200 bg-white/70 dark:bg-zinc-900/60 px-3 py-1.5 rounded-xl text-[11px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-[0.95] cursor-pointer"
                    onClick={() => handleStartRest(30)}
                  >
                    +30s
                  </button>
                  <button
                    className="border border-zinc-250 dark:border-zinc-850 text-zinc-800 dark:text-zinc-200 bg-white/70 dark:bg-zinc-900/60 px-3 py-1.5 rounded-xl text-[11px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-[0.95] cursor-pointer"
                    onClick={() => handleStartRest(60)}
                  >
                    +60s
                  </button>
                </div>
              </div>

              {/* Exercises checklist */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider mb-2 block">Exercises Checklist</span>
                {activeRoutine.exercises.map((ex, index) => {
                  const isDone = !!completedExercises[index];
                  return (
                    <div
                      key={ex.id || index}
                      className={`flex items-start gap-4 p-4.5 rounded-xl border transition-all duration-300 ${isDone
                          ? 'bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500/20 opacity-70'
                          : 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/40 dark:border-zinc-800/40'
                        }`}
                    >
                      <div
                        className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center cursor-pointer select-none flex-shrink-0 transition-all duration-200 mt-0.5 ${isDone
                            ? 'bg-accent border-accent text-white dark:text-zinc-950 scale-105'
                            : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 hover:border-accent/40'
                          }`}
                        onClick={() => handleToggleExercise(index)}
                      >
                        {isDone && (
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-xs font-bold tracking-tight ${isDone ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-50'}`}>{ex.name}</div>
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-medium">{ex.sets}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-3.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer w-full flex justify-center items-center mt-2 shadow-sm"
                onClick={handleFinishWorkout}
              >
                🏆 Finish and Save Workout
              </button>
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-250/50 dark:border-zinc-800/50 rounded-2xl p-10 flex flex-col items-center justify-center min-h-[360px] text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-55 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4 animate-pulse">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">No Active Session</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-[220px] mt-2 leading-relaxed">
                Select a workout routine from the library on the left and click "Start" to begin tracking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Routine Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="px-5 py-4.5 border-b border-zinc-150/45 dark:border-zinc-800/50 flex items-center justify-between">
              <h3 className="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Create Custom Routine</h3>
              <button
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 border-none bg-transparent cursor-pointer transition-colors"
                onClick={handleCloseModal}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitRoutine}>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Routine Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                    required
                    value={newRoutine.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Upper Body A"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">cd
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Category</label>
                    <select
                      name="category"
                      className="w-full px-3 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-150 rounded-xl text-xs outline-none cursor-pointer focus:ring-2 focus:ring-accent/15 focus:border-accent/55 transition-all duration-300"
                      value={newRoutine.category}
                      onChange={handleInputChange}
                    >
                      <option value="Strength">Strength</option>
                      <option value="Cardio">Cardio / HIIT</option>
                      <option value="Flexibility">Flexibility</option>
                      <option value="Endurance">Endurance</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Short Description</label>
                    <input
                      type="text"
                      name="description"
                      className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                      value={newRoutine.description}
                      onChange={handleInputChange}
                      placeholder="chest & shoulders focus"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Exercises (One per line) *</label>
                  <textarea
                    name="exercises"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300 font-sans"
                    rows="4"
                    required
                    value={newRoutine.exercises}
                    onChange={handleInputChange}
                    placeholder="Bench Press - 3 sets x 8 reps&#10;Shoulder Press - 3 sets x 10 reps"
                  />
                  <span className="text-[9.5px] text-zinc-450 dark:text-zinc-550 leading-relaxed mt-1">
                    Tip: Format as <em>Exercise Name - Sets Description</em> for best results.
                  </span>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-zinc-150/45 dark:border-zinc-850/50 flex justify-end gap-2.5 bg-zinc-50/30 dark:bg-zinc-900/20">
                <button
                  type="button"
                  className="border border-zinc-250 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-100 text-zinc-900 dark:text-zinc-50 bg-transparent px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/25 px-5 py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
