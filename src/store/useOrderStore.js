import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((state) => ({
        orders: [{ id: Date.now().toString(), date: new Date().toISOString(), ...order }, ...state.orders]
      })),
      getUserOrders: (userEmail) => {
        return get().orders.filter(order => order.userEmail === userEmail);
      }
    }),
    {
      name: 'order-storage',
    }
  )
);
