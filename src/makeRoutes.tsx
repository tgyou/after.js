import { AsyncRouteProps } from './types';

function makeRoutes(routes: AsyncRouteProps[], pfx = '') {
  return routes.map((r, i) => {
    if (r.component && !r.id) {
      const id = String.fromCharCode(97 + i);
      r.id = pfx === '' ? `r.${pfx}${id}` : `${pfx}${id}`;
    }

    if (r.routes) {
      r.routes = makeRoutes(r.routes, r.id);
    }

    return r;
  });
}

export default makeRoutes;
