"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, Send, User, Mail } from "lucide-react";
import { listThreads, getThread, sendMessage, Thread } from "@/services/messages.service";
import { apiFetch } from "@/services/apiClient";

export default function MessagingClient() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const [threadsRes, userRes] = await Promise.all([
          listThreads(),
          apiFetch<{ success: boolean; data: any }>("users/profile", { method: "GET" }, true)
        ]);
        if (threadsRes.success) {
          setThreads(threadsRes.data || []);
          if (threadsRes.data && threadsRes.data.length > 0) {
            handleSelectThread(threadsRes.data[0]);
          }
        }
        if (userRes.success) setCurrentUser(userRes.data);
      } catch (err) {
        console.error("Messaging init failed", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSelectThread(thread: Thread) {
    setActiveThread(thread);
    setLoadingMessages(true);
    try {
      const res = await getThread(thread.other_id, thread.deal_id || undefined);
      if (res.success) setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMsg.trim() || !activeThread || !currentUser) return;
    const content = newMsg.trim();
    setNewMsg("");
    try {
      const res = await sendMessage(activeThread.other_id, content, activeThread.deal_id || undefined);
      if (res.success) {
        setMessages([...messages, { 
          id: res.data.id, 
          from_user_id: currentUser.id, 
          content, 
          createdAt: new Date() 
        }]);
      }
    } catch (err) {
      console.error("Failed to send message", err);
      setNewMsg(content);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-orange-600" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden flex h-[700px] max-w-7xl mx-auto w-full">
      {/* Threads Sidebar */}
      <div className="w-80 border-r border-zinc-100 flex flex-col bg-white">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <h2 className="text-xl font-black text-black">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 font-bold flex flex-col items-center">
                <Mail className="mb-2 opacity-20" size={48} />
                No messages yet
            </div>
          ) : (
            threads.map(t => (
              <button
                key={`${t.other_id}-${t.deal_id}`}
                onClick={() => handleSelectThread(t)}
                className={`w-full p-4 flex gap-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 text-left ${activeThread?.other_id === t.other_id && activeThread?.deal_id === t.deal_id ? 'bg-orange-50 border-orange-100' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200 uppercase font-black text-zinc-500">
                  {t.other_name ? t.other_name.slice(0, 1) : <User size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-black text-black truncate">{t.other_name || `User #${t.other_id}`}</span>
                    <span className="text-[10px] text-zinc-400 font-bold">
                        {t.last_created_at ? new Date(t.last_created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  {t.deal_title && <p className="text-[9px] text-orange-600 font-black truncate uppercase tracking-tighter mb-1">{t.deal_title}</p>}
                  <p className="text-xs text-zinc-500 font-bold truncate">{t.last_content}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col relative bg-zinc-50/10">
        {activeThread ? (
          <>
            <div className="p-4 border-b border-zinc-100 flex items-center gap-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black">
                {activeThread.other_name ? activeThread.other_name.slice(0, 1) : "?"}
              </div>
              <div>
                <h3 className="font-black text-black">{activeThread.other_name || `Chat with User #${activeThread.other_id}`}</h3>
                {activeThread.deal_title && <p className="text-[10px] text-orange-600 font-black uppercase">{activeThread.deal_title}</p>}
              </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-orange-600" /></div>
              ) : (
                messages.map((m, idx) => {
                  const isMe = m.from_user_id === currentUser?.id;
                  return (
                    <div key={m.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-2xl text-sm font-bold shadow-sm ${isMe ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white text-black border border-zinc-100 rounded-tl-none'}`}>
                        {m.content}
                        <div className={`text-[9px] mt-1 opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {messages.length === 0 && !loadingMessages && (
                <div className="flex-1 flex items-center justify-center text-zinc-300 font-bold italic py-20">No messages in this thread yet.</div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 bg-white shadow-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button 
                    type="submit" 
                    disabled={!newMsg.trim()}
                    className="bg-orange-600 text-white px-5 rounded-xl hover:bg-orange-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8">
            <Mail className="mb-4 opacity-5" size={120} />
            <p className="font-black text-xl text-zinc-300">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
