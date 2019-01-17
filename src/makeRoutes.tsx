import { AsyncRouteProps } from './types';

function makeRoutes(routes: AsyncRouteProps[], pfx = '') {
  if (routes['__route__']) {
    return routes;
  }

  Object.defineProperty(routes, '__route__', {
    value: true,
    writable: false,
  });

  return routes.map((r, i) => {
    if (r.component) {
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
