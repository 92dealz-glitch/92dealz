/**
 * Authentication configuration and constants.
 */

export const AUTH_COOKIE = "next-auth.session-token";
export const DEFAULT_ROLE = "guest";

export const ROLES = {
  GUEST: "guest",
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin",
} as const;
