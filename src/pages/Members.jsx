import React, { useState } from 'react';

export default function Members({ members, onAddMember, onEditMember, onDeleteMember, onCheckIn }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'Standard',
    status: 'Active',
    joinedDate: new Date().toISOString().split('T')[0]
  });

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      tier: 'Standard',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      tier: member.tier,
      status: member.status,
      joinedDate: member.joinedDate
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingMember) {
      onEditMember({
        ...editingMember,
        ...formData
      });
    } else {
      onAddMember({
        id: 'm_' + Date.now(),
        ...formData,
        lastCheckIn: 'Never'
      });
    }
    handleCloseModal();
  };

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || member.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesTier = tierFilter === 'all' || member.tier.toLowerCase() === tierFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesTier;
  });

  return (
    <div className="animate-fade-in space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Member Directory</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Manage profiles, subscription levels, and log member check-ins.
          </p>
        </div>
        <button
          className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/20 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          onClick={handleOpenAddModal}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Member
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="w-full pl-10 pr-3.5 py-2.5 border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 transition-all duration-300 text-zinc-800 dark:text-zinc-150"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-zinc-800 dark:text-zinc-200 text-xs outline-none cursor-pointer focus:ring-2 focus:ring-accent/15 focus:border-accent/55 transition-all duration-300 flex-1 md:flex-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="expiring">Expiring Soon</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 text-zinc-800 dark:text-zinc-200 text-xs outline-none cursor-pointer focus:ring-2 focus:ring-accent/15 focus:border-accent/55 transition-all duration-300 flex-1 md:flex-none"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
          >
            <option value="all">All Tiers</option>
            <option value="vip">VIP</option>
            <option value="standard">Standard</option>
            <option value="basic">Basic</option>
          </select>
        </div>
      </div>

      {/* Member Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-12 text-center flex flex-col items-center">
          <p className="text-zinc-550 dark:text-zinc-400 text-xs mb-4">No members match your current filters.</p>
          <button
            className="border border-zinc-250 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 bg-transparent px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-900 dark:hover:border-zinc-50 transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5"
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setTierFilter('all'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:shadow-xl hover:shadow-accent/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent border border-accent-border/30 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform duration-300">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">{member.name}</h3>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 mt-1.5 rounded-md border border-transparent uppercase tracking-wider ${member.tier === 'VIP' ? 'text-accent border-accent-border/40 bg-accent-bg' :
                          member.tier === 'Standard' ? 'text-blue-500 border-blue-500/20 bg-blue-500/5' :
                            'text-zinc-500 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800'
                        }`}>
                        {member.tier}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${member.status === 'Active' ? 'text-emerald-600 border-emerald-500/25 bg-emerald-500/5' :
                      member.status === 'Expiring' ? 'text-amber-600 border-amber-500/25 bg-amber-500/5' :
                        'text-rose-500 border-rose-500/20 bg-rose-500/5'
                    }`}>
                    {member.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs py-3.5 border-t border-zinc-150/40 dark:border-zinc-900">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-450 dark:text-zinc-500 font-medium">Email</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250 max-w-[150px] truncate">{member.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-450 dark:text-zinc-500 font-medium">Phone</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">{member.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-450 dark:text-zinc-500 font-medium">Joined</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">{member.joinedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-450 dark:text-zinc-500 font-medium">Last Check-In</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">{member.lastCheckIn}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-zinc-150/40 dark:border-zinc-900">
                <button
                  className="bg-accent/10 dark:bg-accent/15 hover:bg-accent/20 text-accent border border-accent/25 px-3 py-2 rounded-xl text-xs font-bold active:scale-[0.97] transition-all cursor-pointer flex-1 disabled:opacity-45 disabled:hover:brightness-100 disabled:active:scale-100"
                  disabled={member.status === 'Inactive'}
                  onClick={() => onCheckIn(member)}
                >
                  Check In
                </button>
                <button
                  className="border border-zinc-250 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-50 text-zinc-900 dark:text-zinc-50 bg-transparent px-3 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer flex-1"
                  onClick={() => handleOpenEditModal(member)}
                >
                  Edit
                </button>
                <button
                  className="border border-zinc-250 dark:border-zinc-800 w-9 h-9 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-200 cursor-pointer flex-shrink-0"
                  onClick={() => onDeleteMember(member.id)}
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Slide/Pop Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="px-5 py-4.5 border-b border-zinc-150/45 dark:border-zinc-800/50 flex items-center justify-between">
              <h3 className="m-0 text-sm font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{editingMember ? 'Edit Member Profile' : 'Add New Member'}</h3>
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
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Sarah Connor"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="sarah@cyberdyne.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 555-0199"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Membership Tier</label>
                    <select
                      name="tier"
                      className="w-full px-3 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-150 rounded-xl text-xs outline-none cursor-pointer focus:ring-2 focus:ring-accent/15 focus:border-accent/55 transition-all duration-300"
                      value={formData.tier}
                      onChange={handleInputChange}
                    >
                      <option value="VIP">VIP</option>
                      <option value="Standard">Standard</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Pass Status</label>
                    <select
                      name="status"
                      className="w-full px-3 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-850 dark:text-zinc-150 rounded-xl text-xs outline-none cursor-pointer focus:ring-2 focus:ring-accent/15 focus:border-accent/55 transition-all duration-300"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Expiring">Expiring Soon</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Joined Date</label>
                  <input
                    type="date"
                    name="joinedDate"
                    className="w-full px-3.5 py-2.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/55 text-zinc-850 dark:text-zinc-100 transition-all duration-300"
                    value={formData.joinedDate}
                    onChange={handleInputChange}
                  />
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
                  {editingMember ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
