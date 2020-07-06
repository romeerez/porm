import { Adapter } from 'pg-adapter';
declare const db: Adapter & {
    prepareQuery: (...args: any) => any;
};
export default db;
