/**
 * Content baseline oracle (Phase 0). Snapshots the five content modules
 * verbatim — this test MUST be green before migration and must pass with
 * ZERO snapshot changes after the JSON migration (Phase 4).
 */
import { describe, expect, it } from 'vitest';
import { SERVICES } from '$lib/content/services';
import { WORK } from '$lib/content/work';
import { TEAM } from '$lib/content/team';
import { PROCESS } from '$lib/content/process';
import { FAQS } from '$lib/content/faq';

describe('content baseline', () => {
	it('SERVICES matches baseline', () => {
		expect(SERVICES).toMatchSnapshot();
	});

	it('WORK matches baseline', () => {
		expect(WORK).toMatchSnapshot();
	});

	it('TEAM matches baseline', () => {
		expect(TEAM).toMatchSnapshot();
	});

	it('PROCESS matches baseline', () => {
		expect(PROCESS).toMatchSnapshot();
	});

	it('FAQS matches baseline', () => {
		expect(FAQS).toMatchSnapshot();
	});
});
