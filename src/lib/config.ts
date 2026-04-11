const DEV_HOST  = 'localhost:1999';
const PROD_HOST = 'blind-taster.REPLACE_WITH_YOUR_PARTYKIT_USERNAME.partykit.dev';

// Before deploying: replace REPLACE_WITH_YOUR_PARTYKIT_USERNAME with your
// PartyKit username (visible at partykit.dev after running `npx partykit login`).
export const PARTYKIT_HOST = __DEV__ ? DEV_HOST : PROD_HOST;
