// UUIDs used by the Blind Tester GATT service.
// A custom 128-bit service UUID ensures we only discover our own games.

export const BT_SERVICE_UUID = '12345678-1234-1234-1234-1234567890AB';

// Single characteristic for all messaging (host ← player writes, host notifies players)
export const BT_CHAR_UUID = '12345678-1234-1234-1234-1234567890CD';

// BLE MTU safe payload size (conservative — avoids fragmentation by the OS)
export const BLE_CHUNK_SIZE = 180;

// Delimiter used between chunk header and body
export const CHUNK_HEADER_SEP = '|';

// Timeout for BLE operations (ms)
export const BLE_SCAN_TIMEOUT = 15000;
export const BLE_CONNECT_TIMEOUT = 10000;

// Reconnection
export const BLE_MAX_RECONNECT_ATTEMPTS = 3;
export const BLE_RECONNECT_DELAY_MS = 2000;

// Write retry
export const BLE_WRITE_RETRIES = 2;
export const BLE_WRITE_RETRY_DELAY_MS = 500;

// Stale in-flight chunk eviction (ms)
export const CHUNK_STALE_MS = 30000;
