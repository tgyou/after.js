import matchRoutes from './matchRoutes';
import makeRoutes from './makeRoutes';
import { AsyncRouteProps, InitialProps, CtxBase } from './types';
import { isAsyncComponent } from './utils';

export async function loadInitialProps(routes: AsyncRouteProps[], pathname: string, ctx: CtxBase): Promise<InitialProps> {
  const ids: Array<String> = [];
  const promises: Promise<any>[] = [];

  const matches = matchRoutes(makeRoutes(routes), pathname);
  const matchedComponent = matches[matches.length - 1].route || null;

  matches.map(match => {
    const route: AsyncRouteProps = match.route;

    if (route.component && isAsyncComponent(route.component)) {
      const component = route.component;
      ids.push(route['id']);
      promises.push(
        component.load
          ? component.load().then(() => component.getInitialProps({ match: match.match, ...ctx }))
          : component.getInitialProps({ match: match.match, ...ctx })
      );
    }
  });

  const data = {};
  (await Promise.all(promises)).map((row, i) => {
    data[ids[String(i)]] = row;
  });
  
  return {
    match: matchedComponent,
    data: data
  };
}
