import * as React from 'react';
import { match as Match, RouteComponentProps } from 'react-router-dom';
import { History, Location } from 'history';
import { AsyncRouteProps } from './types';
export interface AfterpartyProps extends RouteComponentProps<any> {
    history: History;
    location: Location;
    data?: object;
    restData?: object;
    routes: AsyncRouteProps[];
    match: Match<any>;
}
export interface AfterpartyState {
    data: object;
    previousLocation: Location | null;
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
export declare const After: React.ComponentClass<Pick<AfterpartyProps, "data" | "restData" | "routes">, any>;
