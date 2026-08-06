import { create } from 'zustand';
import { socket } from '../lib/socket';

const API_URL = 'http://localhost:3001/api/orders';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const useOrderStore = create((set, get) => ({
  orders: [],

  addOrder: async (orderData) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data.orderId;
  },

  fetchOrders: async () => {
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (res.ok) {
        const orders = await res.json();
        set({ orders });
      }
    } catch (err) {
      console.error(err);
    }
  },

  subscribeToUserOrders: (userId) => {
    get().fetchOrders();

    const handleUpdate = () => get().fetchOrders();

    socket.on('new_order', handleUpdate);
    socket.on('order_status_update', handleUpdate);

    return () => {
      socket.off('new_order', handleUpdate);
      socket.off('order_status_update', handleUpdate);
    };
  },

  subscribeToAllOrders: () => {
    get().fetchOrders();

    const handleUpdate = () => get().fetchOrders();

    socket.on('new_order', handleUpdate);
    socket.on('order_status_update', handleUpdate);

    return () => {
      socket.off('new_order', handleUpdate);
      socket.off('order_status_update', handleUpdate);
    };
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_URL}/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
  },

  cleanup: () => {
    set({ orders: [] });
  },
}));

