# Owner setup checklist — admin panel + CMS (Tech Pixel A2H)

Complete these in order. Nothing below can be done by the site builder without you.

## 1. Supabase project (backend + inbox)
1. Open your Supabase dashboard and confirm project `dkzhskznrsnrzmzqffnq` is active (restore/unpause if paused).
2. Create the admin user: Authentication → Add user → email + password. Send the builder the email (never the password in chat — the builder only needs it for the local `.env` test run, or run the test yourself).
3. Tell the builder to apply `supabase/migrations/0001_enquiries.sql`, then give the builder the new user's UUID so the `profiles` admin-promote row can be inserted.
4. Copy the project's anon/public key into your local `.env` as `PUBLIC_SUPABASE_ANON_KEY` (never use the `service_role` key in the site).

## 2. GitHub repo (CMS editing)
1. Create the GitHub repo and push this site to `main`.
2. In `static/cms/config.yml`, replace `'<OWNER>/<REPO>'` with the real `owner/repo`.
3. Give each editor a GitHub account with Write access to the repo.

## 3. CMS editor login (choose one)
- **Default (no extra setup):** editors mint a fine-grained GitHub Personal Access Token (Contents: read+write on this repo) and paste it into the `/cms/` login screen.
- **Upgrade (non-technical editors):** create a GitHub OAuth App + deploy the `sveltia-cms-auth` Cloudflare worker, then set `base_url` in `config.yml`. Needs your GitHub + Cloudflare accounts.

## 4. Basin + privacy copy
- The contact form is moving from Basin to Supabase. Once cut over, the privacy page's processor list (which names Basin) needs your approved edit — confirm the replacement wording.
- If you still want Basin as a parallel backup, say so before the cutover.

## 5. Hosting rebuilds
- CMS edits commit to GitHub. Your host must rebuild on push (or you redeploy manually), otherwise content changes never go live.

## 6. Launch facts still owed
Domain decision (register `techpixela2h.com` or name a replacement), analytics (fund Plausible ~$9/mo or delete the banner), and the 12 legal facts for the privacy/terms placeholders.
