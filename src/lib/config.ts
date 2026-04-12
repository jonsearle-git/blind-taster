const DEV_HOST  = 'localhost:8787';
const PROD_HOST = 'blind-taster.REPLACE_WITH_YOUR_CLOUDFLARE_SUBDOMAIN.workers.dev';

// Before deploying: replace REPLACE_WITH_YOUR_CLOUDFLARE_SUBDOMAIN with your
// Cloudflare workers subdomain (visible at dash.cloudflare.com after running `npx wrangler login`).
export const PARTYKIT_HOST = __DEV__ ? DEV_HOST : PROD_HOST;
