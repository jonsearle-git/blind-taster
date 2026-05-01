// After running `npx wrangler deploy`, replace this with your actual workers URL.
// Physical devices cannot reach localhost — always use the deployed Cloudflare URL.
const DEPLOYED_HOST = 'blind-taster.REPLACE_WITH_YOUR_CLOUDFLARE_SUBDOMAIN.workers.dev';

export const PARTYKIT_HOST = DEPLOYED_HOST;
