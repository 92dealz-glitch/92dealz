"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { Loader2, Send, User, Mail, ArrowLeft, ExternalLink, Calendar, Clock, ChevronLeft, MoreVertical, Search, CheckCircle2 } from "lucide-react";
import { listThreads, getThread, sendMessage, Thread } from "@/services/messages.service";
import { apiFetch } from "@/services/apiClient";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function MessagingClient() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId");
  const dealIdParam = searchParams.get("dealId");

  useEffect(() => {
    async function init() {
      try {
        const [threadsRes, userRes] = await Promise.all([
          listThreads(),
          apiFetch<{ success: boolean; data: any }>("users/profile", { method: "GET" }, true)
        ]);
        
        const fetchedThreads = threadsRes.data || [];
        setThreads(fetchedThreads);
        if (userRes.success) setCurrentUser(userRes.data);

        if (userIdParam) {
          const uId = Number(userIdParam);
          const dId = dealIdParam ? Number(dealIdParam) : undefined;
          
          // Look for any existing thread with this user
          const existing = fetchedThreads.find(t => t.other_id === uId);
          
          if (existing) {
            // If we found a thread with this user but it was for a different deal (or no deal),
            // and the user provided a dId in the URL, we "re-purpose" this thread for the new deal.
            if (dId && existing.deal_id !== dId) {
              const updatedThread = { ...existing, deal_id: dId };
              // Fetch the title for the new deal if possible
              try {
                const dRes = await apiFetch<{success:boolean, data:any}>(`ads/${dId}`);
                if (dRes.success) updatedThread.deal_title = dRes.data.title;
              } catch {}
              handleSelectThread(updatedThread);
            } else {
              handleSelectThread(existing);
            }
          } else {
            // Initiate a dummy thread to start chatting (completely new interaction)
            const virtualThread: Thread = {
              other_id: uId,
              deal_id: dId || null,
              last_id: 0,
              last_content: "",
              last_created_at: new Date().toISOString(),
              unread_count: 0
            };
            try {
              const uRes = await apiFetch<{success:boolean, data:any}>(`users/${uId}`);
              if (uRes.success) virtualThread.other_name = uRes.data.name;
              
              if (dId) {
                const dRes = await apiFetch<{success:boolean, data:any}>(`ads/${dId}`);
                if (dRes.success) virtualThread.deal_title = dRes.data.title;
              }
            } catch {}
            
            setActiveThread(virtualThread);
            setMessages([]);
            setMobileView("chat");
          }
        } else if (fetchedThreads.length > 0 && window.innerWidth >= 768) {
          handleSelectThread(fetchedThreads[0]);
        }
      } catch (err) {
        console.error("Messaging init failed", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [userIdParam, dealIdParam]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSelectThread(thread: Thread) {
    setActiveThread(thread);
    setMobileView("chat");
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
      <div className="flex-1 flex items-center justify-center p-20 min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-orange-600" size={48} />
          <p className="text-zinc-500 font-bold animate-pulse">Syncing your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-160px)] md:h-[750px] max-w-7xl mx-auto w-full relative transition-all duration-500 ease-in-out">
      
      {/* ─── THREADS SIDEBAR ─── */}
      <div className={`
        ${mobileView === "chat" ? "hidden md:flex" : "flex"}
        w-full md:w-[380px] border-r border-zinc-50 flex flex-col bg-white shrink-0
      `}>
        <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
          <h2 className="text-2xl font-black text-black tracking-tight">Messages</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400 transition-colors"><Search size={20} /></button>
            <button className="p-2 rounded-full hover:bg-zinc-50 text-zinc-400 transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {threads.length === 0 ? (
            <div className="p-16 text-center text-zinc-400 font-bold flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-zinc-50 flex items-center justify-center mb-4">
                   <Mail className="opacity-10" size={40} />
                </div>
                <p className="text-lg text-zinc-300">No conversations yet</p>
                <p className="text-sm text-zinc-400 font-medium mt-1">Contact a seller to start a deal!</p>
            </div>
          ) : (
            threads.map(t => {
              const isActive = activeThread?.other_id === t.other_id && activeThread?.deal_id === t.deal_id;
              return (
                <button
                  key={`${t.other_id}-${t.deal_id}`}
                  onClick={() => handleSelectThread(t)}
                  className={`
                    w-full px-4 py-4 flex gap-4 rounded-2xl transition-all duration-200 group relative
                    ${isActive ? 'bg-orange-50/70 border-zinc-100 shadow-[0_4px_12px_rgba(249,115,22,0.05)]' : 'hover:bg-zinc-50/80'}
                  `}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center border border-zinc-200 uppercase font-black text-zinc-500 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {t.other_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.other_image} alt="" className="w-full h-full object-cover" />
                      ) : t.other_name ? t.other_name.slice(0, 1) : <User size={28} />}
                    </div>
                    {t.unread_count > 0 && (
                       <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center border-4 border-white font-black">
                         {t.unread_count}
                       </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-extrabold text-black truncate text-base leading-tight">
                        {t.other_name || `User #${t.other_id}`}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-black whitespace-nowrap pt-1">
                          {t.last_created_at ? new Date(t.last_created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    {t.deal_title && <p className="text-[10px] text-orange-600 font-black truncate uppercase tracking-tight mb-1">{t.deal_title}</p>}
                    <p className={`text-xs truncate font-bold leading-normal ${isActive ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {t.last_content || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ─── CHAT WINDOW ─── */}
      <div className={`
        ${mobileView === "list" ? "hidden md:flex" : "flex"}
        flex-1 flex-col relative bg-zinc-50/30
      `}>
        {activeThread ? (
          <>
            {/* Header */}
            <header className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMobileView("list")}
                  className="md:hidden p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-500"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black shadow-lg shadow-orange-600/20 shrink-0 overflow-hidden">
                  {activeThread.other_image ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={activeThread.other_image} alt="" className="w-full h-full object-cover" />
                  ) : activeThread.other_name ? activeThread.other_name.slice(0, 1) : "?"}
                </div>
                <div>
                  <h3 className="font-black text-black leading-tight flex items-center gap-2 text-lg">
                    {activeThread.other_name || `User #${activeThread.other_id}`}
                    <Link href={`/seller/${activeThread.other_id}`} className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-300 hover:text-orange-600 transition-all shadow-sm">
                      <ExternalLink size={14} />
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wide">Online Now</span>
                  </div>
                </div>
              </div>
              
              {activeThread.deal_title && (
                 <div className="hidden lg:flex flex-col items-end shrink-0">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Current Deal</span>
                    <Link href={`/product/${activeThread.deal_id}`} className="bg-orange-50 text-orange-600 rounded-xl px-4 py-2 text-xs font-black border border-orange-100 hover:bg-orange-100 transition-all shadow-sm">
                      {activeThread.deal_title}
                    </Link>
                 </div>
              )}
            </header>

            {/* Product Sticky Header (Mobile Only & Secondary for Desktop) */}
            {activeThread.deal_title && (
              <div className="lg:hidden p-3 bg-orange-50/50 border-b border-orange-100/50 flex items-center justify-between">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-tight flex items-center gap-2">
                   <Clock size={12} /> Trading Item: {activeThread.deal_title}
                </p>
                <Link href={`/product/${activeThread.deal_id}`} className="text-[9px] font-extrabold text-orange-600 underline">View Full Ad</Link>
              </div>
            )}

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-orange-600" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Encrypting...</span>
                  </div>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isMe = m.from_user_id === currentUser?.id;
                  const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                  const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';
                  
                  // Simple logic to show date headers
                  const showDate = idx === 0 || (messages[idx-1]?.createdAt && new Date(m.createdAt).toDateString() !== new Date(messages[idx-1]?.createdAt).toDateString());

                  return (
                    <React.Fragment key={m.id || idx}>
                      {showDate && (
                         <div className="flex justify-center my-8">
                            <span className="bg-zinc-200/50 text-zinc-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter shadow-sm border border-zinc-50">
                               {dateStr}
                            </span>
                         </div>
                      )}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start animate-fade-in-up'}`}>
                        <div className={`
                          relative max-w-[85%] md:max-w-[70%] p-4 rounded-[2rem] text-[15px] font-bold shadow-md transition-all duration-300
                          ${isMe 
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-tr-none shadow-orange-600/20 ring-4 ring-orange-500/10' 
                            : 'bg-white text-zinc-900 border border-zinc-100 rounded-tl-none shadow-zinc-200/20'
                          }
                        `}>
                          {m.content}
                        </div>
                        <div className={`mt-2 flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          <span>{time}</span>
                          {isMe && <CheckCircle2 size={12} className="text-orange-500" />}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
              {messages.length === 0 && !loadingMessages && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30 select-none">
                  <Mail size={80} className="mb-4 text-zinc-400" />
                  <div className="text-zinc-500 font-black italic text-xl">End-to-End Encrypted</div>
                  <p className="text-xs font-bold uppercase tracking-tight mt-2">Start your conversation safely</p>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-zinc-50 bg-white">
              <div className="flex gap-3 bg-zinc-50 rounded-[2rem] p-2 pr-2 border border-border-zinc-100 shadow-inner focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500/30 transition-all duration-300">
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-5 py-3 text-sm font-bold outline-none text-zinc-800 placeholder:text-zinc-400"
                />
                <button 
                  type="submit" 
                  disabled={!newMsg.trim()}
                  className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/30 active:scale-90 disabled:opacity-20 disabled:grayscale"
                >
                  <Send size={22} className={newMsg.trim() ? "translate-x-0.5" : ""} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
            <div className="relative mb-10">
               <div className="absolute -inset-4 bg-orange-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
               <Mail className="relative opacity-20 text-orange-600" size={160} />
            </div>
            <h3 className="font-black text-3xl text-zinc-900 mb-2 tracking-tight">Your Inbox</h3>
            <p className="font-bold text-zinc-400 max-w-xs text-lg">Select a conversation from the sidebar to start negotiation.</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f4f4f5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e4e4e7; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
