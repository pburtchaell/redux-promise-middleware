// Type definitions for Redux Promise Middleware version 6.0.0
// Project: Redux Promise Middleware
// Definitions by: Patrick Burtchaell <patrick@pburtchaell.com>
import { Middleware, Action as CoreReduxAction } from 'redux';

export declare interface ActionTypes {
  Pending: string;
  Fulfilled: string;
  Rejected: string;
}

// Action type types
declare type ActionType = string;
declare type PendingActionType = ActionType;
declare type FulfilledActionType = ActionType;
declare type RejectedActionType = ActionType;

// Action payload types
declare type AsyncFunction<> = () => Promise<any>;
declare type AsyncPayload = Promise<any> | AsyncFunction | {
  promise: Promise<any> | AsyncFunction;
  data?: any;
};

// Flux standard action type
export declare interface FluxStandardAction extends CoreReduxAction {
  payload?: any;
  meta?: any;
  error?: boolean;
}

// Async action type
export declare interface AsyncAction extends FluxStandardAction {
  payload?: AsyncPayload;
}

export declare interface Config {
  promiseTypeSuffixes?: [PendingActionType, FulfilledActionType, RejectedActionType];
  promiseTypeDelimiter?: string;
}

export declare function createPromise(config?: Config): Middleware;

declare const promise: Middleware;
export default promise;
