import { apiFetch } from "./apiClient";

export interface Order {
  id: number;
  buyer_id: number;
  vendor_id: number;
  deal_id: number;
  price: number;
  buyer_notes: string | null;
  status: 'pending' | 'buyer_confirmed' | 'vendor_confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deal_title: string;
  deal_image: string;
  buyer_name: string;
  vendor_name: string;
  buyer_phone: string;
  buyer_email: string;
  vendor_phone: string;
  vendor_email: string;
}

export async function createOrder(data: { deal_id: number; vendor_id: number; price: number; notes?: string }) {
  return apiFetch<{ success: boolean; data: { id: number }; message?: string }>("orders", {
    method: "POST",
    body: JSON.stringify(data),
  }, true);
}

export async function listOrders() {
  return apiFetch<{ success: boolean; data: Order[] }>("orders", {
    method: "GET",
  }, true);
}

export async function confirmOrder(orderId: number) {
  return apiFetch<{ success: boolean; data: { id: number; status: string } }>(`orders/${orderId}/confirm`, {
    method: "PATCH",
  }, true);
}


