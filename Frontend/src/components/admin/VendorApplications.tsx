"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, ExternalLink } from "lucide-react";
import { API_BASE } from "@/services/apiClient";
import { useAlert } from "@/context/AlertContext";

interface Submission {
  id: number;
  title: string;
  price: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  description: string;
  created_at: string;
}

export default function VendorApplications() {
  const { showAlert } = useAlert();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchSubmissions = async () => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE}/admin/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch submissions");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: number, status: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE}/admin/submissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s))
        );
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err: any) {
      showAlert(err.message, "Update Error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm mt-8">
      <div className="mb-6">
        <h3 className="font-bold text-zinc-900 text-lg">Vendor Deal Submissions</h3>
        <p className="text-zinc-500 text-sm">Review and approve vendor ads before they go live</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-10 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
          <Clock className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">No pending applications found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-100">
                <th className="px-4 py-3 font-bold">Deal Info</th>
                <th className="px-4 py-3 font-bold">Price</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {submissions.map((sub) => (
                <tr key={sub.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="font-bold text-zinc-900 text-sm">{sub.title}</div>
                    <div className="text-zinc-500 text-xs truncate max-w-[200px]">{sub.description}</div>
                  </td>
                  <td className="px-4 py-4 font-bold text-zinc-700 text-sm">
                    ₦ {Number(sub.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${
                        sub.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : sub.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {sub.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(sub.id, "APPROVED")}
                          disabled={processingId === sub.id}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sub.id, "REJECTED")}
                          disabled={processingId === sub.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-zinc-300 text-xs italic">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
