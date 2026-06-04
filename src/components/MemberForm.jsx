import React, { useState, useEffect } from 'react';
import { useGym } from '../context/GymContext';

/**
 * MemberForm – Cloud CREATE / UPDATE panel.
 *
 * Props
 *   editingMember   {object|null}  – the member object currently being edited, or null for a fresh create.
 *   setEditingMember {function}    – lifter from App.jsx to reset editing state after save.
 */
export default function MemberForm({ editingMember, setEditingMember }) {
  const { addMember, updateMember } = useGym();

  /* ── Local field state ─────────────────────────────────────────── */
  const blank = {
    fullName: '',
    membershipTier: 'Standard',
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    workoutLog: '',
  };

  const [fields, setFields] = useState(blank);
  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState(null); // { type: 'success'|'error', msg }

  /* ── Pre-fill when editingMember changes ──────────────────────── */
  useEffect(() => {
    if (editingMember) {
      setFields({
        fullName: editingMember.fullName || editingMember.name || '',
        membershipTier: editingMember.membershipTier || editingMember.tier || 'Standard',
        registrationDate:
          editingMember.registrationDate || editingMember.joinedDate || new Date().toISOString().split('T')[0],
        status: editingMember.status || 'Active',
        workoutLog: Array.isArray(editingMember.workoutLog)
          ? editingMember.workoutLog.join('\n')
          : editingMember.workoutLog || '',
      });
    } else {
      setFields(blank);
    }
  }, [editingMember]);

  /* ── Handlers ─────────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fields.fullName.trim()) return;

    setSubmitting(true);
    setFlash(null);

    // Normalise workoutLog: store as an array of non-empty lines
    const workoutLogArr = fields.workoutLog
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const payload = {
      fullName: fields.fullName.trim(),
      membershipTier: fields.membershipTier,
      registrationDate: fields.registrationDate,
      status: fields.status,
      workoutLog: workoutLogArr,
    };

    try {
      if (editingMember) {
        await updateMember(editingMember.id, payload);
        setFlash({ type: 'success', msg: 'Member profile updated ✓' });
        setEditingMember(null);
      } else {
        await addMember(payload);
        setFlash({ type: 'success', msg: 'Member added to roster ✓' });
        setFields(blank);
      }
    } catch {
      setFlash({ type: 'error', msg: 'Operation failed. Please try again.' });
    } finally {
      setSubmitting(false);
      // auto-dismiss flash after 3 s
      setTimeout(() => setFlash(null), 3000);
    }
  };

  const handleCancel = () => {
    setEditingMember(null);
    setFields(blank);
    setFlash(null);
  };

  const isEditing = Boolean(editingMember);

  /* ── Shared input class ───────────────────────────────────────── */
  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 ' +
    'bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs ' +
    'placeholder:text-zinc-400 dark:placeholder:text-zinc-500 ' +
    'outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/60 ' +
    'transition-all duration-200';

  const labelCls =
    'block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5';

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <aside
      className={`
        relative flex flex-col rounded-2xl overflow-hidden
        border transition-all duration-300
        ${isEditing
          ? 'border-accent/40 shadow-lg shadow-accent/10'
          : 'border-zinc-200/60 dark:border-zinc-800/60'}
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-md
      `}
    >
      {/* ── Header ── */}
      <div
        className={`px-5 py-4 border-b flex items-center justify-between gap-3
          ${isEditing
            ? 'border-accent/20 bg-accent-bg'
            : 'border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-900/30'}`}
      >
        <div className="flex items-center gap-2.5">
          {/* Icon badge */}
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
              ${isEditing ? 'bg-accent/15 text-accent' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}
          >
            {isEditing ? (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              {isEditing ? 'Edit Member' : 'Add Member'}
            </h2>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-none">
              {isEditing ? `Updating: ${editingMember.fullName || editingMember.name}` : 'Register a new gym profile'}
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            title="Cancel editing"
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-transparent border-none cursor-pointer transition-colors p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Flash banner ── */}
      {flash && (
        <div
          className={`mx-4 mt-4 px-4 py-2.5 rounded-xl text-xs font-semibold animate-fade-in
            ${flash.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400'}`}
        >
          {flash.msg}
        </div>
      )}

      {/* ── Form body ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 flex-1">

        {/* Full Name */}
        <div>
          <label htmlFor="mf-fullName" className={labelCls}>Full Name *</label>
          <input
            id="mf-fullName"
            type="text"
            name="fullName"
            required
            value={fields.fullName}
            onChange={handleChange}
            placeholder="e.g. Sarah Connor"
            className={inputCls}
          />
        </div>

        {/* Membership Tier */}
        <div>
          <label htmlFor="mf-membershipTier" className={labelCls}>Membership Tier</label>
          <select
            id="mf-membershipTier"
            name="membershipTier"
            value={fields.membershipTier}
            onChange={handleChange}
            className={inputCls + ' cursor-pointer'}
          >
            <option value="VIP">VIP</option>
            <option value="Standard">Standard</option>
            <option value="Basic">Basic</option>
          </select>
        </div>

        {/* Registration Date */}
        <div>
          <label htmlFor="mf-registrationDate" className={labelCls}>Registration Date</label>
          <input
            id="mf-registrationDate"
            type="date"
            name="registrationDate"
            value={fields.registrationDate}
            onChange={handleChange}
            className={inputCls}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="mf-status" className={labelCls}>Pass Status</label>
          <select
            id="mf-status"
            name="status"
            value={fields.status}
            onChange={handleChange}
            className={inputCls + ' cursor-pointer'}
          >
            <option value="Active">Active</option>
            <option value="Expiring">Expiring Soon</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Workout Log */}
        <div>
          <label htmlFor="mf-workoutLog" className={labelCls}>
            Workout Log
            <span className="ml-1 font-normal text-zinc-400 normal-case">
              (one entry per line)
            </span>
          </label>
          <textarea
            id="mf-workoutLog"
            name="workoutLog"
            rows={4}
            value={fields.workoutLog}
            onChange={handleChange}
            placeholder={"Jun 3 – Bench 80 kg × 5\nJun 4 – Squat 100 kg × 3"}
            className={inputCls + ' resize-none leading-relaxed'}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-1">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="
                flex-1 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200
                border border-zinc-200 dark:border-zinc-700
                bg-transparent text-slate-900 dark:text-white
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                hover:border-zinc-400 dark:hover:border-zinc-500
                active:scale-[0.98]
              "
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="
              flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all duration-200
              bg-accent/10 dark:bg-accent/15
              hover:bg-accent/20 dark:hover:bg-accent/25
              text-accent border border-accent/30
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-1.5
            "
          >
            {submitting ? (
              <>
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Saving…
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create Profile'
            )}
          </button>
        </div>
      </form>
    </aside>
  );
}
