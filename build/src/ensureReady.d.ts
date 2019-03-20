import { AsyncRouteProps } from './types';
/**
 * This helps us to make sure all the async code is loaded before rendering.
 */
export declare function ensureReady(routes: AsyncRouteProps[], pathname?: string): Promise<any>;
