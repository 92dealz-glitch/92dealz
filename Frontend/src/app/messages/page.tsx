"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiFetch } from "@/services/apiClient";
import { Loader2, Search, Send, User } from "lucide-react";
import Link from "next/link";

export default function MessagesPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadThreads() {
      try {
        const [threadsRes, userRes] = await Promise.all([
          apiFetch<{ success: boolean; data: any[] }>("messages/threads", { method: "GET" }, true),
          apiFetch<{ success: boolean; data: any }>("users/profile", { method: "GET" }, true)
        ]);
        if (threadsRes.success) {
          setThreads(threadsRes.data);
          if (threadsRes.data.length > 0) {
            handleSelectThread(threadsRes.data[0]);
          }
        }
        if (userRes.success) setCurrentUser(userRes.data);
      } catch (err) {
        console.error("Failed to load threads", err);
      } finally {
        setLoading(false);
      }
    }
    loadThreads();
  }, []);

  async function handleSelectThread(thread: any) {
    setActiveThread(thread);
    setLoadingMessages(true);
    try {
      const res = await apiFetch<{ success: boolean; data: any[] }>(`messages/thread?userId=${thread.other_id}${thread.deal_id ? `&dealId=${thread.deal_id}` : ''}`, { method: "GET" }, true);
      if (res.success) setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMsg.trim() || !activeThread) return;
    try {
      const res = await apiFetch<{ success: boolean; data: any }>("messages", {
        method: "POST",
        body: JSON.stringify({
          to_user_id: activeThread.other_id,
          deal_id: activeThread.deal_id,
          content: newMsg.trim()
        })
      }, true);
      if (res.success) {
        setMessages([...messages, { id: res.data.id, from_user_id: currentUser.id, content: newMsg.trim(), createdAt: new Date() }]);
        setNewMsg("");
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={40} /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden flex h-[700px]">
          {/* Threads Sidebar */}
          <div className="w-80 border-r border-zinc-100 flex flex-col">
            <div className="p-4 border-b border-zinc-100">
              <h2 className="text-xl font-black text-black">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 font-bold">No messages yet</div>
              ) : (
                threads.map(t => (
                  <button
                    key={`${t.other_id}-${t.deal_id}`}
                    onClick={() => handleSelectThread(t)}
                    className={`w-full p-4 flex gap-3 hover:bg-zinc-50 transition-colors border-b border-zinc-50 text-left ${activeThread?.other_id === t.other_id ? 'bg-orange-50' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                      <User className="text-zinc-400" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-black text-black truncate">User #{t.other_id}</span>
                        <span className="text-[10px] text-zinc-400 font-bold">{t.last_created_at ? new Date(t.last_created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''}</span>
                      </div>
                      <p className="text-xs text-zinc-500 font-bold truncate">{t.last_content}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col relative">
            {activeThread ? (
              <>
                <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                    <User className="text-zinc-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-black">Chat with User #{activeThread.other_id}</h3>
                    {activeThread.deal_id && <p className="text-[10px] text-orange-600 font-black">Deal ID: {activeThread.deal_id}</p>}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-orange-600" /></div>
                  ) : (
                    messages.map((m, idx) => (
                      <div key={idx} className={`flex ${m.from_user_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm font-bold shadow-sm ${m.from_user_id === currentUser?.id ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white text-black border border-zinc-100 rounded-tl-none'}`}>
                          {m.content}
                          <div className={`text-[9px] mt-1 opacity-70 ${m.from_user_id === currentUser?.id ? 'text-right' : 'text-left'}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-orange-500"
                    />
                    <button type="submit" className="bg-orange-600 text-white p-2 rounded-xl hover:bg-orange-700 transition-colors shadow-sm">
                      <Send size={20} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8">
                <Mail className="mb-4 opacity-20" size={64} />
                <p className="font-black text-lg">Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
