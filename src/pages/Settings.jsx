import React, { useState } from 'react';

export default function Settings({
  settings,
  onSaveSettings,
  onResetData,
  themeAccent,
  onSelectTheme
}) {
  const [formData, setFormData] = useState({
    gymName: settings.gymName || 'Apex Fitness',
    operatingHours: settings.operatingHours || '06:00 AM - 10:00 PM',
    supportContact: settings.supportContact || '+1 (555) 012-3456',
    enableOfflineCaching: settings.enableOfflineCaching !== false,
    enableBackgroundSync: settings.enableBackgroundSync !== false
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetClick = () => {
    if (window.confirm("WARNING: This will reset all member logs, routines, check-ins, and classes to the original mock data. Proceed?")) {
      onResetData();
      alert("App data has been reset to defaults.");
      // Reload states
      setFormData({
        gymName: 'Apex Fitness',
        operatingHours: '06:00 AM - 10:00 PM',
        supportContact: '+1 (555) 012-3456',
        enableOfflineCaching: true,
        enableBackgroundSync: true
      });
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Application Settings</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
          Configure UI theme accents, gym details, and PWA offline storage parameters.
        </p>
      </div>

      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 relative max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Theme Selection */}
          <div className="border-b border-zinc-150/45 dark:border-zinc-800/50 pb-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">UI Theme Customization</h3>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-0.5">
                Choose an accent color. This updates action highlights, status indicators, and SVG chart curves.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Option 1: Violet */}
              <button
                type="button"
                className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2.5 font-semibold text-xs transition-all duration-300 cursor-pointer ${
                  themeAccent === 'violet'
                    ? 'border-accent bg-accent-bg text-zinc-900 dark:text-zinc-50 shadow-md shadow-accent/5 scale-[1.02]'
                    : 'border-zinc-250 dark:border-zinc-800/60 bg-transparent text-zinc-450 hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
                onClick={() => onSelectTheme('violet')}
              >
                <div className="w-5.5 h-5.5 rounded-full bg-[#7c3aed] border-2 border-white dark:border-zinc-900 shadow-md shadow-[#7c3aed]/20" />
                <span>Neon Purple</span>
              </button>

              {/* Option 2: Cyan */}
              <button
                type="button"
                className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2.5 font-semibold text-xs transition-all duration-300 cursor-pointer ${
                  themeAccent === 'cyan'
                    ? 'border-accent bg-accent-bg text-zinc-900 dark:text-zinc-50 shadow-md shadow-accent/5 scale-[1.02]'
                    : 'border-zinc-250 dark:border-zinc-800/60 bg-transparent text-zinc-450 hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
                onClick={() => onSelectTheme('cyan')}
              >
                <div className="w-5.5 h-5.5 rounded-full bg-[#0891b2] border-2 border-white dark:border-zinc-900 shadow-md shadow-[#0891b2]/20" />
                <span>Ocean Blue</span>
              </button>

              {/* Option 3: Emerald */}
              <button
                type="button"
                className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2.5 font-semibold text-xs transition-all duration-300 cursor-pointer ${
                  themeAccent === 'emerald'
                    ? 'border-accent bg-accent-bg text-zinc-900 dark:text-zinc-50 shadow-md shadow-accent/5 scale-[1.02]'
                    : 'border-zinc-250 dark:border-zinc-800/60 bg-transparent text-zinc-450 hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
                onClick={() => onSelectTheme('emerald')}
              >
                <div className="w-5.5 h-5.5 rounded-full bg-[#059669] border-2 border-white dark:border-zinc-900 shadow-md shadow-[#059669]/20" />
                <span>Emerald Pulse</span>
              </button>
            </div>
          </div>

          {/* Gym Profile Details */}
          <div className="border-b border-zinc-150/45 dark:border-zinc-800/50 pb-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Gym Profile Info</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Gym Brand Name</label>
              <input
                type="text"
                name="gymName"
                className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                value={formData.gymName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Daily Operating Hours</label>
                <input
                  type="text"
                  name="operatingHours"
                  className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                  value={formData.operatingHours}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Support Contact Line</label>
                <input
                  type="text"
                  name="supportContact"
                  className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                  value={formData.supportContact}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* PWA offline toggles */}
          <div className="border-b border-zinc-150/45 dark:border-zinc-800/50 pb-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Offline & PWA Configuration</h3>
            
            <div className="flex justify-between items-center gap-4 py-1">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-250 leading-tight">Enable Offline Caching (PWA Mode)</span>
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1 max-w-[500px] leading-relaxed">Saves app shells and pages locally in service workers for offline loads.</span>
              </div>
              <label className="relative inline-block w-9 h-5 flex-shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableOfflineCaching"
                  className="opacity-0 w-0 h-0 peer"
                  checked={formData.enableOfflineCaching}
                  onChange={handleInputChange}
                />
                <span className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-200 dark:bg-zinc-800 peer-checked:bg-accent transition-colors rounded-full before:absolute before:content-[''] before:h-3.5 before:w-3.5 before:left-0.5 before:bottom-0.5 before:bg-white dark:before:bg-zinc-950 peer-checked:before:translate-x-4 before:transition-transform before:rounded-full" />
              </label>
            </div>

            <div className="flex justify-between items-center gap-4 py-1">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-250 leading-tight">Background Data Syncing</span>
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1 max-w-[500px] leading-relaxed">Automatically syncs local activity logs to database when connection is re-established.</span>
              </div>
              <label className="relative inline-block w-9 h-5 flex-shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableBackgroundSync"
                  className="opacity-0 w-0 h-0 peer"
                  checked={formData.enableBackgroundSync}
                  onChange={handleInputChange}
                />
                <span className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-200 dark:bg-zinc-800 peer-checked:bg-accent transition-colors rounded-full before:absolute before:content-[''] before:h-3.5 before:w-3.5 before:left-0.5 before:bottom-0.5 before:bg-white dark:before:bg-zinc-950 peer-checked:before:translate-x-4 before:transition-transform before:rounded-full" />
              </label>
            </div>
          </div>

          {/* System Tools */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-rose-500 tracking-tight">System Maintenance</h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl gap-4">
              <div className="max-w-md">
                <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Clear Local Storage Data</span>
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed">
                  Reset all modules with original mock values. Useful for layout audits and testing environment resets.
                </span>
              </div>
              <button
                type="button"
                className="border border-rose-500/40 text-rose-500 hover:text-rose-600 hover:border-rose-500/60 bg-transparent px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:bg-rose-500/5 active:scale-[0.98] transition-all self-end sm:self-auto"
                onClick={handleResetClick}
              >
                Reset Database
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button 
              type="submit" 
              className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-5 py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Settings
            </button>
            
            {saveSuccess && (
              <span className="text-emerald-500 text-xs font-semibold animate-fade-in flex items-center gap-1">
                ✓ Settings saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
