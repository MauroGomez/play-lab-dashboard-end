import 'server-only';

import { auth, authEnabled } from '@/auth';
import type { Role } from '@/model/definitions';

export type Permission =
  | 'movies:create'
  | 'movies:read'
  | 'movies:update'
  | 'movies:delete'
  | 'invoices:create'
  | 'invoices:read'
  | 'invoices:update'
  | 'invoices:delete'
  | 'customers:read';

const rolePermissions: Record<Role, readonly Permission[]> = {
  admin: [
    'movies:create',
    'movies:read',
    'movies:update',
    'movies:delete',
    'invoices:create',
    'invoices:read',
    'invoices:update',
    'invoices:delete',
    'customers:read',
  ],
  editor: ['movies:create', 'movies:read', 'movies:update', 'customers:read'],
};

// Role of the logged-in user, taken from the session (never from the client).
// With authentication disabled everyone is admin.
async function getCurrentRole(): Promise<Role | undefined> {
  if (!authEnabled) return 'admin';
  const session = await auth();
  return session?.user?.role;
}

// Can the logged-in user do this?
// Check it in every page and server action that requires the permission:
// hiding a button in the UI is not enough.
export async function can(permission: Permission): Promise<boolean> {
  const role = await getCurrentRole();
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}
