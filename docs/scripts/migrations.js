/**
 * Migration framework for localStorage-backed user data.
 *
 * Sessions, stats, personal dictionary and UI preferences all live in
 * localStorage keyed under a single prefix (APP.prefix, "ebt."). When the
 * schema changes (renamed keys, reshaped session objects, renumbered question
 * IDs, ...) we must transform existing data so returning users do not lose
 * progress.
 *
 * Usage from general.js (before readJSON/writeJSON is used for real reads):
 *
 *     EBT.Migrations.run({ currentVersion: APP.version, prefix: APP.prefix });
 *
 * Adding a migration for the jump from version N to N+1:
 *
 *     EBT.Migrations.register(N + 1, function migrateToN1(ctx) {
 *       // ctx.prefix        e.g. "ebt."
 *       // ctx.read(name)    read+parse JSON; returns fallback (or null) on miss
 *       // ctx.write(name, v) serialize+write
 *       // ctx.remove(name)   delete a single key
 *       // ctx.allKeys()      list all keys with prefix stripped
 *     });
 *
 * Migration functions MUST be idempotent: running twice in a row against an
 * already-migrated store should be a no-op, not corruption.
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;

  var VERSION_KEY = "_schemaVersion";
  var registry = Object.create(null);

  function buildContext(prefix) {
    function fullKey(name) {
      return prefix + name;
    }
    return {
      prefix: prefix,
      read: function (name, fallback) {
        try {
          var raw = localStorage.getItem(fullKey(name));
          if (raw == null) return fallback === undefined ? null : fallback;
          return JSON.parse(raw);
        } catch (err) {
          return fallback === undefined ? null : fallback;
        }
      },
      write: function (name, value) {
        localStorage.setItem(fullKey(name), JSON.stringify(value));
      },
      remove: function (name) {
        localStorage.removeItem(fullKey(name));
      },
      allKeys: function () {
        var out = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(prefix) === 0) out.push(k.slice(prefix.length));
        }
        return out;
      },
    };
  }

  function register(version, fn) {
    if (typeof version !== "number" || version < 1) {
      throw new Error("Migration version must be a positive integer");
    }
    if (typeof fn !== "function") {
      throw new Error("Migration must be a function");
    }
    registry[version] = fn;
  }

  function run(opts) {
    var options = opts || {};
    var currentVersion = options.currentVersion;
    var prefix = options.prefix;
    if (typeof currentVersion !== "number" || typeof prefix !== "string") {
      throw new Error("EBT.Migrations.run requires { currentVersion, prefix }");
    }

    var ctx = buildContext(prefix);
    var storedRaw = ctx.read(VERSION_KEY, null);
    // First-run users have no stored version yet; treat them as already on
    // the current version so we don't apply migrations to an empty store.
    var stored = typeof storedRaw === "number" && storedRaw > 0 ? storedRaw : currentVersion;

    if (stored > currentVersion) {
      // App downgraded. We cannot safely forward-migrate; leave data alone
      // but record the lowered version so a future upgrade re-applies steps.
      ctx.write(VERSION_KEY, currentVersion);
      return { from: stored, to: currentVersion, applied: [] };
    }

    var applied = [];
    for (var v = stored + 1; v <= currentVersion; v++) {
      var fn = registry[v];
      if (!fn) continue;
      try {
        fn(ctx);
        applied.push(v);
      } catch (err) {
        console.error("[migrations] step " + v + " failed", err);
        // Stop — do not record a partial bump.
        return { from: stored, to: v - 1, applied: applied, error: err };
      }
    }
    ctx.write(VERSION_KEY, currentVersion);
    return { from: stored, to: currentVersion, applied: applied };
  }

  ns.Migrations = {
    register: register,
    run: run,
    VERSION_KEY: VERSION_KEY,
  };
})();
