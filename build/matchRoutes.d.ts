import { AsyncRouteProps } from './types';
declare function matchRoutes(routes: AsyncRouteProps[], pathname: string, /*not public API*/ branch?: Array<any>): any[];
export default matchRoutes;
