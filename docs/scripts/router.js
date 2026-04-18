/**
 * Small hash-based router with an explicit routes table.
 *
 * Benefits over the previous long if/else chain:
 *   - Every available route is listed in one place.
 *   - Adding a new route = append to the table + define a renderer.
 *   - Renderers can be registered from separate mode files
 *     (window.EBT.Render.<name>).
 */
(function () {
  "use strict";

  window.EBT = window.EBT || {};
  var ns = window.EBT;

  function getRouteFromHash() {
    var raw = window.location.hash || "#/home";
    var cleaned = raw.replace(/^#\/?/, "");
    return cleaned || "home";
  }

  function setHash(route) {
    window.location.hash = "#/" + route;
  }

  /**
   * @typedef {Object} Route
   * @property {string}   path       e.g. "mode/test"
   * @property {Function} render     function with no args; must render into els.main
   * @property {string=}  navId      optional nav link id to highlight
   */

  /** @type {Route[]} */
  var routes = [];

  function register(route) {
    if (!route || typeof route.path !== "string" || typeof route.render !== "function") {
      throw new Error("Router.register requires { path, render }");
    }
    routes.push(route);
  }

  function registerAll(list) {
    list.forEach(register);
  }

  function find(path) {
    for (var i = 0; i < routes.length; i++) {
      if (routes[i].path === path) return routes[i];
    }
    return null;
  }

  function dispatch(path) {
    var route = find(path) || find("home");
    if (route) route.render();
  }

  ns.Router = {
    getRouteFromHash: getRouteFromHash,
    setHash: setHash,
    register: register,
    registerAll: registerAll,
    find: find,
    dispatch: dispatch,
    routes: routes,
  };
})();
