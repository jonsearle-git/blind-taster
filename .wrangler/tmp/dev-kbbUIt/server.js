var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// node_modules/partyserver/dist/index.js
import { DurableObject, env } from "cloudflare:workers";

// node_modules/partyserver/node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// node_modules/partyserver/node_modules/nanoid/index.browser.js
var nanoid = /* @__PURE__ */ __name((size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
}, "nanoid");

// node_modules/partyserver/dist/index.js
if (!("OPEN" in WebSocket)) {
  const WebSocketStatus = {
    CONNECTING: WebSocket.READY_STATE_CONNECTING,
    OPEN: WebSocket.READY_STATE_OPEN,
    CLOSING: WebSocket.READY_STATE_CLOSING,
    CLOSED: WebSocket.READY_STATE_CLOSED
  };
  Object.assign(WebSocket, WebSocketStatus);
  Object.assign(WebSocket.prototype, WebSocketStatus);
}
function tryGetPartyServerMeta(ws) {
  try {
    const attachment = WebSocket.prototype.deserializeAttachment.call(ws);
    if (!attachment || typeof attachment !== "object") return null;
    if (!("__pk" in attachment)) return null;
    const pk = attachment.__pk;
    if (!pk || typeof pk !== "object") return null;
    const { id, tags } = pk;
    if (typeof id !== "string") return null;
    const { uri } = pk;
    return {
      id,
      tags: Array.isArray(tags) ? tags : [],
      uri: typeof uri === "string" ? uri : void 0
    };
  } catch {
    return null;
  }
}
__name(tryGetPartyServerMeta, "tryGetPartyServerMeta");
function isPartyServerWebSocket(ws) {
  return tryGetPartyServerMeta(ws) !== null;
}
__name(isPartyServerWebSocket, "isPartyServerWebSocket");
var AttachmentCache = class {
  static {
    __name(this, "AttachmentCache");
  }
  #cache = /* @__PURE__ */ new WeakMap();
  get(ws) {
    let attachment = this.#cache.get(ws);
    if (!attachment) {
      attachment = WebSocket.prototype.deserializeAttachment.call(ws);
      if (attachment !== void 0) this.#cache.set(ws, attachment);
      else throw new Error("Missing websocket attachment. This is most likely an issue in PartyServer, please open an issue at https://github.com/cloudflare/partykit/issues");
    }
    return attachment;
  }
  set(ws, attachment) {
    this.#cache.set(ws, attachment);
    WebSocket.prototype.serializeAttachment.call(ws, attachment);
  }
};
var attachments = new AttachmentCache();
var connections = /* @__PURE__ */ new WeakSet();
var isWrapped = /* @__PURE__ */ __name((ws) => {
  return connections.has(ws);
}, "isWrapped");
var createLazyConnection = /* @__PURE__ */ __name((ws) => {
  if (isWrapped(ws)) return ws;
  let initialState;
  if ("state" in ws) {
    initialState = ws.state;
    delete ws.state;
  }
  const connection = Object.defineProperties(ws, {
    id: {
      configurable: true,
      get() {
        return attachments.get(ws).__pk.id;
      }
    },
    uri: {
      configurable: true,
      get() {
        return attachments.get(ws).__pk.uri ?? null;
      }
    },
    tags: {
      configurable: true,
      get() {
        return attachments.get(ws).__pk.tags ?? [];
      }
    },
    socket: {
      configurable: true,
      get() {
        return ws;
      }
    },
    state: {
      configurable: true,
      get() {
        return ws.deserializeAttachment();
      }
    },
    setState: {
      configurable: true,
      value: /* @__PURE__ */ __name(function setState(setState) {
        let state;
        if (setState instanceof Function) state = setState(this.state);
        else state = setState;
        ws.serializeAttachment(state);
        return state;
      }, "setState")
    },
    deserializeAttachment: {
      configurable: true,
      value: /* @__PURE__ */ __name(function deserializeAttachment() {
        return attachments.get(ws).__user ?? null;
      }, "deserializeAttachment")
    },
    serializeAttachment: {
      configurable: true,
      value: /* @__PURE__ */ __name(function serializeAttachment(attachment) {
        const setting = {
          ...attachments.get(ws),
          __user: attachment ?? null
        };
        attachments.set(ws, setting);
      }, "serializeAttachment")
    }
  });
  if (initialState) connection.setState(initialState);
  connections.add(connection);
  return connection;
}, "createLazyConnection");
var HibernatingConnectionIterator = class {
  static {
    __name(this, "HibernatingConnectionIterator");
  }
  index = 0;
  sockets;
  constructor(state, tag) {
    this.state = state;
    this.tag = tag;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    const sockets = this.sockets ?? (this.sockets = this.state.getWebSockets(this.tag));
    let socket;
    while (socket = sockets[this.index++]) if (socket.readyState === WebSocket.READY_STATE_OPEN) {
      if (!isPartyServerWebSocket(socket)) continue;
      return {
        done: false,
        value: createLazyConnection(socket)
      };
    }
    return {
      done: true,
      value: void 0
    };
  }
};
function prepareTags(connectionId, userTags) {
  const tags = [connectionId, ...userTags.filter((t) => t !== connectionId)];
  if (tags.length > 10) throw new Error("A connection can only have 10 tags, including the default id tag.");
  for (const tag of tags) {
    if (typeof tag !== "string") throw new Error(`A connection tag must be a string. Received: ${tag}`);
    if (tag === "") throw new Error("A connection tag must not be an empty string.");
    if (tag.length > 256) throw new Error("A connection tag must not exceed 256 characters");
  }
  return tags;
}
__name(prepareTags, "prepareTags");
var InMemoryConnectionManager = class {
  static {
    __name(this, "InMemoryConnectionManager");
  }
  #connections = /* @__PURE__ */ new Map();
  tags = /* @__PURE__ */ new WeakMap();
  getCount() {
    return this.#connections.size;
  }
  getConnection(id) {
    return this.#connections.get(id);
  }
  *getConnections(tag) {
    if (!tag) {
      yield* this.#connections.values().filter((c) => c.readyState === WebSocket.READY_STATE_OPEN);
      return;
    }
    for (const connection of this.#connections.values()) if ((this.tags.get(connection) ?? []).includes(tag)) yield connection;
  }
  accept(connection, options) {
    connection.accept();
    const tags = prepareTags(connection.id, options.tags);
    this.#connections.set(connection.id, connection);
    this.tags.set(connection, tags);
    Object.defineProperty(connection, "tags", {
      get: /* @__PURE__ */ __name(() => tags, "get"),
      configurable: true
    });
    const removeConnection = /* @__PURE__ */ __name(() => {
      this.#connections.delete(connection.id);
      connection.removeEventListener("close", removeConnection);
      connection.removeEventListener("error", removeConnection);
    }, "removeConnection");
    connection.addEventListener("close", removeConnection);
    connection.addEventListener("error", removeConnection);
    return connection;
  }
};
var HibernatingConnectionManager = class {
  static {
    __name(this, "HibernatingConnectionManager");
  }
  constructor(controller) {
    this.controller = controller;
  }
  getCount() {
    let count = 0;
    for (const ws of this.controller.getWebSockets()) if (isPartyServerWebSocket(ws)) count++;
    return count;
  }
  getConnection(id) {
    const matching = this.controller.getWebSockets(id).filter((ws) => {
      return tryGetPartyServerMeta(ws)?.id === id;
    });
    if (matching.length === 0) return void 0;
    if (matching.length === 1) return createLazyConnection(matching[0]);
    throw new Error(`More than one connection found for id ${id}. Did you mean to use getConnections(tag) instead?`);
  }
  getConnections(tag) {
    return new HibernatingConnectionIterator(this.controller, tag);
  }
  accept(connection, options) {
    const tags = prepareTags(connection.id, options.tags);
    this.controller.acceptWebSocket(connection, tags);
    connection.serializeAttachment({
      __pk: {
        id: connection.id,
        tags,
        uri: connection.uri ?? void 0
      },
      __user: null
    });
    return createLazyConnection(connection);
  }
};
var NAME_STORAGE_KEY = "__ps_name";
var serverMapCache = /* @__PURE__ */ new WeakMap();
var bindingNameCache = /* @__PURE__ */ new WeakMap();
function camelCaseToKebabCase(str) {
  if (str === str.toUpperCase() && str !== str.toLowerCase()) return str.toLowerCase().replace(/_/g, "-");
  let kebabified = str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  kebabified = kebabified.startsWith("-") ? kebabified.slice(1) : kebabified;
  return kebabified.replace(/_/g, "-").replace(/-$/, "");
}
__name(camelCaseToKebabCase, "camelCaseToKebabCase");
function resolveCorsHeaders(cors) {
  if (cors === true) return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400"
  };
  if (cors && typeof cors === "object") {
    const h = new Headers(cors);
    const record = {};
    h.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  }
  return null;
}
__name(resolveCorsHeaders, "resolveCorsHeaders");
async function routePartykitRequest(req, env$1 = env, options) {
  if (!serverMapCache.has(env$1)) {
    const namespaceMap = {};
    const bindingNames2 = {};
    for (const [k, v] of Object.entries(env$1)) if (v && typeof v === "object" && "idFromName" in v && typeof v.idFromName === "function") {
      const kebab = camelCaseToKebabCase(k);
      namespaceMap[kebab] = v;
      bindingNames2[kebab] = k;
    }
    serverMapCache.set(env$1, namespaceMap);
    bindingNameCache.set(env$1, bindingNames2);
  }
  const map = serverMapCache.get(env$1);
  const bindingNames = bindingNameCache.get(env$1);
  const prefixParts = (options?.prefix || "parties").split("/");
  const parts = new URL(req.url).pathname.split("/").filter(Boolean);
  if (!prefixParts.every((part, index) => parts[index] === part) || parts.length < prefixParts.length + 2) return null;
  const namespace = parts[prefixParts.length];
  const name = parts[prefixParts.length + 1];
  if (name && namespace) {
    let withCorsHeaders2 = function(response) {
      if (!corsHeaders || isWebSocket) return response;
      const newResponse = new Response(response.body, response);
      for (const [key, value] of Object.entries(corsHeaders)) newResponse.headers.set(key, value);
      return newResponse;
    };
    var withCorsHeaders = withCorsHeaders2;
    __name(withCorsHeaders2, "withCorsHeaders");
    if (!map[namespace]) {
      if (namespace === "main") {
        console.warn("You appear to be migrating a PartyKit project to PartyServer.");
        console.warn(`PartyServer doesn't have a "main" party by default. Try adding this to your PartySocket client:
 
party: "${camelCaseToKebabCase(Object.keys(map)[0])}"`);
      } else console.error(`The url ${req.url}  with namespace "${namespace}" and name "${name}" does not match any server namespace. 
Did you forget to add a durable object binding to the class ${namespace[0].toUpperCase() + namespace.slice(1)} in your wrangler.jsonc?`);
      return new Response("Invalid request", { status: 400 });
    }
    const corsHeaders = resolveCorsHeaders(options?.cors);
    const isWebSocket = req.headers.get("Upgrade")?.toLowerCase() === "websocket";
    if (req.method === "OPTIONS" && corsHeaders) return new Response(null, { headers: corsHeaders });
    let doNamespace = map[namespace];
    if (options?.jurisdiction) doNamespace = doNamespace.jurisdiction(options.jurisdiction);
    const id = doNamespace.idFromName(name);
    const stub = doNamespace.get(id, options);
    req = new Request(req);
    req.headers.set("x-partykit-namespace", namespace);
    if (options?.jurisdiction) req.headers.set("x-partykit-jurisdiction", options.jurisdiction);
    const className = bindingNames[namespace];
    let partyDeprecationWarned = false;
    const lobby = {
      get party() {
        if (!partyDeprecationWarned) {
          partyDeprecationWarned = true;
          console.warn('lobby.party is deprecated and currently returns the kebab-case namespace (e.g. "my-agent"). Use lobby.className instead to get the Durable Object class name (e.g. "MyAgent"). In the next major version, lobby.party will return the class name.');
        }
        return namespace;
      },
      className,
      name
    };
    if (isWebSocket) {
      if (options?.onBeforeConnect) {
        const reqOrRes = await options.onBeforeConnect(req, lobby);
        if (reqOrRes instanceof Request) req = reqOrRes;
        else if (reqOrRes instanceof Response) return reqOrRes;
      }
    } else if (options?.onBeforeRequest) {
      const reqOrRes = await options.onBeforeRequest(req, lobby);
      if (reqOrRes instanceof Request) req = reqOrRes;
      else if (reqOrRes instanceof Response) return withCorsHeaders2(reqOrRes);
    }
    if (isWebSocket) {
      await stub.setName(name, options?.props);
      return await stub.fetch(req);
    }
    return withCorsHeaders2(await stub._initAndFetch(name, options?.props, req));
  } else return null;
}
__name(routePartykitRequest, "routePartykitRequest");
var Server = class extends DurableObject {
  static {
    __name(this, "Server");
  }
  static options = { hibernate: false };
  #status = "zero";
  #ParentClass = Object.getPrototypeOf(this).constructor;
  #connectionManager = this.#ParentClass.options.hibernate ? new HibernatingConnectionManager(this.ctx) : new InMemoryConnectionManager();
  /**
  * Execute SQL queries against the Server's database
  * @template T Type of the returned rows
  * @param strings SQL query template strings
  * @param values Values to be inserted into the query
  * @returns Array of query results
  */
  sql(strings, ...values) {
    let query = "";
    try {
      query = strings.reduce((acc, str, i) => acc + str + (i < values.length ? "?" : ""), "");
      return [...this.ctx.storage.sql.exec(query, ...values)];
    } catch (e) {
      console.error(`failed to execute sql query: ${query}`, e);
      throw this.onException(e);
    }
  }
  constructor(ctx, env2) {
    super(ctx, env2);
  }
  /**
  * Handle incoming requests to the server.
  */
  async fetch(request) {
    try {
      const props = request.headers.get("x-partykit-props");
      if (props) this.#_props = JSON.parse(props);
      if (!this.#_name) await this.#hydrateNameFromStorage();
      if (!this.#_name) {
        const room = request.headers.get("x-partykit-room");
        if (!room) throw new Error(`Missing namespace or room headers when connecting to ${this.#ParentClass.name}.
Did you try connecting directly to this Durable Object? Try using getServerByName(namespace, id) instead.`);
        await this.setName(room);
      }
      await this.#ensureInitialized();
      const url = new URL(request.url);
      if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") return await this.onRequest(request);
      else {
        const { 0: clientWebSocket, 1: serverWebSocket } = new WebSocketPair();
        let connectionId = url.searchParams.get("_pk");
        if (!connectionId) connectionId = nanoid();
        let connection = Object.assign(serverWebSocket, {
          id: connectionId,
          uri: request.url,
          server: this.name,
          tags: [],
          state: null,
          setState(setState) {
            let state;
            if (setState instanceof Function) state = setState(this.state);
            else state = setState;
            this.state = state;
            return this.state;
          }
        });
        const ctx = { request };
        const tags = await this.getConnectionTags(connection, ctx);
        connection = this.#connectionManager.accept(connection, { tags });
        if (!this.#ParentClass.options.hibernate) this.#attachSocketEventHandlers(connection);
        await this.onConnect(connection, ctx);
        return new Response(null, {
          status: 101,
          webSocket: clientWebSocket
        });
      }
    } catch (err) {
      console.error(`Error in ${this.#ParentClass.name}:${this.#_name ?? "<unnamed>"} fetch:`, err);
      if (!(err instanceof Error)) throw err;
      if (request.headers.get("Upgrade") === "websocket") {
        const pair = new WebSocketPair();
        pair[1].accept();
        pair[1].send(JSON.stringify({ error: err.stack }));
        pair[1].close(1011, "Uncaught exception during session setup");
        return new Response(null, {
          status: 101,
          webSocket: pair[0]
        });
      } else return new Response(err.stack, { status: 500 });
    }
  }
  async webSocketMessage(ws, message) {
    if (!isPartyServerWebSocket(ws)) return;
    try {
      const connection = createLazyConnection(ws);
      await this.#ensureInitialized();
      connection.server = this.name;
      return this.onMessage(connection, message);
    } catch (e) {
      console.error(`Error in ${this.#ParentClass.name}:${this.#_name ?? "<unnamed>"} webSocketMessage:`, e);
    }
  }
  async webSocketClose(ws, code, reason, wasClean) {
    if (!isPartyServerWebSocket(ws)) return;
    try {
      const connection = createLazyConnection(ws);
      await this.#ensureInitialized();
      connection.server = this.name;
      return this.onClose(connection, code, reason, wasClean);
    } catch (e) {
      console.error(`Error in ${this.#ParentClass.name}:${this.#_name ?? "<unnamed>"} webSocketClose:`, e);
    }
  }
  async webSocketError(ws, error) {
    if (!isPartyServerWebSocket(ws)) return;
    try {
      const connection = createLazyConnection(ws);
      await this.#ensureInitialized();
      connection.server = this.name;
      return this.onError(connection, error);
    } catch (e) {
      console.error(`Error in ${this.#ParentClass.name}:${this.#_name ?? "<unnamed>"} webSocketError:`, e);
    }
  }
  async #hydrateNameFromStorage() {
    if (this.#_name) return;
    const stored = await this.ctx.storage.get(NAME_STORAGE_KEY);
    if (stored) this.#_name = stored;
  }
  /**
  * @internal — Do not use directly. This is an escape hatch for frameworks
  * (like Agents) that receive calls via native DO RPC, bypassing the
  * standard fetch/alarm/webSocket entry points where initialization
  * normally happens. Calling this from application code is unsupported
  * and may break without notice.
  */
  async __unsafe_ensureInitialized() {
    await this.#ensureInitialized();
  }
  async #ensureInitialized() {
    if (this.#status === "started") return;
    await this.#hydrateNameFromStorage();
    let error;
    await this.ctx.blockConcurrencyWhile(async () => {
      this.#status = "starting";
      try {
        await this.onStart(this.#_props);
        this.#status = "started";
      } catch (e) {
        this.#status = "zero";
        error = e;
      }
    });
    if (error) throw error;
  }
  #attachSocketEventHandlers(connection) {
    const handleMessageFromClient = /* @__PURE__ */ __name((event) => {
      this.onMessage(connection, event.data)?.catch((e) => {
        console.error("onMessage error:", e);
      });
    }, "handleMessageFromClient");
    const handleCloseFromClient = /* @__PURE__ */ __name((event) => {
      connection.removeEventListener("message", handleMessageFromClient);
      connection.removeEventListener("close", handleCloseFromClient);
      this.onClose(connection, event.code, event.reason, event.wasClean)?.catch((e) => {
        console.error("onClose error:", e);
      });
    }, "handleCloseFromClient");
    const handleErrorFromClient = /* @__PURE__ */ __name((e) => {
      connection.removeEventListener("message", handleMessageFromClient);
      connection.removeEventListener("error", handleErrorFromClient);
      this.onError(connection, e.error)?.catch((e2) => {
        console.error("onError error:", e2);
      });
    }, "handleErrorFromClient");
    connection.addEventListener("close", handleCloseFromClient);
    connection.addEventListener("error", handleErrorFromClient);
    connection.addEventListener("message", handleMessageFromClient);
  }
  #_name;
  /**
  * The name for this server. Write-once-only.
  * Hydrated from durable storage by #ensureInitialized() on every
  * entry point (fetch, alarm, webSocketMessage/Close/Error).
  */
  get name() {
    if (!this.#_name) throw new Error(`Attempting to read .name on ${this.#ParentClass.name} before it was set. The name can be set by explicitly calling .setName(name) on the stub, or by using routePartyKitRequest(). This is a known issue and will be fixed soon. Follow https://github.com/cloudflare/workerd/issues/2240 for more updates.`);
    return this.#_name;
  }
  async setName(name, props) {
    if (!name) throw new Error("A name is required.");
    if (this.#_name && this.#_name !== name) throw new Error(`This server already has a name: ${this.#_name}, attempting to set to: ${name}`);
    if (props !== void 0) this.#_props = props;
    if (this.#_name === name) return;
    this.#_name = name;
    await this.ctx.storage.put(NAME_STORAGE_KEY, name);
    await this.#ensureInitialized();
  }
  /**
  * @internal Sets name/props and handles a request in a single RPC call.
  * Used by routePartykitRequest to avoid an extra round trip.
  */
  async _initAndFetch(name, props, request) {
    if (props !== void 0) this.#_props = props;
    if (this.#_name && this.#_name !== name) throw new Error(`This server already has a name: ${this.#_name}, attempting to set to: ${name}`);
    if (!this.#_name) {
      this.#_name = name;
      await this.ctx.storage.put(NAME_STORAGE_KEY, name);
    }
    return this.fetch(request);
  }
  #sendMessageToConnection(connection, message) {
    try {
      connection.send(message);
    } catch (_e) {
      connection.close(1011, "Unexpected error");
    }
  }
  /** Send a message to all connected clients, except connection ids listed in `without` */
  broadcast(msg, without) {
    for (const connection of this.#connectionManager.getConnections()) if (!without || !without.includes(connection.id)) this.#sendMessageToConnection(connection, msg);
  }
  /** Get a connection by connection id */
  getConnection(id) {
    return this.#connectionManager.getConnection(id);
  }
  /**
  * Get all connections. Optionally, you can provide a tag to filter returned connections.
  * Use `Server#getConnectionTags` to tag the connection on connect.
  */
  getConnections(tag) {
    return this.#connectionManager.getConnections(tag);
  }
  /**
  * You can tag a connection to filter them in Server#getConnections.
  * Each connection supports up to 9 tags, each tag max length is 256 characters.
  */
  getConnectionTags(connection, context) {
    return [];
  }
  #_props;
  /**
  * Called when the server is started for the first time.
  */
  onStart(props) {
  }
  /**
  * Called when a new connection is made to the server.
  */
  onConnect(connection, ctx) {
  }
  /**
  * Called when a message is received from a connection.
  */
  onMessage(connection, message) {
  }
  /**
  * Called when a connection is closed.
  */
  onClose(connection, code, reason, wasClean) {
  }
  /**
  * Called when an error occurs on a connection.
  */
  onError(connection, error) {
    console.error(`Error on connection ${connection.id} in ${this.#ParentClass.name}:${this.name}:`, error);
    console.info(`Implement onError on ${this.#ParentClass.name} to handle this error.`);
  }
  /**
  * Called when a request is made to the server.
  */
  onRequest(request) {
    console.warn(`onRequest hasn't been implemented on ${this.#ParentClass.name}:${this.name} responding to ${request.url}`);
    return new Response("Not implemented", { status: 404 });
  }
  /**
  * Called when an exception occurs.
  * @param error - The error that occurred.
  */
  onException(error) {
    console.error(`Exception in ${this.#ParentClass.name}:${this.name}:`, error);
    console.info(`Implement onException on ${this.#ParentClass.name} to handle this error.`);
  }
  onAlarm() {
    console.log(`Implement onAlarm on ${this.#ParentClass.name} to handle alarms.`);
  }
  async alarm() {
    await this.#ensureInitialized();
    await this.onAlarm();
  }
};

// src/party/scoring.ts
function scoreAnswer(question, playerAnswer, correctAnswer) {
  switch (question.type) {
    case "multiple_choice_text" /* MultipleChoiceText */:
    case "multiple_choice_number" /* MultipleChoiceNumber */: {
      if (playerAnswer.type !== question.type) return 0;
      if (correctAnswer.type !== question.type) return 0;
      return playerAnswer.selectedOptionId === correctAnswer.selectedOptionId ? 100 : 0;
    }
    case "slider_number" /* SliderNumber */: {
      if (playerAnswer.type !== "slider_number" /* SliderNumber */) return 0;
      if (correctAnswer.type !== "slider_number" /* SliderNumber */) return 0;
      const range = question.max - question.min;
      if (range === 0) return playerAnswer.value === correctAnswer.value ? 100 : 0;
      const error = Math.abs(playerAnswer.value - correctAnswer.value) / range;
      return Math.max(0, Math.round(100 * (1 - error)));
    }
    case "tags" /* Tags */: {
      if (playerAnswer.type !== "tags" /* Tags */) return 0;
      if (correctAnswer.type !== "tags" /* Tags */) return 0;
      if (correctAnswer.tags.length === 0) return 100;
      const matches = correctAnswer.tags.filter(
        (c) => playerAnswer.tags.some((p) => p.toLowerCase() === c.toLowerCase())
      ).length;
      return Math.round(matches / correctAnswer.tags.length * 100);
    }
    case "price" /* Price */: {
      if (playerAnswer.type !== "price" /* Price */) return 0;
      if (correctAnswer.type !== "price" /* Price */) return 0;
      if (correctAnswer.value === 0) return playerAnswer.value === 0 ? 100 : 0;
      const pctError = Math.abs(playerAnswer.value - correctAnswer.value) / correctAnswer.value;
      return Math.max(0, Math.round(100 * (1 - Math.min(1, pctError))));
    }
  }
}
__name(scoreAnswer, "scoreAnswer");
function formatAnswerForDisplay(question, answer) {
  switch (question.type) {
    case "multiple_choice_text" /* MultipleChoiceText */:
    case "multiple_choice_number" /* MultipleChoiceNumber */: {
      if (answer.type !== question.type) return "\u2014";
      return question.options.find((o) => o.id === answer.selectedOptionId)?.label ?? answer.selectedOptionId;
    }
    case "slider_number" /* SliderNumber */: {
      if (answer.type !== "slider_number" /* SliderNumber */) return "\u2014";
      return String(answer.value);
    }
    case "tags" /* Tags */: {
      if (answer.type !== "tags" /* Tags */) return "\u2014";
      return answer.tags.length > 0 ? answer.tags.join(", ") : "(none)";
    }
    case "price" /* Price */: {
      if (answer.type !== "price" /* Price */) return "\u2014";
      return `${question.currencySymbol}${answer.value.toFixed(2)}`;
    }
  }
}
__name(formatAnswerForDisplay, "formatAnswerForDisplay");
function gradePlayerAnswers(questions, playerAnswers, correctAnswers) {
  const playerMap = new Map(playerAnswers.map((a) => [a.questionId, a]));
  const correctMap = new Map(correctAnswers.map((a) => [a.questionId, a]));
  return questions.map((question) => {
    const correctAnswer = correctMap.get(question.id);
    const playerAnswer = playerMap.get(question.id);
    if (!correctAnswer) {
      const fallback = playerAnswer ?? { questionId: question.id, type: question.type };
      return {
        questionId: question.id,
        prompt: question.prompt,
        playerAnswer: fallback,
        correctAnswer: fallback,
        playerAnswerLabel: playerAnswer ? formatAnswerForDisplay(question, playerAnswer) : "\u2014",
        correctAnswerLabel: "\u2014",
        pointsAwarded: 0
      };
    }
    const points = playerAnswer ? scoreAnswer(question, playerAnswer, correctAnswer) : 0;
    return {
      questionId: question.id,
      prompt: question.prompt,
      playerAnswer: playerAnswer ?? correctAnswer,
      correctAnswer,
      playerAnswerLabel: playerAnswer ? formatAnswerForDisplay(question, playerAnswer) : "(no answer)",
      correctAnswerLabel: formatAnswerForDisplay(question, correctAnswer),
      pointsAwarded: points
    };
  });
}
__name(gradePlayerAnswers, "gradePlayerAnswers");

// src/party/helpers.ts
function toPlayer(p) {
  return { id: p.id, name: p.name, status: p.status, score: p.score };
}
__name(toPlayer, "toPlayer");
function buildGameState(state, roomId) {
  const { phase, roundPhase, currentRound, rounds, questionnaire, players, roundAnswers } = state;
  const roundsForPlayer = rounds.map((r) => ({
    number: r.number,
    label: null
    // always hidden mid-game
  }));
  return {
    roomCode: roomId,
    phase,
    roundPhase,
    players: [...players.values()].map(toPlayer),
    currentRound,
    totalRounds: rounds.length,
    questionnaire: questionnaire ?? null,
    // no stripping needed — questions have no correct answers
    rounds: roundsForPlayer,
    answeredPlayerIds: [...roundAnswers.keys()]
  };
}
__name(buildGameState, "buildGameState");
function buildGameResults(state) {
  const sorted = [...state.players.values()].sort((a, b) => b.score - a.score);
  if (sorted.length === 0) {
    return { players: [], winner: { id: "", name: "Nobody", status: "disconnected" /* Disconnected */, score: 0 } };
  }
  const players = sorted.map((player, index) => {
    const rounds = state.rounds.map((round) => {
      const data = state.roundHistory.get(round.number)?.get(player.id);
      return {
        roundNumber: round.number,
        roundLabel: round.label,
        questionResults: data?.questionResults ?? [],
        roundScore: data?.roundScore ?? 0
      };
    });
    return { player: toPlayer(player), rounds, totalScore: player.score, position: index + 1 };
  });
  return { players, winner: players[0].player };
}
__name(buildGameResults, "buildGameResults");

// src/party/server.ts
var BlindTasterServer = class extends Server {
  static {
    __name(this, "BlindTasterServer");
  }
  hostToken = null;
  // C1: set on first host connect, verified on reconnect
  s = {
    phase: "lobby" /* Lobby */,
    roundPhase: "answering" /* Answering */,
    currentRound: 1,
    rounds: [],
    questionnaire: null,
    players: /* @__PURE__ */ new Map(),
    pending: /* @__PURE__ */ new Map(),
    roundAnswers: /* @__PURE__ */ new Map(),
    roundHistory: /* @__PURE__ */ new Map()
  };
  onConnect(conn, ctx) {
    const params = new URL(ctx.request.url).searchParams;
    const isHost = params.get("isHost") === "1";
    const token = params.get("token") ?? "";
    if (isHost) {
      if (this.hostToken === null) {
        if (token.length < 32) {
          conn.close(1008, "invalid token");
          return;
        }
        this.hostToken = token;
      } else if (token !== this.hostToken) {
        conn.close(1008, "invalid token");
        return;
      }
      conn.setState({ role: "host" });
      this.send(conn, { type: "game_state", payload: buildGameState(this.s, this.name) });
      if (this.s.phase === "game_over" /* GameOver */) {
        this.send(conn, { type: "game_ended", payload: buildGameResults(this.s) });
      } else if (this.s.phase !== "lobby" /* Lobby */) {
        void this.ctx.storage.deleteAlarm();
        this.broadcastToPlayers({ type: "game_resumed" });
      }
    } else {
      conn.setState({ role: "pending" });
    }
  }
  onMessage(sender, message) {
    let msg;
    try {
      const raw = typeof message === "string" ? message : new TextDecoder().decode(message);
      msg = JSON.parse(raw);
      if (typeof msg?.type !== "string") return;
    } catch {
      return;
    }
    const cs = sender.state;
    const HOST_ONLY = /* @__PURE__ */ new Set(["admit_player", "deny_player", "start_game", "reveal_answers", "advance_round", "kick_player", "end_game"]);
    const PLAYER_ONLY = /* @__PURE__ */ new Set(["submit_answers"]);
    const PENDING_ONLY = /* @__PURE__ */ new Set(["request_join"]);
    if (HOST_ONLY.has(msg.type) && cs?.role !== "host") return;
    if (PLAYER_ONLY.has(msg.type) && cs?.role !== "player") return;
    if (PENDING_ONLY.has(msg.type) && cs?.role !== "pending") return;
    switch (msg.type) {
      case "request_join":
        return this.handleRequestJoin(sender, msg.payload.name);
      case "admit_player":
        return this.handleAdmit(msg.payload.playerId);
      case "deny_player":
        return this.handleDeny(msg.payload.playerId);
      case "start_game":
        return this.handleStartGame(msg.payload.questionnaire, msg.payload.rounds);
      case "submit_answers":
        return this.handleSubmitAnswers(sender, msg.payload);
      case "reveal_answers":
        return this.handleRevealAnswers();
      case "advance_round":
        return this.handleAdvanceRound();
      case "kick_player":
        return this.handleKick(msg.payload.playerId);
      case "end_game":
        return this.handleEndGame();
    }
  }
  onClose(conn, _code, _reason, _wasClean) {
    const cs = conn.state;
    if (cs?.role === "host" && this.s.phase !== "lobby" /* Lobby */) {
      this.broadcastToPlayers({ type: "game_paused", payload: { reason: "host_disconnected" /* HostDisconnected */ } });
      void this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1e3);
    } else if (cs?.role === "player" && cs.playerId) {
      const player = this.s.players.get(cs.playerId);
      if (player) {
        player.connectionId = null;
        player.status = "disconnected" /* Disconnected */;
      }
      this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
    } else if (cs?.role === "pending") {
      this.s.pending.delete(conn.id);
    }
  }
  async onAlarm() {
    if (this.s.phase !== "lobby" /* Lobby */ && this.s.phase !== "game_over" /* GameOver */ && !this.findHost()) {
      this.handleEndGame();
    }
  }
  // ─── Message handlers ────────────────────────────────────────────────────────
  handleRequestJoin(conn, name) {
    const sanitised = typeof name === "string" ? name.trim() : "";
    if (sanitised.length === 0 || sanitised.length > 24) return;
    const lower = sanitised.toLowerCase();
    const taken = [...this.s.players.values()].some((p) => p.name.toLowerCase() === lower) || [...this.s.pending.values()].some((n) => n.toLowerCase() === lower);
    if (taken) {
      this.send(conn, { type: "name_taken" });
      return;
    }
    this.s.pending.set(conn.id, sanitised);
    const host = this.findHost();
    if (host) this.send(host, { type: "join_request", payload: { playerId: conn.id, name: sanitised } });
  }
  handleAdmit(pendingConnId) {
    const name = this.s.pending.get(pendingConnId);
    if (!name) return;
    this.s.pending.delete(pendingConnId);
    const conn = this.getConnection(pendingConnId);
    if (!conn) return;
    const player = {
      id: pendingConnId,
      name,
      status: "connected" /* Connected */,
      score: 0,
      connectionId: pendingConnId
    };
    this.s.players.set(pendingConnId, player);
    conn.setState({ role: "player", playerId: pendingConnId });
    this.send(conn, { type: "player_admitted", payload: { playerId: pendingConnId, name } });
    this.broadcastToAdmitted({ type: "player_joined", payload: { player: toPlayer(player) } });
    this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
  }
  handleDeny(pendingConnId) {
    this.s.pending.delete(pendingConnId);
    const conn = this.getConnection(pendingConnId);
    if (conn) this.send(conn, { type: "you_were_denied" });
  }
  handleStartGame(questionnaire, rounds) {
    if (!questionnaire || !Array.isArray(rounds)) return;
    if (questionnaire.questions.length > 20) return;
    if (rounds.length > 20 || rounds.length === 0) return;
    if (typeof questionnaire.name !== "string" || questionnaire.name.length > 100) return;
    for (const q of questionnaire.questions) {
      if (typeof q.prompt !== "string" || q.prompt.length > 500) return;
      if ((q.type === "multiple_choice_text" /* MultipleChoiceText */ || q.type === "multiple_choice_number" /* MultipleChoiceNumber */) && Array.isArray(q.options) && q.options.length > 10) return;
    }
    this.s.questionnaire = questionnaire;
    this.s.rounds = rounds;
    this.s.currentRound = 1;
    this.s.phase = "in_round" /* InRound */;
    this.s.roundPhase = "answering" /* Answering */;
    this.s.roundAnswers = /* @__PURE__ */ new Map();
    const roundsForPlayer = rounds.map((r) => ({ number: r.number, label: null }));
    this.broadcastToPlayers({ type: "game_started", payload: { questionnaire, rounds: roundsForPlayer } });
    this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
  }
  handleSubmitAnswers(sender, data) {
    const cs = sender.state;
    const playerId = cs?.playerId;
    if (!playerId || !this.s.players.has(playerId)) return;
    if (this.s.roundAnswers.has(playerId)) return;
    this.s.roundAnswers.set(playerId, data.answers);
    const host = this.findHost();
    if (host) this.send(host, { type: "player_answered", payload: { playerId } });
    this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
    const connected = [...this.s.players.values()].filter((p) => p.connectionId !== null);
    if (connected.length > 0 && connected.every((p) => this.s.roundAnswers.has(p.id))) {
      this.s.phase = "all_answered" /* AllAnswered */;
      this.s.roundPhase = "all_answered" /* AllAnswered */;
      this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
      this.broadcastToAdmitted({ type: "all_players_answered" });
    }
  }
  handleRevealAnswers() {
    if (this.s.roundPhase === "answers_revealed" /* AnswersRevealed */) return;
    const { questionnaire, currentRound, roundAnswers, players, rounds } = this.s;
    if (!questionnaire) return;
    const currentRoundData = rounds.find((r) => r.number === currentRound);
    if (!currentRoundData) return;
    const playerScores = [];
    const roundMap = /* @__PURE__ */ new Map();
    for (const player of players.values()) {
      const answers = roundAnswers.get(player.id) ?? [];
      const results = gradePlayerAnswers(questionnaire.questions, answers, currentRoundData.correctAnswers);
      const roundScore = results.reduce((sum, r) => sum + r.pointsAwarded, 0);
      player.score += roundScore;
      roundMap.set(player.id, { questionResults: results, roundScore });
      playerScores.push({ playerId: player.id, roundScore, totalScore: player.score });
    }
    this.s.roundHistory.set(currentRound, roundMap);
    this.s.phase = "answers_revealed" /* AnswersRevealed */;
    this.s.roundPhase = "answers_revealed" /* AnswersRevealed */;
    for (const player of players.values()) {
      const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
      if (!conn) continue;
      const qr = roundMap.get(player.id)?.questionResults ?? [];
      this.send(conn, { type: "answers_revealed", payload: { roundNumber: currentRound, questionResults: qr, playerScores } });
    }
    const host = this.findHost();
    if (host) this.send(host, { type: "answers_revealed", payload: { roundNumber: currentRound, questionResults: [], playerScores } });
    this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
  }
  handleAdvanceRound() {
    if (this.s.roundPhase !== "answers_revealed" /* AnswersRevealed */) return;
    if (this.s.currentRound >= this.s.rounds.length) {
      this.handleEndGame();
      return;
    }
    this.s.currentRound += 1;
    this.s.phase = "in_round" /* InRound */;
    this.s.roundPhase = "answering" /* Answering */;
    this.s.roundAnswers = /* @__PURE__ */ new Map();
    this.broadcastToAdmitted({ type: "round_started", payload: { roundNumber: this.s.currentRound } });
    this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
  }
  handleKick(playerId) {
    const player = this.s.players.get(playerId);
    if (!player) return;
    const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
    if (conn) {
      this.send(conn, { type: "you_were_kicked" });
      conn.close(1e3, "kicked");
    }
    this.s.players.delete(playerId);
    this.broadcastToAdmitted({ type: "player_kicked", payload: { playerId } });
    this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
  }
  handleEndGame() {
    if (this.s.phase === "game_over" /* GameOver */) return;
    this.s.phase = "game_over" /* GameOver */;
    const results = buildGameResults(this.s);
    this.broadcastToAdmitted({ type: "game_ended", payload: results });
    this.broadcastToAdmitted({ type: "game_state", payload: buildGameState(this.s, this.name) });
  }
  // ─── Utility ─────────────────────────────────────────────────────────────────
  send(conn, msg) {
    conn.send(JSON.stringify(msg));
  }
  broadcastToPlayers(msg) {
    for (const player of this.s.players.values()) {
      const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
      if (conn) this.send(conn, msg);
    }
  }
  // Send to host + admitted players only — never to unadmitted pending connections.
  broadcastToAdmitted(msg) {
    const host = this.findHost();
    if (host) this.send(host, msg);
    this.broadcastToPlayers(msg);
  }
  findHost() {
    for (const conn of this.getConnections()) {
      if (conn.state?.role === "host") return conn;
    }
    return void 0;
  }
};
var server_default = {
  async fetch(req, env2) {
    return await routePartykitRequest(req, env2) ?? new Response("Not found", { status: 404 });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-pK6ID3/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = server_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-pK6ID3/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  BlindTasterServer,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=server.js.map
