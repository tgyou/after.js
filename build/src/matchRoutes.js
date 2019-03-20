"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
function matchRoutes(routes, pathname, /*not public API*/ branch) {
    if (branch === void 0) { branch = []; }
    routes.some(function (route) {
        var match = route.path
            ? react_router_dom_1.matchPath(pathname, route)
            : branch.length
                ? branch[branch.length - 1].match // use parent match
                : react_router_dom_1.Router['computeRootMatch'](pathname); // use default "root" match
        if (match) {
            branch.push({ route: route, match: match });
            if (route.routes) {
                matchRoutes(route.routes, pathname, branch);
            }
        }
        return match;
    });
    return branch;
}
exports.default = matchRoutes;
//# sourceMappingURL=matchRoutes.js.map