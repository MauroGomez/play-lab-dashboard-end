// Authorization rules: given a role, decide what it is allowed to do.
// The role always comes from the session (see getCurrentRole() in auth.ts),
// never from the client (a form field, a URL param, etc.).

import type { Role } from '@/model/definitions';

export type Permission =
  | 'movies:create'
  | 'movies:edit'
  | 'movies:delete'
  | 'invoices:access';

const rolePermissions: Record<Role, readonly Permission[]> = {
  admin: ['movies:create', 'movies:edit', 'movies:delete', 'invoices:access'],
  editor: ['movies:create', 'movies:edit'],
};

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}

// To be called at the start of every server action / route handler that
// requires a permission: hiding a button in the UI is not enough.
export function requirePermission(
  role: Role | undefined,
  permission: Permission,
) {
  if (!can(role, permission)) {
    throw new Error(`Unauthorized: missing permission '${permission}'.`);
  }
}

// Dashboard routes that require a permission
export function canAccessRoute(
  role: Role | undefined,
  pathname: string,
): boolean {
  if (pathname.startsWith('/dashboard/invoices')) {
    return can(role, 'invoices:access');
  }
  return true;
}
