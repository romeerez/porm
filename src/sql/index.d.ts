import { Model } from '../model';
import { Query } from '../query';
export declare const toSql: ({ model, __query: query }: {
    model: Model<any>;
    __query: Query;
}) => Promise<string>;
