import * as React from 'react';
import { Document as DefaultDoc } from './Document';
import { Request, Response } from 'express';
import { Assets, AsyncRouteProps } from './types';
export interface AfterRenderOptions<T> {
    req: Request;
    res: Response;
    assets: Assets;
    routes: AsyncRouteProps[];
    document?: typeof DefaultDoc;
    customRenderer?: (element: React.ReactElement<T>) => {
        html: string;
    };
}
export declare function render<T>(options: AfterRenderOptions<T>): Promise<string | undefined>;
