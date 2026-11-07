import PocketBase, { LocalAuthStore, type CollectionModel, type RecordModel } from 'pocketbase';
import { PB_URL } from '../context/PocketBaseContext';

/**
 * Separate client for the CMS so the superuser session is stored under its own key
 * and never leaks into the public site's requests.
 */
export const cmsPb = new PocketBase(PB_URL, new LocalAuthStore('ksf_cms_auth'));
cmsPb.autoCancellation(false);

export type Field = {
  name: string;
  type: string;
  required?: boolean;
  hidden?: boolean;
  system?: boolean;
  values?: string[];
  maxSelect?: number;
  [key: string]: unknown;
};

export type Collection = CollectionModel & { fields: Field[] };
export type Rec = RecordModel & Record<string, any>;

/**
 * owner  = PocketBase superuser (full access, incl. live schema)
 * admin  = staff account that can also manage the team
 * editor = staff account that edits content only
 */
export type Role = 'owner' | 'admin' | 'editor';

export function sessionRole(): Role | null {
  const { isValid, isSuperuser, record } = cmsPb.authStore;
  if (!isValid || !record) return null;
  if (isSuperuser) return 'owner';
  if (record.collectionName === 'users' && record.active) return record.role === 'admin' ? 'admin' : 'editor';
  return null;
}

export const canManageTeam = (role: Role | null) => role === 'owner' || role === 'admin';

export function displayName(record: Record<string, any> | null | undefined) {
  return (record?.name as string)?.trim() || (record?.email as string)?.split('@')[0] || '';
}

export function fileUrl(record: Rec, filename: string) {
  if (!filename) return '';
  return `${PB_URL}/api/files/${record.collectionId}/${record.id}/${encodeURIComponent(filename)}`;
}

export function errorMessage(err: unknown): string {
  const e = err as any;
  const fieldErrors = e?.response?.data;
  if (fieldErrors && typeof fieldErrors === 'object' && Object.keys(fieldErrors).length) {
    return Object.entries(fieldErrors)
      .map(([field, v]: [string, any]) => `${field}: ${v?.message ?? 'invalid'}`)
      .join(' · ');
  }
  if (e?.status === 0) return 'Could not reach the server. Check your connection and try again.';
  return e?.response?.message || e?.message || 'Something went wrong.';
}
