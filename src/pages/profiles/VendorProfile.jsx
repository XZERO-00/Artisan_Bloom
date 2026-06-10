import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MessageCircle, ChevronRight, PlusCircle, Trash2, Store, ShoppingBag } from 'lucide-react';
import {
  collection, doc, addDoc, deleteDoc, query, where, onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';
import { ChatWidget } from '../../components/chat/ChatWidget';

export const VendorProfile = () => {
  const { user } = useAuthStore();
  const { threads, getUnreadCount, subscribeToUserThreads } = useChatStore();
  const [activeTab, setActiveTab] = useState('products');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatThread, setActiveChatThread] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'resin', stock: '' });
  const [isSaving, setIsSaving] = useState(false);

  const unreadCount = getUnreadCount(user?.uid, 'vendor');

  // Subscribe to Firestore real-time product updates for this vendor
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, 'products'), where('vendorId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoadingProducts(false);
    });
    return unsub;
  }, [user?.uid]);

  // Subscribe to vendor chat threads
  useEffect(() => {
    if (!user?.uid) return;
    return subscribeToUserThreads(user.uid, 'vendor');
  }, [user?.uid, subscribeToUserThreads]);

  const tabs = [
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'chats', label: 'Customer Inquiries', icon: MessageCircle, badge: unreadCount },
  ];

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !user?.uid) return;
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) || 0,
        category: newProduct.category,
        image: `https://picsum.photos/seed/${encodeURIComponent(newProduct.name)}/500/500`,
        vendorId: user.uid,
        vendorName: user.shopName || user.name,
        tags: [newProduct.category, newProduct.name.toLowerCase().split(' ')[0]],
        rating: null,
        reviewCount: 0,
        createdAt: serverTimestamp(),
      });
      setNewProduct({ name: '', price: '', category: 'resin', stock: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteDoc(doc(db, 'products', productId));
  };

  const openChat = (threadId) => { setActiveChatThread(threadId); setIsChatOpen(true); };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary font-serif">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-textMain">{user?.shopName || user?.name}</h1>
          <p className="text-sm text-textLight">{user?.email}</p>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            <Store className="w-3 h-3 inline mr-1" />Vendor / Maker
          </span>
        </div>
      </motion.div>
      {user?.shopBio && <p className="text-sm text-textLight bg-surface rounded-2xl px-5 py-3 mb-6 border border-black/5">{user.shopBio}</p>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-black/5">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-primary' : 'text-textLight hover:text-textMain'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
            {tab.badge > 0 && <span className="bg-primary text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
            {activeTab === tab.id && <motion.div layoutId="vendor-tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
          </div>

          {showAddForm && (
            <motion.form onSubmit={handleAddProduct} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-2xl p-5 mb-6 border border-primary/20 space-y-3">
              <h3 className="font-semibold text-textMain mb-3">Add New Product</h3>
              <input required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product Name" className="w-full bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Price (₹)" className="bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                  placeholder="Stock Qty" className="bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
              </div>
              <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary">
                {['resin', 'lippan', 'bouquets', 'landscape', 'scenery', 'hampers', 'frames', '3d', 'nameplates', 'keychains', 'wall-hangings'].map(c =>
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <div className="flex gap-3">
                <button type="submit" disabled={isSaving}
                  className="flex-1 bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2.5 text-sm text-textLight hover:text-textMain transition-colors">Cancel</button>
              </div>
            </motion.form>
          )}

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-surface rounded-2xl h-24 animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-textLight">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No products yet. Add your first product above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-surface rounded-2xl p-4 border border-black/5 flex gap-4 items-center">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-textMain text-sm truncate">{p.name}</p>
                    <p className="text-primary text-sm font-bold">₹{p.price}</p>
                    <p className="text-xs text-textLight">Stock: {p.stock} · {p.category}</p>
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Chat Tab */}
      {activeTab === 'chats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {threads.length === 0 ? (
            <div className="text-center py-16 text-textLight">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No customer inquiries yet.</p>
            </div>
          ) : (
            threads.map(thread => {
              const unread = thread.unreadByVendor;
              const lastMsg = thread.lastMessage;
              return (
                <button key={thread.threadId} onClick={() => openChat(thread.threadId)}
                  className="w-full bg-surface rounded-2xl p-4 border border-black/5 hover:border-primary/30 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary shrink-0">
                    {thread.customerName?.charAt(0)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between">
                      <p className="font-semibold text-sm text-textMain">{thread.customerName}</p>
                      {unread > 0 && <span className="bg-primary text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                    </div>
                    <p className="text-xs text-textLight truncate">{thread.productName}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-textLight shrink-0" />
                </button>
              );
            })
          )}
        </motion.div>
      )}

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialThreadId={activeChatThread} />
    </div>
  );
};
