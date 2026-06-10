import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, ShieldOff, BarChart2, Store, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

export const AdminProfile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(() => authService.getAllUsers());

  const vendors = users.filter(u => u.role === 'vendor');
  const customers = users.filter(u => u.role === 'customer');

  const handleToggleBan = (userId, isBanned) => {
    try {
      authService.updateUserStatus(userId, { isBanned: !isBanned });
      setUsers(authService.getAllUsers());
      toast.success(!isBanned ? 'User banned.' : 'User reinstated.');
    } catch (e) { toast.error(e.message); }
  };

  const handleApproveVendor = (userId) => {
    try {
      authService.updateUserStatus(userId, { isApproved: true });
      setUsers(authService.getAllUsers());
      toast.success('Vendor approved!');
    } catch (e) { toast.error(e.message); }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  // Analytics mock data
  const stats = [
    { label: 'Total Users', value: users.filter(u => u.role !== 'admin').length, color: 'bg-blue-100 text-blue-700' },
    { label: 'Vendors', value: vendors.length, color: 'bg-green-100 text-green-700' },
    { label: 'Customers', value: customers.length, color: 'bg-purple-100 text-purple-700' },
    { label: 'Pending Approval', value: vendors.filter(v => !v.isApproved).length, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl font-bold text-red-600 font-serif">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-textMain">{user?.name}</h1>
          <p className="text-sm text-textLight">{user?.email}</p>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            <ShieldCheck className="w-3 h-3 inline mr-1" />Administrator
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-black/5">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-textLight hover:text-textMain'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
            {activeTab === tab.id && <motion.div layoutId="admin-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(stat => (
              <div key={stat.label} className="bg-surface rounded-2xl p-5 border border-black/5 text-center">
                <p className={`text-3xl font-bold font-serif ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                <p className="text-xs text-textLight mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface rounded-2xl p-5 border border-black/5">
            <h3 className="font-semibold text-textMain mb-4">Platform Overview</h3>
            <p className="text-sm text-textLight">
              The CraftNest currently hosts <strong className="text-textMain">{vendors.length} active vendor{vendors.length !== 1 ? 's' : ''}</strong> and serves <strong className="text-textMain">{customers.length} customer{customers.length !== 1 ? 's' : ''}</strong>. 
              {vendors.filter(v => !v.isApproved).length > 0 && (
                <> <span className="text-amber-600 font-semibold">{vendors.filter(v => !v.isApproved).length} vendor(s)</span> are awaiting approval.</>
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Vendors Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Store className="w-4 h-4 text-green-600" />
              <h3 className="font-semibold text-textMain">Vendors ({vendors.length})</h3>
            </div>
            <div className="space-y-3">
              {vendors.map(u => (
                <div key={u.id} className="bg-surface rounded-2xl p-4 border border-black/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 shrink-0">
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-textMain">{u.name}</p>
                    <p className="text-xs text-textLight truncate">{u.email}</p>
                    {u.shopName && <p className="text-xs text-green-600">{u.shopName}</p>}
                  </div>
                  <div className="flex gap-2 items-center">
                    {!u.isApproved && (
                      <button onClick={() => handleApproveVendor(u.id)}
                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                        Approve
                      </button>
                    )}
                    {u.isApproved && !u.isBanned && <span className="text-xs text-green-600 font-medium">✓ Approved</span>}
                    {u.id !== 'vendor-001' && (
                      <button onClick={() => handleToggleBan(u.id, u.isBanned)}
                        className={`p-2 rounded-full transition-colors ${u.isBanned ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}
                        title={u.isBanned ? 'Unban user' : 'Ban user'}>
                        {u.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                      </button>
                    )}
                    {u.isBanned && <span className="text-xs text-red-500 font-medium">Banned</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customers Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-textMain">Customers ({customers.length})</h3>
            </div>
            <div className="space-y-3">
              {customers.map(u => (
                <div key={u.id} className="bg-surface rounded-2xl p-4 border border-black/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 shrink-0">
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-textMain">{u.name}</p>
                    <p className="text-xs text-textLight truncate">{u.email}</p>
                  </div>
                  {u.id !== 'customer-001' && (
                    <button onClick={() => handleToggleBan(u.id, u.isBanned)}
                      className={`p-2 rounded-full transition-colors ${u.isBanned ? 'text-green-500 hover:bg-green-50' : 'text-red-400 hover:bg-red-50'}`}
                      title={u.isBanned ? 'Unban' : 'Ban'}>
                      {u.isBanned ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                    </button>
                  )}
                  {u.isBanned && <span className="text-xs text-red-500 font-medium">Banned</span>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
