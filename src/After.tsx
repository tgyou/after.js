import * as React from 'react';
import { Switch, Route, withRouter, match as Match, RouteComponentProps } from 'react-router-dom';
import { loadInitialProps } from './loadInitialProps';
import { History, Location } from 'history';
import { AsyncRouteProps } from './types';
import { isAsyncComponent } from './utils';
import makeRoutes from'./makeRoutes';

const savedData = {};

export interface AfterpartyProps extends RouteComponentProps<any> {
  history: History;
  location: Location;
  data?: object;
  restData?: object;
  routes: AsyncRouteProps[];
  match: Match<any>;
  render?: Function;
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
    const { location, restData } = this.props;
    const routes = makeRoutes(this.props.routes);
    const data = this.props.data || {};

    const children = (
      <Switch location={location}>
        {routes.map((r, i) => (
          <Route
            key={r.id || `route--${i}`}
            path={r.path}
            exact={r.exact}
            location={location}
            render={(props) => {
              let initialData = null;
              if (data[r.id]) {
                initialData = { initialData: { ...data[r.id] }};
              } else if (savedData[r.id]) {
                initialData = { initialData: { ...savedData[r.id] }};
              }

              if (typeof window !== 'undefined' && !r.component['saveInitialProps']) {
                data[r.id] && delete data[r.id];
                savedData[r.id] && delete savedData[r.id];
              }

              return (
                <AfterComponent
                  route={r}
                  {...restData}
                  {...initialData}
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
            }}
          />
        ))}
      </Switch>
    );

    if (this.props.render) {
      const { render, ...props } = this.props;
      return render({ ...props, children });
    } else {
      return children;
    }
  }
}


export interface AfterComponentProps extends RouteComponentProps<any> {
  history: History;
  location: Location;
  initialData?: object;
  restData?: object | undefined;
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
    const { component, initialData, children, match, ...ctx } = this.props;
    const promise = component.load
          ? component.load().then(() => component.getInitialProps && component.getInitialProps({ match, ...ctx }))
          : component.getInitialProps({ match, ...ctx })

    this.setState({ loading: promise });
    promise.then((data: any) => {
      if (component.saveInitialProps) savedData[this.props.route.id] = data;
      this.setState({ data, loading: false });
    });
  }
  
  
  render(): any {
    const { initialData, component, children, ...props } = this.props;
    const { data } = this.state;

    const Component: any = component;
    if (this.state.loading && component.loadingInitialProps === null) {
      return null;
    } else if (this.state.loading && typeof component.loadingInitialProps === 'function') {
      return <component.loadingInitialProps __loading={this.state.loading} />;
    } else if (this.state.loading) {
      return <Component __loading={this.state.loading} {...data} {...props}>{children}</Component>;
    } else {
      return <Component {...data} {...props}>{children}</Component>;
    }
  }
}

export const After = withRouter(Afterparty);
