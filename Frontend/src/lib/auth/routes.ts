/**
 * Role-based route protection mapping.
 * Update these as your app grows.
 */

export const protectedRouteMap: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/user-dashboard", roles: ["buyer", "seller", "vendor"] },
  { prefix: "/vendor-dashboard", roles: ["seller", "vendor"] },
];
