import { getSupabase } from './supabase';

export type EnquiryPayload = {
	name: string;
	email?: string | null;
	phone: string;
	service: string;
	answers: Record<string, unknown>;
	budget: string;
	timeline: string;
	subject: string;
	message: string;
	// Set only for authenticated customers so the row is owned by their account
	// (enforced by the customer_insert RLS policy). Omitted for the public
	// anonymous form; undefined is dropped by JSON serialization.
	user_id?: string | null;
};

// Returns true only when the row lands. supabase-js resolves `{error}`
// instead of throwing, so BOTH paths map to false; the empty-env
// construction throw is also caught -> false (NOT rethrown), keeping the
// wizard's fallback branch reachable. try/catch-only handling is forbidden:
// the `{error}` -> false mapping below is load-bearing.
export async function submitEnquiry(payload: EnquiryPayload): Promise<boolean> {
	try {
		const supabase = getSupabase();
		const { error } = await supabase.from('enquiries').insert(payload);
		return !error;
	} catch {
		return false;
	}
}
