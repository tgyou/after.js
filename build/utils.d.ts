import { AsyncRouteableComponent, AsyncRouteComponentType } from "./types";
/** @private is the given object a Function? */
export declare const isFunction: (obj: any) => boolean;
/** @private is the given object an Object? */
export declare const isObject: (obj: any) => boolean;
/** @private is the given object/value a promise? */
export declare const isPromise: (value: any) => boolean;
/** @private Guard cluase to narrow the AsyncRouteableComponent union type on getInitialProps */
export declare function isAsyncComponent(Component: AsyncRouteableComponent): Component is AsyncRouteComponentType<any>;
/** @private Guard cluase to narrow the AsyncRouteableComponent union type on load */
export declare function isLoadableComponent(Component: AsyncRouteableComponent): Component is AsyncRouteComponentType<any>;
