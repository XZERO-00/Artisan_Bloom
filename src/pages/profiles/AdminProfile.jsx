import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, ShieldOff, BarChart2, Store, User, DollarSign, Activity } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';

import toast from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

export const AdminProfile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [usersData, earningsRes] = await Promise.all([
        authService.getAllUsers(),
        fetch('http://localhost:3001/api/earnings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setUsers(usersData);
      
      if (earningsRes.ok) {
        const earningsData = await earningsRes.json();
        setEarnings(earningsData.map(e => ({
          ...e,
          date: e.createdAt ? new Date(e.createdAt).toLocaleDateString() : 'Unknown'
        })));
      }
    } catch (e) {
      toast.error('Failed to load admin data: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const vendors = users.filter(u => u.role === 'vendor');
  const customers = users.filter(u => u.role === 'customer');

  const handleToggleBan = async (userId, isBanned) => {
    try {
      await authService.updateUserStatus(userId, { isBanned: !isBanned });
      toast.success(!isBanned ? 'User banned.' : 'User reinstated.');
      fetchDashboardData();
    } catch (e) { toast.error(e.message); }
  };

  const handleApproveVendor = async (userId) => {
    try {
      await authService.updateUserStatus(userId, { isApproved: true });
      toast.success('Vendor approved!');
      fetchDashboardData();
    } catch (e) { toast.error(e.message); }
  };

  const tabs = [
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart2 },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  // Group earnings by date for the chart
  const earningsByDate = earnings.reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) {
      existing.amount += curr.platformCommission;
    } else {
      acc.push({ date: curr.date, amount: curr.platformCommission });
    }
    return acc;
  }, []);

  const totalEarnings = earnings.reduce((sum, item) => sum + (item.platformCommission || 0), 0);

  const stats = [
    { label: 'Total Users', value: users.length, color: 'bg-blue-100 text-blue-700', icon: Users },
    { label: 'Vendors', value: vendors.length, color: 'bg-green-100 text-green-700', icon: Store },
    { label: 'Customers', value: customers.length, color: 'bg-purple-100 text-purple-700', icon: User },
    { label: 'Platform Revenue', value: `₹${totalEarnings.toFixed(2)}`, color: 'bg-amber-100 text-amber-700', icon: DollarSign },
  ];

  if (isLoading) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-textLight">Loading Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl font-bold text-red-600 font-serif">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-textMain">{user?.name}</h1>
          <p className="text-sm text-textLight">{user?.email}</p>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium mt-1 flex items-center w-max">
            <ShieldCheck className="w-3 h-3 mr-1" /> Administrator
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-black/5 overflow-x-auto custom-scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary' : 'text-textLight hover:text-textMain'}`}>
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
              <div key={stat.label} className="bg-surface rounded-2xl p-5 border border-black/5 flex flex-col justify-between items-start h-full">
                <div className={`p-2 rounded-xl mb-3 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif text-textMain">{stat.value}</p>
                  <p className="text-xs text-textLight mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-black/5 shadow-sm">
              <h3 className="font-semibold text-textMain mb-6 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" /> Revenue Over Time (Platform Commission)
              </h3>
              <div className="h-[300px] w-full">
                {earningsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsByDate}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7A7A7A' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7A7A7A' }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                      />
                      <Line type="monotone" dataKey="amount" stroke="#EAC8B9" strokeWidth={3} dot={{ r: 4, fill: '#DFAA9D', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#F47C62' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-textLight text-sm">No revenue data available yet.</div>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-3xl p-6 border border-black/5 shadow-sm">
              <h3 className="font-semibold text-textMain mb-4">Quick Insights</h3>
              <div className="space-y-4 text-sm text-textLight">
                <div className="p-4 bg-background rounded-2xl border border-black/5">
                  <span className="block text-xs font-bold uppercase tracking-wider mb-1">Average Revenue / Order</span>
                  <span className="text-xl font-serif font-bold text-textMain">
                    ₹{earnings.length > 0 ? (totalEarnings / earnings.length).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="p-4 bg-background rounded-2xl border border-black/5">
                  <span className="block text-xs font-bold uppercase tracking-wider mb-1">Pending Approvals</span>
                  <span className="text-xl font-serif font-bold text-amber-600">
                    {vendors.filter(v => !v.isApproved).length} Vendors
                  </span>
                </div>
                <div className="p-4 bg-background rounded-2xl border border-black/5">
                  <span className="block text-xs font-bold uppercase tracking-wider mb-1">Total Orders with Commission</span>
                  <span className="text-xl font-serif font-bold text-textMain">
                    {earnings.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          
          {/* Vendors Section */}
          <div className="bg-surface rounded-3xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Store className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-textMain text-lg">Vendors ({vendors.length})</h3>
            </div>
            {vendors.length === 0 ? <p className="text-textLight text-sm">No vendors found.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.map(u => (
                  <div key={u.uid} className="bg-background rounded-2xl p-4 border border-black/5 flex items-center gap-4 hover:border-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 shrink-0 text-lg">
                      {u.name?.charAt(0) || 'V'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-textMain truncate">{u.name}</p>
                      <p className="text-xs text-textLight truncate mb-1">{u.email}</p>
                      {u.shopName && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium inline-block truncate max-w-full">{u.shopName}</span>}
                    </div>
                    <div className="flex flex-col gap-2 items-end shrink-0">
                      {!u.isApproved && (
                        <button onClick={() => handleApproveVendor(u.uid)}
                          className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">
                          Approve
                        </button>
                      )}
                      {u.isApproved && !u.isBanned && <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">✓ Approved</span>}
                      {u.uid !== user?.uid && (
                        <button onClick={() => handleToggleBan(u.uid, u.isBanned)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${u.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                        >
                          {u.isBanned ? 'Unban' : 'Suspend'}
                        </button>
                      )}
                      {u.isBanned && <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Banned</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customers Section */}
          <div className="bg-surface rounded-3xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-textMain text-lg">Customers ({customers.length})</h3>
            </div>
            {customers.length === 0 ? <p className="text-textLight text-sm">No customers found.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers.map(u => (
                  <div key={u.uid} className="bg-background rounded-2xl p-4 border border-black/5 flex items-center gap-4 hover:border-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 shrink-0 text-lg">
                      {u.name?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-textMain truncate">{u.name}</p>
                      <p className="text-xs text-textLight truncate">{u.email}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end shrink-0">
                      {u.uid !== user?.uid && (
                        <button onClick={() => handleToggleBan(u.uid, u.isBanned)}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors ${u.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                        >
                          {u.isBanned ? 'Unban' : 'Suspend'}
                        </button>
                      )}
                      {u.isBanned && <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Banned</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      )}
    </div>
  );
};
