"use client";

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

export default function DeleteAccountSection() {
  const { showNotification } = useNotification();
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirmation !== "DELETE") {
      showNotification("error", "Please type DELETE to confirm.");
      return;
    }
    
    // Simulate deletion
    showNotification("warning", "Account deletion process started. This is irreversible.");
    setIsDeleting(false);
    setConfirmation("");
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8 font-bold">
      <h2 className="text-lg text-zinc-900 mb-2">Delete Account</h2>
      <p className="text-sm text-zinc-500 mb-8 font-medium">Irreversible actions for your account</p>

      <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-white rounded-xl border border-zinc-100 shadow-sm shrink-0">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <div>
            <h4 className="text-sm text-zinc-900 mb-1">Delete Account</h4>
            <p className="text-sm text-zinc-500 font-medium">Permanently delete your account and all associated data. This action cannot be undone.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsDeleting(true)}
          className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-bold shadow-md shadow-red-500/20 whitespace-nowrap active:scale-95"
        >
          Delete Account
        </button>
      </div>

      {isDeleting && (
        <div className="mt-6 p-6 border border-red-200 bg-red-50 rounded-2xl animate-in zoom-in-95 duration-200">
          <p className="text-sm text-red-900 mb-4">To confirm, please type <span className="font-black italic">DELETE</span> in the field below:</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="type DELETE here"
              className="flex-1 px-4 py-2.5 bg-white border border-red-200 rounded-lg outline-none focus:border-red-500 text-red-900 transition-colors"
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2.5 text-red-900/60 hover:text-red-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
