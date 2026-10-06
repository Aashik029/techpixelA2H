import { defineConfig } from '@playwright/test';

// Load .env for the E2E specs (CONFIGURED skip-guards read process.env).
// Guarded: an absent file must not crash the config load (absent-.env build
// failure is documented, not tested). Requires Node >= 20.12 for loadEnvFile.
try {
	process.loadEnvFile?.();
} catch {
	/* no .env — specs fall back to skip-guards */
}

export default defineConfig({
	testDir: 'e2e',
	baseURL: 'http://localhost:4173',
	webServer: {
		command: 'npm run build && npx vite preview --port 4173 --strictPort',
		port: 4173,
		reuseExistingServer: !process.env.CI,
		timeout: 180000
	},
	use: {
		trace: 'retain-on-failure'
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' }
		}
	]
});
