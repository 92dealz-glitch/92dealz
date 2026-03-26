"use client";
import React, { useEffect, useState } from "react";
import { listOrders, confirmOrder, Order } from "@/services/orders.service";
import { API_BASE } from "@/services/apiClient";
import { Loader2, ShoppingBag, Package, Phone, Mail, User, Clock, CheckCircle } from "lucide-react";
import { useAlert } from "@/context/AlertContext";

export default function BuyerOrdersPage() {
    const { showAlert } = useAlert();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
            let currentUserId = null;
            if (token) {
                 const profileRes = await fetch(`${API_BASE}/users/profile`, {
                     headers: { Authorization: `Bearer ${token}` }
                 });
                 const profileData = await profileRes.json();
                 if (profileData?.data?.id) {
                     currentUserId = profileData.data.id;
                 }
            }

            const res = await listOrders();
            if (res.success && currentUserId) {
                setOrders(res.data.filter(o => o.buyer_id === currentUserId));
            } else if (res.success && !currentUserId) {
                // Fallback if profile fails
                setOrders(res.data.filter(o => o.buyer_phone));
            }
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleConfirm(orderId: number) {
        setActionLoading(orderId);
        try {
            const res = await confirmOrder(orderId);
            if (res.success) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: res.data.status as any } : o));
            }
        } catch (err) {
            showAlert("Failed to update order", "Order Error");
        } finally {
            setActionLoading(null);
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'vendor_confirmed':
            case 'buyer_confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-orange-600" size={40} />
        </div>
    );

    const buyerOrders = orders; // The API should be returning what's relevant

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-zinc-900">My Purchases</h1>
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black ring-1 ring-orange-200">
                             {buyerOrders.length} {buyerOrders.length === 1 ? 'Item' : 'Items'}
                         </span>
                   </div>
                   <p className="text-zinc-500 font-bold text-lg">Track your order requests and confirmations</p>
                </div>
            </div>

            {buyerOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-zinc-100">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="text-zinc-300" size={40} />
                    </div>
                    <h3 className="text-xl font-black text-zinc-900 mb-2">No orders placed</h3>
                    <p className="text-zinc-500 font-bold max-w-xs mx-auto">When you place a direct order for a product, it will appear here for tracking.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {buyerOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Product Image */}
                                <div className="w-full lg:w-48 h-48 lg:h-32 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                                    {order.deal_image ? (
                                        <img src={order.deal_image} alt={order.deal_title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300"><Package size={32} /></div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                            <h3 className="text-xl font-black text-zinc-900 mt-2">{order.deal_title}</h3>
                                            <p className="text-orange-600 font-black text-lg">Γéª{order.price.toLocaleString()}</p>
                                        </div>
                                        
                                        <div className="text-right text-xs text-zinc-400 font-bold">
                                            Order ID: #{order.id}<br />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Seller Details</p>
                                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                                                <User size={14} className="text-zinc-400" /> {order.vendor_name}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                                                <Phone size={14} className="text-zinc-400" /> {order.vendor_phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-600">
                                                <Mail size={14} className="text-zinc-400" /> {order.vendor_email}
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-end gap-2">
                                            <div className="p-4 bg-zinc-50 rounded-xl flex items-center gap-3">
                                                 {order.status === 'completed' ? (
                                                     <CheckCircle className="text-green-600" size={24} />
                                                 ) : (
                                                     <Clock className="text-orange-500" size={24} />
                                                 )}
                                                 <div>
                                                     <p className="text-xs font-black text-zinc-900 uppercase tracking-tight">Current Step</p>
                                                     <p className="text-xs text-zinc-500 font-bold">
                                                          {order.status === 'pending' ? 'Awaiting confirmation' : 
                                                           order.status === 'vendor_confirmed' ? 'Seller confirmed! Awaiting your confirmation' :
                                                           order.status === 'buyer_confirmed' ? 'You confirmed! Awaiting seller' :
                                                           order.status === 'completed' ? 'Deal closed successfully' : 'Status updated'}
                                                     </p>
                                                 </div>
                                            </div>
                                            {order.status === 'vendor_confirmed' && (
                                                <button 
                                                    onClick={() => handleConfirm(order.id)}
                                                    disabled={!!actionLoading}
                                                    className="w-full mt-3 bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading === order.id ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                                    Confirm Received
                                                </button>
                                            )}
                                            {order.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleConfirm(order.id)}
                                                    disabled={!!actionLoading}
                                                    className="w-full mt-3 bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                                >
                                                    {actionLoading === order.id ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                                    Mark as Confirmed
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
