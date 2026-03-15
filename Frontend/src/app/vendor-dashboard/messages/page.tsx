"use client";
import { useEffect, useState } from "react";
import { listThreads, getThread, sendMessage, Thread } from "@/services/messages.service";

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<{ userId: number; dealId?: number; otherName?: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("user_id");
      if (stored) setCurrentUserId(Number(stored));
    }
  }, []);

  async function loadThreads() {
    const res = await listThreads();
    const threadsData = res.data || [];
    setThreads(threadsData);
    if (!active && threadsData.length) {
      setActive({ 
        userId: threadsData[0].other_id, 
        dealId: threadsData[0].deal_id || undefined,
        otherName: threadsData[0].other_name
      });
    }
  }

  async function loadThread() {
    if (!active) return;
    const res = await getThread(active.userId, active.dealId);
    setMessages(res.data || []);
  }

  useEffect(() => { loadThreads(); }, []);
  useEffect(() => { 
    if (active) {
      loadThread();
      const interval = setInterval(loadThread, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [active?.userId, active?.dealId]);

  async function onSend() {
    if (!input.trim() || !active) return;
    const msg = input.trim();
    setInput("");
    try {
      await sendMessage(active.userId, msg, active.dealId);
      await loadThread();
      await loadThreads();
    } catch (err) {
      alert("Failed to send message");
      setInput(msg);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden h-[80vh] flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] overflow-hidden">
        <aside className="border-r flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {threads.map(t => (
              <button
                key={`${t.other_id}-${t.deal_id || 0}`}
                onClick={() => setActive({ 
                  userId: t.other_id, 
                  dealId: t.deal_id || undefined,
                  otherName: t.other_name 
                })}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  active?.userId === t.other_id && active?.dealId === (t.deal_id || undefined)
                    ? "bg-orange-50 border-orange-200 ring-1 ring-orange-200" 
                    : "hover:bg-gray-50 border-transparent"
                } border`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-bold text-gray-900 truncate flex-1">
                    {t.other_name || `User #${t.other_id}`}
                  </div>
                  {t.unread_count > 0 && (
                    <span className="ml-2 bg-orange-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                      {t.unread_count}
                    </span>
                  )}
                </div>
                {t.deal_title && (
                  <div className="text-[10px] text-orange-600 font-bold mb-1 truncate uppercase tracking-wider">
                    Item: {t.deal_title}
                  </div>
                )}
                <div className="text-xs text-gray-500 truncate">{t.last_content}</div>
                <div className="text-[9px] text-gray-400 mt-1">
                  {new Date(t.last_created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
            {threads.length === 0 && (
              <div className="text-center py-10">
                <div className="text-4xl mb-2">💬</div>
                <div className="text-sm text-gray-500 font-medium">No messages yet</div>
              </div>
            )}
          </div>
        </aside>

        <section className="flex flex-col overflow-hidden bg-gray-50">
          {active ? (
            <>
              <div className="p-4 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div>
                  <h3 className="font-bold text-gray-900">{active.otherName || `User #${active.userId}`}</h3>
                  {active.dealId && (
                    <div className="text-xs text-orange-600 font-medium">Chatting about Ad #{active.dealId}</div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                {messages.map((m, idx) => {
                  const isMe = m.from_user_id === currentUserId;
                  return (
                    <div key={m.id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                        isMe 
                          ? "bg-orange-600 text-white rounded-tr-none" 
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                      }`}>
                        <div className="text-sm leading-relaxed">{m.content}</div>
                        <div className={`text-[9px] mt-1.5 font-medium ${isMe ? "text-orange-100" : "text-gray-400"}`}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                    Start a conversation...
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t">
                <form 
                  onSubmit={(e) => { e.preventDefault(); onSend(); }}
                  className="flex gap-2"
                >
                  <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your message..." 
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" 
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-md active:scale-95"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
              <div className="text-6xl mb-4">✉️</div>
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

