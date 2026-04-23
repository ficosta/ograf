# Bunny CDN deploy

`deploy-bunny.mjs` only uploads the built SPA and purges the CDN cache.
The Bunny infrastructure itself (storage zone, pull zone, hostnames,
TLS, SPA fallback) is configured by hand in the Bunny dashboard.

## One-time manual setup in the Bunny dashboard

1. **Create the Storage Zone**
   - Dashboard → Storage → Add Storage Zone
   - Name: `ograf-dev-site` (must be globally unique; pick another if taken)
   - Primary region: **Falkenstein / DE**
   - Replication regions: none
   - Tier: Standard
   - After creation, open the zone → **FTP & API Access** → copy the
     **Password** (used by the deploy script as `BUNNY_STORAGE_PASSWORD`)

2. **Enable the SPA 404 fallback on the Storage Zone**
   - In the storage zone settings, turn on **"Serve a custom 404 page"**
   - Set **Custom 404 file path**: `/index.html`
   - Enable **"Rewrite 404 to 200"** (sometimes listed as "Serve index on
     missing file")
   - This is how client-side react-router routes (`/tutorials/quote`,
     `/check`, etc.) keep working on hard reload.

3. **Create the Pull Zone**
   - Dashboard → CDN → Add Pull Zone
   - Name: `ograf-dev-site` (reuse the storage zone name for clarity)
   - Origin type: **Storage Zone** → select the zone you just created
   - Pricing tier: Standard
   - Edge regions: leave default (all) or restrict to EU + NA
   - After creation, note the pull zone **ID** (top-right of the zone
     details page) — that's `BUNNY_PULL_ZONE_ID`

4. **Attach the custom hostnames to the Pull Zone**
   - Pull zone → **Hostnames** → add:
     - `ograf.dev`
     - `www.ograf.dev`
   - For each, click **Load Free Certificate** (Let's Encrypt). DNS must
     already resolve to the pull zone (`*.b-cdn.net`) for this to succeed.
   - Toggle **Force SSL** on for each hostname.

5. **Security hardening on the Pull Zone**
   - **Security** tab:
     - TLS 1.0: off
     - TLS 1.1: off
     - TLS 1.2+: on
     - Log Forwarding: optional
     - Block POST requests: **on** (static site, no POSTs expected)
     - Block no-referrer: off (we want direct URL access to work)
   - **Headers** tab:
     - Add canonical URL header: on
     - Add Strict-Transport-Security (HSTS): `max-age=31536000; includeSubDomains`
     - Add X-Content-Type-Options: `nosniff`
     - Add X-Frame-Options: `SAMEORIGIN`
     - Add Referrer-Policy: `strict-origin-when-cross-origin`
   - **Caching** tab:
     - Smart Cache: on
     - Default cache time: **1 hour** (Vite assets are content-hashed, so
       longer is fine, but keep index.html short)
     - Vary cache by: Country off, Hostname off
     - Use the **Edge Rule** below to keep `index.html` short-lived even
       when everything else is long-lived.
   - **Edge Rules** (optional, recommended):
     - Rule 1: *"No cache on index.html"*
       - Trigger: URL contains `/index.html` → Override cache time: 60s
     - Rule 2: *"Long cache on hashed assets"*
       - Trigger: URL contains `/assets/` → Override cache time: 1 year

6. **DNS**
   - Point `ograf.dev` and `www.ograf.dev` as `CNAME` to
     `<pull-zone-name>.b-cdn.net`
   - If the apex (`ograf.dev`) can't take a CNAME at your DNS host,
     use an `ALIAS` or a flattened CNAME (Cloudflare / Route 53 both
     support this).
   - Back in step 4, re-run **Load Free Certificate** once DNS has
     propagated (usually 1–5 minutes on Bunny-managed DNS).

## Generate the account API key (for cache purge)

- Dashboard → Account → **API** → copy the account API key
- This is `BUNNY_API_KEY` for the script.

## Deploy

```bash
# Build first
pnpm --filter @ograf/dev build

# Set env (do NOT commit these; prefer a local .env.bunny.local file)
export BUNNY_STORAGE_ZONE="ograf-dev-site"
export BUNNY_STORAGE_PASSWORD="<from dashboard step 1>"
export BUNNY_STORAGE_ENDPOINT="storage.bunnycdn.com"   # DE region
export BUNNY_PULL_ZONE_ID="<from dashboard step 3>"
export BUNNY_API_KEY="<account API key>"

# Upload + purge
node scripts/deploy-bunny.mjs
```

The script walks `apps/dev/dist/`, PUTs each file to the storage zone
with the same relative path, and purges the pull zone cache.

## Storage endpoints by region

If you pick a region other than DE, change `BUNNY_STORAGE_ENDPOINT`:

| Region | Endpoint |
|---|---|
| DE (Falkenstein) | `storage.bunnycdn.com` |
| UK | `uk.storage.bunnycdn.com` |
| SE (Stockholm) | `se.storage.bunnycdn.com` |
| NY | `ny.storage.bunnycdn.com` |
| LA | `la.storage.bunnycdn.com` |
| SG | `sg.storage.bunnycdn.com` |
| SYD | `syd.storage.bunnycdn.com` |
| BR | `br.storage.bunnycdn.com` |
| JH | `jh.storage.bunnycdn.com` |

## Rotate on compromise

If the storage password or API key leaks (e.g., pasted into a chat,
committed to git), rotate it immediately:

- Storage password: storage zone → FTP & API Access → **Reset password**
- Account API key: Account → API → **Regenerate**

After rotating, update the local env vars and re-run the deploy.
