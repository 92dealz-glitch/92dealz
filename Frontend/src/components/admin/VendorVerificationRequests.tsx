"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Loader2, ExternalLink, ShieldCheck, User } from "lucide-react";
import { getAdminVerifications, reviewAdminVerification } from "@/lib/api";

interface VerificationRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  government_id_url: string;
  createdAt: string;
}

export default function VendorVerificationRequests() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedIdUrl, setSelectedIdUrl] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await getAdminVerifications();
      if (res.success) {
        setRequests(res.data);
      } else {
        throw new Error("Failed to fetch requests");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this verification?`)) return;
    
    setProcessingId(id);
    try {
      const res = await reviewAdminVerification(id, status);
      if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        throw new Error(res.message || "Action failed");
      }
    } catch (err: any) {
      alert(err.message);
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-zinc-900 text-lg flex items-center gap-2">
            <ShieldCheck className="text-blue-500" />
            Vendor Verification Requests
          </h3>
          <p className="text-zinc-500 text-sm">Review government IDs to grant Verified badges</p>
        </div>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase">
          {requests.length} Pending
        </span>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-10 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
          <Clock className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">No pending verification requests</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-100">
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200">Vendor Info</th>
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200">Business Name</th>
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200 text-center">Gov ID</th>
                <th className="px-4 py-3 font-bold text-black border-b-2 border-zinc-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {requests.map((req) => (
                <tr key={req.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{req.name}</div>
                        <div className="text-zinc-500 text-xs">{req.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-zinc-700 text-sm">{req.businessName || "N/A"}</div>
                    <div className="text-zinc-500 text-xs">{req.phone || "No phone"}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => setSelectedIdUrl(req.government_id_url)}
                      className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-2 px-4 rounded-lg text-xs transition-colors"
                    >
                      <ExternalLink size={14} />
                      View ID
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleReview(req.id, "approved")}
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(req.id, "rejected")}
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ID Image Modal */}
      {selectedIdUrl && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedIdUrl(null)}>
          <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
            <img src={selectedIdUrl} alt="Government ID" className="w-full h-auto max-h-[80vh] object-contain" />
            <div className="p-4 flex justify-between items-center bg-zinc-50 border-t">
              <span className="text-zinc-500 font-bold text-sm text-black">Verification ID Document</span>
              <button 
                onClick={() => setSelectedIdUrl(null)}
                className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                title="Close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
