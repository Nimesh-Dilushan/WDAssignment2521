import React from 'react';
import { useGym } from '../context/GymContext';

/* ═══════════════════════════════════════════════════════════════════
   makeBezierPath  –  custom cubic-Bézier path math algorithm
   Converts an array of { x, y } data-points into an SVG `d` string
   using cardinal splines approximated as smooth cubic Bézier curves.
   Tension controls curve tightness (0 = straight lines, 1 = very curved).
   ═══════════════════════════════════════════════════════════════════ */
function makeBezierPath(points, tension = 0.4) {
  if (!points || points.length < 2) return '';

  const len = points.length;
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < len - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, len - 1)];

    // Cardinal-spline control points
    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 2;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 2;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 2;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 2;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/* ═══════════════════════════════════════════════════════════════════
   WorkoutTrendLine  –  renders a compact SVG sparkline for a member's
   workout-log entries using the makeBezierPath algorithm.
   ═══════════════════════════════════════════════════════════════════ */
function WorkoutTrendLine({ workoutLog }) {
  // Treat each log entry as an ordinal data point; derive a "volume"
  // proxy from the entry length so we have something to plot.
  const entries = Array.isArray(workoutLog) ? workoutLog : [];
  if (entries.length < 2) return null;

  const W = 180;
  const H = 42;
  const PAD = 4;

  // Map entries → values (simple heuristic: entry char-count mod 60 + 20)
  const raw = entries.map((e) => (e.length % 60) + 20);
  const minV = Math.min(...raw);
  const maxV = Math.max(...raw);
  const range = maxV - minV || 1;

  const points = raw.map((v, i) => ({
    x: PAD + ((W - PAD * 2) / (raw.length - 1)) * i,
    y: H - PAD - ((v - minV) / range) * (H - PAD * 2),
  }));

  const linePath = makeBezierPath(points, 0.35);

  // Area fill: close back along the bottom
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;

  return (
    <div className="mt-3 pt-3 border-t border-zinc-100/60 dark:border-zinc-800/60">
      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
        Training Trend
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-10 overflow-visible"
        preserveAspectRatio="none"
        aria-label="Workout trend sparkline"
      >
        <defs>
          <linearGradient id={`tg-${entries.length}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Gradient area fill */}
        <path d={areaPath} fill={`url(#tg-${entries.length})`} />
        {/* Bezier trend line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Data-point dots */}
        {points.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="2" fill="var(--color-accent)" />
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Status badge helper
   ═══════════════════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    Active: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/8',
    Expiring: 'text-amber-600 dark:text-amber-400 border-amber-500/25 bg-amber-500/8',
    Inactive: 'text-rose-500 dark:text-rose-400 border-rose-500/20 bg-rose-500/8',
  };
  return (
    <span
      className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${
        map[status] || 'text-zinc-500 border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50'
      }`}
    >
      {status || 'Unknown'}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TierBadge helper
   ═══════════════════════════════════════════════════════════════════ */
function TierBadge({ tier }) {
  const map = {
    VIP: 'text-accent border-accent-border/40 bg-accent-bg',
    Standard: 'text-blue-500 dark:text-blue-400 border-blue-500/20 bg-blue-500/5',
    Basic: 'text-zinc-500 border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50',
  };
  return (
    <span
      className={`inline-block text-[9px] font-bold px-2 py-0.5 mt-1.5 rounded-md border uppercase tracking-wider ${
        map[tier] || map.Basic
      }`}
    >
      {tier || 'Basic'}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Initials avatar helper
   ═══════════════════════════════════════════════════════════════════ */
function Avatar({ name }) {
  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent border border-accent-border/30 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Spinner  –  Tailwind animated loading indicator
   ═══════════════════════════════════════════════════════════════════ */
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-accent animate-spin" />
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
        Syncing with Firestore…
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EmptyState  –  descriptive empty roster card
   ═══════════════════════════════════════════════════════════════════ */
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-5 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-center text-zinc-300 dark:text-zinc-600">
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No registered gym profiles exist yet</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
          Use the form on the left to add your first member. New profiles will appear here instantly once saved to the cloud.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MemberList  –  main exported component
   Props:
     setEditingMember  {function}  – lifter that passes the selected member
                                     up to App.jsx to bridge the form panel.
   ═══════════════════════════════════════════════════════════════════ */
export default function MemberList({ setEditingMember }) {
  const { members, loading, deleteMember } = useGym();

  const handleDelete = (member) => {
    const confirmed = window.confirm(
      `Remove "${member.fullName || member.name}" from the roster?\n\nThis action cannot be undone.`
    );
    if (confirmed) deleteMember(member.id);
  };

  /* ── Loading skeleton ── */
  if (loading) return <Spinner />;

  return (
    <section className="animate-fade-in">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Member Roster
          </h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {members.length === 0
              ? 'No profiles yet'
              : `${members.length} profile${members.length !== 1 ? 's' : ''} synced from Firestore`}
          </p>
        </div>

        {/* Live indicator dot */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200/60 dark:border-zinc-700/60 bg-white/60 dark:bg-zinc-900/40 text-[10px] text-zinc-500 dark:text-zinc-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Adaptive grid: 1 col → 2 col (md) → 3 col (lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.length === 0 ? (
          <EmptyState />
        ) : (
          members.map((member) => {
            const displayName = member.fullName || member.name || 'Unknown Member';
            const workoutLogArr = Array.isArray(member.workoutLog)
              ? member.workoutLog
              : typeof member.workoutLog === 'string' && member.workoutLog
              ? member.workoutLog.split('\n').filter(Boolean)
              : [];

            return (
              <article
                key={member.id}
                className="
                  group relative flex flex-col
                  bg-white/70 dark:bg-slate-900/70
                  backdrop-blur-md
                  border border-zinc-200/60 dark:border-zinc-800/60
                  rounded-2xl p-5
                  hover:shadow-xl hover:shadow-accent/8
                  hover:border-accent/30
                  hover:-translate-y-0.5
                  transition-all duration-300
                  animate-scale-up
                "
              >
                {/* ── Card header: avatar + name + status ── */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={displayName} />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                        {displayName}
                      </h3>
                      <TierBadge tier={member.membershipTier || member.tier} />
                    </div>
                  </div>
                  <StatusBadge status={member.status} />
                </div>

                {/* ── Metadata rows ── */}
                <div className="flex flex-col gap-2 text-xs py-3.5 border-t border-zinc-100/60 dark:border-zinc-800/60 flex-1">
                  {[
                    {
                      label: 'Registered',
                      value: member.registrationDate || member.joinedDate || '—',
                    },
                    {
                      label: 'Tier',
                      value: member.membershipTier || member.tier || 'Basic',
                    },
                    {
                      label: 'Log Entries',
                      value: workoutLogArr.length
                        ? `${workoutLogArr.length} session${workoutLogArr.length !== 1 ? 's' : ''}`
                        : 'None yet',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center gap-2">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium shrink-0">
                        {label}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200 text-right truncate">
                        {value}
                      </span>
                    </div>
                  ))}

                  {/* Historical narrative workout log */}
                  {workoutLogArr.length > 0 && (
                    <div className="mt-1 pt-3 border-t border-zinc-100/60 dark:border-zinc-800/60">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                        Recent Sessions
                      </p>
                      <ul className="flex flex-col gap-1">
                        {workoutLogArr.slice(-3).map((entry, i) => (
                          <li
                            key={i}
                            className="text-[10px] text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50/70 dark:bg-zinc-800/40 rounded-lg px-2.5 py-1 border border-zinc-100/60 dark:border-zinc-700/40 truncate"
                            title={entry}
                          >
                            {entry}
                          </li>
                        ))}
                        {workoutLogArr.length > 3 && (
                          <li className="text-[9px] text-zinc-400 dark:text-zinc-500 pl-2.5">
                            +{workoutLogArr.length - 3} more…
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* ── Bezier SVG trend sparkline (when data available) ── */}
                  <WorkoutTrendLine workoutLog={workoutLogArr} />
                </div>

                {/* ── Action buttons ── */}
                <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-zinc-100/60 dark:border-zinc-800/60">
                  {/* Modify button */}
                  <button
                    id={`edit-member-${member.id}`}
                    onClick={() => setEditingMember(member)}
                    className="
                      flex-1 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200
                      border border-zinc-200 dark:border-zinc-700
                      bg-transparent text-slate-900 dark:text-white
                      hover:bg-zinc-100 dark:hover:bg-zinc-800
                      hover:border-zinc-400 dark:hover:border-zinc-500
                      active:scale-[0.97]
                      flex items-center justify-center gap-1.5
                    "
                  >
                    <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Modify
                  </button>

                  {/* Delete button */}
                  <button
                    id={`delete-member-${member.id}`}
                    onClick={() => handleDelete(member)}
                    className="
                      w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer
                      border border-zinc-200 dark:border-zinc-700
                      text-rose-500 hover:text-rose-600
                      hover:border-rose-500/50 hover:bg-rose-500/5
                      transition-all duration-200
                      active:scale-[0.97]
                    "
                    title={`Delete ${displayName}`}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
