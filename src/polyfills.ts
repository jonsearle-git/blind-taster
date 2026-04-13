// Hermes does not expose browser globals like Event/EventTarget.
// This file has NO imports so Metro evaluates it before any other module.
// It must be the first import in index.ts.

if (typeof global.Event === 'undefined') {
  // @ts-expect-error minimal Event polyfill for Hermes
  global.Event = class Event {
    type: string;
    bubbles: boolean;
    cancelable: boolean;
    constructor(type: string, init?: { bubbles?: boolean; cancelable?: boolean }) {
      this.type = type;
      this.bubbles = init?.bubbles ?? false;
      this.cancelable = init?.cancelable ?? false;
    }
  };
}

if (typeof global.EventTarget === 'undefined') {
  global.EventTarget = class EventTarget {
    private _listeners: Record<string, Array<(e: unknown) => void>> = {};
    addEventListener(type: string, fn: (e: unknown) => void): void {
      (this._listeners[type] ??= []).push(fn);
    }
    removeEventListener(type: string, fn: (e: unknown) => void): void {
      this._listeners[type] = (this._listeners[type] ?? []).filter(l => l !== fn);
    }
    dispatchEvent(event: { type: string }): boolean {
      (this._listeners[event.type] ?? []).forEach(fn => fn(event));
      return true;
    }
  };
}

if (typeof global.MessageEvent === 'undefined') {
  // @ts-expect-error minimal MessageEvent polyfill for Hermes
  global.MessageEvent = class MessageEvent extends global.Event {
    data: unknown;
    constructor(type: string, init?: { data?: unknown }) {
      super(type);
      this.data = init?.data;
    }
  };
}

if (typeof global.CloseEvent === 'undefined') {
  global.CloseEvent = class CloseEvent extends global.Event {
    code: number;
    reason: string;
    wasClean: boolean;
    constructor(type: string, init?: { code?: number; reason?: string; wasClean?: boolean }) {
      super(type);
      this.code = init?.code ?? 0;
      this.reason = init?.reason ?? '';
      this.wasClean = init?.wasClean ?? false;
    }
  };
}
