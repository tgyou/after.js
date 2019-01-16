import { matchPath, Router } from 'react-router-dom';
import { AsyncRouteProps } from './types';

function matchRoutes(routes: AsyncRouteProps[], pathname: string, /*not public API*/ branch: Array<any> = []) {
  routes.some(route => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match // use parent match
      : Router['computeRootMatch'](pathname); // use default "root" match

    if (match) {
      branch.push({ route, match });

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });

  return branch;
}

export default matchRoutes;
