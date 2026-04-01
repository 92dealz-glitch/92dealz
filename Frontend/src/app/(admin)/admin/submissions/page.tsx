"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Clock, 
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  MapPin,
  Tag
} from "lucide-react";
import { getAdminSubmissions, updateAdminSubmissionStatus } from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING: "bg-orange-50 text-orange-600 border-orange-100",
    APPROVED: "bg-green-50 text-green-600 border-green-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
  };
  
  const colors = styles[status as keyof typeof styles] || "bg-zinc-50 text-zinc-600 border-zinc-100";
  
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${colors}`}>
      {status}
    </span>
  );
}

function DetailBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
      <div className="text-zinc-400 text-[10px] font-black uppercase mb-1">{label}</div>
      <div className="text-black font-bold text-sm">{value}</div>
    </div>
  );
}

function ClipboardListIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4D4D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M9 8h6" />
    </svg>
  );
}

// --- Main Page Component ---

interface Submission {
  id: number;
  title: string;
  price: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  image_url: string | null;
  images_json: string | null;
  condition?: string;
  brand?: string;
  model?: string;
  state?: string;
  city?: string;
  user_id: number;
}

export default function SubmissionsPage() {
  const { showNotification } = useNotification();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await getAdminSubmissions();
      if (res.success) {
        setSubmissions(res.data);
      }
    } catch (error) {
      showNotification("error", "Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: "APPROVED" | "REJECTED") => {
    setIsUpdating(true);
    try {
      const res = await updateAdminSubmissionStatus(id, status);
      if (res.success) {
        showNotification("success", `Submission ${status === "APPROVED" ? "approved" : "rejected"}!`);
        fetchSubmissions();
        setSelectedSubmission(null);
      }
    } catch (error) {
      showNotification("error", "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-black">Ad Submissions</h1>
          <p className="text-zinc-500 font-bold mt-1">Review and manage pending vendor ads</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search ads or status..."
            className="pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl w-full md:w-[320px] focus:outline-none focus:border-[#f45c03] transition-all font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-[#f45c03] border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-zinc-500">Loading submissions...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardListIcon />
          </div>
          <h2 className="text-2xl font-black text-black mb-2">No submissions found</h2>
          <p className="text-zinc-500 font-bold">All caught up! No pending ads to review currently.</p>
        </div>
      ) : (
        /* Submissions Table */
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-6 py-4 font-black text-zinc-600 text-[13px] uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 font-black text-zinc-600 text-[13px] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-black text-zinc-600 text-[13px] uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 font-black text-zinc-600 text-[13px] uppercase tracking-wider">Date Submitted</th>
                  <th className="px-6 py-4 font-black text-zinc-600 text-[13px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 flex-shrink-0">
                          {sub.image_url ? (
                            <img src={sub.image_url} alt={sub.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <Tag size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-black text-black hover:text-[#f45c03] transition-colors cursor-pointer" onClick={() => setSelectedSubmission(sub)}>
                            {sub.title}
                          </p>
                          <p className="text-zinc-400 text-xs font-bold mt-0.5">{sub.brand} {sub.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="px-6 py-5 font-black text-zinc-900">
                      ₦{sub.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-zinc-500 font-bold text-sm">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedSubmission(sub)}
                          className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>
                        {sub.status === "PENDING" && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(sub.id, "APPROVED")}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                              title="Approve"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(sub.id, "REJECTED")}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Reject"
                            >
                              <XCircle size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative aspect-video bg-zinc-100 border-b border-zinc-100">
              {selectedSubmission.image_url ? (
                <img src={selectedSubmission.image_url} alt={selectedSubmission.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                   <Tag size={48} />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 flex gap-2">
                 <StatusBadge status={selectedSubmission.status} />
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-black text-black">{selectedSubmission.title}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 font-bold text-sm mt-1">
                    <MapPin size={14} className="text-[#f45c03]" />
                    {selectedSubmission.city}, {selectedSubmission.state}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#f45c03] text-2xl font-black">₦{selectedSubmission.price.toLocaleString()}</div>
                  <div className="text-zinc-400 text-xs font-bold mt-1">PRICE</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailBox label="Brand" value={selectedSubmission.brand || "N/A"} />
                <DetailBox label="Model" value={selectedSubmission.model || "N/A"} />
                <DetailBox label="Condition" value={selectedSubmission.condition || "N/A"} />
                <DetailBox label="Vendor ID" value={`#${selectedSubmission.user_id}`} />
              </div>

              {selectedSubmission.status === "PENDING" && (
                <div className="flex gap-4 pt-4">
                  <button 
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedSubmission.id, "REJECTED")}
                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-black py-4 rounded-2xl transition-all disabled:opacity-50"
                  >
                    Reject Ad
                  </button>
                  <button 
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedSubmission.id, "APPROVED")}
                    className="flex-1 bg-[#f45c03] hover:bg-[#f45c03] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
                  >
                    {isUpdating ? "Approving..." : "Approve Ad"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


