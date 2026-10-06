import { getSupabase } from './supabase';

export type EnquiryPayload = {
	name: string;
	phone: string;
	service: string;
	answers: Record<string, unknown>;
	budget: string;
	timeline: string;
	subject: string;
	message: string;
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
