"use client";
// Build Fix: Ensuring Vercel picks up the new reviewId prop interface.

import React, { useState } from "react";
import { AlertTriangle, X, Loader2, Send } from "lucide-react";
import { submitReport } from "@/lib/api";
import { useAlert } from "@/context/AlertContext";

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: number;
  vendorId?: number;
  reportedReviewId?: number;
  itemName: string;
}

const REASONS = [
  "Inappropriate Content",
  "Scam or Fraud",
  "Incorrect Category",
  "Prohibited Items",
  "Harassment",
  "Spam",
  "Other"
];

export default function ReportModal({ isOpen, onClose, productId, vendorId, reportedReviewId, itemName }: ReportModalProps) {
  const { showAlert } = useAlert();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setLoading(true);
    try {
      const res = await submitReport({
        product_id: productId,
        vendor_id: vendorId,
        review_id: reportedReviewId,
        reason,
        details
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          setReason("");
          setDetails("");
        }, 2000);
      }
    } catch (err) {
      showAlert("Failed to submit report. Please try again.", "Report Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <AlertTriangle size={20} />
            </div>
            <h3 className="font-bold text-zinc-900">Report {productId ? "Product" : reportedReviewId ? "Review" : "Vendor"}</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50">
                <Send size={24} />
            </div>
            <h4 className="font-black text-zinc-900 text-lg">Report Submitted</h4>
            <p className="text-zinc-500 text-sm mt-1">Thank you for helping keep 234Deals safe. Our team will review this shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-zinc-500 font-medium">Reporting: <span className="text-orange-600 font-bold">{itemName}</span></p>
            
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                Reason for reporting
              </label>
              <select
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-zinc-200 px-4 py-3 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition-all appearance-none bg-zinc-50 cursor-pointer hover:bg-zinc-100"
              >
                <option value="">Select a reason</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">
                Additional Details
              </label>
              <textarea
                placeholder="Provide more info to help us investigate..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full h-32 rounded-md border border-zinc-200 p-4 text-sm focus:ring-2 focus:ring-orange-300 outline-none transition-all resize-none bg-zinc-50 hover:bg-zinc-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !reason}
              className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-md hover:bg-orange-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
