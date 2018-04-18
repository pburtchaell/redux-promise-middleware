import { Middleware } from 'redux';

export declare const PENDING: string;
export declare const FULFILLED: string;
export declare const REJECTED: string;

declare function promiseMiddleware(config?: { promiseTypeSuffixes?: string[], promiseTypeDelimiter?: string }): Middleware;

export default promiseMiddleware;
