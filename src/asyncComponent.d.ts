import * as React from 'react';
import { Module, AsyncRouteComponentState, Ctx } from './types';
/**
 * Returns a new React component, ready to be instantiated.
 * Note the closure here protecting Component, and providing a unique
 * instance of Component to the static implementation of `load`.
 */
export declare function asyncComponent<Props>({ loader, Placeholder }: {
    loader: () => Promise<Module<React.ComponentType<Props>>>;
    Placeholder?: React.ComponentType<Props>;
}): {
    new (props: Props): {
        componentWillMount(): void;
        updateState(): void;
        render(): JSX.Element | null;
        context: any;
        setState<K extends "Component">(state: AsyncRouteComponentState | ((prevState: Readonly<AsyncRouteComponentState>, props: Readonly<Props>) => AsyncRouteComponentState | Pick<AsyncRouteComponentState, K> | null) | Pick<AsyncRouteComponentState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<{
            children?: React.ReactNode;
        }> & Readonly<Props>;
        state: Readonly<AsyncRouteComponentState>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    /**
     * Static so that you can call load against an uninstantiated version of
     * this component. This should only be called one time outside of the
     * normal render path.
     */
    load(): Promise<void>;
    getInitialProps(ctx: Ctx<any>): any;
    contextType?: React.Context<any> | undefined;
};
