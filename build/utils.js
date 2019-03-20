"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @private is the given object a Function? */
exports.isFunction = function (obj) { return 'function' === typeof obj; };
/** @private is the given object an Object? */
exports.isObject = function (obj) { return obj !== null && typeof obj === 'object'; };
/** @private is the given object/value a promise? */
exports.isPromise = function (value) {
    return exports.isObject(value) && exports.isFunction(value.then);
};
/** @private Guard cluase to narrow the AsyncRouteableComponent union type on getInitialProps */
function isAsyncComponent(Component) {
    return Component.getInitialProps !== undefined;
}
exports.isAsyncComponent = isAsyncComponent;
/** @private Guard cluase to narrow the AsyncRouteableComponent union type on load */
function isLoadableComponent(Component) {
    return Component.load !== undefined;
}
exports.isLoadableComponent = isLoadableComponent;
//# sourceMappingURL=utils.js.map