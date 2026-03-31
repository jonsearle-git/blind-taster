/**
 * BLE Message Protocol
 *
 * Because BLE characteristic payloads are limited (~180 bytes), all messages
 * are chunked before sending and reassembled on receipt.
 *
 * Chunk wire format (base64-encoded UTF-8):
 *   <msgId>|<chunkIndex>|<totalChunks>|<payload>
 *
 * Once all chunks for a msgId arrive, the payloads are joined and JSON.parsed
 * into a message object: { type, ...data }
 */

import { BLE_CHUNK_SIZE, CHUNK_HEADER_SEP, CHUNK_STALE_MS } from './bleConstants';

// --- Encode a message into an array of base64 chunk strings ---
export function encodeMessage(messageObj) {
  const json = JSON.stringify(messageObj);
  const msgId = Math.random().toString(36).slice(2, 9);

  // Split json into chunks of BLE_CHUNK_SIZE characters
  const chunks = [];
  for (let i = 0; i < json.length; i += BLE_CHUNK_SIZE) {
    chunks.push(json.slice(i, i + BLE_CHUNK_SIZE));
  }

  return chunks.map((payload, index) => {
    const header = `${msgId}${CHUNK_HEADER_SEP}${index}${CHUNK_HEADER_SEP}${chunks.length}${CHUNK_HEADER_SEP}`;
    return btoa(unescape(encodeURIComponent(header + payload)));
  });
}

// --- Decode a single received base64 chunk ---
// Returns { msgId, chunkIndex, totalChunks, payload } or null if malformed
export function decodeChunk(base64String) {
  try {
    const raw = decodeURIComponent(escape(atob(base64String)));
    const sepIdx1 = raw.indexOf(CHUNK_HEADER_SEP);
    const sepIdx2 = raw.indexOf(CHUNK_HEADER_SEP, sepIdx1 + 1);
    const sepIdx3 = raw.indexOf(CHUNK_HEADER_SEP, sepIdx2 + 1);
    if (sepIdx1 < 0 || sepIdx2 < 0 || sepIdx3 < 0) return null;

    const msgId = raw.slice(0, sepIdx1);
    const chunkIndex = parseInt(raw.slice(sepIdx1 + 1, sepIdx2), 10);
    const totalChunks = parseInt(raw.slice(sepIdx2 + 1, sepIdx3), 10);
    const payload = raw.slice(sepIdx3 + 1);

    if (isNaN(chunkIndex) || isNaN(totalChunks)) return null;
    return { msgId, chunkIndex, totalChunks, payload };
  } catch {
    return null;
  }
}

// --- Reassembly buffer ---
// Manages in-flight multi-chunk messages. Returns complete message object
// when all chunks have arrived, or null if still waiting.
export class ReassemblyBuffer {
  constructor() {
    this._buffer = {}; // msgId → { total, chunks: Map<index,payload>, ts: number }
  }

  feed(chunk) {
    const decoded = decodeChunk(chunk);
    if (!decoded) return null;

    const { msgId, chunkIndex, totalChunks, payload } = decoded;

    if (!this._buffer[msgId]) {
      this._buffer[msgId] = { total: totalChunks, chunks: new Map(), ts: Date.now() };
    }

    this._buffer[msgId].chunks.set(chunkIndex, payload);

    if (this._buffer[msgId].chunks.size === totalChunks) {
      const full = Array.from({ length: totalChunks }, (_, i) => this._buffer[msgId].chunks.get(i)).join('');
      delete this._buffer[msgId];
      try {
        return JSON.parse(full);
      } catch {
        return null;
      }
    }

    return null;
  }

  // Evict any in-flight messages whose first chunk arrived more than CHUNK_STALE_MS ago.
  // Call this when a connection drops to prevent stale chunks corrupting the next session.
  evictStale() {
    const cutoff = Date.now() - CHUNK_STALE_MS;
    for (const msgId of Object.keys(this._buffer)) {
      if (this._buffer[msgId].ts < cutoff) {
        delete this._buffer[msgId];
      }
    }
  }

  clear() {
    this._buffer = {};
  }
}
