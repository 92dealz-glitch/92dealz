/**
 * Role-based route protection mapping.
 * Update these as your app grows.
 */

export const protectedRouteMap: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/user-dashboard", roles: ["user", "buyer", "seller", "vendor", "admin"] },
  { prefix: "/vendor-dashboard", roles: ["user", "buyer", "seller", "vendor", "admin"] },
  { prefix: "/admin-dashboard", roles: ["admin"] },
  { prefix: "/admin", roles: ["admin"] },
];
