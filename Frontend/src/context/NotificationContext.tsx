"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

type NotificationType = "success" | "warning" | "error";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Notifications Portal/Overlay */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-3">
        {notifications.map((n) => (
          <div 
            key={n.id}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
              n.type === "success" 
                ? "bg-[#10B981] text-white" 
                : n.type === "warning" 
                ? "bg-[#F59E0B] text-white" 
                : "bg-[#EF4444] text-white"
            }`}
          >
            {n.type === "success" && <CheckCircle2 size={24} />}
            {n.type === "warning" && <AlertTriangle size={24} />}
            {n.type === "error" && <XCircle size={24} />}
            
            <span className="font-bold">{n.message}</span>
            
            <button 
              onClick={() => removeNotification(n.id)}
              className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
