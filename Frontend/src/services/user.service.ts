import { getProfile as coreGetProfile, updateProfile as coreUpdateProfile } from "../lib/api";
import { apiFetch } from "./apiClient";

export const getProfile = coreGetProfile;
export const updateProfile = coreUpdateProfile;

export const buyPlan = async (plan: 'free' | 'basic' | 'star' | 'premium' | 'starter') => {
  return apiFetch<{ success: boolean; message: string; data: any }>('/users/buy-plan', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  }, true);
};

export const initializePayment = async (planId: 'free' | 'basic' | 'star' | 'premium' | 'starter', email?: string) => {
  return apiFetch<{ success: boolean; authorization_url: string; reference: string; message?: string }>('/payments/initialize', {
    method: 'POST',
    body: JSON.stringify({ planId, email }),
  }, true);
};

export const verifyPayment = async (reference: string) => {
  return apiFetch<{ success: boolean; message: string; data?: any }>(`/payments/verify/${reference}`, {
    method: 'GET',
  }, true);
};


