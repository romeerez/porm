import { Model } from './model';
export declare const transaction: <T extends Record<string, Model<any>>>(models: T, fn: (models: T) => Promise<any>) => Promise<any[]>;
