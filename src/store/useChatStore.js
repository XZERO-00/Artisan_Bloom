import { create } from 'zustand';
import { socket } from '../lib/socket';

const API_URL = 'http://localhost:3001/api/chat';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const useChatStore = create((set, get) => ({
  threads: [],
  activeThreadId: null,
  activeMessages: [],
  
  _pollInterval: null,

  getOrCreateThread: async (threadData) => {
    const res = await fetch(`${API_URL}/threads`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(threadData)
    });
    const data = await res.json();
    set({ activeThreadId: data.threadId });
    return data.threadId;
  },

  setActiveThread: (threadId) => {
    set({ activeThreadId: threadId });
  },

  clearActiveThread: () => {
    set({ activeThreadId: null, activeMessages: [] });
  },

  fetchThreads: async () => {
    try {
      const res = await fetch(`${API_URL}/threads`, { headers: getHeaders() });
      if (res.ok) set({ threads: await res.json() });
    } catch (err) {
      console.error(err);
    }
  },

  subscribeToUserThreads: (userId, role) => {
    get().fetchThreads();
    const interval = setInterval(() => get().fetchThreads(), 5000);
    set({ _pollInterval: interval });
    return () => clearInterval(interval);
  },

  fetchMessages: async (threadId) => {
    try {
      const res = await fetch(`${API_URL}/threads/${threadId}/messages`, { headers: getHeaders() });
      if (res.ok) set({ activeMessages: await res.json() });
    } catch (err) {
      console.error(err);
    }
  },

  subscribeToMessages: (threadId) => {
    get().fetchMessages(threadId);
    
    const handleMessage = (msg) => {
      set(state => ({ activeMessages: [...state.activeMessages, msg] }));
      get().fetchThreads(); 
    };

    socket.on(`chat_message_${threadId}`, handleMessage);

    return () => {
      socket.off(`chat_message_${threadId}`, handleMessage);
    };
  },

  sendMessage: async (threadId, { senderId, senderName, text, senderRole }) => {
    if (!threadId || !text.trim()) return;
    
    await fetch(`${API_URL}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, senderName, senderRole })
    });
  },

  markAsRead: async (threadId, role) => {
    if (!threadId) return;
    await fetch(`${API_URL}/threads/${threadId}/read`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    });
    get().fetchThreads(); 
  },

  getUnreadCount: (userId, role) => {
    return get().threads.reduce((acc, t) => {
      if (role === 'vendor' && t.vendorId === userId) return acc + (t.unreadByVendor || 0);
      if (role === 'customer' && t.customerId === userId) return acc + (t.unreadByCustomer || 0);
      return acc;
    }, 0);
  },

  getThreadsForUser: (userId, role) => {
    return get().threads;
  },
}));

