"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, Trash2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getNotifications, markAsRead, markAllRead, deleteNotification, AppNotification } from "@/services/notification.service";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadData = async () => {
    try {
      const res = await getNotifications();
      if (res.success) setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this notification?")) return;
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-4 h-16 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-zinc-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-zinc-900">Notifications</h1>
        <button 
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-orange-600 hover:text-orange-700"
        >
          Mark all read
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
             <p className="text-zinc-500 mt-4 font-medium">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div 
                key={n.id}
                className={`bg-white rounded-xl border p-4 shadow-sm relative transition-all ${!n.read_at ? "border-orange-200 ring-1 ring-orange-100/50" : "border-zinc-200"}`}
              >
                {!n.read_at && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-xl" />}
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-zinc-900 text-sm pr-6">{n.title}</h3>
                  <div className="flex gap-2">
                    {!n.read_at && (
                        <button onClick={() => handleMarkRead(n.id)} className="text-zinc-400 hover:text-orange-600 transition-colors">
                            <CheckCircle size={18} />
                        </button>
                    )}
                    <button onClick={() => handleDelete(n.id)} className="text-zinc-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed mb-3">{n.message}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {n.link && (
                        <button 
                            onClick={() => router.push(n.link!)}
                            className="bg-orange-50 text-orange-600 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                            View Details
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
               <Bell size={32} className="text-zinc-200" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">No notifications</h2>
            <p className="text-zinc-500 text-sm mt-1">We&apos;ll notify you when something important happens.</p>
          </div>
        )}
      </div>
    </div>
  );
}
