import { Adapter } from 'pg-adapter';
import { Definition, Model } from './types';
export declare const model: <T>(db: Adapter, table: string, def?: Definition) => Model;
