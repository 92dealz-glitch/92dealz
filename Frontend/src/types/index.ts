/**
 * Shared types for the marketplace domain.
 */

export type Role = "guest" | "buyer" | "seller" | "admin" | "auth";

export interface User {
  id: string;
  email?: string;
  role: Role;
}
