import { getProfile as coreGetProfile, updateProfile as coreUpdateProfile, apiFetch } from "@/lib/api";

export const getProfile = coreGetProfile;
export const updateProfile = coreUpdateProfile;

export const buyPlan = async (plan: 'free' | 'basic' | 'star') => {
  return apiFetch<{ success: boolean; message: string; data: any }>('/users/buy-plan', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  }, true);
};
