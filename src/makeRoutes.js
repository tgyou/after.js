"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makeRoutes(routes, pfx) {
    if (pfx === void 0) { pfx = ''; }
    return routes.map(function (r, i) {
        if (r.component && !r.id) {
            var id = String.fromCharCode(97 + i);
            r.id = pfx === '' ? "r." + pfx + id : "" + pfx + id;
        }
        if (r.routes) {
            r.routes = makeRoutes(r.routes, r.id);
        }
        return r;
    });
}
exports.default = makeRoutes;
//# sourceMappingURL=makeRoutes.js.map