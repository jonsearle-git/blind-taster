// After running `npx wrangler deploy`, replace this with your actual workers URL.
// Physical devices cannot reach localhost — always use the deployed Cloudflare URL.
const DEPLOYED_HOST = 'blind-taster.searlesoft.workers.dev';

export const PARTYKIT_HOST = DEPLOYED_HOST;

// HMAC-SHA256 key used to sign room codes so only the app can create rooms.
// Must match the ROOM_SIGNING_KEY Worker secret — set via:
//   npx wrangler secret put ROOM_SIGNING_KEY
// Then paste this value when prompted.
export const ROOM_SIGNING_KEY = 'd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2';
