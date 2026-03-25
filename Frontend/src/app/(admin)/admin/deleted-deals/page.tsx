"use client";
export const dynamic = "force-dynamic";

import React from "react";
import { 
  History, 
  RotateCcw, 
  Trash,
  Info,
  Download,
  Bell,
} from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

const deletedDealsData = [
  { 
    id: 1, 
    title: "Samsung Galaxy", 
    price: "₦450,000", 
    merchant: "TechHub", 
    category: "Electronics", 
    clicks: "5,897", 
    deletedDate: "2 days ago",
    deletedBy: "Admin User"
  },
  { 
    id: 2, 
    title: "Nike Air Max 270", 
    price: "₦450,000", 
    merchant: "TechHub", 
    category: "Phones", 
    clicks: "5,897", 
    deletedDate: "2 days ago",
    deletedBy: "System"
  },
  { 
    id: 3, 
    title: "Nike Air Max 270", 
    price: "₦85,000", 
    merchant: "SportsWorld", 
    category: "Fashion", 
    clicks: "1,000", 
    deletedDate: "5 days ago",
    deletedBy: "Admin User"
  },
];

export default function DeletedDealsPage() {
  const { showNotification } = useNotification();
  const hasDeals = deletedDealsData.length > 0;

  const handleRestore = (title: string) => {
    showNotification("success", `Deal "${title}" restored successfully`);
  };

  const handleRestoreAll = () => {
    showNotification("success", "All deals restored successfully");
  };

  const handleDeleteForever = (title: string) => {
    showNotification("warning", `Deal "${title}" permanently deleted`);
  };

  const handleEmptyTrash = () => {
    showNotification("warning", "Trash emptied successfully");
  };

  return (
    <div className="space-y-8 font-bold">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Deleted Deals</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-semibold text-zinc-700">
            <Download size={16} />
            Export
          </button>
          <button className="relative p-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
            <Bell size={20} className="text-zinc-600" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Deleted Deals</h2>
            <p className="text-sm text-zinc-500">Manage soft-deleted deals. Items will be permanently deleted after 30 days.</p>
          </div>
          {hasDeals && (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRestoreAll}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors text-sm font-bold text-zinc-700 active:scale-95"
              >
                <RotateCcw size={18} />
                Restore All
              </button>
              <button 
                onClick={handleEmptyTrash}
                className="flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-bold text-zinc-700 active:scale-95"
              >
                <Trash size={18} />
                Empty Trash
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Info Alert */}
          <div className="flex items-start gap-3 bg-zinc-50 border border-zinc-200 p-4 rounded-xl mb-6">
            <Info className="text-zinc-500 mt-0.5" size={20} />
            <div className="text-sm text-zinc-600">
              <p className="font-bold">Items in trash will be permanently deleted after 30 days</p>
              <p>You can restore deals before they are permanently removed from the system.</p>
            </div>
          </div>

          {!hasDeals ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                <Trash size={40} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">No deleted deals</h3>
              <p className="text-zinc-500 max-w-sm">When you delete deals, they&apos;ll appear here for 30 days before being permanently removed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-100 rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-500 text-[12px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Deal Title</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Merchant</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Clicks</th>
                    <th className="px-6 py-4">Deleted Date</th>
                    <th className="px-6 py-4">Deleted By</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 italic">
                  {deletedDealsData.map((deal) => (
                    <tr key={deal.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-zinc-900">{deal.title}</td>
                      <td className="px-6 py-4 text-sm font-bold text-zinc-900">{deal.price}</td>
                      <td className="px-6 py-4 text-sm text-zinc-600">{deal.merchant}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{deal.category}</td>
                      <td className="px-6 py-4 text-sm text-zinc-600 font-medium">{deal.clicks}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{deal.deletedDate}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{deal.deletedBy}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleRestore(deal.title)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 text-zinc-700 text-[11px] font-bold rounded hover:bg-zinc-300 transition-colors active:scale-95"
                          >
                            <RotateCcw size={14} />
                            Restore
                          </button>
                          <button 
                            onClick={() => handleDeleteForever(deal.title)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-200 text-zinc-700 text-[11px] font-bold rounded hover:bg-red-100 hover:text-red-600 transition-colors active:scale-95"
                          >
                            <Trash size={14} />
                            Delete Forever
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

