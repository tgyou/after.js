"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var loadInitialProps_1 = require("./loadInitialProps");
var utils_1 = require("./utils");
var makeRoutes_1 = __importDefault(require("./makeRoutes"));
var savedData = {};
var Afterparty = /** @class */ (function (_super) {
    __extends(Afterparty, _super);
    function Afterparty(props) {
        var _this = _super.call(this, props) || this;
        _this.prefetch = function (pathname) {
            loadInitialProps_1.loadInitialProps(_this.props.routes, pathname, {
                history: _this.props.history
            })
                .then(function (_a) {
                var data = _a.data;
                var _b;
                _this.prefetcherCache = __assign({}, _this.prefetcherCache, (_b = {}, _b[pathname] = data, _b));
            })
                .catch(function (e) { return console.log(e); });
        };
        _this.prefetcherCache = {};
        return _this;
    }
    // only runs clizzient
    Afterparty.prototype.componentWillReceiveProps = function (nextProps) {
        var navigated = nextProps.location !== this.props.location;
        if (navigated) {
            window.scrollTo(0, 0);
        }
    };
    Afterparty.prototype.render = function () {
        var _this = this;
        var _a = this.props, location = _a.location, restData = _a.restData;
        var routes = makeRoutes_1.default(this.props.routes);
        var data = this.props.data || {};
        return (React.createElement(react_router_dom_1.Switch, null, routes.map(function (r, i) { return (React.createElement(react_router_dom_1.Route, { key: r.id || "route--" + i, path: r.path, exact: r.exact, location: location, render: function (props) {
                var initialData = null;
                if (data[r.id]) {
                    initialData = { initialData: __assign({}, data[r.id]) };
                }
                else if (savedData[r.id]) {
                    initialData = { initialData: __assign({}, savedData[r.id]) };
                }
                if (typeof window !== 'undefined' && !r.component['saveInitialProps']) {
                    data[r.id] && delete data[r.id];
                    savedData[r.id] && delete savedData[r.id];
                }
                return (React.createElement(AfterComponent, __assign({ route: r }, restData, initialData, { component: r.component, history: props.history, location: location, match: props.match, prefetch: _this.prefetch }), r.routes ? React.createElement(Afterparty, { history: props.history, location: location, match: props.match, routes: r.routes, data: data }) : null));
                // return (
                //   <r.component 
                //     {...initialData}
                //     history={props.history} 
                //     location={location}
                //     match={props.match}
                //     prefetch={this.prefetch}>
                //     {r.routes ? <After routes={r.routes} data={data} /> : null}
                //   </r.component>
                // );
            } })); })));
    };
    return Afterparty;
}(React.Component));
var AfterComponent = /** @class */ (function (_super) {
    __extends(AfterComponent, _super);
    function AfterComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            data: props.initialData
        };
        return _this;
    }
    AfterComponent.prototype.componentWillMount = function () {
        var _a = this.props, component = _a.component, initialData = _a.initialData;
        if (typeof window !== 'undefined' && component && utils_1.isAsyncComponent(component) && !initialData) {
            this.fetch();
        }
    };
    AfterComponent.prototype.fetch = function () {
        var _this = this;
        var _a = this.props, component = _a.component, initialData = _a.initialData, children = _a.children, match = _a.match, ctx = __rest(_a, ["component", "initialData", "children", "match"]);
        var promise = component.load
            ? component.load().then(function () { return component.getInitialProps && component.getInitialProps(__assign({ match: match }, ctx)); })
            : component.getInitialProps(__assign({ match: match }, ctx));
        this.setState({ loading: promise });
        promise.then(function (data) {
            if (component.saveInitialProps)
                savedData[_this.props.route.id] = data;
            _this.setState({ data: data, loading: false });
        });
    };
    AfterComponent.prototype.render = function () {
        var _a = this.props, initialData = _a.initialData, component = _a.component, children = _a.children, props = __rest(_a, ["initialData", "component", "children"]);
        var data = this.state.data;
        var Component = component;
        if (this.state.loading && component.loadingInitialProps === null) {
            return null;
        }
        else if (this.state.loading && typeof component.loadingInitialProps === 'function') {
            return React.createElement(component.loadingInitialProps, { __loading: this.state.loading });
        }
        else if (this.state.loading) {
            return React.createElement(Component, __assign({ __loading: this.state.loading }, data, props), children);
        }
        else {
            return React.createElement(Component, __assign({}, data, props), children);
        }
    };
    return AfterComponent;
}(React.Component));
exports.After = react_router_dom_1.withRouter(Afterparty);
//# sourceMappingURL=After.js.map