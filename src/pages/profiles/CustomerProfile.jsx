import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, MessageCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useChatStore } from '../../store/useChatStore';
import { ChatWidget } from '../../components/chat/ChatWidget';

export const CustomerProfile = () => {
  const { user } = useAuthStore();
  const orderStore = useOrderStore?.();
  const { getThreadsForUser, getUnreadCount } = useChatStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatThread, setActiveChatThread] = useState(null);

  const userOrders = orderStore?.orders?.filter(o => o.userId === user?.id) || [];
  const chatThreads = getThreadsForUser(user?.id, 'customer');
  const unreadCount = getUnreadCount(user?.id, 'customer');

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'chats', label: 'Messages', icon: MessageCircle, badge: unreadCount },
  ];

  const openChat = (threadId) => {
    setActiveChatThread(threadId);
    setIsChatOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary font-serif">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-textMain">{user?.name}</h1>
          <p className="text-sm text-textLight">{user?.email}</p>
          <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium mt-1 inline-block">Customer</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-black/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-primary' : 'text-textLight hover:text-textMain'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge > 0 && (
              <span className="bg-primary text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">{tab.badge}</span>
            )}
            {activeTab === tab.id && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 text-textLight">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders yet.</p>
              <p className="text-sm mt-1">Start shopping to see your orders here!</p>
            </div>
          ) : (
            userOrders.map(order => (
              <div key={order.id} className="bg-surface rounded-2xl p-5 border border-black/5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-textLight font-medium uppercase tracking-wide">Order #{order.id?.slice(-6)}</p>
                    <p className="text-sm text-textLight">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">{order.status || 'Processing'}</span>
                </div>
                <div className="space-y-2">
                  {order.items?.slice(0, 2).map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-textMain">{item.name}</p>
                        <p className="text-xs text-textLight">Qty: {item.quantity} · ₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && <p className="text-xs text-textLight">+{order.items.length - 2} more items</p>}
                </div>
                <p className="text-sm font-bold text-textMain mt-3 pt-3 border-t border-black/5">
                  Total: ₹{order.total?.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* Messages Tab */}
      {activeTab === 'chats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {chatThreads.length === 0 ? (
            <div className="text-center py-16 text-textLight">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No messages yet.</p>
              <p className="text-sm mt-1">Click "Ask Maker" on a product to start a conversation!</p>
            </div>
          ) : (
            chatThreads.map(thread => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const unread = thread.unreadByCustomer;
              return (
                <button
                  key={thread.threadId}
                  onClick={() => openChat(thread.threadId)}
                  className="w-full bg-surface rounded-2xl p-4 border border-black/5 hover:border-primary/30 transition-all flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary shrink-0">
                    {thread.vendorName?.charAt(0)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-textMain">{thread.vendorName}</p>
                      {unread > 0 && <span className="bg-primary text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                    </div>
                    <p className="text-xs text-textLight truncate">{thread.productName}</p>
                    {lastMsg && <p className="text-xs text-textLight truncate mt-0.5">{lastMsg.text}</p>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-textLight shrink-0" />
                </button>
              );
            })
          )}
        </motion.div>
      )}

      {/* Chat Widget */}
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialThreadId={activeChatThread} />
    </div>
  );
};
