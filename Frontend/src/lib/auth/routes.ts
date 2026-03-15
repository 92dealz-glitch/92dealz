/**
 * Role-based route protection mapping.
 * Update these as your app grows.
 */

export const protectedRouteMap: Array<{ prefix: string; roles: string[] }> = [
  { prefix: "/buyer", roles: ["buyer"] },
  { prefix: "/seller", roles: ["seller"] },
  { prefix: "/admin", roles: ["admin"] },
];
