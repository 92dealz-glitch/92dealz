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
