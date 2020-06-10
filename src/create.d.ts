import { Model } from './model';
export declare const create: <T>(model: Model<any>, records: T | T[], returning?: string | string[]) => Promise<T | T[]>;
