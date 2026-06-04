import React from 'react';

export default function Dashboard({ stats, recentCheckins, classes, setActivePage }) {
  // Get today's day of the week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDay = daysOfWeek[new Date().getDay()];

  // Filter classes for today
  const todayClasses = classes.filter(c => c.day === todayDay).slice(0, 3);

  // SVG Chart Data - Mocking attendance for last 7 days
  const chartPoints = [24, 38, 30, 45, 52, 60, stats.checkedInToday];
  const chartDays = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Today'];

  // Calculate SVG path coordinates (width: 500, height: 150)
  const maxVal = Math.max(...chartPoints, 70);
  const minVal = 0;
  const range = maxVal - minVal;

  const chartPointsCoords = chartPoints.map((val, idx) => {
    const x = (idx / (chartPoints.length - 1)) * 460 + 20; // 20 to 480
    const y = 135 - ((val - minVal) / range) * 95; // 40 to 135
    return { x, y, value: val };
  });

  // This function takes an array of coordinate points and links them together to create a smooth, continuous, Cubic Bézier curve formatted as an SVG path string.
  // This function uses complex JS math functions in the overall development of the chart.
  const makeBezierPath = (coords) => {
    if (coords.length === 0) return '';
    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i];
      const p1 = coords[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = makeBezierPath(chartPointsCoords);
  const areaPath = chartPointsCoords.length > 0
    ? `${linePath} L ${chartPointsCoords[chartPointsCoords.length - 1].x} 140 L ${chartPointsCoords[0].x} 140 Z`
    : '';

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            Welcome back, Coach! <span className="animate-bounce inline-block">👋</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Here is your gym's overview for today, <span className="font-medium text-zinc-700 dark:text-zinc-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2 shadow-sm"
            onClick={() => setActivePage('members')}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
            Add Member
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-accent/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200/40 dark:border-zinc-700/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">{stats.totalMembers}</span>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-1.5">Total Members</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">{stats.activeMembers}</span>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-1.5">Active Passes</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">{stats.checkedInToday}</span>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-1.5">Active Check-ins</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">{stats.classesToday}</span>
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-1.5">Classes Scheduled</span>
          </div>
        </div>
      </div>

      {/* Graphs and Feeds Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Bezier Chart */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Weekly Attendance Trend</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Visits mapped over the past week</p>
            </div>
            <span className="text-[10px] text-accent bg-accent-bg border border-accent-border px-2 py-0.5 rounded-md font-semibold">
              Average: 44 visits/day
            </span>
          </div>
          <div className="h-[200px] w-full mt-4 flex items-center justify-center">
            <svg viewBox="0 0 500 165" width="100%" height="100%" className="overflow-visible select-none">
              {/* Grid Lines */}
              <line x1="20" y1="40" x2="480" y2="40" stroke="currentColor" className="text-zinc-200/50 dark:text-zinc-800/30" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="90" x2="480" y2="90" stroke="currentColor" className="text-zinc-200/50 dark:text-zinc-800/30" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="20" y1="140" x2="480" y2="140" stroke="currentColor" className="text-zinc-200/60 dark:text-zinc-800/50" strokeWidth="1" />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Area Path (underneath curve) */}
              <path
                d={areaPath}
                fill="url(#chartGradient)"
                className="transition-all duration-500"
              />

              {/* Smooth Bezier Line Path */}
              <path
                d={linePath}
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
              />

              {/* Bullet Points */}
              {chartPointsCoords.map((pt, idx) => (
                <g key={idx} className="group/node cursor-pointer">
                  {/* Glowing hover outer ring */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill="var(--accent-color)"
                    opacity="0"
                    className="group-hover/node:opacity-20 transition-opacity duration-200"
                  />
                  {/* Pulsing ring for today */}
                  {idx === chartPoints.length - 1 && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill="none"
                      stroke="var(--accent-color)"
                      strokeWidth="1.5"
                      opacity="0.5"
                      className="animate-ping origin-center"
                    />
                  )}
                  {/* Central Node Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="white"
                    stroke="var(--accent-color)"
                    strokeWidth="2.5"
                    className="dark:fill-zinc-900 transition-all duration-200 group-hover/node:r-[5px]"
                  />
                  {/* Value Label above */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    fontSize="9"
                    fontWeight="bold"
                    fill="currentColor"
                    className="text-zinc-800 dark:text-zinc-200 transition-opacity duration-200 opacity-80 group-hover/node:opacity-100"
                    textAnchor="middle"
                  >
                    {pt.value}
                  </text>
                </g>
              ))}

              {/* Day Labels */}
              {chartDays.map((day, idx) => {
                const x = (idx / (chartPoints.length - 1)) * 460 + 20;
                return (
                  <text
                    key={idx}
                    x={x}
                    y="158"
                    fontSize="9.5"
                    fontWeight="500"
                    fill="currentColor"
                    className="text-zinc-450 dark:text-zinc-500"
                    textAnchor="middle"
                  >
                    {day}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Recent Check-ins List */}
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 flex flex-col hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Recent Check-ins</h3>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Real-time attendance stream</p>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[195px] pr-1.5 scrollbar-thin">
            {recentCheckins.length === 0 ? (
              <p className="text-zinc-450 dark:text-zinc-500 text-xs text-center my-10">No check-ins recorded today.</p>
            ) : (
              recentCheckins.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 hover:bg-white dark:hover:bg-zinc-850/40 hover:border-accent/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent border border-accent-border/30 flex items-center justify-center font-bold text-xs">
                      {checkin.memberName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">{checkin.memberName}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{checkin.time}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border border-transparent uppercase tracking-wider ${checkin.tier === 'VIP' ? 'text-accent border-accent-border bg-accent-bg' :
                      checkin.tier === 'Standard' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' :
                        'text-zinc-450 dark:text-zinc-500 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800'
                    }`}>
                    {checkin.tier}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Today's Schedule Area */}
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/20 transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Today's Class Schedule</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Sessions scheduled for today, {todayDay}</p>
          </div>
          <button
            className="border border-zinc-250 dark:border-zinc-850 hover:border-zinc-900 dark:hover:border-zinc-100 text-zinc-900 dark:text-zinc-50 bg-transparent px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
            onClick={() => setActivePage('classes')}
          >
            Full Week Calendar &rarr;
          </button>
        </div>

        {todayClasses.length === 0 ? (
          <div className="p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl">
            <p className="text-zinc-450 dark:text-zinc-500 text-xs">No classes scheduled for today.</p>
            <button
              className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 mt-3 shadow-sm"
              onClick={() => setActivePage('classes')}
            >
              Schedule a Class
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todayClasses.map((item) => {
              const enrollmentPercent = Math.min(100, Math.round((item.enrolled / item.capacity) * 100));
              return (
                <div key={item.id} className="border border-zinc-200/40 dark:border-zinc-800/40 rounded-xl p-5 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-850/40 transition-all duration-300 hover:shadow-md hover:shadow-accent/5">
                  <div className="flex justify-between items-start mb-2.5 gap-2">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">{item.name}</h4>
                    <span className="text-[10px] text-accent font-bold bg-accent-bg border border-accent-border px-2.5 py-0.5 rounded-md whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-zinc-400 dark:text-zinc-500 text-xs mb-5">Instructor: <strong className="text-zinc-700 dark:text-zinc-300 font-medium">{item.instructor}</strong></p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-[10px] text-zinc-450 dark:text-zinc-500 mb-1.5 font-medium">
                      <span>Enrolled: {item.enrolled}/{item.capacity}</span>
                      <span>{enrollmentPercent}% Booked</span>
                    </div>
                    <div className="h-2 bg-zinc-200/50 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent/70 to-accent transition-all duration-500 rounded-full"
                        style={{ width: `${enrollmentPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1 */}
        <div
          className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5 transition-all duration-300 relative flex gap-4.5 items-center cursor-pointer"
          onClick={() => setActivePage('workouts')}
        >
          <div className="bg-accent/10 text-accent border border-accent-border/30 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M6 8H5a4 4 0 0 0 0 8h1" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <rect x="6" y="7" width="12" height="10" rx="2" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Log active workout</h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">Start set checklist & tracker</p>
          </div>
        </div>

        {/* Action 2 */}
        <div
          className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5 transition-all duration-300 relative flex gap-4.5 items-center cursor-pointer"
          onClick={() => setActivePage('classes')}
        >
          <div className="bg-accent/10 text-accent border border-accent-border/30 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Book upcoming class</h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">Enroll members into sessions</p>
          </div>
        </div>

        {/* Action 3 */}
        <div
          className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5 transition-all duration-300 relative flex gap-4.5 items-center cursor-pointer"
          onClick={() => setActivePage('settings')}
        >
          <div className="bg-accent/10 text-accent border border-accent-border/30 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Manage app settings</h4>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">Toggle offline & theme accent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
