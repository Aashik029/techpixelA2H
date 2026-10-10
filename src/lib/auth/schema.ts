/**
 * Detects the "migration 0002 has not been applied yet" family of Postgres /
 * PostgREST failures, so the UI can explain the real cause instead of showing a
 * raw database error or silently bouncing the viewer somewhere unhelpful.
 *
 * Only used to improve messaging. It never grants access: the admin gate denies
 * the panel unless the profile row positively says is_admin = true.
 */

const MISSING_COLUMN = '42703';
const MISSING_TABLE = '42P01';
const UNDEFINED_COLUMN = 'PGRST204';

export function isSetupMissing(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as { code?: unknown; message?: unknown };
  const code = typeof candidate.code === 'string' ? candidate.code : '';
  if (code === MISSING_COLUMN || code === MISSING_TABLE || code === UNDEFINED_COLUMN) return true;
  const message = typeof candidate.message === 'string' ? candidate.message : '';
  return /does not exist|user_id|profiles/i.test(message);
}

export const SETUP_MISSING_MESSAGE =
  'Admin sign-in is not enabled on the database yet.';
export const SETUP_MISSING_HINT =
  'Apply supabase/migrations/0002_customer_auth.sql in the Supabase dashboard SQL editor (project byczcsyukmzkbrwinrmr), then reload this page.';