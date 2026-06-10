import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, ChevronLeft } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';

export const ChatWidget = ({ isOpen, onClose, initialThreadId = null }) => {
  const { user } = useAuthStore();
  const {
    threads, activeThreadId, activeMessages,
    setActiveThread, sendMessage, markAsRead,
    clearActiveThread, subscribeToMessages,
  } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Set thread from prop
  useEffect(() => {
    if (initialThreadId) setActiveThread(initialThreadId);
  }, [initialThreadId, setActiveThread]);

  // Subscribe to real-time Firestore messages when active thread changes
  useEffect(() => {
    if (activeThreadId) {
      const unsub = subscribeToMessages(activeThreadId);
      markAsRead(activeThreadId, user?.role);
      return unsub;
    }
  }, [activeThreadId, subscribeToMessages, markAsRead, user?.role]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId || !user) return;
    await sendMessage(activeThreadId, {
      senderId: user.uid,
      senderName: user.name,
      text: inputText.trim(),
      senderRole: user.role,
    });
    setInputText('');
  };

  const handleClose = () => {
    clearActiveThread();
    onClose();
  };

  const activeThread = threads.find(t => t.threadId === activeThreadId);
  const otherPartyName = user?.role === 'customer'
    ? activeThread?.vendorName
    : activeThread?.customerName;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-[200] w-[360px] max-h-[500px] bg-background rounded-[1.5rem] shadow-2xl border border-black/8 flex flex-col overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-surface border-b border-black/5">
            <div className="flex items-center gap-2">
              {activeThreadId && (
                <button onClick={() => clearActiveThread()}
                  className="p-1 rounded-full hover:bg-background transition-colors text-textLight">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm text-textMain">
                {activeThread ? otherPartyName : 'Messages'}
              </span>
              {activeThread && (
                <span className="text-xs text-textLight truncate max-w-[120px]">· {activeThread.productName}</span>
              )}
            </div>
            <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-primary/10 transition-colors text-textLight hover:text-textMain">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Thread List */}
          {!activeThreadId ? (
            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-textLight text-sm gap-2">
                  <MessageCircle className="w-8 h-8 opacity-30" />
                  <p>No conversations yet.</p>
                </div>
              ) : (
                threads.map(thread => {
                  const unread = user?.role === 'vendor' ? thread.unreadByVendor : thread.unreadByCustomer;
                  const otherName = user?.role === 'customer' ? thread.vendorName : thread.customerName;
                  return (
                    <button key={thread.threadId} onClick={() => setActiveThread(thread.threadId)}
                      className="w-full text-left px-5 py-3.5 border-b border-black/5 hover:bg-surface transition-colors flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm shrink-0 mt-0.5">
                        {otherName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-sm text-textMain truncate">{otherName}</p>
                          {unread > 0 && (
                            <span className="bg-primary text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full ml-2 shrink-0">{unread}</span>
                          )}
                        </div>
                        <p className="text-xs text-textLight truncate">{thread.productName}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <>
              {/* Messages — sourced from real-time Firestore subscription */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 min-h-0">
                {activeMessages.length === 0 && (
                  <div className="text-center text-xs text-textLight mt-6">
                    Start the conversation about <span className="font-semibold">{activeThread?.productName}</span>
                  </div>
                )}
                {activeMessages.map(msg => {
                  const isMine = msg.senderId === user?.uid;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                        isMine ? 'bg-primary text-white rounded-br-sm' : 'bg-surface text-textMain rounded-bl-sm'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[0.6rem] mt-1 ${isMine ? 'text-white/60' : 'text-textLight'}`}>
                          {msg.timestamp?.toDate
                            ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '...'}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="px-4 py-3 border-t border-black/5 flex items-center gap-2">
                <input type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface rounded-full px-4 py-2 text-sm focus:outline-none border border-transparent focus:border-primary/40 transition-colors" />
                <button type="submit" disabled={!inputText.trim()}
                  className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
