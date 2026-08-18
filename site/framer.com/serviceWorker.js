"use strict";
(() => {
  function he() {
    return ["/web/v2/dashboard/metadata"];
  }
  var J = class {
    constructor(e = 0, t = 0, n = !1) {
      (this.first = null),
        (this.items = Object.create(null)),
        (this.last = null),
        (this.max = e),
        (this.resetTtl = n),
        (this.size = 0),
        (this.ttl = t);
    }
    clear() {
      return (
        (this.first = null),
        (this.items = Object.create(null)),
        (this.last = null),
        (this.size = 0),
        this
      );
    }
    delete(e) {
      if (this.has(e)) {
        let t = this.items[e];
        delete this.items[e],
          this.size--,
          t.prev !== null && (t.prev.next = t.next),
          t.next !== null && (t.next.prev = t.prev),
          this.first === t && (this.first = t.next),
          this.last === t && (this.last = t.prev);
      }
      return this;
    }
    entries(e = this.keys()) {
      let t = new Array(e.length);
      for (let n = 0; n < e.length; n++) {
        let o = e[n];
        t[n] = [o, this.get(o)];
      }
      return t;
    }
    evict(e = !1) {
      if (e || this.size > 0) {
        let t = this.first;
        delete this.items[t.key],
          --this.size === 0
            ? ((this.first = null), (this.last = null))
            : ((this.first = t.next), (this.first.prev = null));
      }
      return this;
    }
    expiresAt(e) {
      let t;
      return this.has(e) && (t = this.items[e].expiry), t;
    }
    get(e) {
      let t = this.items[e];
      if (t !== void 0) {
        if (this.ttl > 0 && t.expiry <= Date.now()) {
          this.delete(e);
          return;
        }
        return this.moveToEnd(t), t.value;
      }
    }
    has(e) {
      return e in this.items;
    }
    moveToEnd(e) {
      this.last !== e &&
        (e.prev !== null && (e.prev.next = e.next),
        e.next !== null && (e.next.prev = e.prev),
        this.first === e && (this.first = e.next),
        (e.prev = this.last),
        (e.next = null),
        this.last !== null && (this.last.next = e),
        (this.last = e),
        this.first === null && (this.first = e));
    }
    keys() {
      let e = new Array(this.size),
        t = this.first,
        n = 0;
      for (; t !== null; ) (e[n++] = t.key), (t = t.next);
      return e;
    }
    setWithEvicted(e, t, n = this.resetTtl) {
      let o = null;
      if (this.has(e)) this.set(e, t, !0, n);
      else {
        this.max > 0 &&
          this.size === this.max &&
          ((o = { ...this.first }), this.evict(!0));
        let i = (this.items[e] = {
          expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
          key: e,
          prev: this.last,
          next: null,
          value: t,
        });
        ++this.size === 1 ? (this.first = i) : (this.last.next = i),
          (this.last = i);
      }
      return o;
    }
    set(e, t, n = !1, o = this.resetTtl) {
      let i = this.items[e];
      return (
        n || i !== void 0
          ? ((i.value = t),
            n === !1 &&
              o &&
              (i.expiry = this.ttl > 0 ? Date.now() + this.ttl : this.ttl),
            this.moveToEnd(i))
          : (this.max > 0 && this.size === this.max && this.evict(!0),
            (i = this.items[e] =
              {
                expiry: this.ttl > 0 ? Date.now() + this.ttl : this.ttl,
                key: e,
                prev: this.last,
                next: null,
                value: t,
              }),
            ++this.size === 1 ? (this.first = i) : (this.last.next = i),
            (this.last = i)),
        this
      );
    }
    values(e = this.keys()) {
      let t = new Array(e.length);
      for (let n = 0; n < e.length; n++) t[n] = this.get(e[n]);
      return t;
    }
  };
  function ge(r = 1e3, e = 0, t = !1) {
    if (isNaN(r) || r < 0) throw new TypeError("Invalid max value");
    if (isNaN(e) || e < 0) throw new TypeError("Invalid ttl value");
    if (typeof t != "boolean") throw new TypeError("Invalid resetTtl value");
    return new J(r, e, t);
  }
  function m(r, e) {
    r.waitUntil(e);
  }
  function R(r, e) {
    if (r) return;
    if (typeof e == "function")
      try {
        e = e();
      } catch {
        e = "(assert message threw)";
      }
    typeof e == "string" &&
      e.length > 2048 &&
      (e = e.slice(0, 2048) + "\u2026");
    let t = Error(e ? "Assertion Error: " + e : "Assertion Error");
    if (t.stack)
      try {
        let n = t.stack.split(`
`);
        n[1]?.includes("assert")
          ? (n.splice(1, 1),
            (t.stack = n.join(`
`)))
          : n[0]?.includes("assert") &&
            (n.splice(0, 1),
            (t.stack = n.join(`
`)));
      } catch {}
    throw t;
  }
  var Xt = Object.freeze([]);
  function b() {
    return typeof document == "object";
  }
  var me,
    xe = !1;
  function ye({ error: r, tags: e, extras: t, critical: n, caller: o }) {
    let i = Z(r, o);
    return (
      me
        ? me({
            error: i,
            tags: { ...i.tags, ...e },
            extras: { ...i.extras, ...t },
            critical: !!n,
          })
        : xe ||
          ((xe = !0),
          console.error(
            "Set up an error callback with setErrorReporter, or configure Sentry with initializeEnvironment"
          )),
      i
    );
  }
  function Z(r, e = Z) {
    return r instanceof Error ? r : new Q(r, e);
  }
  var Q = class extends Error {
    constructor(e, t) {
      let n = e ? JSON.stringify(e) : "No error message provided";
      if ((super(n), (this.message = n), t && Error.captureStackTrace))
        Error.captureStackTrace(this, t);
      else
        try {
          throw new Error();
        } catch (o) {
          this.stack = o.stack;
        }
    }
  };
  var A =
      typeof window < "u" && !("Deno" in globalThis)
        ? window.location.hostname
        : void 0,
    be = !!(
      A &&
      ["web.framerlocal.com", "localhost", "127.0.0.1", "[::1]"].includes(A)
    ),
    X = (() => {
      if (!A) return;
      if (be) return { main: A, previewLink: void 0 };
      let r = /^(([^.]+\.)?beta\.)?((?:development\.)?framer\.com)$/u,
        e = A.match(r);
      if (!(!e || !e[3])) return { previewLink: e[2] && e[0], main: e[3] };
    })(),
    we = {
      hosts: X,
      isDevelopment: X?.main === "development.framer.com",
      isProduction: X?.main === "framer.com",
      isLocal: be,
    };
  var C;
  function F() {
    return typeof window > "u" ? {} : C || ((C = Je()), C);
  }
  function Je() {
    let r = window.location,
      e = window?.bootstrap?.services;
    if (e) return e;
    let t;
    try {
      if (
        ((t = window.top.location.origin),
        (e = window.top?.bootstrap?.services),
        e)
      )
        return e;
    } catch {}
    if (t && t !== r.origin)
      throw Error(`Unexpectedly embedded by ${t} (expected ${r.origin})`);
    if (r.origin.endsWith("framer.com") || r.origin.endsWith("framer.dev"))
      throw Error("ServiceMap data was not provided in document");
    try {
      let n =
        new URLSearchParams(r.search).get("services") ||
        new URLSearchParams(r.hash.substring(1)).get("services");
      n && (e = JSON.parse(n));
    } catch {}
    if (e && typeof e == "object" && e.api) return e;
    throw Error("ServiceMap requested but not available");
  }
  function P(r, e = 0, t = new Set()) {
    if (r === null) return r;
    if (typeof r == "function") return `[Function: ${r.name ?? "unknown"}]`;
    if (typeof r != "object") return r;
    if (r instanceof Error) return `[${r.toString()}]`;
    if (t.has(r)) return "[Circular]";
    if (e > 2) return "...";
    t.add(r);
    try {
      if ("toJSON" in r && typeof r.toJSON == "function")
        return P(r.toJSON(), e + 1, t);
      if (Array.isArray(r)) return r.map((n) => P(n, e + 1, t));
      if (Object.getPrototypeOf(r) !== Object.prototype)
        return `[Object: ${
          ("__class" in r && r.__class) || r.constructor?.name
        }]`;
      {
        let n = {};
        for (let [o, i] of Object.entries(r)) n[o] = P(i, e + 1, t);
        return n;
      }
    } catch (n) {
      return `[Throws: ${n instanceof Error ? n.message : n}]`;
    } finally {
      t.delete(r);
    }
  }
  var ee = ["trace", "debug", "info", "warn", "error"],
    Qe = ["\u{1F50D}", "\u{1F9EA}", "\u2139\uFE0F", "\u26A0\uFE0F", "\u274C"],
    Ze = [":trace", ":debug", ":info", ":warn", ":error"],
    Me = "logTimestamps";
  function Ie(r) {
    return new Date(r).toISOString().substring(10, 24);
  }
  function ve(r, e) {
    let t = [];
    for (let n of r.split(/[ ,]/u)) {
      let o = n.trim();
      if (o.length === 0) continue;
      let i = 1,
        s = !1;
      o.startsWith("-") && ((o = o.slice(1)), (i = 3), (s = !0));
      for (let g = 0; g <= 4; g++) {
        let I = Ze[g];
        if (I && o.endsWith(I)) {
          (i = g),
            s && (i += 1),
            (o = o.slice(0, o.length - I.length)),
            o.length === 0 && (o = "*");
          break;
        }
      }
      let c = new RegExp("^" + Ae(o).replace(/\\\*/gu, ".*") + "$"),
        h = 0;
      for (let g of e) g.id.match(c) && ((g.level = i), ++h);
      h === 0 && t.push(n);
    }
    return t;
  }
  var O = class r {
      constructor(e, t, n) {
        this.logger = e;
        this.level = t;
        this.parts = n;
        (this.id = r.nextId++), (this.time = Date.now());
      }
      logger;
      level;
      parts;
      static nextId = 0;
      id;
      time;
      stringPrefix;
      cachedMessage;
      toMessage() {
        if (this.stringPrefix) return this.cachedMessage ?? this.parts;
        let e = [ee[this.level] + ": [" + this.logger.id + "]"];
        B && e.unshift(Ie(this.time)), (this.stringPrefix = e.join(" "));
        let t = this.parts[0];
        if (typeof t == "string") {
          let n = ot(t, this.logger.id, this.level);
          this.cachedMessage = [
            n.length > 0 ? `${this.stringPrefix} ${n}` : this.stringPrefix,
            ...this.parts.slice(1),
          ];
        } else this.cachedMessage = [this.stringPrefix, ...this.parts];
        return this.cachedMessage;
      }
      resetMessagePrefix() {
        (this.stringPrefix = void 0), (this.cachedMessage = void 0);
      }
      toConsoleMessage() {
        let e = this.toMessage().slice(),
          t = e[0];
        if (typeof t != "string") return e;
        let n = ee[this.level],
          o = Qe[this.level];
        n && o && (e[0] = t.replace(`${n}:`, `${o}`));
        let i = `[${this.logger.id}]`,
          s = e[0];
        if (typeof s != "string") return e;
        let c = s.indexOf(i);
        return (
          c < 0 ||
            ((e[0] = s.slice(0, c) + "%c" + i + "%c" + s.slice(c + i.length)),
            e.splice(1, 0, "color: #9ca3af", "")),
          e
        );
      }
      toString() {
        return this.toMessage()
          .map((e) => {
            let t = typeof e;
            if (t === "string") return e;
            if (t === "function") return `[Function: ${e.name ?? "unknown"}]`;
            if (e instanceof Error) return e.stack ?? e.toString();
            let n = JSON.stringify(P(e));
            return n?.length > 253 ? n.slice(0, 250) + "..." : n;
          })
          .join(" ");
      }
    },
    y = "*:app:info,app:info",
    B = !0,
    Te = typeof process < "u" && !!process.kill,
    Xe = Te && !!process.env.CI;
  Xe ? (y = "-:warn") : Te && (y = "");
  try {
    typeof window < "u" &&
      window.localStorage &&
      ((y = window.localStorage.logLevel || y),
      (B = window.localStorage[Me] !== "false"));
  } catch {}
  try {
    typeof process < "u" && (y = process.env.DEBUG || y);
  } catch {}
  try {
    typeof window < "u" &&
      Object.assign(window, { setLogLevel: Le, setLogTimestamps: Re });
  } catch {}
  try {
    typeof window < "u" &&
      window.postMessage &&
      window.top === window &&
      window.addEventListener("message", (r) => {
        if (!r.data || typeof r.data != "object") return;
        let { loggerId: e, level: t, parts: n, printed: o } = r.data;
        if (
          typeof e != "string" ||
          !Array.isArray(n) ||
          n.length < 1 ||
          typeof t != "number"
        )
          return;
        let i = E(e);
        if (t < 0 || t > 5) return;
        n[0] = n[0].replace("[", "*[");
        let s = new O(i, t, n);
        (s.stringPrefix = n[0]),
          x.push(s),
          !o && (i.level > t || console?.log(...s.toConsoleMessage()));
      });
  } catch {}
  var re;
  try {
    typeof window < "u" &&
      window.postMessage &&
      window.parent !== window &&
      !window.location.pathname.startsWith("/edit") &&
      (re = (r) => {
        try {
          let e = r.toMessage().map((s) => P(s)),
            t = r.logger,
            n = r.level,
            o = t.level <= r.level,
            i = { loggerId: t.id, level: n, parts: e, printed: o };
          window.parent?.postMessage(i, F().app);
        } catch {}
      });
  } catch {}
  var te = {},
    x = [],
    ke = 1e3;
  function w(r, e, t) {
    let n = new O(r, e, t);
    for (x.push(n), re?.(n); x.length > ke; ) x.shift();
    return n;
  }
  function Se(r) {
    return typeof r == "number" && (ke = r), x;
  }
  var et = /\/(?<filename>[^/.]+)(?=\.(?:debug\.)?html$)/u,
    Ee;
  function tt() {
    if (!(typeof window > "u" || !window.location))
      return (Ee ??= et.exec(window.location.pathname)?.groups?.filename), Ee;
  }
  function E(r) {
    let e = tt();
    r = (e ? e + ":" : "") + r;
    let t = te[r];
    if (t) return t;
    let n = new W(r);
    return (te[r] = n), ve(y, [n]), re?.(new O(n, -1, [])), n;
  }
  function Le(r, e = !0) {
    try {
      typeof window < "u" &&
        window.localStorage &&
        (window.localStorage.logLevel = r);
    } catch {}
    let t = y;
    y = r;
    let n = Object.values(te);
    for (let i of n) i.level = 3;
    let o = ve(r, n);
    if (
      (o.length > 0 &&
        console?.warn("Some log level specs matched no loggers:", o),
      e && x.length > 0)
    ) {
      console?.log("--- LOG REPLAY ---");
      for (let i of x)
        i.logger.level > i.level ||
          (i.level >= 3
            ? console?.warn(...i.toConsoleMessage())
            : console?.log(...i.toConsoleMessage()));
      console?.log("--- END OF LOG REPLAY ---");
    }
    return t;
  }
  function Re(r) {
    let e = B;
    B = r;
    for (let t of x) t.resetMessagePrefix();
    try {
      typeof window < "u" &&
        window.localStorage &&
        (window.localStorage[Me] = String(r));
    } catch {}
    return e;
  }
  var rt = (r) => {
      let e = {
        ...r,
        logs: Se()
          .slice(-50)
          .map((t) => t.toString().slice(0, 600)).join(`
`),
      };
      return (
        r.logs &&
          console?.warn(
            "extras.logs is reserved for log replay buffer, use another key"
          ),
        e
      );
    },
    W = class {
      constructor(e, t) {
        this.id = e;
        this.errorIsCritical = t ?? (e === "fatal" || e.endsWith(":fatal"));
      }
      id;
      level = 3;
      didLog = {};
      errorIsCritical;
      extend(e) {
        let t = this.id + ":" + e;
        return E(t);
      }
      getBufferedMessages() {
        return x.filter((e) => e.logger === this);
      }
      setLevel(e) {
        let t = this.level;
        return (this.level = e), t;
      }
      isLoggingTraceMessages() {
        return this.level >= 0;
      }
      trace = (...e) => {
        if (this.level > 0) return;
        let t = w(this, 0, e);
        console?.log(...t.toConsoleMessage());
      };
      debug = (...e) => {
        let t = w(this, 1, e);
        this.level > 1 || console?.log(...t.toConsoleMessage());
      };
      info = (...e) => {
        let t = w(this, 2, e);
        this.level > 2 || console?.info(...t.toConsoleMessage());
      };
      warn = (...e) => {
        let t = w(this, 3, e);
        this.level > 3 || console?.warn(...t.toConsoleMessage());
      };
      warnOncePerMinute = (e, ...t) => {
        let n = this.didLog[e];
        if (n && n > Date.now()) return;
        (this.didLog[e] = Date.now() + 1e3 * 60), t.unshift(e);
        let o = w(this, 3, t);
        this.level > 3 || console?.warn(...o.toConsoleMessage());
      };
      error = (...e) => {
        let t = w(this, 4, e);
        this.level > 4 || console?.error(...t.toConsoleMessage());
      };
      errorOncePerMinute = (e, ...t) => {
        let n = this.didLog[e];
        if (n && n > Date.now()) return;
        (this.didLog[e] = Date.now() + 1e3 * 60), t.unshift(e);
        let o = w(this, 4, t);
        this.level > 4 || console?.error(...o.toConsoleMessage());
      };
      reportWithoutLogging = (e, t, n, o) => {
        let i = rt(t ?? {}),
          s = ye({
            caller: this.reportWithoutLogging,
            error: e,
            tags: { ...n, handler: "logger", where: this.id },
            extras: t,
            critical: o ?? this.errorIsCritical,
          });
        return [i, s];
      };
      reportError = (e, t, n, o) => {
        let [i, s] = this.reportWithoutLogging(e, t, n, o),
          c = [s, i, n].filter(Boolean);
        this.error(...c);
      };
      reportErrorWithThrottle = (e, t, n, o, i) => {
        if (!nt(t)) return;
        let s = this.didLog[t.message];
        (s && s > Date.now()) ||
          ((this.didLog[t.message] = Date.now() + e),
          this.reportError(t, n, o, i));
      };
      reportErrorOncePerMinute = (e, t, n, o) =>
        this.reportErrorWithThrottle(1e3 * 60, e, t, n, o);
      reportErrorOnceEveryTenMinutes = (e, t, n, o) =>
        this.reportErrorWithThrottle(1e3 * 60 * 10, e, t, n, o);
      reportCriticalError = (e, t, n) => this.reportError(e, t, n, !0);
    };
  function nt(r) {
    return Object.prototype.hasOwnProperty.call(r, "message");
  }
  function Ae(r) {
    return r.replace(/[/\-\\^$*+?.()|[\]{}]/gu, "\\$&");
  }
  function ot(r, e, t) {
    let n = ee[t];
    if (!n) return r;
    let o = `${n}: [${e}]`,
      i = Ae(o).replace("\\[", "\\*?\\["),
      s = new RegExp(`^(?:T?\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z\\s+)?${i}\\s*`);
    return r.replace(s, "");
  }
  var Pe = "dependencies",
    Oe = "config",
    ne = `${Oe}/${Pe}`,
    st = "importMap.json",
    at = "dependencies.json",
    lt = `${ne}/${st}`,
    ct = `${ne}/${at}`;
  var De;
  ((Ft) => {
    function r(l, ...a) {
      return l.concat(a);
    }
    Ft.push = r;
    function e(l) {
      return l.slice(0, -1);
    }
    Ft.pop = e;
    function t(l, ...a) {
      return a.concat(l);
    }
    Ft.unshift = t;
    function n(l, a, ...u) {
      let p = l.length;
      if (a < 0 || a > p) throw Error("index out of range: " + a);
      let d = l.slice();
      return d.splice(a, 0, ...u), d;
    }
    Ft.insert = n;
    function o(l, a, u) {
      let p = l.length;
      if (a < 0 || a >= p) throw Error("index out of range: " + a);
      let d = Array.isArray(u) ? u : [u],
        L = l.slice();
      return L.splice(a, 1, ...d), L;
    }
    Ft.replace = o;
    function i(l, a) {
      let u = l.length;
      if (a < 0 || a >= u) throw Error("index out of range: " + a);
      let p = l.slice();
      return p.splice(a, 1), p;
    }
    Ft.remove = i;
    function s(l, a, u) {
      let p = l.length;
      if (a < 0 || a >= p) throw Error("from index out of range: " + a);
      if (u < 0 || u >= p) throw Error("to index out of range: " + u);
      let d = l.slice();
      if (u === a) return d;
      let L = d[a];
      return (
        a < u
          ? (d.splice(u + 1, 0, L), d.splice(a, 1))
          : (d.splice(a, 1), d.splice(u, 0, L)),
        d
      );
    }
    Ft.move = s;
    function c(l, a) {
      let u = [],
        p = Math.min(l.length, a.length);
      for (let d = 0; d < p; d++) u.push([l[d], a[d]]);
      return u;
    }
    Ft.zip = c;
    function h(l, a, u) {
      let p = l.slice(),
        d = p[a];
      return d === void 0 || (p[a] = u(d)), p;
    }
    Ft.update = h;
    function g(l) {
      return Array.from(new Set(l));
    }
    Ft.unique = g;
    function I(l, ...a) {
      return Array.from(new Set([...l, ...a.flat()]));
    }
    Ft.union = I;
    function Ct(l, a) {
      return l.filter(a);
    }
    Ft.filter = Ct;
  })((De ||= {}));
  var ut = Object.prototype.hasOwnProperty;
  function dt(r, e) {
    return ut.call(r, e);
  }
  var Ne;
  ((n) => {
    function r(o, i) {
      for (let s of Object.keys(o)) dt(i, s) || delete o[s];
      for (let s of Object.keys(i)) o[s] === void 0 && (o[s] = i[s]);
      return Object.setPrototypeOf(o, Object.getPrototypeOf(i)), o;
    }
    n.morphUsingTemplate = r;
    function e(o, i) {
      i && Object.assign(o, i);
    }
    n.writeOnce = e;
    function t(o, i) {
      return Object.assign(Object.create(Object.getPrototypeOf(o)), o, i);
    }
    n.update = t;
  })((Ne ||= {}));
  var Ce;
  ((o) => {
    function r(i, ...s) {
      return new Set([...i, ...s]);
    }
    o.add = r;
    function e(i, ...s) {
      let c = new Set(i);
      for (let h of s) c.delete(h);
      return c;
    }
    o.remove = e;
    function t(...i) {
      let s = new Set();
      for (let c of i) for (let h of c) s.add(h);
      return s;
    }
    o.union = t;
    function n(i, s) {
      return i.has(s) ? o.remove(i, s) : o.add(i, s);
    }
    o.toggle = n;
  })((Ce ||= {}));
  var Fe;
  ((n) => {
    function r(o, ...i) {
      let s = new Map();
      o.forEach((h, g) => s.set(g, h));
      let c = !1;
      for (let h of i) h && (h.forEach((g, I) => s.set(I, g)), (c = !0));
      return c ? s : o;
    }
    n.merge = r;
    function e(o, i, s) {
      let c = new Map(o);
      return c.set(i, s), c;
    }
    n.set = e;
    function t(o, i) {
      let s = new Map(o);
      return s.delete(i), s;
    }
    n.remove = t;
  })((Fe ||= {}));
  var _ = class extends Promise {
    _state = "initial";
    resolve;
    reject;
    get state() {
      return this._state;
    }
    pending() {
      return (this._state = "pending"), this;
    }
    isResolved() {
      return this._state === "fulfilled" || this._state === "rejected";
    }
    constructor() {
      let e, t;
      super((n, o) => {
        (e = n), (t = o);
      }),
        (this.resolve = (n) => {
          (this._state = "fulfilled"), e(n);
        }),
        (this.reject = (n) => {
          (this._state = "rejected"), t(n);
        });
    }
  };
  _.prototype.constructor = Promise;
  var ft = b() && "hidden" in document,
    Pr = b() && "requestIdleCallback" in window,
    Or = b() && typeof requestAnimationFrame == "function",
    pt = !1,
    ht = !1,
    gt = !1;
  function mt() {
    if (!(typeof scheduler > "u")) return scheduler;
  }
  var U = mt();
  U &&
    ((pt = "yield" in U), (ht = "postTask" in U), (gt = "isInputPending" in U));
  function xt() {
    return ft ? document.hidden : !1;
  }
  var Dr = b() && typeof document.hasFocus == "function";
  var Nr = 1e3 / 60,
    Cr = 1e3 / 25;
  var yt, Be;
  function We() {
    let r = Be;
    r && ((yt = void 0), (Be = void 0), r());
  }
  b() &&
    (document.addEventListener("visibilitychange", () => {
      xt() && We();
    }),
    window.addEventListener("pagehide", We));
  var $r = E("task-queue");
  function bt() {
    var r =
      !navigator.userAgentData &&
      /Safari\//.test(navigator.userAgent) &&
      !/Chrom(e|ium)\//.test(navigator.userAgent);
    if (!r || !indexedDB.databases) return Promise.resolve();
    var e;
    return new Promise(function (t) {
      var n = function () {
        return indexedDB.databases().finally(t);
      };
      (e = setInterval(n, 100)), n();
    }).finally(function () {
      return clearInterval(e);
    });
  }
  var _e = bt;
  function j(r) {
    return new Promise((e, t) => {
      (r.oncomplete = r.onsuccess = () => e(r.result)),
        (r.onabort = r.onerror = () => t(r.error));
    });
  }
  function Ue(r, e, t) {
    let n = indexedDB.open(r, t);
    return (n.onupgradeneeded = () => n.result.createObjectStore(e)), j(n);
  }
  function wt(r, e) {
    let t = _e()
      .then(() => Ue(r, e))
      .then((n) =>
        n.objectStoreNames.contains(e)
          ? n
          : (n.close(), Ue(r, e, n.version + 1))
      );
    return (n, o) => t.then((i) => o(i.transaction(e, n).objectStore(e)));
  }
  var oe;
  function ie() {
    return oe || (oe = wt("keyval-store", "keyval")), oe;
  }
  function $(r, e = ie()) {
    return e("readonly", (t) => j(t.get(r)));
  }
  function V(r, e, t = ie()) {
    return t("readwrite", (n) => (n.put(e, r), j(n.transaction)));
  }
  function K(r, e = ie()) {
    return e("readwrite", (t) => (t.delete(r), j(t.transaction)));
  }
  var M = class extends Error {};
  M.prototype.name = "InvalidTokenError";
  function Et(r) {
    return decodeURIComponent(
      atob(r).replace(/(.)/g, (e, t) => {
        let n = t.charCodeAt(0).toString(16).toUpperCase();
        return n.length < 2 && (n = "0" + n), "%" + n;
      })
    );
  }
  function Mt(r) {
    let e = r.replace(/-/g, "+").replace(/_/g, "/");
    switch (e.length % 4) {
      case 0:
        break;
      case 2:
        e += "==";
        break;
      case 3:
        e += "=";
        break;
      default:
        throw new Error("base64 string is not of the correct length");
    }
    try {
      return Et(e);
    } catch {
      return atob(e);
    }
  }
  function $e(r, e) {
    if (typeof r != "string")
      throw new M("Invalid token specified: must be a string");
    e || (e = {});
    let t = e.header === !0 ? 0 : 1,
      n = r.split(".")[t];
    if (typeof n != "string")
      throw new M(`Invalid token specified: missing part #${t + 1}`);
    let o;
    try {
      o = Mt(n);
    } catch (i) {
      throw new M(
        `Invalid token specified: invalid base64 for part #${t + 1} (${
          i.message
        })`
      );
    }
    try {
      return JSON.parse(o);
    } catch (i) {
      throw new M(
        `Invalid token specified: invalid json for part #${t + 1} (${
          i.message
        })`
      );
    }
  }
  var v = class r {
    scopes;
    constructor(e) {
      if (((this.scopes = BigInt(0)), typeof e == "string")) {
        this.scopes = BigInt(e).valueOf();
        return;
      }
      if (typeof e == "bigint") {
        this.scopes = e;
        return;
      }
      if (typeof e == "number") {
        this.addScope(e);
        return;
      }
      if (Array.isArray(e)) {
        this.addScope(...e);
        return;
      }
    }
    addScope(...e) {
      for (let t of e) {
        if (t < 0) throw new Error("Scope must be 0 or bigger.");
        this.scopes = this.scopes | BigInt(1 << t).valueOf();
      }
    }
    hasScope(e) {
      if (e < 0) throw new Error("Scope must be 0 or bigger.");
      return !!((this.scopes >> BigInt(e)) & BigInt(1));
    }
    intersection(e) {
      return new r(this.scopes & e.valueOf());
    }
    matches(e) {
      return this.intersection(e).valueOf() === this.scopes;
    }
    valueOf() {
      return this.scopes;
    }
    toString() {
      return this.scopes.toString();
    }
  };
  var se = new v([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]),
    Ve = new v([4, 5, 6, 7, 10, 11]);
  var H = class r extends Error {
      message;
      code;
      data;
      isTemporary;
      ref;
      status;
      skipSentry;
      constructor({
        message: e,
        code: t,
        data: n = {},
        isTemporary: o,
        ref: i,
        status: s,
        skipSentry: c,
        cause: h,
      }) {
        super(),
          Error.captureStackTrace && Error.captureStackTrace(this, r),
          (this.message = e),
          (this.code = t),
          (this.data = n),
          (this.isTemporary = !0),
          (this.ref = i),
          (this.status = s),
          (this.skipSentry = !!c),
          (this.cause = h),
          o !== void 0
            ? (this.isTemporary = o)
            : s && (this.isTemporary = s !== z.BadRequest);
      }
      toString() {
        return this.message;
      }
      isUnauthorized() {
        return this.status === z.Unauthorized;
      }
      isNotFound() {
        return this.status === z.NotFound;
      }
      isForbidden() {
        return this.status === z.Forbidden;
      }
      isClientError() {
        return this.status && this.status >= 400 && this.status < 500;
      }
      isServerError() {
        return this.status && this.status >= 500;
      }
    },
    z = {
      Ok: 200,
      BadRequest: 400,
      Unauthorized: 401,
      PaymentDeclined: 402,
      Forbidden: 403,
      NotFound: 404,
      Conflict: 409,
    };
  var f = E("accessTokenRefresher"),
    It = 401,
    ae = "access_token",
    le = "access_token.edit",
    vt = 90 * 1e3,
    Tt = 30 * 1e3,
    q = class {
      constructor(e, t) {
        this.options = t;
        this.url = `${e}/auth/web/access-token`;
        try {
          typeof window < "u" && window.top?.location.href;
        } catch {
          this.isEmbeddedCrossOrigin = !0;
        }
      }
      options;
      _accessToken;
      _accessTokenExpiry;
      _accessTokenStorageKey;
      timer = null;
      url;
      accessTokenWaitList = [];
      retryAttempt = 0;
      MaxRetryDelay = 60 * 1e3;
      BaseRetryDelay = 1e3;
      isUnauthorized = !1;
      hasStarted = !1;
      isEmbeddedCrossOrigin = !1;
      async start() {
        R(
          !this.hasStarted,
          "Attempt to start AccessTokenRefresher more than once."
        ),
          (this.hasStarted = !0);
        let e = await this.loadAccessTokenFromStorage();
        if (e) {
          let { accessToken: t, expiry: n, storageKey: o } = e;
          this.setToken(t, n, o), this.scheduleRefreshAt(ce(n));
        } else await this.refreshAccessTokenAndScheduleNextRefresh();
      }
      registerForNewToken(e) {
        f.debug("Adding waiter for new token"),
          this.accessTokenWaitList.push(e);
      }
      flushWaitList() {
        let e = this.accessTokenWaitList;
        (this.accessTokenWaitList = []),
          f.debug("Flushing waitlist, contains", e.length, "waiters");
        for (let t of e) t(this._accessToken);
      }
      isUnauthorizedResponse(e) {
        return e.status === It;
      }
      handleServerError = (e) => {
        if (!this.isUnauthorizedResponse(e))
          throw (
            (f.debug(
              "Error response status:",
              e.status,
              "with text:",
              e.statusText
            ),
            this.retryWithBackoff(),
            new H({ status: e.status, message: e.statusText }))
          );
      };
      async refreshAccessTokenAndScheduleNextRefresh() {
        f.debug("Renewing access token"),
          this.hasStarted || (this.hasStarted = !0);
        let e;
        try {
          e = await fetch(this.url, { credentials: "include" });
        } catch {
          f.error("Connection error, retrying\u2026"), this.retryWithBackoff();
          return;
        }
        if (!e.ok) {
          this.handleServerError(e),
            this.isUnauthorizedResponse(e) &&
              (f.debug("Turning on unauthorized mode"),
              (this.isUnauthorized = !0),
              this.flushWaitList(),
              this.options?.onUnauthorized?.(this));
          return;
        }
        f.debug("Received access token"), (this.retryAttempt = 0);
        let t = await e.json(),
          { accessToken: n } = t,
          o = $e(n),
          i = new v(o.scopes);
        if (
          !this.isEmbeddedCrossOrigin &&
          !this.isValidAccessToken(o.scope, i)
        ) {
          await this.discardAccessToken(),
            f.reportError(
              `Received access token has insufficient scopes. Wanted: ${se.valueOf()}, got: ${i.valueOf()}`,
              void 0,
              void 0,
              !0
            ),
            this.options?.onInsufficientScopes?.(this),
            this.retryWithBackoff();
          return;
        }
        let s;
        if (
          (t.expiresInSeconds
            ? ((s = Date.now() + t.expiresInSeconds * 1e3),
              f.debug("Received expiry seconds:", t.expiresInSeconds))
            : (s = t.expiresAt),
          !n)
        ) {
          f.error("Unable to authenticate client"), this.retryWithBackoff();
          return;
        }
        let c = new Date(s);
        if (Number.isNaN(c.getTime())) {
          f.error("Access Token expiry date is invalid"),
            this.retryWithBackoff();
          return;
        }
        this.setToken(n, c, this.isEmbeddedCrossOrigin ? le : ae),
          this.scheduleRefreshAt(ce(c));
      }
      setToken(e, t, n) {
        f.debug("Setting acccess token"),
          (this._accessToken = e),
          (this._accessTokenExpiry = t),
          (this._accessTokenStorageKey = n),
          this.flushWaitList(),
          this.saveAccessTokenInStorage(n, {
            accessToken: e,
            expiresAt: t.toISOString(),
          });
      }
      clearRefreshTimer() {
        this.timer &&
          (f.debug("Clearing refresh timer"),
          clearTimeout(this.timer),
          (this.timer = null));
      }
      retryWithBackoff() {
        this.clearRefreshTimer(), (this.retryAttempt += 1);
        let e = Math.floor(
          Math.random() *
            Math.min(
              this.MaxRetryDelay,
              this.BaseRetryDelay * 2 ** this.retryAttempt
            )
        );
        f.debug("Retrying after", e), this.scheduleRefreshAfter(e);
      }
      scheduleRefreshAfter(e) {
        this.clearRefreshTimer(),
          (this.timer = setTimeout(
            () => this.refreshAccessTokenAndScheduleNextRefresh(),
            e
          ));
      }
      scheduleRefreshAt(e) {
        let t = e.getTime() - new Date().getTime();
        if (t <= 0) throw new Error("Refresh time is not valid");
        this.scheduleRefreshAfter(t);
      }
      async saveAccessTokenInStorage(e, t) {
        try {
          await V(e, t);
        } catch (n) {
          f.debug("Error in storing access token", n);
        }
      }
      async loadAccessTokenFromStorage() {
        let e = this.isEmbeddedCrossOrigin ? le : ae;
        try {
          let t = await $(e);
          if (!t) return null;
          let { accessToken: n, expiresAt: o } = t,
            i = new Date(o);
          return new Date() >= ce(i)
            ? null
            : { accessToken: n, expiry: i, storageKey: e };
        } catch (t) {
          return (
            f.warn(
              "Warning: failed to read the access token from IndexedDB (via idb-keyval):",
              t
            ),
            null
          );
        }
      }
      hasAccessTokenExpired() {
        return this._accessTokenExpiry
          ? new Date().getTime() >= this._accessTokenExpiry.getTime() - Tt
          : !1;
      }
      isAccessTokenValid() {
        return (
          this._accessToken &&
          !this.isUnauthorized &&
          !this.hasAccessTokenExpired()
        );
      }
      async getAccessToken() {
        if (this.isUnauthorized) return Promise.resolve(void 0);
        if (this.isAccessTokenValid())
          return Promise.resolve(this._accessToken);
        let e = new Promise((t) => this.registerForNewToken(t));
        return (
          this.hasAccessTokenExpired() && (await this.discardAccessToken(!0)),
          this.hasStarted || (await this.start()),
          e
        );
      }
      async getAuthorizationHeaderValue() {
        let e = await this.getAccessToken();
        if (e) return `Bearer ${e}`;
      }
      async stopAuthentication() {
        try {
          await this.discardAccessToken(!1),
            (this.hasStarted = !1),
            await K(ae),
            await K(le);
        } catch {}
      }
      async discardAccessToken(e = !1) {
        try {
          f.debug("Discarding access token with renewal", e),
            this.clearRefreshTimer(),
            (this._accessToken = void 0),
            (this._accessTokenExpiry = void 0),
            this._accessTokenStorageKey &&
              (await K(this._accessTokenStorageKey)),
            (this._accessTokenStorageKey = void 0),
            e && !this.isUnauthorized && this.scheduleRefreshAfter(0);
        } catch {}
      }
      async withAuthorizationHeader(e) {
        let t = await this.getAuthorizationHeaderValue();
        return (
          t &&
            ((e.headers = new Headers(e.headers)),
            e.headers.set("authorization", t)),
          e
        );
      }
      isValidAccessToken(e, t) {
        return e === "public-api" ? Ve.matches(t) : se.matches(t);
      }
    };
  function ce(r) {
    return new Date(r.getTime() - vt);
  }
  var G;
  T();
  async function T() {
    if (!G)
      try {
        G = await $("apiBaseURL");
      } catch (r) {
        console.log("Unable to get apiBaseURL from IndexedDB", r);
      }
    return G;
  }
  async function Ke(r) {
    (G = r), await V("apiBaseURL", r);
  }
  var k;
  ue();
  async function ue() {
    let r = await T();
    r && (k = new q(r));
  }
  var kt = 100,
    St = 120 * 1e3,
    de = ge(kt, St);
  async function Lt(r, e) {
    try {
      return await r.responsePromise;
    } catch (t) {
      return (
        console.error(
          `The prefetch request failed for some reason. Maybe the prefetching implementation got outdated, and we\u2019re sending incorrect requests?

`,
          t
        ),
        fetch(e)
      );
    }
  }
  async function Rt() {
    if (!k) return;
    let r = await T();
    if (!r)
      throw new Error(
        "The service worker has the access token but doesn\u2019t have the API server. This isn\u2019t supposed to happen because accessTokenRefresher also depends on the API server."
      );
    let e = await k.withAuthorizationHeader({
        mode: "cors",
        credentials: "include",
        redirect: "error",
      }),
      t = At(r, ...he());
    return { dashboard: { url: t, responsePromise: fetch(t, e) } };
  }
  function At(r, e, t) {
    let n = new URL(e, r);
    return t && (n.search = `?${new URLSearchParams(t)}`), n.href;
  }
  function Pt(r) {
    let e = new URL(r).pathname;
    return (
      e === "/projects" ||
      e === "/projects/" ||
      e.startsWith("/projects/folder") ||
      e.startsWith("/domains")
    );
  }
  var D = {
    fetch(r) {
      let e = r.clientId || r.resultingClientId;
      if (!e) return;
      if (r.request.mode === "navigate" && Pt(r.request.url)) {
        m(
          r,
          Rt().then((n) => {
            n && de.set(e, n.dashboard);
          })
        );
        return;
      }
      let t = de.get(e);
      if (t && r.request.url === t.url) {
        r.respondWith(Lt(t, r.request)), de.delete(e);
        return;
      }
    },
    message(r) {
      let e = r.data;
      if (e.type === "refreshApiServer") {
        let t = e.payload.api;
        r.waitUntil(
          T().then((n) => {
            if (n !== t) return Ke(t).then(() => ue());
          })
        );
      }
      e.type === "signOut" && k && r.waitUntil(k.stopAuthentication());
    },
  };
  var fe = "/s/offline-CJS4FTB4.html";
  var Y = "service-worker",
    qe = [
      "/app.framerstatic.com/service-worker-assets/Inter-Medium.0290816f.woff2?src=offline",
      "/app.framerstatic.com/service-worker-assets/Inter-SemiBold.b3092fa6.woff2?src=offline",
    ],
    pe = [fe, ...qe];
  function ze(r, e) {
    return e.findIndex((t) => r.endsWith(t)) !== -1;
  }
  async function He({ force: r } = {}) {
    let e = await caches.open(Y);
    if (r) return e.addAll(pe);
    let t = async (n) => {
      if (!(await e.match(n))) return e.add(n);
    };
    await Promise.all(pe.map((n) => t(n)));
  }
  async function Dt(r) {
    try {
      return await fetch(r.request, { referrer: r.request.referrer });
    } catch (e) {
      console.error(`Unable to load ${r.request.url}`, e);
      let t = e instanceof TypeError,
        n = e instanceof DOMException && e.name === "NetworkError";
      if (!(t || n)) throw e;
      return await (await caches.open(Y)).match(fe);
    }
  }
  function Nt(r) {
    return new URL(r).pathname.startsWith("/projects");
  }
  var N = {
    install(r) {
      m(r, He({ force: !0 }));
    },
    activate(r) {
      m(
        r,
        (async () => {
          let t = await caches.open(Y),
            n = await t.keys();
          await Promise.all(
            n.map((o) => {
              if (!ze(o.url, pe)) return t.delete(o);
            })
          );
        })()
      );
    },
    fetch(r) {
      if (r.request.mode === "navigate" && Nt(r.request.url))
        r.respondWith(Dt(r)),
          m(
            r,
            He().catch((e) => {
              console.warn("Unable to re-cache the offline page", e);
            })
          );
      else if (ze(r.request.url, qe)) {
        let e = caches.open(Y).then((t) => t.match(r.request));
        r.respondWith(e);
      }
    },
  };
  var S = self;
  S.addEventListener("install", function (r) {
    N.install?.(r), D.install?.(r), m(r, S.skipWaiting());
  });
  S.addEventListener("activate", function (r) {
    N.activate?.(r),
      D.activate?.(r),
      m(r, S.registration.navigationPreload?.disable() ?? Promise.resolve());
  });
  S.addEventListener("fetch", function (r) {
    N.fetch?.(r), D.fetch?.(r);
  });
  S.addEventListener("message", function (r) {
    N.message?.(r), D.message?.(r);
  });
})();
/*! Bundled license information:

tiny-lru/dist/tiny-lru.js:
  (**
   * tiny-lru
   *
   * @copyright 2026 Jason Mulligan <jason.mulligan@avoidwork.com>
   * @license BSD-3-Clause
   * @version 11.4.7
   *)
*/
