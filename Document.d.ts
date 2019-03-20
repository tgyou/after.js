import * as React from 'react';
import { DocumentProps } from './types';
export declare class Document extends React.Component<DocumentProps> {
    static getInitialProps({ assets, data, renderPage }: DocumentProps): Promise<any>;
    render(): JSX.Element;
}
export declare function AfterRoot(): JSX.Element;
export declare function AfterData({ data }: any): JSX.Element;
