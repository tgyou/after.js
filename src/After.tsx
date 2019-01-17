import * as React from 'react';
import { Switch, Route, withRouter, match as Match, RouteComponentProps } from 'react-router-dom';
import { loadInitialProps } from './loadInitialProps';
import { History, Location } from 'history';
import { AsyncRouteProps } from './types';
import { isAsyncComponent } from './utils';
import makeRoutes from'./makeRoutes';

export interface AfterpartyProps extends RouteComponentProps<any> {
  history: History;
  location: Location;
  data?: object;
  routes: AsyncRouteProps[];
  match: Match<any>;
}

export interface AfterpartyState {
  data: object;
  previousLocation: Location | null;
}

class Afterparty extends React.Component<AfterpartyProps> {
  prefetcherCache: any;

  constructor(props: AfterpartyProps) {
    super(props);
    this.prefetcherCache = {};
  }

  // only runs clizzient
  componentWillReceiveProps(nextProps: AfterpartyProps) {
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
    }
  }

  prefetch = (pathname: string) => {
    loadInitialProps(this.props.routes, pathname, {
      history: this.props.history
    })
      .then(({ data }) => {
        this.prefetcherCache = {
          ...this.prefetcherCache,
          [pathname]: data
        };
      })
      .catch((e) => console.log(e));
  };

  render(): any {
    const { location } = this.props;
    const routes = makeRoutes(this.props.routes);
    const data = { ...(this.props.data || {}) };

    return (
      <Switch>
        {routes.map((r, i) => (
          <Route
            key={`route--${i}`}
            path={r.path}
            exact={r.exact}
            location={location}
            render={(props) => {
              const initialData = data[r.id] || null;
              if (initialData) delete data[r.id];

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

              return (
                <AfterComponent
                  route={r}
                  initialData={...initialData}
                  component={r.component}
                  history={props.history} 
                  location={location}
                  match={props.match}
                  prefetch={this.prefetch}>
                  {r.routes ? <Afterparty history={props.history} 
                  location={location}
                  match={props.match} routes={r.routes} data={data} /> : null}
                </AfterComponent>
              );
            }}
          />
        ))}
      </Switch>
    );
  }
}


export interface AfterComponentProps extends RouteComponentProps<any> {
  history: History;
  location: Location;
  initialData?: object;
  routes: AsyncRouteProps[];
  match: Match<any>;
  route: AsyncRouteProps;
  component?: any;
  children?: Element | null;

}

export interface AfterComponentState {
  data?: object | undefined;
}

class AfterComponent extends React.Component<any, any> {
  
  constructor(props: AfterComponentProps) {
    super(props);

    this.state = {
      data: props.initialData
    }
  }
  
  
  componentWillMount() {
    const { component, initialData } = this.props;

    if (typeof window !== 'undefined' && component && isAsyncComponent(component) && !initialData) {
      this.fetch();
    }
  }

  fetch() {
    const { component, match, location, history } = this.props;
    const promise = component.load
          ? component.load().then(() => component.getInitialProps && component.getInitialProps({ match, location, history }))
          : component.getInitialProps({ match, location, history })

    promise.then((data: any) => this.setState({ data }));
  }
  
  
  render(): any {
    const { initialData, component, children, ...props } = this.props;
    const { data } = this.state;

    const Component: any = component;
    return <Component {...data} {...props}>{children}</Component>;
  }
}

export const After = withRouter(Afterparty);
