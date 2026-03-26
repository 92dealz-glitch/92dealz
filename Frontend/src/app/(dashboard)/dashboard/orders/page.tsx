"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiFetch } from "@/services/apiClient";
import { Loader2, ShoppingBag, CheckCircle, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useAlert } from "@/context/AlertContext";

export default function OrdersPage() {
  const { showAlert } = useAlert();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordersRes, userRes] = await Promise.all([
          apiFetch<{ success: boolean; data: any[] }>("orders", { method: "GET" }, true),
          apiFetch<{ success: boolean; data: any }>("users/profile", { method: "GET" }, true)
        ]);
        if (ordersRes.success) setOrders(ordersRes.data);
        if (userRes.success) setCurrentUser(userRes.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleConfirm(orderId: number) {
    if (!confirm("Confirm this sale/purchase?")) return;
    try {
      const res = await apiFetch<{ success: boolean; data: any }>(`orders/${orderId}/confirm`, {
        method: "PATCH"
      }, true);
      if (res.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: res.data.status } : o));
        showAlert("Status updated!", "Order Status");
      }
    } catch (err) {
      console.error("Failed to confirm order", err);
      showAlert("Failed to update status", "Order Error");
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-600" size={18} />;
      case 'pending': return <Clock className="text-orange-500" size={18} />;
      case 'buyer_confirmed':
      case 'vendor_confirmed': return <Clock className="text-blue-500" size={18} />;
      case 'cancelled': return <XCircle className="text-red-500" size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={40} /></div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-black">My Orders</h1>
            <p className="text-zinc-500 font-bold">Manage your purchases and sales</p>
          </div>
          <Link href="/" className="bg-orange-600 text-white px-6 py-2 rounded-xl font-black hover:bg-orange-700 transition shadow-sm inline-flex items-center gap-2">
            <ShoppingBag size={18} />
            Browse More Deals
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-16 text-center">
            <ShoppingBag className="mx-auto mb-4 text-zinc-300" size={64} />
            <h2 className="text-xl font-black text-zinc-900 mb-2">No orders found</h2>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto font-bold">You haven't placed any orders or sold any items yet.</p>
            <Link href="/" className="text-orange-600 font-black hover:underline">Start shopping now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="w-24 h-24 bg-zinc-100 rounded-xl overflow-hidden shrink-0 border border-zinc-100">
                  <img src={order.deal_image} alt={order.deal_title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold">Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-black text-black truncate mb-1">{order.deal_title}</h3>
                  <p className="text-2xl font-black text-orange-600 mb-2">₦{Number(order.price).toLocaleString()}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs font-bold">
                    <div className="flex justify-between md:justify-start gap-2">
                      <span className="text-zinc-400">Buyer:</span>
                      <span className="text-black">{order.buyer_id === currentUser.id ? 'You' : order.buyer_name}</span>
                    </div>
                    <div className="flex justify-between md:justify-start gap-2">
                      <span className="text-zinc-400">Vendor:</span>
                      <span className="text-black">{order.vendor_id === currentUser.id ? 'You' : order.vendor_name}</span>
                    </div>
                    <div className="flex justify-between md:justify-start gap-2">
                      <span className="text-zinc-400">Contact:</span>
                      <span className="text-orange-600">{order.buyer_id === currentUser.id ? order.vendor_phone : order.buyer_phone}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleConfirm(order.id)}
                      className="w-full bg-black text-white px-8 py-3 rounded-xl font-black hover:bg-zinc-800 transition shadow-sm"
                    >
                      {order.buyer_id === currentUser.id ? 'Confirm Purchase' : 'Confirm Sale'}
                    </button>
                  )}
                  {order.status === 'completed' && (
                    <div className="text-green-600 font-black flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                      <CheckCircle size={20} />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
