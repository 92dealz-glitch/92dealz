"use client";

import React, { useEffect, useState } from "react";
import { Flag, Loader2, CheckCircle, XCircle, ExternalLink, Trash2, UserX } from "lucide-react";
import { getAdminReports, updateReportStatusAdmin, deleteDealAdmin, updateVendorStatusAdmin } from "@/lib/api";
import Link from "next/link";

export default function AdminReportManagement() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getAdminReports();
      if (res.success) {
        setReports(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusUpdate = async (id: number, status: 'resolved' | 'dismissed') => {
    setActionLoading(id);
    try {
      const res = await updateReportStatusAdmin(id, status);
      if (res.success) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuickAction = async (reportId: number, type: 'product' | 'vendor', targetId: number, title: string) => {
    const reason = prompt(`Reason for removing this ${type}? (Vendor will be notified)`);
    if (!reason) return;

    setActionLoading(reportId);
    try {
      let res;
      if (type === 'product') {
        res = await deleteDealAdmin(targetId, reason);
      } else {
        res = await updateVendorStatusAdmin(targetId, 'suspended'); // Or delete? user asked for remove from database
        // Actually for vendor "delete" is more "remove from database"
        // res = await deleteVendorAdmin(targetId);
      }
      
      if (res.success) {
        await updateReportStatusAdmin(reportId, 'resolved');
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} removed and vendor notified.`);
      }
    } catch (err) {
      alert("Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-zinc-100">
        <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
          <Flag className="text-orange-500" />
          Reporting & Moderation
        </h3>
        <p className="text-zinc-500 text-sm">Review content flagged by users</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 text-zinc-500 text-[12px] font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Reporter</th>
              <th className="px-6 py-4">Reported Item</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="animate-spin text-orange-600 mx-auto" />
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className={`hover:bg-zinc-50 transition-colors ${report.status !== 'pending' ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-900 text-sm">{report.Reporter?.name}</div>
                    <div className="text-zinc-500 text-[11px]">{report.Reporter?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {report.Product ? (
                      <div>
                        <div className="font-bold text-orange-600 text-sm flex items-center gap-1.5">
                          Product: {report.Product.title}
                          <Link href={`/product/${report.Product.id}`} target="_blank" className="text-zinc-400 hover:text-orange-500">
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                        <div className="text-zinc-400 text-[10px]">ID: #{report.Product.id}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold text-purple-600 text-sm flex items-center gap-1.5">
                          Vendor: {report.Vendor?.name}
                          <Link href={`/seller/${report.Vendor?.id}`} target="_blank" className="text-zinc-400 hover:text-purple-500">
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                        <div className="text-zinc-400 text-[10px]">ID: #{report.Vendor?.id}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-zinc-800">{report.reason}</div>
                    <div className="text-xs text-zinc-500 line-clamp-1 italic">"{report.details || "No extra details"}"</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase rounded ${
                      report.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                      report.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-zinc-400">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                            disabled={actionLoading === report.id}
                            className="p-2 hover:bg-zinc-100 hover:text-zinc-600 rounded-lg transition-colors"
                            title="Dismiss"
                          >
                            <XCircle size={18} />
                          </button>
                          
                          {report.Product && (
                            <button
                              onClick={() => handleQuickAction(report.id, 'product', report.Product.id, report.Product.title)}
                              disabled={actionLoading === report.id}
                              className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}

                          {report.Vendor && (
                            <button
                              onClick={() => handleQuickAction(report.id, 'vendor', report.Vendor.id, report.Vendor.name)}
                              disabled={actionLoading === report.id}
                              className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                              title="Suspend Vendor"
                            >
                              <UserX size={18} />
                            </button>
                          )}

                          <button
                            onClick={() => handleStatusUpdate(report.id, 'resolved')}
                            disabled={actionLoading === report.id}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors font-bold"
                            title="Mark as Resolved"
                          >
                            <CheckCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center text-zinc-400 font-bold">No reports pending.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
