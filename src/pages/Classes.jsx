import React, { useState } from 'react';

export default function Classes({ classes, onAddClass, onToggleBookClass, onDeleteClass, onUpdateClass }) {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Set default active tab to today's weekday, default to Monday if Sunday/not matched
  const getTodayTab = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const current = days[new Date().getDay()];
    return current === 'Sunday' ? 'Sunday' : current;
  };

  const [activeTab, setActiveTab] = useState(getTodayTab());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    instructor: '',
    day: activeTab,
    time: '08:00 AM',
    duration: '60 mins',
    capacity: 20
  });

  const handleOpenModal = () => {
    setFormData(prev => ({
      ...prev,
      day: activeTab // Default to current day tab
    }));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      instructor: '',
      day: activeTab,
      time: '08:00 AM',
      duration: '60 mins',
      capacity: 20
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.instructor) return;

    onAddClass({
      id: 'c_' + Date.now(),
      ...formData,
      enrolled: 0,
      isBooked: false
    });
    handleCloseModal();
  };

  // Filter classes by day
  const filteredClasses = classes.filter(c => c.day === activeTab);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Class Schedule</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Book group classes, manage weekly sessions, and view seats configuration.
          </p>
        </div>
        <button 
          className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          onClick={handleOpenModal}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <line x1="12" y1="14" x2="12" y2="18" />
            <line x1="10" y1="16" x2="14" y2="16" />
          </svg>
          Add Session
        </button>
      </div>

      {/* Weekday Filter Sliding Tabs */}
      <div className="bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40 p-1 rounded-2xl flex gap-1 overflow-x-auto w-full md:w-max max-w-full scrollbar-none">
        {weekdays.map(day => (
          <button
            key={day}
            className={`px-4 py-2 rounded-xl border-none bg-transparent text-xs font-bold cursor-pointer whitespace-nowrap transition-all duration-300 ${
              activeTab === day
                ? 'bg-white dark:bg-zinc-800 text-accent shadow-sm font-bold scale-[1.02]'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/40 dark:hover:bg-zinc-800/20'
            }`}
            onClick={() => setActiveTab(day)}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-12 text-center flex flex-col items-center">
          <p className="text-zinc-550 dark:text-zinc-400 text-xs mb-4">No classes scheduled for {activeTab}.</p>
          <button 
            className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
            onClick={handleOpenModal}
          >
            Schedule First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((item) => {
            const enrollmentPercent = Math.min(100, Math.round((item.enrolled / item.capacity) * 100));
            const isFull = item.enrolled >= item.capacity && !item.isBooked;

            return (
              <div 
                key={item.id} 
                className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-accent/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5 gap-2">
                    <h3 className="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-snug">{item.name}</h3>
                    <span className="text-[10px] text-accent font-bold bg-accent-bg border border-accent-border px-2.5 py-0.5 rounded-md whitespace-nowrap">{item.time}</span>
                  </div>
                  
                  <div className="text-zinc-400 dark:text-zinc-500 text-xs mb-5">
                    Instructor: <strong className="text-zinc-700 dark:text-zinc-300 font-medium">{item.instructor}</strong> &middot; <span>{item.duration}</span>
                  </div>

                  <div className="mb-5 space-y-3">
                    <div className="flex justify-between text-[10px] text-zinc-450 dark:text-zinc-500 font-medium">
                      <span>Enrolled: {item.enrolled} / {item.capacity}</span>
                      <span className={`font-semibold ${isFull ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-50'}`}>
                        {isFull ? 'FULLY BOOKED' : `${enrollmentPercent}% Booked`}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-200/50 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${enrollmentPercent}%`,
                          background: isFull ? '#f43f5e' : 'var(--accent-color)'
                        }}
                      />
                    </div>
                    
                    {/* Add/Remove Spots Controls */}
                    <div className="flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/30 p-2 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 text-[10px] gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 dark:text-zinc-400 font-bold">Booked:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Remove booked spot"
                            className="w-4.5 h-4.5 flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 hover:border-rose-500 hover:text-rose-500 rounded-md cursor-pointer transition-all active:scale-95 font-bold"
                            onClick={() => {
                              const newEnrolled = Math.max(0, item.enrolled - 1);
                              onUpdateClass({
                                ...item,
                                enrolled: newEnrolled,
                                isBooked: newEnrolled > 0 ? item.isBooked : false
                              });
                            }}
                          >
                            -
                          </button>
                          <span className="font-semibold w-4 text-center">{item.enrolled}</span>
                          <button
                            type="button"
                            title="Add booked spot"
                            className="w-4.5 h-4.5 flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 rounded-md cursor-pointer transition-all active:scale-95 font-bold"
                            onClick={() => {
                              onUpdateClass({
                                ...item,
                                enrolled: Math.min(item.capacity, item.enrolled + 1)
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 dark:text-zinc-400 font-bold">Capacity:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Decrease capacity"
                            className="w-4.5 h-4.5 flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 hover:border-rose-500 hover:text-rose-500 rounded-md cursor-pointer transition-all active:scale-95 font-bold"
                            onClick={() => {
                              const newCapacity = Math.max(item.enrolled, item.capacity - 1);
                              onUpdateClass({
                                ...item,
                                capacity: newCapacity
                              });
                            }}
                          >
                            -
                          </button>
                          <span className="font-semibold w-4 text-center">{item.capacity}</span>
                          <button
                            type="button"
                            title="Increase capacity"
                            className="w-4.5 h-4.5 flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-500 rounded-md cursor-pointer transition-all active:scale-95 font-bold"
                            onClick={() => {
                              onUpdateClass({
                                ...item,
                                capacity: item.capacity + 1
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-3.5 border-t border-zinc-150/40 dark:border-zinc-900">
                  <button
                    className={`flex-1 border px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] ${
                      item.isBooked
                        ? 'border-zinc-250 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        : 'bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 active:scale-[0.98] transition-all cursor-pointer shadow-sm'
                    }`}
                    disabled={isFull}
                    onClick={() => onToggleBookClass(item.id)}
                  >
                    {item.isBooked ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Booked (Cancel)
                      </span>
                    ) : 'Book Spot'}
                  </button>
                  <button
                    className="border border-zinc-250 dark:border-zinc-800 w-9 h-9 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-200 cursor-pointer flex-shrink-0"
                    onClick={() => onDeleteClass(item.id)}
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="px-5 py-4.5 border-b border-zinc-150/45 dark:border-zinc-800/50 flex items-center justify-between">
              <h3 className="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Schedule New Class</h3>
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

            <form onSubmit={handleSubmit}>
              <div className="p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Class Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Cardio Kickboxing"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Instructor Name *</label>
                  <input
                    type="text"
                    name="instructor"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                    required
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="Jessica Miller"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Weekday</label>
                    <select
                      name="day"
                      className="w-full px-3 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-150 rounded-xl text-xs outline-none cursor-pointer focus:ring-2 focus:ring-accent/15 focus:border-accent/55 transition-all duration-300"
                      value={formData.day}
                      onChange={handleInputChange}
                    >
                      {weekdays.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Time Slot</label>
                    <input
                      type="text"
                      name="time"
                      className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                      value={formData.time}
                      onChange={handleInputChange}
                      placeholder="09:30 AM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="45 mins"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Max Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                      min="1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                    />
                  </div>
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
                  Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
